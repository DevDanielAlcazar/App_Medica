import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/patient/wallet
 * Obtiene el saldo y el historial de transacciones de la billetera del paciente.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    // Buscar la billetera del usuario, o crearla si no existe (robustez)
    let wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId,
          balance: 0,
        },
        include: {
          transactions: true,
        },
      });
      console.log(`Billetera de cortesía creada para el usuario: ${userId}`);
    }

    return NextResponse.json({
      success: true,
      balance: wallet.balance,
      transactions: wallet.transactions,
    });
  } catch (error: any) {
    console.error("Error al obtener la billetera del paciente:", error);
    return NextResponse.json(
      { error: "Error al obtener la información de la billetera." },
      { status: 500 }
    );
  }
}
