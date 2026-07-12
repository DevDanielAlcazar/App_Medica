import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/patient/tickets
 * Retorna todos los tickets del paciente autenticado.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    console.error("Error al obtener tickets del paciente:", error);
    return NextResponse.json(
      { error: "Error al cargar la lista de tickets." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/patient/tickets
 * Crea un nuevo ticket de soporte.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");
    const { subject, description, category, priority } = await request.json();

    if (!subject || !description) {
      return NextResponse.json(
        { error: "El asunto y la descripción son obligatorios." },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject,
        description,
        category: category || "other",
        priority: priority || "low",
        status: "open"
      }
    });

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        userId,
        action: "TICKET_CREATED",
        entity: "SupportTicket",
        details: {
          ticketId: ticket.id,
          subject
        }
      }
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error("Error al crear ticket:", error);
    return NextResponse.json(
      { error: "Error interno al crear el ticket de soporte." },
      { status: 500 }
    );
  }
}
