import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    // El token tiene el formato: `session-token-${userId}`
    const userId = token.replace("session-token-", "");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Error en /api/auth/me:", error);
    if (error.code === "P1001" || error.message?.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Base de datos temporalmente fuera de línea. Por favor verifica que tu túnel SSH (puerto 5433) esté activo." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
