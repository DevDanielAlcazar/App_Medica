import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/patient/reminders
 * Recupera el listado de recordatorios de medicamentos del paciente autenticado.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    const reminders = await prisma.medicationReminder.findMany({
      where: { userId },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({ success: true, reminders });
  } catch (error: any) {
    console.error("Error al obtener recordatorios:", error);
    return NextResponse.json(
      { error: "Error al obtener la lista de recordatorios." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/patient/reminders
 * Registra un nuevo recordatorio de medicamento en el calendario.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");
    const { medication, dosage, frequency, startDate, endDate } = await request.json();

    if (!medication || !dosage || !frequency || !startDate) {
      return NextResponse.json(
        { error: "Los campos medicamento, dosis, frecuencia y fecha de inicio son obligatorios." },
        { status: 400 }
      );
    }

    const reminder = await prisma.medicationReminder.create({
      data: {
        userId,
        medication,
        dosage,
        frequency,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    // Registrar en log de auditoría
    await prisma.auditLog.create({
      data: {
        userId,
        action: "MEDICATION_REMINDER_CREATED",
        entity: "MedicationReminder",
        details: {
          reminderId: reminder.id,
          medication,
          dosage,
        },
      },
    });

    return NextResponse.json({ success: true, reminder });
  } catch (error: any) {
    console.error("Error al crear recordatorio de medicamento:", error);
    return NextResponse.json(
      { error: "Error interno al guardar el recordatorio." },
      { status: 500 }
    );
  }
}
