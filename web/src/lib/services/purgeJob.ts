import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PurgeResult {
  success: boolean;
  purgedCount: number;
  message: string;
}

/**
 * Busca y elimina permanentemente todos los expedientes (ClinicalCase)
 * marcados como "curado" o "archivado" que tengan más de 6 meses de inactividad.
 */
export async function purgeInactiveCases(): Promise<PurgeResult> {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // 1. Encontrar casos elegibles para purgar
    const casesToPurge = await prisma.clinicalCase.findMany({
      where: {
        status: { in: ["curado", "archivado"] },
        updatedAt: { lte: sixMonthsAgo }
      },
      select: {
        id: true,
        title: true,
        userId: true
      }
    });

    const purgedCount = casesToPurge.length;

    if (purgedCount === 0) {
      return {
        success: true,
        purgedCount: 0,
        message: "No se encontraron expedientes inactivos de más de 6 meses para purgar."
      };
    }

    // 2. Ejecutar la purga de los casos
    // Debido a onDelete: Cascade configurado en la base de datos para Message y Appointment,
    // eliminar el ClinicalCase removerá secuencialmente sus mensajes y citas vinculadas.
    await prisma.$transaction(async (tx) => {
      // Eliminar los casos
      await tx.clinicalCase.deleteMany({
        where: {
          id: {
            in: casesToPurge.map(c => c.id)
          }
        }
      });

      // Obtener el primer admin disponible para asociarle la acción en la bitácora de auditoría
      const admin = await tx.user.findFirst({
        where: { role: "admin" }
      });

      const auditUserId = admin?.id || casesToPurge[0].userId; // Si no hay admin, usar el del primer caso

      // Crear log de auditoría global del purge
      await tx.auditLog.create({
        data: {
          userId: auditUserId,
          action: "SYSTEM_PURGE_CASES",
          entity: "ClinicalCase",
          details: {
            triggeredBy: "cron_job",
            purgedCasesCount: purgedCount,
            purgedCaseIds: casesToPurge.map(c => c.id),
            dateRangeLimit: sixMonthsAgo.toISOString()
          }
        }
      });
    });

    console.log(`[Purge Job] Se han purgado con éxito ${purgedCount} expedientes clínicos inactivos hace más de 6 meses.`);

    return {
      success: true,
      purgedCount,
      message: `Se purgaron ${purgedCount} expedientes clínicos inactivos hace más de 6 meses correctamente.`
    };
  } catch (err: any) {
    console.error("Error al ejecutar el job de purga:", err);
    return {
      success: false,
      purgedCount: 0,
      message: `Error al purgar expedientes: ${err.message}`
    };
  }
}
