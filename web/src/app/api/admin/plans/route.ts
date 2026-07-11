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

/** GET /api/admin/plans */
export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const plans = await prisma.subscriptionPlan.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ success: true, plans });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al obtener planes." }, { status: 500 });
  }
}

/** POST /api/admin/plans — Crear un plan */
export async function POST(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const {
      name, description, stripePriceId, stripeProductId,
      credits, price, currency, interval, isActive, features, sortOrder,
    } = await req.json();

    if (!name || price === undefined) {
      return NextResponse.json({ error: "name y price son obligatorios." }, { status: 400 });
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name, description: description ?? "",
        stripePriceId: stripePriceId || null,
        stripeProductId: stripeProductId || null,
        credits: credits ?? 0,
        price: parseFloat(price),
        currency: currency ?? "MXN",
        interval: interval ?? "monthly",
        isActive: isActive ?? true,
        features: features ?? [],
        sortOrder: sortOrder ?? 0,
      },
    });

    await prisma.auditLog.create({
      data: { userId: admin.id, action: "PLAN_CREATED", entity: "SubscriptionPlan", details: { planId: plan.id, name } },
    });

    return NextResponse.json({ success: true, plan });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al crear plan." }, { status: 500 });
  }
}

/** PATCH /api/admin/plans — Actualizar un plan */
export async function PATCH(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { id, ...data } = await req.json();
    if (!id) return NextResponse.json({ error: "id requerido." }, { status: 400 });

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        ...data,
        price: data.price !== undefined ? parseFloat(data.price) : undefined,
      },
    });

    await prisma.auditLog.create({
      data: { userId: admin.id, action: "PLAN_UPDATED", entity: "SubscriptionPlan", details: { planId: id } },
    });

    return NextResponse.json({ success: true, plan });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al actualizar plan." }, { status: 500 });
  }
}

/** DELETE /api/admin/plans?id=xxx */
export async function DELETE(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id requerido." }, { status: 400 });

    await prisma.subscriptionPlan.delete({ where: { id } });

    await prisma.auditLog.create({
      data: { userId: admin.id, action: "PLAN_DELETED", entity: "SubscriptionPlan", details: { planId: id } },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al eliminar plan." }, { status: 500 });
  }
}
