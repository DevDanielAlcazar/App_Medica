import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const APPOINTMENT_REFUND = 200;

/**
 * GET /api/doctor/appointments
 * Recupera el listado de citas del médico autenticado.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    // Verificar rol de médico
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "medico") {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: userId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        clinicalCase: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { dateTime: "asc" },
    });

    return NextResponse.json({ success: true, appointments });
  } catch (error: any) {
    console.error("Error al obtener citas médicas:", error);
    return NextResponse.json(
      { error: "Error al obtener citas del médico." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/doctor/appointments
 * Permite al médico cancelar una cita y reembolsar los créditos al paciente.
 */
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const doctorId = token.replace("session-token-", "");
    const { appointmentId, reason } = await request.json();

    if (!appointmentId) {
      return NextResponse.json({ error: "ID de cita requerido." }, { status: 400 });
    }

    // 1. Obtener la cita y validar pertenencia
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            wallet: true,
          },
        },
      },
    });

    if (!appointment || appointment.doctorId !== doctorId) {
      return NextResponse.json(
        { error: "Cita no encontrada o no asignada a este médico." },
        { status: 404 }
      );
    }

    if (appointment.status === "cancelled") {
      return NextResponse.json(
        { error: "La cita ya se encuentra cancelada." },
        { status: 400 }
      );
    }

    // 2. Procesar reembolso y cancelación en una transacción
    await prisma.$transaction(async (tx) => {
      // a. Cambiar estado de la cita
      await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "cancelled",
          notes: `Cancelada por el médico. Motivo: ${reason || "No especificado"}`,
        },
      });

      // b. Reembolsar saldo al Wallet del paciente si el pago fue realizado
      if (appointment.patient.wallet) {
        await tx.wallet.update({
          where: { id: appointment.patient.wallet.id },
          data: {
            balance: {
              increment: APPOINTMENT_REFUND,
            },
          },
        });

        // Crear la transacción contable de reembolso
        await tx.transaction.create({
          data: {
            walletId: appointment.patient.wallet.id,
            amount: APPOINTMENT_REFUND,
            type: "in",
            description: `Reembolso por cancelación de cita con Dr. Ramirez`,
            status: "completed",
          },
        });
      }

      // c. Si está enlazado a un caso, añadir hito al timeline
      if (appointment.caseId) {
        const clinicalCase = await tx.clinicalCase.findUnique({
          where: { id: appointment.caseId },
        });

        if (clinicalCase) {
          const timelineEvent = {
            id: crypto.randomUUID(),
            type: "alert",
            timestamp: new Date().toISOString(),
            title: "Cita Cancelada",
            description: `Cita virtual cancelada por el médico. Créditos reembolsados. Motivo: ${reason || "No especificado"}`,
            severity: "medium" as const,
          };

          await tx.clinicalCase.update({
            where: { id: appointment.caseId },
            data: {
              timeline: [...(clinicalCase.timeline as any[]), timelineEvent],
            },
          });
        }
      }

      // d. Registrar log de auditoría
      await tx.auditLog.create({
        data: {
          userId: doctorId,
          action: "APPOINTMENT_CANCELLED_BY_DOCTOR",
          entity: "Appointment",
          details: {
            appointmentId,
            patientId: appointment.patientId,
            refund: APPOINTMENT_REFUND,
            reason: reason || "",
          },
        },
      });
    });

    return NextResponse.json({ success: true, message: "Cita cancelada y créditos reembolsados." });
  } catch (error: any) {
    console.error("Error al cancelar cita:", error);
    return NextResponse.json(
      { error: "Error interno al procesar la cancelación." },
      { status: 500 }
    );
  }
}
