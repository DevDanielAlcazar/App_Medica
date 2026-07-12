import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function checkSupportAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;

  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || (user.role !== "soporte" && user.role !== "admin")) return null;

  return user;
}

/**
 * GET /api/support/compensations?email=patient@demo.com
 * Busca un usuario por correo y retorna sus datos y saldo de Wallet.
 */
export async function GET(request: Request) {
  try {
    const agent = await checkSupportAuth();
    if (!agent) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "El correo es obligatorio." }, { status: 400 });
    }

    const patient = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: {
        wallet: true
      }
    });

    if (!patient) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      patient: {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
        wallet: patient.wallet ? {
          id: patient.wallet.id,
          balance: patient.wallet.balance
        } : null
      }
    });
  } catch (error: any) {
    console.error("Error al buscar usuario para compensación:", error);
    return NextResponse.json(
      { error: "Error interno al buscar el usuario." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/support/compensations
 * Acredita créditos manuales en la billetera de un usuario.
 */
export async function POST(request: Request) {
  try {
    const agent = await checkSupportAuth();
    if (!agent) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const { patientId, amount, ticketId, reason } = await request.json();

    if (!patientId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "El ID de paciente y una cantidad positiva son requeridos." },
        { status: 400 }
      );
    }

    // 1. Obtener la Wallet del paciente
    const wallet = await prisma.wallet.findUnique({
      where: { userId: patientId }
    });

    if (!wallet) {
      return NextResponse.json({ error: "El usuario no cuenta con una billetera activa." }, { status: 404 });
    }

    const creditsToAdd = parseInt(amount, 10);

    // 2. Transacción atómica para abonar saldo y crear registro
    const result = await prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: {
            increment: creditsToAdd
          }
        }
      });

      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          amount: creditsToAdd,
          type: "in",
          description: `Compensación de Soporte - ${reason || "Ajuste técnico"} ${ticketId ? `(Ticket #${ticketId.slice(0, 8)})` : ""}`,
          status: "completed"
        }
      });

      // Crear registro de auditoría de la acción administrativa
      await tx.auditLog.create({
        data: {
          userId: agent.id,
          action: "WALLET_COMPENSATED_BY_SUPPORT",
          entity: "Wallet",
          details: {
            targetWalletId: wallet.id,
            targetUserId: patientId,
            creditsAdded: creditsToAdd,
            reason: reason || "",
            ticketId: ticketId || null
          }
        }
      });

      return { wallet: updatedWallet, transaction };
    });

    console.log(`[Compensation Approved] Agente ${agent.email} acreditó +${creditsToAdd} créditos al usuario ${patientId}. Reason: ${reason}`);

    return NextResponse.json({
      success: true,
      walletBalance: result.wallet.balance,
      message: `Se han acreditado con éxito ${creditsToAdd} créditos por compensación.`
    });
  } catch (error: any) {
    console.error("Error al compensar usuario:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la compensación." },
      { status: 500 }
    );
  }
}
