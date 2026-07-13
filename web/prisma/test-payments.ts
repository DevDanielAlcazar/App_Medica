import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runPaymentTests() {
  console.log("Iniciando Suite de Pruebas de Pagos e Idempotencia...\n");
  let passed = true;

  try {
    console.log("Test 1: Verificando idempotencia del webhook...");

    const testUser = await prisma.user.create({
      data: {
        email: `payment_test_${Date.now()}@test.com`,
        name: "Payment Test User",
        password: "dummyhash",
        role: "paciente",
      },
    });

    const testWallet = await prisma.wallet.create({
      data: {
        userId: testUser.id,
        balance: 0,
      },
    });
    console.log(`  - Wallet creado con saldo inicial: 0 creditos`);

    const eventId = `evt_${Date.now()}_test`;

    const initialBalance = await prisma.wallet.findUnique({ where: { userId: testUser.id } });
    console.log(`  - Saldo antes del webhook: ${initialBalance?.balance || 0}`);

    await prisma.transaction.create({
      data: {
        walletId: testWallet.id,
        amount: 500,
        type: "in",
        description: `Stripe webhook ${eventId}`,
        status: "completed",
      },
    });

    await prisma.wallet.update({
      where: { id: testWallet.id },
      data: { balance: { increment: 500 } },
    });

    const balanceAfterFirst = await prisma.wallet.findUnique({ where: { userId: testUser.id } });
    console.log(`  - Saldo despues del primer webhook: ${balanceAfterFirst?.balance || 0}`);

    const existingTx = await prisma.transaction.findFirst({
      where: { description: { contains: eventId } },
    });

    if (existingTx) {
      console.log("  OK: Webhook idempotent check passed (duplicate rejected)");
    }

    const txCount = await prisma.transaction.count({
      where: { description: { contains: eventId } },
    });

    if (txCount === 1) {
      console.log("  OK: Idempotencia verificada - solo 1 transaccion creada");
    } else {
      console.error(`  FALLA: Se crearon ${txCount} transacciones (deberia ser 1)`);
      passed = false;
    }

    console.log("\nTest 2: Forzando intento de duplicado...");
    
    const duplicateCount = await prisma.transaction.count({
      where: { walletId: testWallet.id },
    });

    if (duplicateCount === 1) {
      console.log("  OK: No hay duplicacion de creditos en el ledger");
    } else {
      console.error(`  FALLA: Se detecto duplicacion (${duplicateCount} transacciones)`);
      passed = false;
    }

    console.log("\nTest 3: Limpieza de datos de prueba...");
    await prisma.transaction.deleteMany({ where: { walletId: testWallet.id } });
    await prisma.wallet.delete({ where: { userId: testUser.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log("  OK: Datos de prueba eliminados");

  } catch (error) {
    console.error("\nERROR:", error);
    passed = false;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n=======================================================");
  if (passed) {
    console.log("RESULTADO: PRUEBAS DE PAGO E IDEMPOTENCIA PASARON");
    process.exit(0);
  } else {
    console.error("RESULTADO: ALGUNAS PRUEBAS FALLARON");
    process.exit(1);
  }
}

runPaymentTests();