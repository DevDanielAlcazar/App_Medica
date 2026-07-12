import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    // 1. Validar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    // 2. Eliminar el usuario (Prisma disparará cascada sobre Wallet, Cases, Messages, Reminders y AuditLogs)
    await prisma.user.delete({
      where: { id: userId }
    });

    console.log(`[Account Purge] Usuario con ID ${userId} y todos sus datos médicos eliminados permanentemente.`);

    // 3. Borrar la cookie de sesión
    const response = NextResponse.json({
      success: true,
      message: "Cuenta y todos sus datos asociados eliminados de forma permanente."
    });

    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expira de inmediato
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error al eliminar la cuenta del usuario:", error);
    return NextResponse.json(
      { error: "Error interno al eliminar la cuenta de usuario." },
      { status: 500 }
    );
  }
}
