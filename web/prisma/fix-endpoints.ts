/**
 * Script para actualizar los proveedores de IA existentes con los datos correctos.
 * 
 * Convención final:
 *   baseUrl     = URL completa incluyendo prefijo de versión (ej: https://inference.poolside.ai/v1)
 *   completionEndpoint = solo el sufijo de la ruta (ej: /chat/completions)
 * 
 * Así la URL final resulta: baseUrl + completionEndpoint = https://inference.poolside.ai/v1/chat/completions
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Datos correctos por proveedor (según URL completa proporcionada por el usuario)
const PROVIDER_FIXES: Record<string, { baseUrl: string; completionEndpoint: string }> = {
  "Poolside_1": {
    baseUrl: "https://inference.poolside.ai/v1",
    completionEndpoint: "/chat/completions",
  },
  "Opencode_1": {
    baseUrl: "https://opencode.ai/zen/v1",
    completionEndpoint: "/chat/completions",
  },
};

async function main() {
  console.log("=== Corrección de proveedores de IA en DB ===\n");

  const providers = await prisma.aiProvider.findMany();

  for (const prov of providers) {
    const fix = PROVIDER_FIXES[prov.name];
    if (fix) {
      console.log(`[FIXING] ${prov.name}`);
      console.log(`  baseUrl:            ${prov.baseUrl} → ${fix.baseUrl}`);
      console.log(`  completionEndpoint: ${prov.completionEndpoint} → ${fix.completionEndpoint}`);

      await prisma.aiProvider.update({
        where: { id: prov.id },
        data: {
          baseUrl: fix.baseUrl,
          completionEndpoint: fix.completionEndpoint,
        },
      });
      console.log(`  ✅ Actualizado.\n`);
    } else {
      console.log(`[OK] ${prov.name} — no requiere cambios\n`);
    }
  }

  // Verificar resultado final
  console.log("\n=== URLs finales resultantes ===");
  const updated = await prisma.aiProvider.findMany();
  for (const p of updated) {
    const fullUrl = p.baseUrl.replace(/\/+$/, "") + p.completionEndpoint;
    console.log(`  ${p.name}: ${fullUrl}`);
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
