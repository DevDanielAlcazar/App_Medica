import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const caseId = '5724e215-99ab-4c5e-a5f4-0bbab6baf49a';
  const c = await prisma.clinicalCase.findUnique({ where: { id: caseId } });
  if (!c) {
    console.log("No se encontró el caso.");
    return;
  }

  // Filtrar los eventos de derivación urgente del timeline
  const cleanTimeline = (c.timeline as any[]).filter(
    (event) => event.title !== "Derivación Urgente"
  );

  await prisma.clinicalCase.update({
    where: { id: caseId },
    data: {
      status: "en_analisis",
      timeline: cleanTimeline
    }
  });

  console.log(`✅ Caso ${caseId} restaurado a 'en_analisis' y timeline limpiado.`);
}

main().finally(() => prisma.$disconnect());
