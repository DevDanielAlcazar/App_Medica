import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Intentar una consulta simple para verificar la conexión
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "success",
      message: "Conexión a la base de datos establecida correctamente a través del túnel SSH.",
      data: {
        userCount,
      },
    });
  } catch (error: any) {
    console.error("Error al conectar con la base de datos:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "No se pudo conectar a la base de datos.",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
