import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/patient/tickets/[ticketId]/messages
 * Carga el historial de mensajes de un ticket, validando propiedad.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    // Validar propiedad del ticket
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket || ticket.userId !== userId) {
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
    console.error("Error al obtener mensajes del ticket:", error);
    return NextResponse.json(
      { error: "Error interno al recuperar los mensajes." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/patient/tickets/[ticketId]/messages
 * Agrega un mensaje del paciente al ticket.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío." },
        { status: 400 }
      );
    }

    // Validar propiedad del ticket
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket || ticket.userId !== userId) {
      return NextResponse.json({ error: "Ticket no encontrado o sin autorización." }, { status: 404 });
    }

    // Crear mensaje
    const message = await prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId: userId,
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

    // Cambiar estado a open/abierto si estaba resuelto/cerrado y el usuario reabre al escribir
    if (ticket.status === "resolved" || ticket.status === "closed") {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: "open" }
      });
    }

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error("Error al crear mensaje del ticket:", error);
    return NextResponse.json(
      { error: "Error interno al enviar el mensaje." },
      { status: 500 }
    );
  }
}
