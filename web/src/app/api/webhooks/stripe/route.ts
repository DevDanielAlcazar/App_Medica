import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Forzar Next.js a no parsear el body como JSON para poder validar la firma raw de Stripe
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error("[Stripe Webhook Error] Credenciales de Stripe no configuradas en el servidor.");
    return NextResponse.json({ error: "Configuración de Stripe faltante." }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-01-27.acacian" as any,
  });

  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Falta encabezado stripe-signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error(`[Stripe Webhook Error] Firma inválida: ${err.message}`);
    return NextResponse.json({ error: `Firma inválida: ${err.message}` }, { status: 400 });
  }

  // Procesar evento de Checkout Completado
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const userId = session.metadata?.userId;
    const creditsStr = session.metadata?.credits;

    if (!userId || !creditsStr) {
      console.warn("[Stripe Webhook] Metadatos del checkout incompletos o faltantes.");
      return NextResponse.json({ received: true });
    }

    const creditsNum = parseInt(creditsStr, 10);

    if (isNaN(creditsNum) || creditsNum <= 0) {
      console.warn(`[Stripe Webhook] Cantidad de créditos inválida: ${creditsStr}`);
      return NextResponse.json({ received: true });
    }

    try {
      console.log(`[Stripe Webhook] Procesando abono de ${creditsNum} créditos para el usuario: ${userId}`);

      // Buscar o crear la billetera del usuario
      let wallet = await prisma.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            userId,
            balance: 0,
          },
        });
      }

      // Procesar recarga inmutable
      await prisma.$transaction(async (tx) => {
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
            description: `Recarga de créditos vía Stripe Checkout (Sesión: ${session.id})`,
            status: "completed",
          },
        });

        await tx.auditLog.create({
          data: {
            userId,
            action: "WALLET_STRIPE_RECHARGE",
            entity: "Wallet",
            details: {
              credits: creditsNum,
              stripeSessionId: session.id,
              previousBalance: wallet.balance,
              newBalance: updatedWallet.balance,
            },
          },
        });
      });

      console.log(`[Stripe Webhook] Abono completado exitosamente para el usuario: ${userId}`);
    } catch (dbErr: any) {
      console.error("[Stripe Webhook Database Error]:", dbErr);
      // Retornar 500 para que Stripe reintente la llamada más tarde
      return NextResponse.json({ error: "Error al registrar en base de datos." }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
