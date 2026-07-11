import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando sembrado de base de datos...");

  const superadminEmail = "superadmin@angelicamed.com";
  
  // Buscar si ya existe el superadmin
  const existingUser = await prisma.user.findUnique({
    where: { email: superadminEmail }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("SuperAdminMed2026!", 10);
    const user = await prisma.user.create({
      data: {
        email: superadminEmail,
        password: hashedPassword,
        name: "Super Administrador",
        role: "superadmin",
        wallet: {
          create: {
            balance: 1000 // créditos iniciales de cortesía
          }
        }
      }
    });

    console.log(`Usuario superadmin creado exitosamente: ${user.email}`);
  } else {
    console.log(`El usuario superadmin ya existe: ${existingUser.email}`);
  }

  console.log("Sembrado completado.");
}

main()
  .catch((e) => {
    console.error("Error durante el sembrado:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
