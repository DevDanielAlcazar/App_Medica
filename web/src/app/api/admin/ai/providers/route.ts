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

/** GET /api/admin/ai/providers — Lista todos los proveedores con sus modelos y keys */
export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const providers = await prisma.aiProvider.findMany({
      include: { apiKeys: true, models: true },
      orderBy: { priority: "asc" },
    });

    return NextResponse.json({ success: true, providers });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al obtener proveedores." }, { status: 500 });
  }
}

/** POST /api/admin/ai/providers — Crear un nuevo proveedor */
export async function POST(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const body = await req.json();
    const {
      name, protocol, baseUrl, completionEndpoint, modelsEndpoint,
      priority, timeoutMs, supportsStreaming, supportsVision, supportsTools, regionPolicy
    } = body;

    if (!name || !protocol || !baseUrl || !completionEndpoint) {
      return NextResponse.json({ error: "Campos obligatorios faltantes." }, { status: 400 });
    }

    const provider = await prisma.aiProvider.create({
      data: {
        name, protocol, baseUrl, completionEndpoint,
        modelsEndpoint: modelsEndpoint || null,
        priority: priority ?? 1,
        timeoutMs: timeoutMs ?? 10000,
        supportsStreaming: supportsStreaming ?? true,
        supportsVision: supportsVision ?? false,
        supportsTools: supportsTools ?? false,
        regionPolicy: regionPolicy || null,
      },
    });

    await prisma.auditLog.create({
      data: { userId: admin.id, action: "AI_PROVIDER_CREATED", entity: "AiProvider", details: { providerId: provider.id, name } },
    });

    return NextResponse.json({ success: true, provider });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Ya existe un proveedor con ese nombre." }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Error al crear proveedor." }, { status: 500 });
  }
}

/** DELETE /api/admin/ai/providers?id=xxx — Eliminar proveedor */
export async function DELETE(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID requerido." }, { status: 400 });

    await prisma.aiProvider.delete({ where: { id } });

    await prisma.auditLog.create({
      data: { userId: admin.id, action: "AI_PROVIDER_DELETED", entity: "AiProvider", details: { providerId: id } },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al eliminar proveedor." }, { status: 500 });
  }
}
