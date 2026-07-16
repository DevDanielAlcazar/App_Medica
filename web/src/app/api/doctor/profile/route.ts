import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function getDoctorUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    include: { doctorProfile: true }
  });
  if (!user || user.role !== "medico") return null;
  return user;
}

export async function PUT(req: Request) {
  try {
    const user = await getDoctorUser();
    if (!user) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { name } = await req.json();

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name ?? undefined,
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Error al actualizar perfil." }, { status: 500 });
  }
}