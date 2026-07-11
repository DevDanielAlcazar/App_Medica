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

/** GET /api/admin/ai/models — Lista todos los modelos con su proveedor */
export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const models = await prisma.aiModel.findMany({
      include: { provider: { select: { name: true, status: true } } },
      orderBy: [{ provider: { priority: "asc" } }, { displayName: "asc" }],
    });

    return NextResponse.json({ success: true, models });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al obtener modelos." }, { status: 500 });
  }
}

/** PATCH /api/admin/ai/models — Actualizar enabled/clinicalAllowed de un modelo */
export async function PATCH(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { modelId, enabled, clinicalAllowed } = await req.json();
    if (!modelId) return NextResponse.json({ error: "modelId requerido." }, { status: 400 });

    const model = await prisma.aiModel.update({
      where: { id: modelId },
      data: {
        ...(enabled !== undefined && { enabled }),
        ...(clinicalAllowed !== undefined && { clinicalAllowed }),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "AI_MODEL_UPDATED",
        entity: "AiModel",
        details: { modelId, enabled, clinicalAllowed },
      },
    });

    return NextResponse.json({ success: true, model });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al actualizar modelo." }, { status: 500 });
  }
}

/** POST /api/admin/ai/models — Crear modelo manualmente */
export async function POST(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const {
      providerId, modelName, displayName, capabilities,
      maxContext, enabled, clinicalAllowed, costTier, latencyTier,
    } = await req.json();

    if (!providerId || !modelName || !displayName) {
      return NextResponse.json({ error: "providerId, modelName y displayName son obligatorios." }, { status: 400 });
    }

    const model = await prisma.aiModel.create({
      data: {
        providerId, modelName, displayName,
        capabilities: capabilities ?? [],
        maxContext: maxContext ?? 8192,
        enabled: enabled ?? true,
        clinicalAllowed: clinicalAllowed ?? false,
        costTier: costTier ?? "medium",
        latencyTier: latencyTier ?? "medium",
      },
    });

    return NextResponse.json({ success: true, model });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al crear modelo." }, { status: 500 });
  }
}

/** DELETE /api/admin/ai/models?id=xxx — Eliminar modelo */
export async function DELETE(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID de modelo requerido." }, { status: 400 });

    await prisma.aiModel.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "AI_MODEL_DELETED",
        entity: "AiModel",
        details: { modelId: id },
      },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al eliminar modelo." }, { status: 500 });
  }
}
