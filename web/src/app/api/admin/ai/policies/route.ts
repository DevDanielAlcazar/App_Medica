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

/** GET /api/admin/ai/policies */
export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const policies = await prisma.routingPolicy.findMany({ orderBy: { useCase: "asc" } });
    return NextResponse.json({ success: true, policies });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al obtener políticas." }, { status: 500 });
  }
}

/** POST /api/admin/ai/policies — Crear nueva política */
export async function POST(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const {
      useCase, riskLevel, requiredCapabilities, allowedModels,
      fallbackChain, maxCost, maxLatency, requireClinicalApproved,
    } = await req.json();

    if (!useCase) return NextResponse.json({ error: "useCase es obligatorio." }, { status: 400 });

    const policy = await prisma.routingPolicy.create({
      data: {
        useCase,
        riskLevel: riskLevel ?? "low",
        requiredCapabilities: requiredCapabilities ?? [],
        allowedModels: allowedModels ?? [],
        fallbackChain: fallbackChain ?? [],
        maxCost: maxCost ?? "medium",
        maxLatency: maxLatency ?? "medium",
        requireClinicalApproved: requireClinicalApproved ?? false,
      },
    });

    return NextResponse.json({ success: true, policy });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Ya existe una política para ese caso de uso." }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "Error al crear política." }, { status: 500 });
  }
}

/** PATCH /api/admin/ai/policies — Actualizar una política existente */
export async function PATCH(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { id, ...data } = await req.json();
    if (!id) return NextResponse.json({ error: "id requerido." }, { status: 400 });

    const policy = await prisma.routingPolicy.update({ where: { id }, data });

    await prisma.auditLog.create({
      data: { userId: admin.id, action: "ROUTING_POLICY_UPDATED", entity: "RoutingPolicy", details: { policyId: id } },
    });

    return NextResponse.json({ success: true, policy });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al actualizar política." }, { status: 500 });
  }
}

/** DELETE /api/admin/ai/policies?id=xxx */
export async function DELETE(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id requerido." }, { status: 400 });

    await prisma.routingPolicy.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al eliminar política." }, { status: 500 });
  }
}
