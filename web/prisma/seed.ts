import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando sembrado de base de datos...");

  // 1. Sembrar el usuario superadmin
  const superadminEmail = "superadmin@angelicamed.com";
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
            balance: 1000
          }
        }
      }
    });
    console.log(`Usuario superadmin creado exitosamente: ${user.email}`);
  } else {
    console.log(`El usuario superadmin ya existe: ${existingUser.email}`);
  }

  // 2. Sembrar proveedores de IA por defecto
  const providers = [
    {
      name: "openai",
      protocol: "openai",
      baseUrl: "https://api.openai.com/v1",
      completionEndpoint: "/chat/completions",
      priority: 1,
      timeoutMs: 12000,
      supportsStreaming: true,
    },
    {
      name: "anthropic",
      protocol: "claude",
      baseUrl: "https://api.anthropic.com/v1",
      completionEndpoint: "/messages",
      priority: 2,
      timeoutMs: 15000,
      supportsStreaming: true,
    }
  ];

  for (const prov of providers) {
    const existingProv = await prisma.aiProvider.findUnique({
      where: { name: prov.name }
    });

    if (!existingProv) {
      const provider = await prisma.aiProvider.create({
        data: {
          ...prov,
          apiKeys: {
            create: {
              label: `${prov.name} default key`,
              encryptedSecret: "env_key_placeholder", // Indica al Gateway que cargue la llave desde process.env
              status: "active"
            }
          }
        }
      });
      console.log(`Proveedor IA creado: ${provider.name}`);

      // Sembrar modelos para cada proveedor
      if (prov.name === "openai") {
        await prisma.aiModel.createMany({
          data: [
            {
              providerId: provider.id,
              modelName: "gpt-4o",
              displayName: "GPT-4o (Clínico Primario)",
              capabilities: ["chat", "vision", "tools"],
              clinicalAllowed: true,
              costTier: "high",
              latencyTier: "medium",
            },
            {
              providerId: provider.id,
              modelName: "gpt-4o-mini",
              displayName: "GPT-4o Mini (Soporte Rápido)",
              capabilities: ["chat"],
              clinicalAllowed: false,
              costTier: "low",
              latencyTier: "low",
            }
          ]
        });
      } else if (prov.name === "anthropic") {
        await prisma.aiModel.createMany({
          data: [
            {
              providerId: provider.id,
              modelName: "claude-3-5-sonnet-20241022",
              displayName: "Claude 3.5 Sonnet (Clínico de Respaldo)",
              capabilities: ["chat", "vision", "tools"],
              clinicalAllowed: true,
              costTier: "high",
              latencyTier: "medium",
            },
            {
              providerId: provider.id,
              modelName: "claude-3-haiku-20240307",
              displayName: "Claude 3 Haiku",
              capabilities: ["chat"],
              clinicalAllowed: false,
              costTier: "low",
              latencyTier: "low",
            }
          ]
        });
      }
    }
  }

  // 3. Sembrar políticas de ruteo clínico
  const policies = [
    {
      useCase: "clinical_triage",
      riskLevel: "high",
      requiredCapabilities: ["chat"],
      allowedModels: ["gpt-4o", "claude-3-5-sonnet-20241022"],
      fallbackChain: ["openai", "anthropic"],
      requireClinicalApproved: true,
    },
    {
      useCase: "support_reply",
      riskLevel: "low",
      requiredCapabilities: ["chat"],
      allowedModels: ["gpt-4o-mini", "claude-3-haiku-20240307"],
      fallbackChain: ["openai", "anthropic"],
      requireClinicalApproved: false,
    }
  ];

  for (const pol of policies) {
    const existingPol = await prisma.routingPolicy.findUnique({
      where: { useCase: pol.useCase }
    });

    if (!existingPol) {
      await prisma.routingPolicy.create({
        data: pol
      });
      console.log(`Política de ruteo creada para caso de uso: ${pol.useCase}`);
    }
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
