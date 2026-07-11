import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Stripe from "stripe";

// Opciones de paquetes de créditos y costos asociados (en MXN)
const CREDIT_PACKAGES: Record<number, { cost: number; name: string }> = {
  200: { cost: 200, name: "Paquete Clínico Básico (200 créditos)" },
  500: { cost: 450, name: "Paquete Clínico Premium (500 créditos)" },
  1000: { cost: 800, name: "Paquete Clínico Elite (1000 créditos)" },
};

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const patientId = token.replace("session-token-", "");
    const { creditsOption } = await request.json();

    const selectedPackage = CREDIT_PACKAGES[creditsOption];
    if (!selectedPackage) {
      return NextResponse.json(
        { error: "Opción de recarga de créditos inválida." },
        { status: 400 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // MOCK BYPASS: Si Stripe no está configurado, redireccionamos a un checkout simulado
    if (!stripeSecretKey || stripeSecretKey === "COLOCA_AQUI_TU_STRIPE_SECRET_KEY" || stripeSecretKey.trim() === "") {
      console.log(`[Stripe Checkout] API Key faltante. Iniciando flujo simulado para ${creditsOption} créditos.`);
      return NextResponse.json({
        success: true,
        checkoutUrl: `${appUrl}/paciente/wallet/checkout-mock?credits=${creditsOption}`,
      });
    }

    // Inicializar Stripe con la llave provista
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-01-27.acacian" as any, // Forzar compatibilidad o apiVersion por defecto de Stripe SDK
    });

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: selectedPackage.name,
              description: `Abono de ${creditsOption} créditos de consulta para uso en Angélica Med.`,
            },
            unit_amount: selectedPackage.cost * 100, // Stripe espera centavos
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        userId: patientId,
        credits: creditsOption.toString(),
      },
      success_url: `${appUrl}/paciente/wallet?success=true`,
      cancel_url: `${appUrl}/paciente/wallet?cancel=true`,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error: any) {
    console.error("Error al crear sesión de checkout:", error);
    return NextResponse.json(
      { error: "Error al iniciar el proceso de pago." },
      { status: 500 }
    );
  }
}
