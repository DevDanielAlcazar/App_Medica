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

/** POST /api/admin/ai/models/sync — Sincroniza modelos desde el proveedor */
export async function POST(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: "No autorizado." }, { status: 403 });

    const { providerId } = await req.json();
    if (!providerId) return NextResponse.json({ error: "providerId requerido." }, { status: 400 });

    const provider = await prisma.aiProvider.findUnique({
      where: { id: providerId },
      include: {
        apiKeys: {
          where: { status: "active" },
          take: 1
        }
      }
    });

    if (!provider) {
      return NextResponse.json({ error: "Proveedor no encontrado." }, { status: 404 });
    }

    if (provider.apiKeys.length === 0) {
      return NextResponse.json({ error: "El proveedor no tiene API keys activas para sincronizar." }, { status: 400 });
    }

    const rawSecret = provider.apiKeys[0].encryptedSecret;
    const apiKey = await resolveApiKey(rawSecret, provider.name);

    if (!apiKey) {
      return NextResponse.json({ error: `No se pudo resolver la API key para ${provider.name}.` }, { status: 400 });
    }

    const modelsEndpoint = provider.modelsEndpoint || "/v1/models";
    const url = `${provider.baseUrl}${modelsEndpoint}`;

    let response;
    try {
      response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "x-api-key": apiKey // Some providers use this
        }
      });
    } catch (fetchError: any) {
      console.error(`Error fetching from ${url}:`, fetchError);
      return NextResponse.json({ error: `Error conectando con la API de ${provider.name}: ${fetchError.message}` }, { status: 502 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Error de la API (${response.status}): ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    let importedCount = 0;

    // OpenAI format: { data: [{ id: "model-id" }] }
    // Anthropic doesn't have a standard /v1/models endpoint, but if they add one or if it's a generic provider, we try to handle common structures.
    const modelsList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : data.models;

    if (!modelsList || !Array.isArray(modelsList)) {
      return NextResponse.json({ error: "La API devolvió un formato de respuesta de modelos no reconocido." }, { status: 400 });
    }

    for (const remoteModel of modelsList) {
      const modelId = remoteModel.id || remoteModel.name;
      if (!modelId) continue;

      const existingModel = await prisma.aiModel.findFirst({
        where: {
          providerId: provider.id,
          modelName: modelId
        }
      });

      if (!existingModel) {
        await prisma.aiModel.create({
          data: {
            providerId: provider.id,
            modelName: modelId,
            displayName: modelId,
            enabled: false, // Default to disabled to let admin review
            capabilities: [],
            maxContext: 8192,
            clinicalAllowed: false,
            costTier: "medium",
            latencyTier: "medium"
          }
        });
        importedCount++;
      }
    }

    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: "AI_MODELS_SYNCED",
        entity: "AiModel",
        details: { providerId, importedCount }
      }
    });

    return NextResponse.json({ success: true, importedCount });

  } catch (e: any) {
    console.error("Error in models sync:", e);
    return NextResponse.json({ error: "Error interno durante la sincronización." }, { status: 500 });
  }
}
