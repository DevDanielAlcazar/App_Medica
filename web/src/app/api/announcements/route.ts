import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

/** GET /api/announcements — Lista anuncios activos para el usuario autenticado */
export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

    const now = new Date();
    
    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } },
        ],
        audience: {
          in: ["all", user.role]
        },
      },
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