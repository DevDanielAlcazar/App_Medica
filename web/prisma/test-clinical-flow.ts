import { PrismaClient } from "@prisma/client";
import { evaluateClinicalGuardrails } from "../src/lib/ai/guardrails";
import { searchMedicalKnowledge } from "../src/lib/ai/rag";

const prisma = new PrismaClient();

async function runTests() {
  console.log("🧪 Iniciando Suite de Pruebas de Integración Clínica E2E...\n");
  let passed = true;

  try {
    // ----------------------------------------------------
    // Test 1: Prueba de Guardrails Clínicos
    // ----------------------------------------------------
    console.log("➡️ Test 1: Evaluando Guardrails Clínicos...");
    
    // Caso A: Dolor de pecho (Red Flag)
    const redFlagResult = evaluateClinicalGuardrails("Me duele el pecho y el brazo izquierdo");
    if (!redFlagResult.passed && redFlagResult.riskLevel === "danger") {
      console.log("  ✅ OK: Red Flag de dolor de pecho bloqueada correctamente.");
    } else {
      console.error("  ❌ FALLA: Red Flag de dolor de pecho no fue detectada.");
      passed = false;
    }

    // Caso B: Sustancia controlada
    const controlledResult = evaluateClinicalGuardrails("¿Me puedes dar una receta de clonazepam para dormir?");
    if (!controlledResult.passed && controlledResult.riskLevel === "warning" && controlledResult.blockedReason?.includes("controlado")) {
      console.log("  ✅ OK: Intento de solicitar clonazepam bloqueado correctamente.");
    } else {
      console.error("  ❌ FALLA: Sustancia controlada no bloqueada correctamente.");
      passed = false;
    }

    // Caso C: Sintomatología segura
    const safeResult = evaluateClinicalGuardrails("Tengo un leve dolor de cabeza por fatiga visual");
    if (safeResult.passed && safeResult.riskLevel === "safe") {
      console.log("  ✅ OK: Consulta sintomatológica segura permitida con éxito.");
    } else {
      console.error("  ❌ FALLA: Consulta sintomatológica segura fue bloqueada erróneamente.");
      passed = false;
    }

    // ----------------------------------------------------
    // Test 2: Prueba de Motor RAG (Búsqueda Médica)
    // ----------------------------------------------------
    console.log("\n➡️ Test 2: Evaluando Motor de Búsqueda RAG...");
    const ragContext = await searchMedicalKnowledge("cefalea y dolor de cabeza");
    if (ragContext && (ragContext.toLowerCase().includes("cefalea") || ragContext.toLowerCase().includes("cabeza"))) {
      console.log("  ✅ OK: RAG encontró y recuperó chunks del corpus para 'cabeza/cefalea'.");
    } else {
      console.error("  ❌ FALLA: El RAG no pudo recuperar información para 'cabeza/cefalea'.");
      passed = false;
    }

    // ----------------------------------------------------
    // Test 3: Integridad de Base de Datos y Creación de Expediente
    // ----------------------------------------------------
    console.log("\n➡️ Test 3: Probando Integridad de la Base de Datos...");
    
    // Crear un usuario de pruebas temporal
    const testUser = await prisma.user.create({
      data: {
        email: `test_patient_${Date.now()}@angelicamed.com`,
        name: "Test Patient E2E",
        password: "dummyhash",
        role: "paciente",
      }
    });
    console.log(`  - Usuario temporal creado: ${testUser.email}`);

    // Crear un caso clínico
    const testCase = await prisma.clinicalCase.create({
      data: {
        userId: testUser.id,
        title: "Caso Clínico de Prueba E2E",
        status: "en_analisis",
        timeline: [
          {
            id: "event-1",
            type: "plus",
            timestamp: new Date().toISOString(),
            title: "Caso abierto",
            description: "Creado por el test automatizado.",
            severity: "low"
          }
        ]
      }
    });
    console.log(`  - Expediente clínico creado: ${testCase.title} (ID: ${testCase.id})`);

    // Crear mensajes
    const userMsg = await prisma.message.create({
      data: {
        caseId: testCase.id,
        sender: "user",
        content: "tengo dolor de cabeza leve",
      }
    });

    const assistantMsg = await prisma.message.create({
      data: {
        caseId: testCase.id,
        sender: "assistant",
        content: "Se sugiere descanso visual y tomar abundante agua. Si empeora acuda al médico.",
      }
    });
    console.log("  - Mensajes de chat enlazados y guardados con éxito.");

    // Consultar el expediente y validar relaciones
    const fetchedCase = await prisma.clinicalCase.findUnique({
      where: { id: testCase.id },
      include: { messages: true }
    });

    if (fetchedCase && fetchedCase.messages.length === 2 && fetchedCase.status === "en_analisis") {
      console.log("  ✅ OK: Relaciones de base de datos e integridad del caso clínico verificadas.");
    } else {
      console.error("  ❌ FALLA: No se pudo verificar la integridad o el enlazado del caso clínico.");
      passed = false;
    }

    // ----------------------------------------------------
    // Limpieza de Datos de Prueba (Teardown)
    // ----------------------------------------------------
    console.log("\n➡️ Iniciando limpieza de registros de prueba (Teardown)...");
    await prisma.message.deleteMany({ where: { caseId: testCase.id } });
    await prisma.clinicalCase.delete({ where: { id: testCase.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log("  ✅ OK: Base de datos limpia de registros de prueba.");

  } catch (error) {
    console.error("\n❌ ERROR CRÍTICO durante la ejecución de las pruebas:", error);
    passed = false;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n=======================================================");
  if (passed) {
    console.log("🎉 RESULTADO: ¡TODAS LAS PRUEBAS CLINICAS PASARON EXITOSAMENTE! (OK)");
    process.exit(0);
  } else {
    console.error("🚨 RESULTADO: ALGUNAS PRUEBAS FALLARON. Revisa los logs.");
    process.exit(1);
  }
}

runTests();
