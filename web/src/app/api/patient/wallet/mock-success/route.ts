import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Solo permitir en desarrollo o si las llaves de Stripe no están configuradas
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const isStripeDisabled = !stripeSecretKey || stripeSecretKey === "COLOCA_AQUI_TU_STRIPE_SECRET_KEY" || stripeSecretKey.trim() === "";

    if (process.env.NODE_ENV === "production" && !isStripeDisabled) {
      return NextResponse.json(
        { error: "Operación no permitida en producción." },
        { status: 403 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const patientId = token.replace("session-token-", "");
    const { credits } = await request.json();

    const creditsNum = parseInt(credits, 10);
    if (isNaN(creditsNum) || creditsNum <= 0) {
      return NextResponse.json({ error: "Monto de créditos inválido." }, { status: 400 });
    }

    // Buscar o crear billetera
    let wallet = await prisma.wallet.findUnique({
      where: { userId: patientId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: patientId,
          balance: 0,
        },
      });
    }

    // Procesar la recarga simulada en una transacción
    const result = await prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: creditsNum,
          },
        },
      });

      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount: creditsNum,
          type: "in",
          description: "Recarga simulada de créditos (Bypass Mode)",
          status: "completed",
        },
      });

      await tx.auditLog.create({
        data: {
          userId: patientId,
          action: "WALLET_MOCK_RECHARGE",
          entity: "Wallet",
          details: {
            credits: creditsNum,
            previousBalance: wallet.balance,
            newBalance: updatedWallet.balance,
          },
        },
      });

      return updatedWallet;
    });

    return NextResponse.json({
      success: true,
      balance: result.balance,
      message: "Recarga simulada completada exitosamente.",
    });
  } catch (error: any) {
    console.error("Error al procesar recarga simulada:", error);
    return NextResponse.json(
      { error: "Error al procesar la recarga simulada." },
      { status: 500 }
    );
  }
}
