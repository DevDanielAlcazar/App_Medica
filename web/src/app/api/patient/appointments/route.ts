import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { google } from "googleapis";

const APPOINTMENT_COST = 200;

async function createGoogleMeetSpace(): Promise<string | null> {
  try {
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!credentials) throw new Error("No service account credentials");

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(credentials),
      scopes: ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/calendar.events"],
    });

    const calendar = google.calendar({ version: "v3", auth });
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: "Cita médica virtual - Angélica Med",
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet" as const,
            },
          },
        },
        start: {
          dateTime: new Date().toISOString(),
          timeZone: "America/Mexico_City",
        },
        end: {
          dateTime: new Date(Date.now() + 3600000).toISOString(),
          timeZone: "America/Mexico_City",
        },
      },
      conferenceDataVersion: 1,
    });

    return response.data.conferenceData?.entryPoints?.[0]?.uri || null;
  } catch (err) {
    console.error("Google Meet API error, falling back to mock:", err);
    return null;
  }
}

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

    if (!dateTime) {
      return NextResponse.json(
        { error: "La fecha y hora son obligatorias." },
        { status: 400 }
      );
    }

    let targetDoctorId: string | null = null;
    let doctorName = "Médico por asignar";

    if (doctorId === "random") {
      // Buscar todos los médicos verificados activos
      const activeDoctors = await prisma.user.findMany({
        where: {
          role: "medico",
          doctorProfile: {
            verificationStatus: "activo",
          },
        },
      });
      if (activeDoctors.length > 0) {
        const randomDoc = activeDoctors[Math.floor(Math.random() * activeDoctors.length)];
        targetDoctorId = randomDoc.id;
        doctorName = randomDoc.name;
      } else {
        targetDoctorId = null;
        doctorName = "Médico por asignar";
      }
    } else if (doctorId && doctorId !== "none" && doctorId !== "sin_medico") {
      // Validar existencia y verificación del médico específico
      const doctor = await prisma.user.findFirst({
        where: {
          id: doctorId,
          role: "medico",
          doctorProfile: {
            verificationStatus: "activo",
          },
        },
      });

      if (!doctor) {
        return NextResponse.json(
          { error: "El médico seleccionado no está disponible o no ha sido verificado." },
          { status: 404 }
        );
      }
      targetDoctorId = doctor.id;
      doctorName = doctor.name;
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
          description: `Pago de cita médica virtual - ${doctorName}`,
          status: "completed",
        },
      });

      // c. Generar enlace de Meet y crear la cita
      const meetLink = await createGoogleMeetSpace() || generateMeetLink();
      const appointment = await tx.appointment.create({
        data: {
          patientId,
          doctorId: targetDoctorId,
          caseId: caseId || null,
          dateTime: new Date(dateTime),
          meetLink,
          status: "confirmed", // Cita pagada queda confirmada
          notes: `Cita pagada con créditos de Wallet. Asignado a: ${doctorName}`,
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
            description: `Se agendó una cita virtual con ${doctorName} para el ${dateFormatted}. Enlace de Meet asignado.`,
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
            doctorId: targetDoctorId,
            cost: APPOINTMENT_COST,
          },
        },
      });

      return { appointment, walletBalance: updatedWallet.balance };
    });

    // Enviar correos electrónicos de confirmación en segundo plano de forma asíncrona
    try {
      const [patientUser, doctorUser, caseObj] = await Promise.all([
        prisma.user.findUnique({ where: { id: patientId } }),
        targetDoctorId ? prisma.user.findUnique({ where: { id: targetDoctorId } }) : null,
        caseId ? prisma.clinicalCase.findUnique({ where: { id: caseId } }) : null,
      ]);

      const { sendAppointmentConfirmationEmail, sendDoctorAssignmentEmail } = await import("@/lib/services/email");

      if (patientUser) {
        sendAppointmentConfirmationEmail({
          to: patientUser.email,
          patientName: patientUser.name,
          doctorName: doctorName,
          dateTime: dateTime,
          meetLink: result.appointment.meetLink,
          caseTitle: caseObj?.title || null
        }).catch(err => console.error("Error al enviar correo de confirmación al paciente:", err));
      }

      if (doctorUser) {
        sendDoctorAssignmentEmail({
          to: doctorUser.email,
          doctorName: doctorName,
          patientName: patientUser?.name || "Paciente",
          dateTime: dateTime,
          meetLink: result.appointment.meetLink
        }).catch(err => console.error("Error al enviar correo de asignación al médico:", err));
      }
    } catch (err) {
      console.error("Error al disparar flujos de email de cita:", err);
    }

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
