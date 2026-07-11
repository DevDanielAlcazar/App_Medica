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

/** GET /api/admin/ai/keys?providerId=xxx */
export async function GET(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get("providerId");

    const keys = await prisma.aiApiKey.findMany({
      where: providerId ? { providerId } : undefined,
      include: { provider: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Enmascarar el secreto para no exponerlo en el frontend
    const maskedKeys = keys.map((k) => ({
      ...k,
      encryptedSecret: k.encryptedSecret.slice(0, 8) + "••••••••••••••••",
    }));

    return NextResponse.json({ success: true, keys: maskedKeys });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al obtener API Keys." }, { status: 500 });
  }
}

/** POST /api/admin/ai/keys — Agregar nueva API Key */
export async function POST(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { providerId, label, secret, rateLimit, monthlyBudget } = await req.json();

    if (!providerId || !label || !secret) {
      return NextResponse.json({ error: "providerId, label y secret son obligatorios." }, { status: 400 });
    }

    // En producción esto debería usar AES-256 con KMS. 
    // Por ahora almacenamos el valor directamente (el campo se llama encryptedSecret por diseño futuro).
    const key = await prisma.aiApiKey.create({
      data: {
        providerId,
        label,
        encryptedSecret: secret,
        rateLimit: rateLimit ? parseInt(rateLimit) : null,
        monthlyBudget: monthlyBudget ? parseFloat(monthlyBudget) : null,
        createdBy: admin.id,
        status: "active",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "AI_KEY_CREATED",
        entity: "AiApiKey",
        details: { keyId: key.id, providerId, label },
      },
    });

    return NextResponse.json({ success: true, keyId: key.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al crear API Key." }, { status: 500 });
  }
}

/** DELETE /api/admin/ai/keys?id=xxx */
export async function DELETE(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID de la key requerido." }, { status: 400 });

    await prisma.aiApiKey.delete({ where: { id } });

    await prisma.auditLog.create({
      data: { userId: admin.id, action: "AI_KEY_DELETED", entity: "AiApiKey", details: { keyId: id } },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al eliminar API Key." }, { status: 500 });
  }
}
