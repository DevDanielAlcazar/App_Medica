import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { purgeInactiveCases } from "@/lib/services/purgeJob";

// Auxiliar para validar que quien llama sea Administrador
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;

  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "admin") return null;

  return user;
}

/**
 * GET /api/admin/jobs/purge-cases
 * Retorna la cantidad de casos "curados" o "archivados" con más de 6 meses de inactividad
 * que son elegibles para ser purgados. (Vista previa / Dry run)
 */
export async function GET() {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const eligibleCount = await prisma.clinicalCase.count({
      where: {
        status: { in: ["curado", "archivado"] },
        updatedAt: { lte: sixMonthsAgo }
      }
    });

    return NextResponse.json({
      success: true,
      eligibleCount,
      dateLimit: sixMonthsAgo.toISOString()
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Error al consultar expedientes elegibles." }, { status: 500 });
  }
}

/**
 * POST /api/admin/jobs/purge-cases
 * Ejecuta activamente la purga de casos y devuelve el total purgado.
 */
export async function POST() {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    const result = await purgeInactiveCases();
    return NextResponse.json(result);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Falla al ejecutar el job de purga." }, { status: 500 });
  }
}
