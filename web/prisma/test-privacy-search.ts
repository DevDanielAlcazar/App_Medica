import { PrismaClient } from "@prisma/client";
import { searchMedicalWeb } from "../src/lib/services/webSearch";
import { purgeInactiveCases } from "../src/lib/services/purgeJob";

const prisma = new PrismaClient();

async function runTests() {
  console.log("🧪 Iniciando Suite de Pruebas de Privacidad y Búsqueda Web (Sprint 9)...\n");
  let passed = true;

  try {
    // ----------------------------------------------------
    // Test 1: Búsqueda Web Médica & Caché (REQ-029)
    // ----------------------------------------------------
    console.log("➡️ Test 1: Ejecutando Búsqueda Web Médica y Validando Caché...");
    
    // Limpiar caché previa
    await prisma.searchCache.deleteMany();

    const query = "covid guidelines 2026";
    
    // Primera llamada (debe fallar a Tavily por falta de API key y usar fallback local de alta calidad)
    console.log("  - Ejecutando primera búsqueda (escritura en caché)...");
    const t0 = Date.now();
    const response1 = await searchMedicalWeb(query);
    const time1 = Date.now() - t0;

    // Verificar que se escribió en la base de datos
    const cacheRecord = await prisma.searchCache.findUnique({
      where: { query: query.toLowerCase() }
    });

    if (cacheRecord && response1.includes("who.int") && response1.includes("cdc.gov")) {
      console.log("  ✅ OK: Búsqueda web formateó correctamente e inyectó resultados del allowlist en DB.");
    } else {
      console.error("  ❌ FALLA: No se encontró registro en la tabla SearchCache o formato inválido.");
      passed = false;
    }

    // Segunda llamada (debe recuperar de caché de inmediato, t < 20ms)
    console.log("  - Ejecutando segunda búsqueda (recuperación desde caché)...");
    const t1 = Date.now();
    const response2 = await searchMedicalWeb(query);
    const time2 = Date.now() - t1;

    if (response1 === response2 && time2 < 50) {
      console.log(`  ✅ OK: Caché exitosa en ${time2}ms (vs ${time1}ms la primera vez).`);
    } else {
      console.error(`  ❌ FALLA: Falló la coincidencia de caché o latencia muy alta (${time2}ms).`);
      passed = false;
    }

    // ----------------------------------------------------
    // Test 2: Purga de Privacidad GDPR (REQ-016 / US-005)
    // ----------------------------------------------------
    console.log("\n➡️ Test 2: Probando Purga Automática de Expedientes (> 6 Meses)...");

    // Crear un usuario de prueba
    const user = await prisma.user.create({
      data: {
        email: `test_purge_user_${Date.now()}@angelicamed.com`,
        name: "Test Patient Purge GDPR",
        password: "dummyhash",
        role: "paciente",
      }
    });

    // Crear un caso clínico
    const oldCase = await prisma.clinicalCase.create({
      data: {
        userId: user.id,
        title: "Caso Antiguo de Influenza",
        status: "curado",
        timeline: []
      }
    });

    // Forzar fecha de actualización a hace 7 meses (180 días + margen)
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
    
    await prisma.clinicalCase.update({
      where: { id: oldCase.id },
      data: {
        updatedAt: sevenMonthsAgo
      }
    });

    // Añadir mensaje e hito asociado para probar cascada de onDelete
    await prisma.message.create({
      data: {
        caseId: oldCase.id,
        sender: "user",
        content: "Tengo gripe y cuerpo cortado."
      }
    });

    await prisma.appointment.create({
      data: {
        patientId: user.id,
        caseId: oldCase.id,
        dateTime: new Date(),
        status: "confirmed",
        meetLink: "https://meet.google.com/test-link"
      }
    });

    console.log("  - Registros de prueba antiguos creados (Case, Message, Appointment).");

    // Ejecutar el job de purga
    const purgeResult = await purgeInactiveCases();

    if (purgeResult.success && purgeResult.purgedCount >= 1) {
      // Verificar que el caso ya no existe
      const checkCase = await prisma.clinicalCase.findUnique({
        where: { id: oldCase.id }
      });
      // Verificar que el mensaje cascada fue eliminado
      const checkMessages = await prisma.message.findMany({
        where: { caseId: oldCase.id }
      });
      // Verificar que la cita cascada fue eliminada
      const checkAppointments = await prisma.appointment.findMany({
        where: { caseId: oldCase.id }
      });

      if (!checkCase && checkMessages.length === 0 && checkAppointments.length === 0) {
        console.log(`  ✅ OK: Purga de ${purgeResult.purgedCount} caso(s) e eliminación en cascada de mensajes y citas exitosa.`);
      } else {
        console.error("  ❌ FALLA: Los registros huérfanos o el caso persistieron tras la purga.");
        passed = false;
      }
    } else {
      console.error("  ❌ FALLA: El job de purga no reportó casos eliminados.");
      passed = false;
    }

    // Verificar que se creó el log de auditoría
    const auditRecord = await prisma.auditLog.findFirst({
      where: { action: "SYSTEM_PURGE_CASES" }
    });

    if (auditRecord) {
      console.log(`  ✅ OK: Bitácora de auditoría registrada correctamente.`);
    } else {
      console.error("  ❌ FALLA: No se encontró registro del purge en la bitácora de auditoría (AuditLog).");
      passed = false;
    }

    // ----------------------------------------------------
    // Limpieza final de prueba (Teardown)
    // ----------------------------------------------------
    console.log("\n➡️ Iniciando limpieza final de registros...");
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.searchCache.deleteMany();
    await prisma.auditLog.deleteMany({ where: { action: "SYSTEM_PURGE_CASES" } });
    console.log("  ✅ OK: Base de datos limpia de registros de prueba.");

  } catch (error) {
    console.error("\n❌ ERROR CRÍTICO durante la ejecución de las pruebas:", error);
    passed = false;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n=======================================================");
  if (passed) {
    console.log("🎉 RESULTADO: ¡TODAS LAS PRUEBAS DE PRIVACIDAD Y BÚSQUEDA WEB PASARON EXITOSAMENTE! (OK)");
    process.exit(0);
  } else {
    console.error("🚨 RESULTADO: ALGUNAS PRUEBAS FALLARON. Revisa los logs.");
    process.exit(1);
  }
}

runTests();
