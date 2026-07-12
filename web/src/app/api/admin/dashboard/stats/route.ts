import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Validar rol admin
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;

  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "admin") return null;

  return user;
}

export async function GET() {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "No autorizado." }, { status: 403 });
    }

    // 1. Conteo de usuarios
    const totalUsers = await prisma.user.count();
    const patientsCount = await prisma.user.count({ where: { role: "paciente" } });
    const doctorsCount = await prisma.user.count({ where: { role: "medico" } });

    // 2. Médicos pendientes de verificación
    const pendingDoctors = await prisma.user.count({
      where: {
        role: "medico",
        doctorProfile: {
          verificationStatus: { in: ["en_revision", "pendiente"] }
        }
      }
    });

    // 3. Casos clínicos activos
    const activeCases = await prisma.clinicalCase.count({
      where: {
        status: { notIn: ["curado", "archivado"] }
      }
    });

    // 4. Parámetros del sistema
    const smtpSetting = await prisma.systemSetting.findUnique({
      where: { key: "gmail_smtp_enabled" }
    });
    const smtpEnabled = smtpSetting?.value === "true";

    const aiProvidersCount = await prisma.aiProvider.count({ where: { status: "active" } });
    const aiModelsCount = await prisma.aiModel.count({ where: { enabled: true } });

    // 5. Total de transacciones e ingresos estimados (Stripe)
    const transactions = await prisma.transaction.findMany({
      where: {
        type: "in",
        status: "completed"
      },
      select: {
        amount: true
      }
    });
    const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);

    // 6. Casos elegibles para purgar (> 6 meses inactividad)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const eligiblePurgeCount = await prisma.clinicalCase.count({
      where: {
        status: { in: ["curado", "archivado"] },
        updatedAt: { lte: sixMonthsAgo }
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        patientsCount,
        doctorsCount,
        pendingDoctors,
        activeCases,
        smtpEnabled,
        aiProvidersCount,
        aiModelsCount,
        totalRevenue,
        eligiblePurgeCount
      }
    });
  } catch (error: any) {
    console.error("Error al obtener estadísticas del admin:", error);
    return NextResponse.json(
      { error: "Error interno al calcular estadísticas." },
      { status: 500 }
    );
  }
}
