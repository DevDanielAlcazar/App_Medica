import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Costo fijo de la cita en créditos
const APPOINTMENT_COST = 200;

/**
 * Genera un enlace simulado de Google Meet
 */
function generateMeetLink(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const gen = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `https://meet.google.com/${gen(3)}-${gen(4)}-${gen(3)}`;
}

/**
 * GET /api/patient/appointments
 * Recupera el listado de citas del paciente autenticado.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    const appointments = await prisma.appointment.findMany({
      where: { patientId: userId },
      include: {
        doctor: {
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
    console.error("Error al obtener citas:", error);
    return NextResponse.json(
      { error: "Error al obtener la lista de citas." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/patient/appointments
 * Reserva y procesa el pago de una cita médica virtual.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const patientId = token.replace("session-token-", "");
    const { doctorId, dateTime, caseId } = await request.json();

    if (!doctorId || !dateTime) {
      return NextResponse.json(
        { error: "El doctor y la fecha/hora son obligatorios." },
        { status: 400 }
      );
    }

    // 1. Validar existencia y verificación del médico
    const doctor = await prisma.user.findFirst({
      where: {
        id: doctorId,
        role: "medico",
        doctorProfile: {
          verificationStatus: "activo",
        },
      },
      include: {
        doctorProfile: true,
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "El médico seleccionado no está disponible o no ha sido verificado." },
        { status: 404 }
      );
    }

    // 2. Validar que el paciente tenga Wallet y saldo suficiente
    const patientWallet = await prisma.wallet.findUnique({
      where: { userId: patientId },
    });

    if (!patientWallet || patientWallet.balance < APPOINTMENT_COST) {
      return NextResponse.json(
        { error: `Saldo insuficiente. El costo de la cita es de ${APPOINTMENT_COST} créditos (Tienes ${patientWallet?.balance || 0} créditos).` },
        { status: 400 }
      );
    }

    // 3. Ejecutar transacción Prisma para el pago y la reservación
    const result = await prisma.$transaction(async (tx) => {
      // a. Descontar saldo del Wallet
      const updatedWallet = await tx.wallet.update({
        where: { userId: patientId },
        data: {
          balance: {
            decrement: APPOINTMENT_COST,
          },
        },
      });

      // b. Crear la transacción de la billetera
      await tx.transaction.create({
        data: {
          walletId: patientWallet.id,
          amount: -APPOINTMENT_COST,
          type: "out",
          description: `Pago de cita médica virtual con ${doctor.name}`,
          status: "completed",
        },
      });

      // c. Generar enlace de Meet y crear la cita
      const meetLink = generateMeetLink();
      const appointment = await tx.appointment.create({
        data: {
          patientId,
          doctorId,
          caseId: caseId || null,
          dateTime: new Date(dateTime),
          meetLink,
          status: "confirmed", // Cita pagada queda confirmada
          notes: "Cita pagada con créditos de Wallet.",
        },
      });

      // d. Si hay caso clínico, añadir hito al timeline
      if (caseId) {
        const clinicalCase = await tx.clinicalCase.findUnique({
          where: { id: caseId },
        });

        if (clinicalCase) {
          const dateFormatted = new Date(dateTime).toLocaleString("es-ES", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });

          const timelineEvent = {
            id: crypto.randomUUID(),
            type: "check",
            timestamp: new Date().toISOString(),
            title: "Cita Programada",
            description: `Se agendó una cita virtual con ${doctor.name} para el ${dateFormatted}. Enlace de Meet asignado.`,
            severity: "low" as const,
          };

          const updatedTimeline = [...(clinicalCase.timeline as any[]), timelineEvent];

          await tx.clinicalCase.update({
            where: { id: caseId },
            data: {
              timeline: updatedTimeline,
            },
          });
        }
      }

      // e. Registrar en log de auditoría
      await tx.auditLog.create({
        data: {
          userId: patientId,
          action: "APPOINTMENT_BOOKED",
          entity: "Appointment",
          details: {
            appointmentId: appointment.id,
            doctorId: doctor.id,
            cost: APPOINTMENT_COST,
          },
        },
      });

      return { appointment, walletBalance: updatedWallet.balance };
    });

    return NextResponse.json({
      success: true,
      appointment: result.appointment,
      walletBalance: result.walletBalance,
    });
  } catch (error: any) {
    console.error("Error al procesar reserva de cita:", error);
    return NextResponse.json(
      { error: "Error interno al reservar la cita." },
      { status: 500 }
    );
  }
}
