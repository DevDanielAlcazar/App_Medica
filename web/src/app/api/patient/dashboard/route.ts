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

    // 1. Obtener balance del Wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });
    const balance = wallet ? wallet.balance : 0;

    // 2. Conteo de Casos Activos (padecimientos no curados ni archivados)
    const activeCasesCount = await prisma.clinicalCase.count({
      where: {
        userId,
        status: {
          notIn: ["curado", "archivado"],
        },
      },
    });

    // 3. Obtener Próxima Cita (fecha >= ahora, ordenada de forma ascendente)
    const nextAppointment = await prisma.appointment.findFirst({
      where: {
        patientId: userId,
        dateTime: {
          gte: new Date(),
        },
        status: {
          in: ["pending", "confirmed"], // Citas pendientes o confirmadas
        },
      },
      orderBy: {
        dateTime: "asc",
      },
      include: {
        doctor: {
          select: {
            name: true,
          },
        },
      },
    });

    // 4. Obtener Actividad Reciente (últimos casos creados o modificados)
    const recentCases = await prisma.clinicalCase.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    });

    // Formatear la actividad reciente
    const recentActivity = recentCases.map((c) => {
      let actionText = `Caso "${c.title}" actualizado.`;
      if (c.status === "curado") actionText = `Caso "${c.title}" marcado como Curado.`;
      else if (c.status === "derivado") actionText = `Caso "${c.title}" derivado a consulta física.`;
      
      return {
        id: c.id,
        action: actionText,
        updatedAt: c.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        balance,
        activeCasesCount,
        nextAppointment: nextAppointment ? {
          id: nextAppointment.id,
          doctorName: nextAppointment.doctor ? nextAppointment.doctor.name : "Médico por asignar",
          dateTime: nextAppointment.dateTime,
        } : null,
        recentActivity,
      },
    });
  } catch (error: any) {
    console.error("Error al obtener dashboard de paciente:", error);
    if (error.code === "P1001" || error.message?.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Base de datos fuera de línea. Por favor verifica que tu túnel SSH (puerto 5433) esté activo." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Error al cargar las estadísticas del paciente." },
      { status: 500 }
    );
  }
}
