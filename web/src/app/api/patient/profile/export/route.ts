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

    const userId = token.replace("session-token-", "");

    // 1. Cargar toda la información relacionada del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: {
          include: {
            transactions: true
          }
        },
        medicationReminders: true,
        cases: {
          include: {
            messages: true,
            appointments: {
              include: {
                doctor: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    // 2. Registrar en auditoría la descarga de datos
    await prisma.auditLog.create({
      data: {
        userId,
        action: "DATA_EXPORT",
        entity: "User",
        details: {
          timestamp: new Date().toISOString(),
          ip: "127.0.0.1"
        }
      }
    });

    // 3. Retornar el volcado estructurado
    return NextResponse.json({
      success: true,
      exportedAt: new Date().toISOString(),
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        wallet: user.wallet ? {
          balance: user.wallet.balance,
          transactions: user.wallet.transactions.map(t => ({
            id: t.id,
            amount: t.amount,
            type: t.type,
            description: t.description,
            status: t.status,
            createdAt: t.createdAt
          }))
        } : null,
        medicationReminders: user.medicationReminders.map(r => ({
          id: r.id,
          medication: r.medication,
          dosage: r.dosage,
          frequency: r.frequency,
          startDate: r.startDate,
          endDate: r.endDate
        })),
        clinicalCases: user.cases.map(c => ({
          id: c.id,
          title: c.title,
          status: c.status,
          timeline: c.timeline,
          createdAt: c.createdAt,
          messages: c.messages.map(m => ({
            id: m.id,
            sender: m.sender,
            content: m.content,
            attachments: m.attachments,
            createdAt: m.createdAt
          })),
          appointments: c.appointments.map(a => ({
            id: a.id,
            dateTime: a.dateTime,
            meetLink: a.meetLink,
            status: a.status,
            doctorName: a.doctor?.name || "No asignado",
            doctorEmail: a.doctor?.email || "No asignado"
          }))
        }))
      }
    });
  } catch (error: any) {
    console.error("Error al exportar datos del paciente:", error);
    return NextResponse.json(
      { error: "Error interno al exportar los datos." },
      { status: 500 }
    );
  }
}
