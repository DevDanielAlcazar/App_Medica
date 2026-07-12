import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Auxiliar para validar rol de soporte o admin
async function checkSupportAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;

  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || (user.role !== "soporte" && user.role !== "admin")) return null;

  return user;
}

/**
 * GET /api/support/tickets
 * Retorna todos los tickets del sistema con detalles del creador.
 */
export async function GET() {
  try {
    const agent = await checkSupportAuth();
    if (!agent) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const tickets = await prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, tickets });
  } catch (error: any) {
    console.error("Error al listar tickets para soporte:", error);
    return NextResponse.json(
      { error: "Error interno al recuperar tickets." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/support/tickets
 * Permite cambiar el estatus de un ticket.
 */
export async function PUT(request: Request) {
  try {
    const agent = await checkSupportAuth();
    if (!agent) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const { ticketId, status, priority } = await request.json();

    if (!ticketId) {
      return NextResponse.json({ error: "ID de ticket requerido." }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData
    });

    // Registrar en auditoría la acción de soporte
    await prisma.auditLog.create({
      data: {
        userId: agent.id,
        action: "TICKET_UPDATED_BY_SUPPORT",
        entity: "SupportTicket",
        details: {
          ticketId,
          updatedFields: updateData
        }
      }
    });

    return NextResponse.json({ success: true, ticket: updatedTicket });
  } catch (error: any) {
    console.error("Error al actualizar ticket desde soporte:", error);
    return NextResponse.json(
      { error: "Error interno al actualizar el ticket." },
      { status: 500 }
    );
  }
}
