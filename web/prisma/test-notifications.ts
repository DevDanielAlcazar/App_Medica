import { PrismaClient } from "@prisma/client";
import { getSmtpConfig } from "../src/lib/services/email";

const prisma = new PrismaClient();

async function runTests() {
  console.log("🧪 Iniciando Suite de Pruebas de Notificaciones y Calendario (Sprint 8)...\n");
  let passed = true;

  try {
    // ----------------------------------------------------
    // Test 1: Configuración de Notificaciones (SystemSetting)
    // ----------------------------------------------------
    console.log("➡️ Test 1: Guardando y Leyendo Configuración SMTP...");
    
    // Configuración dummy
    const updates = [
      { key: "gmail_smtp_host", value: "smtp.testserver.com" },
      { key: "gmail_smtp_port", value: "465" },
      { key: "gmail_smtp_user", value: "test@testserver.com" },
      { key: "gmail_smtp_pass", value: "supersecretpass" },
      { key: "gmail_smtp_sender_name", value: "Angélica Med Test App" },
      { key: "gmail_smtp_enabled", value: "true" }
    ];

    // Cargar en la DB
    for (const update of updates) {
      await prisma.systemSetting.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: { key: update.key, value: update.value }
      });
    }

    // Leer usando el servicio
    const smtpConfig = await getSmtpConfig();
    
    if (
      smtpConfig.host === "smtp.testserver.com" &&
      smtpConfig.port === 465 &&
      smtpConfig.user === "test@testserver.com" &&
      smtpConfig.pass === "supersecretpass" &&
      smtpConfig.senderName === "Angélica Med Test App" &&
      smtpConfig.enabled === true
    ) {
      console.log("  ✅ OK: Mapeo y lectura dinámica de SystemSetting a SmtpConfig correctos.");
    } else {
      console.error("  ❌ FALLA: Los valores leídos no coinciden con los guardados.");
      passed = false;
    }

    // ----------------------------------------------------
    // Test 2: Simulación de Renderizado de Plantillas
    // ----------------------------------------------------
    console.log("\n➡️ Test 2: Validando Renderizado de Plantillas HTML...");
    
    const { sendAppointmentConfirmationEmail } = await import("../src/lib/services/email");
    
    // Probamos disparar la llamada con configuración habilitada pero sin conexión real
    // (debe retornar false en lugar de crashear porque la conexión fallará/es dummy)
    const emailSentResult = await sendAppointmentConfirmationEmail({
      to: "patient@test.com",
      patientName: "Paciente Test",
      doctorName: "Dr. Ramírez",
      dateTime: new Date().toISOString(),
      meetLink: "https://meet.google.com/abc-defg-hij",
      caseTitle: "Caso Clínico Gripe"
    });

    // Como es un host inválido, debe fallar de forma controlada y devolver false, no tirar excepción.
    if (emailSentResult === false) {
      console.log("  ✅ OK: El servicio manejó la falla de conexión SMTP de forma segura y controlada.");
    } else {
      console.error("  ❌ FALLA: El envío de email con credenciales falsas retornó éxito inesperadamente.");
      passed = false;
    }

    // ----------------------------------------------------
    // Test 3: Recordatorios de Medicamento (MedicationReminder)
    // ----------------------------------------------------
    console.log("\n➡️ Test 3: Evaluando Gestión de Recordatorios de Medicamentos...");

    // Crear un usuario de pruebas temporal
    const testUser = await prisma.user.create({
      data: {
        email: `test_calendar_user_${Date.now()}@angelicamed.com`,
        name: "Test Patient Calendar E2E",
        password: "dummyhash",
        role: "paciente",
      }
    });
    console.log(`  - Usuario temporal creado: ${testUser.email}`);

    // Crear un recordatorio de medicamento
    const reminder = await prisma.medicationReminder.create({
      data: {
        userId: testUser.id,
        medication: "Paracetamol",
        dosage: "500 mg",
        frequency: "cada 8 horas",
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 días después
      }
    });
    console.log(`  - Recordatorio creado para '${reminder.medication}' (${reminder.dosage})`);

    // Consultar recordatorios
    const fetchedReminders = await prisma.medicationReminder.findMany({
      where: { userId: testUser.id }
    });

    if (fetchedReminders.length === 1 && fetchedReminders[0].medication === "Paracetamol") {
      console.log("  ✅ OK: Creación, relación de base de datos e integridad del recordatorio correctas.");
    } else {
      console.error("  ❌ FALLA: No se pudo verificar la integridad del recordatorio guardado.");
      passed = false;
    }

    // ----------------------------------------------------
    // Limpieza de Datos de Prueba (Teardown)
    // ----------------------------------------------------
    console.log("\n➡️ Iniciando limpieza de registros de prueba (Teardown)...");
    
    // Eliminar recordatorios y usuario
    await prisma.medicationReminder.deleteMany({ where: { userId: testUser.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    
    // Restaurar SMTP settings a default/vacío para que no queden valores dummy
    const keys = ["gmail_smtp_host", "gmail_smtp_port", "gmail_smtp_user", "gmail_smtp_pass", "gmail_smtp_sender_name", "gmail_smtp_enabled"];
    await prisma.systemSetting.deleteMany({
      where: { key: { in: keys } }
    });
    
    console.log("  ✅ OK: Base de datos limpia de registros de prueba.");

  } catch (error) {
    console.error("\n❌ ERROR CRÍTICO durante la ejecución de las pruebas:", error);
    passed = false;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n=======================================================");
  if (passed) {
    console.log("🎉 RESULTADO: ¡TODAS LAS PRUEBAS DE NOTIFICACIONES PASARON EXITOSAMENTE! (OK)");
    process.exit(0);
  } else {
    console.error("🚨 RESULTADO: ALGUNAS PRUEBAS FALLARON. Revisa los logs.");
    process.exit(1);
  }
}

runTests();
