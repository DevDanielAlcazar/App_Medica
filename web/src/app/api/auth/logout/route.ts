import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: "Sesión cerrada correctamente." });

    // Borrar cookies estableciendo maxAge a 0
    response.cookies.set("auth-token", "", {
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("user-role", "", {
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error("Error en logout:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al cerrar sesión." },
      { status: 500 }
    );
  }
}
