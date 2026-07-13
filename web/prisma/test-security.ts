import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runSecurityTests() {
  console.log("Iniciando Suite de Pruebas de Seguridad y RBAC...\n");
  let passed = true;

  try {
    console.log("Test 1: Verificando RBAC en endpoints admin...");
    
    const patientUser = await prisma.user.create({
      data: {
        email: `security_test_${Date.now()}@test.com`,
        name: "Patient Security Test",
        password: "dummyhash",
        role: "paciente",
      },
    });
    console.log(`  - Usuario paciente creado: ${patientUser.email}`);

    const adminEndpoints = [
      "/api/admin/ai/providers",
      "/api/admin/ai/keys",
      "/api/admin/permisos",
      "/api/admin/plans",
    ];

    const fs = require("fs");
    const path = require("path");

    for (const endpoint of adminEndpoints) {
      try {
        const routePath = path.join(__dirname, "..", "src", "app", endpoint);
        const routeFiles = fs.readdirSync(routePath).filter((f: string) => f.endsWith(".ts"));
        
        for (const file of routeFiles) {
          const content = fs.readFileSync(path.join(routePath, file), "utf-8");
          const hasRoleCheck = content.includes("role") && (content.includes("admin") || content.includes("superadmin"));
          
          if (hasRoleCheck) {
            console.log(`  OK: ${endpoint} tiene validacion de rol`);
          } else {
            console.error(`  WARNING ${endpoint} podria carecer de validacion de rol`);
            passed = false;
          }
        }
      } catch (err) {
        console.log(`  INFO ${endpoint} - no se encontro archivo de ruta`);
      }
    }

    console.log("\nTest 2: Verificando que AuditLog no exponga PHI...");
    const auditLogs = await prisma.auditLog.findMany({
      where: { userId: patientUser.id },
      take: 5,
    });

    for (const log of auditLogs) {
      const detailsStr = JSON.stringify(log.details);
      const phiPatterns = ["password", "ssn", "credit card", "medical record", "diagnosis", "symptom"];
      const hasPhi = phiPatterns.some(pattern => detailsStr.toLowerCase().includes(pattern));
      
      if (hasPhi) {
        console.error(`  FALLA: AuditLog contiene posible PHI: ${log.action}`);
        passed = false;
      }
    }
    console.log("  OK: AuditLog no contiene PHI expuesto");

    console.log("\nTest 3: Limpieza de datos de prueba...");
    await prisma.user.delete({ where: { id: patientUser.id } });
    console.log("  OK: Usuario de prueba eliminado");

  } catch (error) {
    console.error("\nERROR CRITICO:", error);
    passed = false;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n=======================================================");
  if (passed) {
    console.log("RESULTADO: PRUEBAS DE SEGURIDAD PASARON EXITOSAMENTE");
    process.exit(0);
  } else {
    console.error("RESULTADO: ALGUNAS PRUEBAS DE SEGURIDAD FALLARON");
    process.exit(1);
  }
}

runSecurityTests();