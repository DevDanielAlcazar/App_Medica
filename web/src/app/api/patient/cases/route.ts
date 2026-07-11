import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/patient/cases
 * Lista los casos clínicos asociados al paciente logueado.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    const cases = await prisma.clinicalCase.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, cases });
  } catch (error: any) {
    console.error("Error al obtener casos:", error);
    if (error.code === "P1001" || error.message?.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Base de datos fuera de línea. Por favor verifica que tu túnel SSH esté activo." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Error interno del servidor al consultar casos." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/patient/cases
 * Abre un nuevo caso clínico e inicializa su línea de tiempo.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "El título de la consulta es obligatorio." },
        { status: 400 }
      );
    }

    const initialTimeline = [
      {
        id: crypto.randomUUID(),
        type: "plus",
        timestamp: new Date().toISOString(),
        title: "Caso abierto",
        description: "Se ha iniciado una nueva consulta de orientación clínica sintomática.",
        severity: "low"
      }
    ];

    const newCase = await prisma.clinicalCase.create({
      data: {
        userId,
        title,
        status: "en_analisis",
        timeline: initialTimeline,
      },
    });

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        userId,
        action: "CASE_CREATED",
        entity: "ClinicalCase",
        details: { caseId: newCase.id, title },
      },
    });

    return NextResponse.json({ success: true, case: newCase });
  } catch (error: any) {
    console.error("Error al crear caso:", error);
    if (error.code === "P1001" || error.message?.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Base de datos fuera de línea. Por favor verifica que tu túnel SSH esté activo." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Error interno del servidor al crear caso." },
      { status: 500 }
    );
  }
}
