import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/patient/cases/[caseId]
 * Recupera los detalles de un caso clínico específico.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    const clinicalCase = await prisma.clinicalCase.findUnique({
      where: { id: caseId },
      include: {
        appointments: true,
      },
    });

    if (!clinicalCase || clinicalCase.userId !== userId) {
      return NextResponse.json({ error: "Caso clínico no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, case: clinicalCase });
  } catch (error: any) {
    console.error("Error al obtener caso clínico:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

/**
 * DELETE /api/patient/cases/[caseId]
 * Elimina permanentemente un caso clínico (expediente) a petición expresa del paciente.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    // 1. Validar propiedad del caso clínico
    const clinicalCase = await prisma.clinicalCase.findUnique({
      where: { id: caseId },
    });

    if (!clinicalCase || clinicalCase.userId !== userId) {
      return NextResponse.json({ error: "Caso clínico no encontrado." }, { status: 404 });
    }

    // 2. Eliminar caso (Prisma eliminará cascada Messages y Appointments según la configuración de onDelete)
    await prisma.clinicalCase.delete({
      where: { id: caseId },
    });

    // 3. Registrar en log de auditoría inmutable
    await prisma.auditLog.create({
      data: {
        userId,
        action: "CASE_DELETED",
        entity: "ClinicalCase",
        details: {
          caseId,
          title: clinicalCase.title,
          consent: "El paciente solicitó la eliminación permanente del expediente clínico de forma voluntaria de acuerdo a las leyes de protección de datos.",
        },
      },
    });

    return NextResponse.json({ success: true, message: "Caso eliminado con éxito." });
  } catch (error: any) {
    console.error("Error al eliminar caso clínico:", error);
    return NextResponse.json({ error: "Error al intentar eliminar el caso clínico." }, { status: 500 });
  }
}
