import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runTests() {
  console.log("🧪 Iniciando Suite de Pruebas de Tickets y Compensaciones (Sprint 10)...\n");
  let passed = true;

  try {
    // ----------------------------------------------------
    // Configuración: Crear usuarios temporales
    // ----------------------------------------------------
    const timestamp = Date.now();
    const patientUser = await prisma.user.create({
      data: {
        email: `test_support_patient_${timestamp}@angelicamed.com`,
        name: "Paciente de Pruebas Soporte",
        password: "dummyhash",
        role: "paciente",
        wallet: {
          create: {
            balance: 50 // saldo inicial
          }
        }
      },
      include: {
        wallet: true
      }
    });

    const agentUser = await prisma.user.create({
      data: {
        email: `test_support_agent_${timestamp}@angelicamed.com`,
        name: "Agente Soporte Pruebas",
        password: "dummyhash",
        role: "soporte",
      }
    });

    console.log(`  - Paciente temporal creado: ${patientUser.email} (Saldo inicial: ${patientUser.wallet?.balance} créditos)`);
    console.log(`  - Agente temporal creado: ${agentUser.email}`);

    // ----------------------------------------------------
    // Test 1: Crear ticket de soporte
    // ----------------------------------------------------
    console.log("\n➡️ Test 1: Creando Ticket de Soporte...");
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: patientUser.id,
        subject: "Falla con videollamada de consulta virtual",
        description: "Al iniciar la consulta con el Dr. Ramírez, la pantalla se congeló y consumió mis créditos.",
        category: "appointment",
        priority: "high",
        status: "open"
      }
    });

    if (ticket && ticket.status === "open" && ticket.priority === "high") {
      console.log(`  ✅ OK: Ticket creado correctamente con ID: ${ticket.id}`);
    } else {
      console.error("  ❌ FALLA: No se pudo verificar la creación del ticket.");
      passed = false;
    }

    // ----------------------------------------------------
    // Test 2: Enviar mensajes de chat (Paciente & Agente)
    // ----------------------------------------------------
    console.log("\n➡️ Test 2: Simulación de Mensajes en el Chat de Soporte...");
    
    // Mensaje del paciente
    const msg1 = await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: patientUser.id,
        content: "Adjunto captura de pantalla del error."
      }
    });

    // Mensaje del agente
    const msg2 = await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: agentUser.id,
        content: "Hola, entiendo el problema. Revisé el log y efectivamente hubo una desconexión. Procederé a compensarte con 200 créditos."
      }
    });

    const messages = await prisma.ticketMessage.findMany({
      where: { ticketId: ticket.id }
    });

    if (messages.length === 2 && messages[1].senderId === agentUser.id) {
      console.log(`  ✅ OK: Mensajes de chat registrados. Historial contiene ${messages.length} mensajes.`);
    } else {
      console.error("  ❌ FALLA: Error de integridad en los mensajes del chat de soporte.");
      passed = false;
    }

    // ----------------------------------------------------
    // Test 3: Actualizar estatus del ticket
    // ----------------------------------------------------
    console.log("\n➡️ Test 3: Actualizando estatus del ticket por agente...");
    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticket.id },
      data: { status: "resolved" }
    });

    if (updatedTicket.status === "resolved") {
      console.log("  ✅ OK: Ticket marcado como Resuelto con éxito.");
    } else {
      console.error("  ❌ FALLA: Falló la actualización de estatus del ticket.");
      passed = false;
    }

    // ----------------------------------------------------
    // Test 4: Procesamiento de Compensación en Wallet
    // ----------------------------------------------------
    console.log("\n➡️ Test 4: Acreditación de Compensación Manual de Créditos...");
    
    const creditsToAward = 200;
    
    // Obtener wallet del paciente
    const patientWallet = await prisma.wallet.findUnique({
      where: { userId: patientUser.id }
    });

    if (!patientWallet) {
      throw new Error("Wallet de paciente no encontrada.");
    }

    // Ejecutar transacción de abono
    await prisma.$transaction(async (tx) => {
      await tx.wallet.update({
        where: { id: patientWallet.id },
        data: {
          balance: {
            increment: creditsToAward
          }
        }
      });

      await tx.transaction.create({
        data: {
          walletId: patientWallet.id,
          amount: creditsToAward,
          type: "in",
          description: `Compensación de Soporte - Cita caída (Ticket #${ticket.id.slice(0, 8)})`,
          status: "completed"
        }
      });

      await tx.auditLog.create({
        data: {
          userId: agentUser.id,
          action: "WALLET_COMPENSATED_BY_SUPPORT",
          entity: "Wallet",
          details: {
            targetWalletId: patientWallet.id,
            creditsAdded: creditsToAward,
            ticketId: ticket.id
          }
        }
      });
    });

    // Validar balances y ledgers
    const finalWallet = await prisma.wallet.findUnique({
      where: { id: patientWallet.id }
    });
    
    const ledgerEntry = await prisma.transaction.findFirst({
      where: { walletId: patientWallet.id, type: "in" }
    });

    const auditLogEntry = await prisma.auditLog.findFirst({
      where: { userId: agentUser.id, action: "WALLET_COMPENSATED_BY_SUPPORT" }
    });

    if (
      finalWallet &&
      finalWallet.balance === 250 &&
      ledgerEntry &&
      ledgerEntry.amount === 200 &&
      auditLogEntry
    ) {
      console.log(`  ✅ OK: Saldo acreditado (+200). Balance final: ${finalWallet.balance} créditos.`);
      console.log(`  ✅ OK: Ledger inmutable creado: '${ledgerEntry.description}'`);
      console.log(`  ✅ OK: Log de auditoría del agente registrado con éxito.`);
    } else {
      console.error("  ❌ FALLA: Inconsistencia detectada en Wallet, Ledger o logs de auditoría.");
      passed = false;
    }

    // ----------------------------------------------------
    // Limpieza final de prueba (Teardown)
    // ----------------------------------------------------
    console.log("\n➡️ Iniciando limpieza de registros de prueba (Teardown)...");
    
    // Eliminar cascada de ticket y mensajes
    await prisma.supportTicket.delete({ where: { id: ticket.id } });
    
    // Eliminar transacciones del wallet
    await prisma.transaction.deleteMany({ where: { walletId: patientWallet.id } });
    await prisma.wallet.delete({ where: { id: patientWallet.id } });
    
    // Eliminar usuarios
    await prisma.user.delete({ where: { id: patientUser.id } });
    await prisma.user.delete({ where: { id: agentUser.id } });
    
    // Eliminar logs de auditoría generados por el agente
    await prisma.auditLog.deleteMany({ where: { userId: agentUser.id } });

    console.log("  ✅ OK: Base de datos limpia de registros de prueba.");

  } catch (error) {
    console.error("\n❌ ERROR CRÍTICO durante la ejecución de las pruebas:", error);
    passed = false;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n=======================================================");
  if (passed) {
    console.log("🎉 RESULTADO: ¡TODAS LAS PRUEBAS DE SOPORTE Y COMPENSACIONES PASARON EXITOSAMENTE! (OK)");
    process.exit(0);
  } else {
    console.error("🚨 RESULTADO: ALGUNAS PRUEBAS FALLARON. Revisa los logs.");
    process.exit(1);
  }
}

runTests();
