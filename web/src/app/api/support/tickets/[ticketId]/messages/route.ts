import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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
 * GET /api/support/tickets/[ticketId]/messages
 * Carga todo el historial de mensajes de un ticket para soporte.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const agent = await checkSupportAuth();
    if (!agent) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const { ticketId } = await params;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket no encontrado." }, { status: 404 });
    }

    const messages = await prisma.ticketMessage.findMany({
      where: { ticketId },
      include: {
        sender: {
          select: {
            name: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json({ success: true, messages, ticket });
  } catch (error: any) {
    console.error("Error al obtener mensajes del ticket para soporte:", error);
    return NextResponse.json(
      { error: "Error interno al recuperar mensajes." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/support/tickets/[ticketId]/messages
 * Agrega un mensaje de respuesta del agente de soporte.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const agent = await checkSupportAuth();
    if (!agent) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const { ticketId } = await params;
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío." },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket no encontrado." }, { status: 404 });
    }

    // Crear mensaje del agente
    const message = await prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId: agent.id,
        content
      },
      include: {
        sender: {
          select: {
            name: true,
            role: true
          }
        }
      }
    });

    // Actualizar estado del ticket a "in_progress" si estaba "open"
    if (ticket.status === "open") {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: "in_progress" }
      });
    }

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error("Error al enviar mensaje de soporte:", error);
    return NextResponse.json(
      { error: "Error interno al enviar la respuesta." },
      { status: 500 }
    );
  }
}
