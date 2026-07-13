import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");
    const subscription = await req.json();

    if (!subscription?.endpoint || !subscription?.keys) {
      return NextResponse.json({ error: "Suscripción inválida" }, { status: 400 });
    }

    const pushSub = await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        publicKey: subscription.keys.p256dh,
        authToken: subscription.keys.auth,
        userId,
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        publicKey: subscription.keys.p256dh,
        authToken: subscription.keys.auth,
      },
    });

    return NextResponse.json({ success: true, subscriptionId: pushSub.id });
  } catch (err) {
    console.error("Push subscription error:", err);
    return NextResponse.json({ error: "Error guardando suscripción" }, { status: 500 });
  }
}