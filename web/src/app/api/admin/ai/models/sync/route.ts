import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { resolveApiKey } from "@/lib/ai/gateway";

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) return null;
  return user;
}

async function fetchRemoteModels(provider: any): Promise<{ id: string; object?: string }[]> {
  const rawSecret = provider.apiKeys[0].encryptedSecret;
  const apiKey = await resolveApiKey(rawSecret, provider.name);

  if (!apiKey) {
    throw new Error(`No se pudo resolver la API key para ${provider.name}.`);
  }

  const modelsEndpoint = provider.modelsEndpoint || "/v1/models";
  const url = `${provider.baseUrl.replace(/\/$/, "")}${modelsEndpoint}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "x-api-key": apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error de la API (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const modelsList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : data.models;

  if (!modelsList || !Array.isArray(modelsList)) {
    throw new Error("La API devolvió un formato de respuesta de modelos no reconocido.");
  }

  return modelsList;
}

/**
 * GET /api/admin/ai/models/sync?providerId=xxx
 * Obtiene la lista de modelos disponibles del proveedor SIN guardarlos.
 * Devuelve qué modelos ya existen en el sistema y cuáles son nuevos.
 */
export async function GET(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const providerId = searchParams.get("providerId");
    if (!providerId) return NextResponse.json({ error: "providerId requerido." }, { status: 400 });

    const provider = await prisma.aiProvider.findUnique({
      where: { id: providerId },
      include: {
        apiKeys: { where: { status: "active" }, take: 1 },
        models: { select: { modelName: true } },
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "Proveedor no encontrado." }, { status: 404 });
    }

    if (provider.apiKeys.length === 0) {
      return NextResponse.json({ error: "El proveedor no tiene API keys activas." }, { status: 400 });
    }

    let remoteModels;
    try {
      remoteModels = await fetchRemoteModels(provider);
    } catch (fetchError: any) {
      return NextResponse.json({ error: fetchError.message }, { status: 502 });
    }

    const existingModelNames = new Set(provider.models.map((m) => m.modelName));

    const models = remoteModels
      .map((rm) => {
        const modelId = rm.id || (rm as any).name;
        if (!modelId) return null;
        return {
          id: modelId,
          alreadyImported: existingModelNames.has(modelId),
        };
      })
      .filter(Boolean);

    return NextResponse.json({ success: true, models, providerId });
  } catch (e: any) {
    console.error("Error in models sync preview:", e);
    return NextResponse.json({ error: "Error interno durante la obtención de modelos." }, { status: 500 });
  }
}

/**
 * POST /api/admin/ai/models/sync
 * Importa modelos seleccionados.
 * Body: { providerId: string, selectedModelIds: string[] }
 * Si selectedModelIds está vacío o no se envía, importa todos los nuevos.
 */
export async function POST(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { providerId, selectedModelIds } = await req.json();
    if (!providerId) return NextResponse.json({ error: "providerId requerido." }, { status: 400 });

    const provider = await prisma.aiProvider.findUnique({
      where: { id: providerId },
      include: {
        apiKeys: { where: { status: "active" }, take: 1 },
        models: { select: { modelName: true } },
      },
    });

    if (!provider) {
      return NextResponse.json({ error: "Proveedor no encontrado." }, { status: 404 });
    }

    if (provider.apiKeys.length === 0) {
      return NextResponse.json({ error: "El proveedor no tiene API keys activas para sincronizar." }, { status: 400 });
    }

    let remoteModels;
    try {
      remoteModels = await fetchRemoteModels(provider);
    } catch (fetchError: any) {
      return NextResponse.json({ error: fetchError.message }, { status: 502 });
    }

    const existingModelNames = new Set(provider.models.map((m) => m.modelName));
    const selectedSet = selectedModelIds && selectedModelIds.length > 0
      ? new Set<string>(selectedModelIds)
      : null; // null = importar todos los nuevos

    let importedCount = 0;

    for (const remoteModel of remoteModels) {
      const modelId = remoteModel.id || (remoteModel as any).name;
      if (!modelId) continue;

      // Si se especificó selección, solo importar los seleccionados
      if (selectedSet && !selectedSet.has(modelId)) continue;

      // No reimportar los que ya existen
      if (existingModelNames.has(modelId)) continue;

      await prisma.aiModel.create({
        data: {
          providerId: provider.id,
          modelName: modelId,
          displayName: modelId,
          enabled: false, // Deshabilitado por defecto para que el admin revise
          capabilities: [],
          maxContext: 8192,
          clinicalAllowed: false,
          costTier: "medium",
          latencyTier: "medium",
        },
      });
      importedCount++;
    }

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "AI_MODELS_SYNCED",
        entity: "AiModel",
        details: { providerId, importedCount, selectedCount: selectedSet?.size ?? "all" },
      },
    });

    return NextResponse.json({ success: true, importedCount });
  } catch (e: any) {
    console.error("Error in models sync:", e);
    return NextResponse.json({ error: "Error interno durante la sincronización." }, { status: 500 });
  }
}
