import { prisma } from "@/lib/prisma";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GatewayResponse {
  content: string;
  providerUsed: string;
  modelUsed: string;
  success: boolean;
  error?: string;
}

/**
 * Resuelve la API key del proveedor. Si es el placeholder, busca la variable de entorno correspondiente.
 */
export async function resolveApiKey(secret: string, providerName: string): Promise<string> {
  if (secret === "env_key_placeholder") {
    const envVar = `${providerName.toUpperCase()}_API_KEY`;
    return process.env[envVar] || "";
  }
  return secret; // Retornar tal cual en caso de llaves custom ingresadas por el admin
}

/**
 * Llamada HTTP al protocolo OpenAI (/chat/completions)
 */
async function callOpenAi(
  baseUrl: string,
  endpoint: string,
  apiKey: string,
  modelName: string,
  messages: ChatMessage[],
  timeoutMs: number
): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = baseUrl.replace(/\/$/, "") + (endpoint.startsWith("/") ? endpoint : "/" + endpoint);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI HTTP ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Respuesta de OpenAI vacía o mal estructurada.");
    }
    return content;
  } catch (err: any) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Llamada HTTP al protocolo Anthropic Claude (/v1/messages)
 */
async function callClaude(
  baseUrl: string,
  endpoint: string,
  apiKey: string,
  modelName: string,
  messages: ChatMessage[],
  timeoutMs: number
): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = baseUrl.replace(/\/$/, "") + (endpoint.startsWith("/") ? endpoint : "/" + endpoint);

    // Extraer el system prompt si existe
    const systemMessage = messages.find((m) => m.role === "system")?.content;
    const userMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 4000,
        messages: userMessages,
        system: systemMessage,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude HTTP ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    const content = json.content?.[0]?.text;
    if (!content) {
      throw new Error("Respuesta de Claude vacía o mal estructurada.");
    }
    return content;
  } catch (err: any) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Enruta una solicitud de IA basada en el caso de uso y maneja el failover a través de la cadena de respaldo.
 */
export async function routeAiRequest(
  useCase: string,
  messages: ChatMessage[],
  userId?: string
): Promise<GatewayResponse> {
  try {
    // 1. Obtener la política de ruteo para el caso de uso
    const policy = await prisma.routingPolicy.findUnique({
      where: { useCase },
    });

    if (!policy) {
      throw new Error(`No se encontró una política de ruteo configurada para el caso de uso: ${useCase}`);
    }

    // 2. Obtener proveedores activos y modelos habilitados
    const activeProviders = await prisma.aiProvider.findMany({
      where: { status: "active" },
      include: {
        models: {
          where: { enabled: true },
        },
        apiKeys: {
          where: { status: "active" },
        },
      },
      orderBy: { priority: "asc" }, // Probar primero los de mayor prioridad
    });

    // 3. Crear una lista ordenada de modelos candidatos a probar (respetando la cadena de fallbacks y la política)
    const candidates: Array<{
      provider: typeof activeProviders[0];
      model: typeof activeProviders[0]["models"][0];
      apiKey: string;
    }> = [];

    // Función auxiliar para agregar candidatos permitidos para un proveedor determinado
    const addCandidatesForProvider = (provider: typeof activeProviders[0]) => {
      const allowedModels = provider.models.filter((m) => {
        // Verificar si la política limita los modelos permitidos
        if (policy.allowedModels.length > 0 && !policy.allowedModels.includes(m.modelName)) {
          return false;
        }
        // Si requiere aprobación clínica, verificar campo
        if (policy.requireClinicalApproved && !m.clinicalAllowed) {
          return false;
        }
        return true;
      });

      for (const m of allowedModels) {
        // Agregar un candidato por CADA API key activa registrada para este proveedor
        for (const key of provider.apiKeys) {
          candidates.push({
            provider,
            model: m,
            apiKey: key.encryptedSecret,
          });
        }
      }
    };

    // Primero agregamos los proveedores especificados en el fallbackChain de la política
    for (const fallbackProviderName of policy.fallbackChain) {
      const provider = activeProviders.find((p) => p.name === fallbackProviderName);
      if (!provider || provider.apiKeys.length === 0) continue;
      addCandidatesForProvider(provider);
    }

    // Si después de probar la cadena preferida no tenemos candidatos (o como respaldo final),
    // agregamos CUALQUIER otro proveedor activo configurado en el sistema con API Keys activas.
    const preferredNames = new Set(policy.fallbackChain);
    const backupProviders = activeProviders.filter(
      (p) => !preferredNames.has(p.name) && p.apiKeys.length > 0
    );

    for (const provider of backupProviders) {
      addCandidatesForProvider(provider);
    }

    if (candidates.length === 0) {
      throw new Error(`No hay modelos de IA disponibles o con API keys configuradas en el sistema para el caso de uso: ${useCase}`);
    }

    // 4. Intentar llamadas en secuencia (Failover Loop)
    let lastError: Error | null = null;

    for (const candidate of candidates) {
      const { provider, model, apiKey: rawSecret } = candidate;

      try {
        console.log(`[AI Gateway] Intentando petición con modelo ${model.modelName} (${provider.name})...`);
        const apiKey = await resolveApiKey(rawSecret, provider.name);

        if (!apiKey) {
          throw new Error(`API Key no configurada o vacía para el proveedor: ${provider.name}`);
        }

        let responseText = "";
        if (provider.protocol === "openai" || provider.protocol === "generic") {
          responseText = await callOpenAi(
            provider.baseUrl,
            provider.completionEndpoint,
            apiKey,
            model.modelName,
            messages,
            provider.timeoutMs
          );
        } else if (provider.protocol === "claude") {
          responseText = await callClaude(
            provider.baseUrl,
            provider.completionEndpoint,
            apiKey,
            model.modelName,
            messages,
            provider.timeoutMs
          );
        } else {
          throw new Error(`Protocolo de IA no soportado: ${provider.protocol}`);
        }

        // Registrar uso exitoso en la auditoría
        await prisma.auditLog.create({
          data: {
            userId: userId || null,
            action: "AI_GATEWAY_SUCCESS",
            entity: "AiModel",
            details: {
              useCase,
              provider: provider.name,
              model: model.modelName,
              tokensApprox: messages.reduce((acc, m) => acc + m.content.length / 4, 0) + responseText.length / 4,
            },
          },
        });

        return {
          content: responseText,
          providerUsed: provider.name,
          modelUsed: model.modelName,
          success: true,
        };
      } catch (err: any) {
        console.warn(`[AI Gateway] Error con modelo ${model.modelName} de ${provider.name}: ${err.message}. Probando fallback...`);
        lastError = err;

        // Registrar fallo en auditoría
        await prisma.auditLog.create({
          data: {
            userId: userId || null,
            action: "AI_GATEWAY_FAILOVER",
            entity: "AiModel",
            details: {
              useCase,
              provider: provider.name,
              model: model.modelName,
              error: err.message || "Desconocido",
            },
          },
        });
      }
    }

    // Si todos fallan
    throw new Error(`Todos los modelos configurados en la cadena de respaldo fallaron. Último error: ${lastError?.message}`);
  } catch (error: any) {
    console.error("[AI Gateway Fatal]:", error);
    return {
      content: "",
      providerUsed: "none",
      modelUsed: "none",
      success: false,
      error: error.message || "Error fatal en AI Gateway.",
    };
  }
}
