const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando prueba de integración: Contabilidad y Liquidaciones (Sprint 11) ---');

  // 1. Limpiar o crear datos mock
  const uniqueEmail = `doc_finanzas_${Date.now()}@test.com`;
  
  const user = await prisma.user.create({
    data: {
      email: uniqueEmail,
      name: 'Dr. Finanzas Test',
      role: 'medico',
      password: 'hashedpassword123',
    },
  });

  const docProfile = await prisma.doctorProfile.create({
    data: {
      userId: user.id,
      bankName: 'Banamex',
      clabe: '002123456789012345',
      balance: 1500.50, // simulamos un balance inicial
    },
  });

  console.log('1. Doctor creado con balance de MXN 1500.50');

  // 2. Crear un ciclo contable manual
  const cycle = await prisma.accountingCycle.create({
    data: {
      periodName: `Semana Test ${Date.now()}`,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'open'
    }
  });

  console.log(`2. Ciclo contable creado: ${cycle.periodName}`);

  // 3. Simular solicitud de retiro por parte del médico
  const withdrawalAmount = 1000.00;
  
  const updatedProfile = await prisma.doctorProfile.update({
    where: { id: docProfile.id },
    data: { balance: { decrement: withdrawalAmount } }
  });

  const txRecord = await prisma.doctorTransaction.create({
    data: {
      doctorId: docProfile.id,
      amount: withdrawalAmount,
      type: 'withdrawal',
      description: 'Retiro manual',
      status: 'completed'
    }
  });

  const payout = await prisma.payout.create({
    data: {
      doctorId: docProfile.id,
      cycleId: cycle.id,
      amount: withdrawalAmount,
      status: 'pending',
      clabe: docProfile.clabe,
      bankName: docProfile.bankName
    }
  });

  console.log(`3. Retiro solicitado por MXN ${withdrawalAmount}. Nuevo balance: ${updatedProfile.balance}`);
  console.log(`   Transacción generada: ${txRecord.id}`);
  console.log(`   Payout pendiente generado: ${payout.id}`);

  // 4. Simular Admin aprobando el payout
  const approvedPayout = await prisma.payout.update({
    where: { id: payout.id },
    data: { status: 'completed' }
  });

  console.log(`4. Payout marcado como completado (Pagado). Estado actual: ${approvedPayout.status}`);

  console.log('--- Prueba de integración Exitosa ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
