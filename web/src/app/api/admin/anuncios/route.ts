import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) return null;
  return user;
}

/** GET /api/admin/anuncios — Lista todos los anuncios */
export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const announcements = await prisma.announcement.findMany({
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ success: true, announcements });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al obtener anuncios." }, { status: 500 });
  }
}

interface CreateAnnouncementBody {
  title: string;
  content: string;
  audience: string;
  startDate?: string;
  endDate?: string;
  priority?: number;
  isActive?: boolean;
}

/** POST /api/admin/anuncios — Crear un anuncio */
export async function POST(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const body: CreateAnnouncementBody = await req.json();
    const { title, content, audience, startDate, endDate, priority, isActive } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Título y contenido son obligatorios." }, { status: 400 });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        audience: audience || "all",
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        priority: priority ?? 0,
        isActive: isActive ?? true,
        createdBy: admin.id,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "ANNOUNCEMENT_CREATED",
        entity: "Announcement",
        details: { announcementId: announcement.id, title },
      },
    });

    return NextResponse.json({ success: true, announcement });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al crear el anuncio." }, { status: 500 });
  }
}

/** PUT /api/admin/anuncios — Actualizar un anuncio */
export async function PUT(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const body = await req.json();
    const { id, title, content, audience, startDate, endDate, priority, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID del anuncio es obligatorio." }, { status: 400 });
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: title ?? undefined,
        content: content ?? undefined,
        audience: audience ?? undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        priority: priority ?? undefined,
        isActive: isActive ?? undefined,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "ANNOUNCEMENT_UPDATED",
        entity: "Announcement",
        details: { announcementId: id },
      },
    });

    return NextResponse.json({ success: true, announcement });
  } catch (e: any) {
    console.error(e);
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Anuncio no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al actualizar el anuncio." }, { status: 500 });
  }
}

/** DELETE /api/admin/anuncios — Eliminar un anuncio */
export async function DELETE(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID del anuncio es obligatorio." }, { status: 400 });
    }

    await prisma.announcement.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "ANNOUNCEMENT_DELETED",
        entity: "Announcement",
        details: { announcementId: id },
      },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    if (e.code === "P2025") {
      return NextResponse.json({ error: "Anuncio no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al eliminar el anuncio." }, { status: 500 });
  }
}