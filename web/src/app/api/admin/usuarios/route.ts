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

/** GET /api/admin/usuarios — List all users (paginated) */
export async function GET(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          planId: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Error listing users:", error);
    return NextResponse.json({ error: "Error al listar usuarios." }, { status: 500 });
  }
}

/** POST /api/admin/usuarios — Create user with role (admin only) */
export async function POST(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { email, password, name, role } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "email, password, name y role son obligatorios." }, { status: 400 });
    }

    if (!["paciente", "medico", "admin", "superadmin"].includes(role)) {
      return NextResponse.json({ error: "Rol inválido." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "El email ya está registrado." }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: { email, password, name, role },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    await prisma.auditLog.create({
      data: { userId: admin.id, action: "USER_CREATED", entity: "User", details: { userId: user.id, role } },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error al crear usuario." }, { status: 500 });
  }
}

/** PUT /api/admin/usuarios — Update user/ban/suspend (admin only) */
export async function PUT(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { userId, action, ...data } = await request.json();

    if (!userId || !action) {
      return NextResponse.json({ error: "userId y action son obligatorios." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    let updatedUser;
    let auditAction;

    if (action === "update") {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { ...data },
        select: { id: true, email: true, name: true, role: true },
      });
      auditAction = "USER_UPDATED";
    } else if (action === "ban" || action === "suspend") {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: action === "ban" ? "banned" : "suspended" },
        select: { id: true, email: true, name: true, role: true },
      });
      auditAction = action === "ban" ? "USER_BANNED" : "USER_SUSPENDED";
    } else {
      return NextResponse.json({ error: "Acción inválida. Use: update, ban, suspend." }, { status: 400 });
    }

    await prisma.auditLog.create({
      data: { userId: admin.id, action: auditAction, entity: "User", details: { targetUserId: userId } },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error al actualizar usuario." }, { status: 500 });
  }
}

/** DELETE /api/admin/usuarios?id=xxx — Delete user (admin only) */
export async function DELETE(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) return NextResponse.json({ error: "id requerido." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado." }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: userId } });

    await prisma.auditLog.create({
      data: { userId: admin.id, action: "USER_DELETED", entity: "User", details: { targetUserId: userId } },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Error al eliminar usuario." }, { status: 500 });
  }
}