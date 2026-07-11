import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/doctor/schedule
 * Obtiene la disponibilidad horaria del médico autenticado.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    const profile = await prisma.doctorProfile.findUnique({
      where: { userId },
      select: {
        schedule: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de médico no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, schedule: profile.schedule });
  } catch (error: any) {
    console.error("Error al obtener disponibilidad del médico:", error);
    return NextResponse.json(
      { error: "Error al consultar la disponibilidad horaria." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/doctor/schedule
 * Permite al médico guardar/modificar su agenda de disponibilidad horaria.
 */
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");
    const { schedule } = await request.json();

    if (!schedule) {
      return NextResponse.json({ error: "Datos de disponibilidad requeridos." }, { status: 400 });
    }

    const profile = await prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de médico no encontrado." }, { status: 404 });
    }

    // Actualizar disponibilidad
    const updatedProfile = await prisma.doctorProfile.update({
      where: { userId },
      data: {
        schedule,
      },
    });

    // Registrar auditoría
    await prisma.auditLog.create({
      data: {
        userId,
        action: "DOCTOR_SCHEDULE_UPDATED",
        entity: "DoctorProfile",
        details: {
          profileId: updatedProfile.id,
          schedule,
        },
      },
    });

    return NextResponse.json({ success: true, schedule: updatedProfile.schedule });
  } catch (error: any) {
    console.error("Error al actualizar disponibilidad horaria:", error);
    return NextResponse.json(
      { error: "Error al actualizar la disponibilidad horaria." },
      { status: 500 }
    );
  }
}
