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

export async function GET() {
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al obtener perfil." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAdminUser();
    if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { name, email } = await req.json();

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name ?? undefined,
        email: email ?? undefined,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al actualizar perfil." }, { status: 500 });
  }
}