import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const caseId = '5724e215-99ab-4c5e-a5f4-0bbab6baf49a';
  const c = await prisma.clinicalCase.findUnique({
    where: { id: caseId },
    include: { messages: true }
  });
  console.log("=== Case ===");
  console.log(JSON.stringify(c, null, 2));
}
main().finally(() => prisma.$disconnect());
