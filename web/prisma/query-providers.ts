import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const providers = await prisma.aiProvider.findMany();
  providers.forEach(p => {
    console.log(`name=${p.name}`);
    console.log(`  baseUrl=${p.baseUrl}`);
    console.log(`  completionEndpoint=${p.completionEndpoint}`);
    console.log(`  protocol=${p.protocol}`);
    console.log();
  });
}
main().finally(() => prisma.$disconnect());
