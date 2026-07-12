import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const ROLES = ["paciente", "medico", "admin", "soporte", "contabilidad"];

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) return null;
  return user;
}

/** GET /api/admin/permisos — Matriz de permisos por rol */
export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const permissions = await prisma.permission.findMany({
      orderBy: [{ role: "asc" }, { actionKey: "asc" }],
    });

    // Transform to matrix format: { [role]: { [actionKey]: isGranted } }
    const matrix: Record<string, Record<string, boolean>> = {};
    for (const role of ROLES) {
      matrix[role] = {};
    }

    permissions.forEach((p) => {
      if (!matrix[p.role]) matrix[p.role] = {};
      matrix[p.role][p.actionKey] = p.isGranted;
    });

    // If no permissions exist, seed defaults
    if (permissions.length === 0) {
      const defaultActionKeys = [
        "view_dashboard",
        "manage_cases",
        "send_messages",
        "schedule_appointments",
        "process_payments",
        "view_users",
        "manage_ai_providers",
        "manage_subscription_plans",
        "send_notifications",
        "manage_support_tickets",
        "process_payouts",
        "ban_users",
        "refund_credits",
      ];

      const defaultPerms = [];
      for (const role of ROLES) {
        for (const key of defaultActionKeys) {
          const isGranted = role !== "paciente" || !key.includes("manage_");
          defaultPerms.push({
            data: {
              role,
              actionKey: key,
              description: key.replace(/_/g, " "),
              isGranted,
            },
          });
        }
      }

      await prisma.permission.createMany({ data: defaultPerms.map((p) => p.data) });

      const newPerms = await prisma.permission.findMany({
        orderBy: [{ role: "asc" }, { actionKey: "asc" }],
      });

      newPerms.forEach((p) => {
        if (!matrix[p.role]) matrix[p.role] = {};
        matrix[p.role][p.actionKey] = p.isGranted;
      });
    }

    return NextResponse.json({ success: true, matrix, roles: ROLES });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al obtener permisos." }, { status: 500 });
  }
}

/** POST /api/admin/permisos — Actualizar un permiso específico */
export async function POST(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { role, actionKey, isGranted } = await req.json();

    if (!role || !actionKey || typeof isGranted !== "boolean") {
      return NextResponse.json({ error: "role, actionKey e isGranted son obligatorios." }, { status: 400 });
    }

    if (!ROLES.includes(role)) {
      return NextResponse.json({ error: "Rol inválido." }, { status: 400 });
    }

    // superadmin permissions are immutable (all granted)
    if (role === "superadmin") {
      return NextResponse.json({ error: "Los permisos de superadmin son inmutables." }, { status: 403 });
    }

    const permission = await prisma.permission.upsert({
      where: { role_actionKey: { role, actionKey } },
      update: { isGranted },
      create: {
        role,
        actionKey,
        isGranted,
        description: actionKey.replace(/_/g, " "),
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "PERMISSION_UPDATED",
        entity: "Permission",
        details: { role, actionKey, isGranted },
      },
    });

    return NextResponse.json({ success: true, permission });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al actualizar el permiso." }, { status: 500 });
  }
}

/** PUT /api/admin/permisos — Bulk update (reemplazo total) */
export async function PUT(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { permissions } = await req.json();

    if (!Array.isArray(permissions)) {
      return NextResponse.json({ error: "permissions debe ser un array." }, { status: 400 });
    }

    // Validate and filter out superadmin (inmutable)
    const filteredPerms = permissions.filter((p: any) => p.role !== "superadmin");

    // Delete existing non-superadmin permissions
    await prisma.permission.deleteMany({
      where: { role: { in: ROLES.filter((r) => r !== "superadmin") } },
    });

    // Create new permissions
    const createdPerms = [];
    for (const p of filteredPerms) {
      if (p.role && p.actionKey && typeof p.isGranted === "boolean") {
        createdPerms.push({
          data: {
            role: p.role,
            actionKey: p.actionKey,
            description: p.description || p.actionKey.replace(/_/g, " "),
            isGranted: p.isGranted,
          },
        });
      }
    }

    if (createdPerms.length > 0) {
      await prisma.permission.createMany({ data: createdPerms.map((p) => p.data) });
    }

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "PERMISSIONS_BULK_UPDATED",
        entity: "Permission",
        details: { count: createdPerms.length },
      },
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al actualizar permisos masivamente." }, { status: 500 });
  }
}