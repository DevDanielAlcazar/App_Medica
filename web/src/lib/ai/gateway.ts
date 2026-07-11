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
  return secret;
}

/**
 * Construye la URL completa de la API.
 * La lógica es simple: base + endpoint.
 *
 * El administrador debe configurar:
 *   - baseUrl: URL completa hasta el prefijo de versión si aplica.
 *     Ej: "https://inference.poolside.ai/v1", "https://api.groq.com/openai/v1"
 *   - completionEndpoint: solo el sufijo de la ruta.
 *     Ej: "/chat/completions" (NO "/v1/chat/completions" si el v1 ya está en baseUrl)
 *
 * Ejemplos válidos:
 *   buildApiUrl("https://inference.poolside.ai/v1", "/chat/completions")
 *     → "https://inference.poolside.ai/v1/chat/completions"  ✅
 *   buildApiUrl("https://api.kilo.ai/api/gateway", "/chat/completions")
 *     → "https://api.kilo.ai/api/gateway/chat/completions"  ✅
 *   buildApiUrl("https://openrouter.ai/api/v1", "/chat/completions")
 *     → "https://openrouter.ai/api/v1/chat/completions"  ✅
 */
function buildApiUrl(baseUrl: string, endpoint: string): string {
  const base = baseUrl.replace(/\/+$/, ""); // quitar trailing slashes
  const ep = endpoint.startsWith("/") ? endpoint : "/" + endpoint;
  return base + ep;
}

/**
 * Llamada HTTP al protocolo OpenAI-compatible (/chat/completions)
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
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = buildApiUrl(baseUrl, endpoint);
    console.log(`[AI Gateway] POST ${url} | model: ${modelName}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      // Intentar leer el body como texto (puede ser JSON o HTML)
      const errorText = await response.text();
      // Si el error es HTML (página web de error), dar un mensaje más legible
      const isHtml = errorText.trim().startsWith("<!DOCTYPE") || errorText.trim().startsWith("<html");
      const shortError = isHtml
        ? `La URL del proveedor devolvió una página HTML (probable URL incorrecta: ${url})`
        : errorText.slice(0, 300);
      throw new Error(`HTTP ${response.status}: ${shortError}`);
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Respuesta vacía o mal estructurada (campo choices[0].message.content ausente).");
    }
    return content;
  } catch (err: any) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Llamada HTTP al protocolo Anthropic Claude (/messages)
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
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = buildApiUrl(baseUrl, endpoint);
    console.log(`[AI Gateway] POST ${url} | model: ${modelName}`);

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

    clearTimeout(timer);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 300)}`);
    }

    const json = await response.json();
    const content = json.content?.[0]?.text;
    if (!content) {
      throw new Error("Respuesta de Claude vacía o mal estructurada (campo content[0].text ausente).");
    }
    return content;
  } catch (err: any) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Función auxiliar: dado un proveedor activo, agrega candidatos a la lista
 * respetando las restricciones de la política de ruteo.
 *
 * @param ignorePolicyFilter - Si true, ignora el filtro de allowedModels (fallback).
 */
function buildCandidatesForProvider(
  provider: any,
  policy: any,
  ignorePolicyFilter: boolean
): Array<{ provider: any; model: any; apiKey: string }> {
  const candidates: Array<{ provider: any; model: any; apiKey: string }> = [];

  const eligibleModels = provider.models.filter((m: any) => {
    if (ignorePolicyFilter) {
      // En modo fallback solo respetamos clinicalAllowed si la política lo exige
      return policy.requireClinicalApproved ? m.clinicalAllowed : true;
    }
    // Filtro estricto: allowedModels lista nombres exactos
    if (policy.allowedModels.length > 0 && !policy.allowedModels.includes(m.modelName)) {
      return false;
    }
    if (policy.requireClinicalApproved && !m.clinicalAllowed) {
      return false;
    }
    return true;
  });

  for (const model of eligibleModels) {
    for (const key of provider.apiKeys) {
      candidates.push({ provider, model, apiKey: key.encryptedSecret });
    }
  }

  return candidates;
}

/**
 * Enruta una solicitud al modelo de IA más adecuado con failover automático.
 *
 * Estrategia (4 niveles):
 *   1. Proveedores en fallbackChain de la política, con filtro estricto
 *   2. Resto de proveedores activos, con filtro estricto
 *   3. Si aún 0 candidatos: todos los proveedores ignorando allowedModels pero respetando clinicalAllowed
 *   4. Último recurso: todos los proveedores habilitados sin importar clinicalAllowed
 */
export async function routeAiRequest(
  useCase: string,
  messages: ChatMessage[],
  userId?: string
): Promise<GatewayResponse> {
  try {
    // 1. Obtener la política de ruteo
    const policy = await prisma.routingPolicy.findUnique({ where: { useCase } });

    if (!policy) {
      throw new Error(
        `No se encontró política de ruteo para '${useCase}'. Crea una en Admin → Config IA → Políticas de Ruteo.`
      );
    }

    // 2. Obtener proveedores activos con modelos habilitados y keys activas
    const activeProviders = await prisma.aiProvider.findMany({
      where: { status: "active" },
      include: {
        models: { where: { enabled: true } },
        apiKeys: { where: { status: "active" } },
      },
      orderBy: { priority: "asc" },
    });

    if (activeProviders.length === 0) {
      throw new Error("No hay proveedores de IA activos. Configura al menos uno en Admin → Config IA.");
    }

    // 3. Construir lista ordenada de candidatos
    let candidates: Array<{ provider: any; model: any; apiKey: string }> = [];

    // Nivel 1 — fallbackChain de la política con filtro estricto
    for (const name of policy.fallbackChain) {
      const prov = activeProviders.find((p) => p.name === name);
      if (prov && prov.apiKeys.length > 0) {
        candidates.push(...buildCandidatesForProvider(prov, policy, false));
      }
    }

    // Nivel 2 — resto de proveedores activos con filtro estricto
    const inChain = new Set(policy.fallbackChain);
    for (const prov of activeProviders) {
      if (!inChain.has(prov.name) && prov.apiKeys.length > 0) {
        candidates.push(...buildCandidatesForProvider(prov, policy, false));
      }
    }

    // Nivel 3 — ignorar allowedModels pero respetar clinicalAllowed
    if (candidates.length === 0 && policy.allowedModels.length > 0) {
      console.warn(
        `[AI Gateway] Ningún modelo del sistema coincide con allowedModels [${policy.allowedModels.join(", ")}]. ` +
          `Aplicando fallback nivel 3: cualquier modelo ${policy.requireClinicalApproved ? "con clinicalAllowed=true" : "habilitado"}.`
      );
      for (const prov of activeProviders) {
        if (prov.apiKeys.length > 0) {
          candidates.push(...buildCandidatesForProvider(prov, policy, true));
        }
      }
    }

    // Nivel 4 — último recurso: cualquier modelo habilitado sin restricción
    if (candidates.length === 0 && policy.requireClinicalApproved) {
      console.warn(
        `[AI Gateway] No hay modelos con clinicalAllowed=true. ` +
          `Último recurso: usando cualquier modelo habilitado con API key activa.`
      );
      for (const prov of activeProviders) {
        if (prov.apiKeys.length > 0) {
          for (const model of prov.models) {
            for (const key of prov.apiKeys) {
              candidates.push({ provider: prov, model, apiKey: key.encryptedSecret });
            }
          }
        }
      }
    }

    if (candidates.length === 0) {
      throw new Error(
        `No hay modelos de IA disponibles para '${useCase}'. ` +
          `Verifica que existan proveedores activos con API keys y modelos habilitados en Admin → Config IA → Modelos.`
      );
    }

    console.log(
      `[AI Gateway] ${candidates.length} candidato(s) para '${useCase}'. Orden: ${
        candidates.map((c) => `${c.provider.name}/${c.model.modelName}`).slice(0, 4).join(" → ")
      }${candidates.length > 4 ? " ..." : ""}`
    );

    // 4. Failover loop — intentar candidatos en secuencia
    let lastError: Error | null = null;

    for (const { provider, model, apiKey: rawSecret } of candidates) {
      try {
        const apiKey = await resolveApiKey(rawSecret, provider.name);
        if (!apiKey) {
          throw new Error(`API Key vacía para el proveedor '${provider.name}'. Verifica la variable de entorno o el valor almacenado.`);
        }

        let responseText = "";
        const protocol = provider.protocol === "generic" ? "openai" : provider.protocol;

        if (protocol === "openai") {
          responseText = await callOpenAi(
            provider.baseUrl,
            provider.completionEndpoint,
            apiKey,
            model.modelName,
            messages,
            provider.timeoutMs
          );
        } else if (protocol === "claude") {
          responseText = await callClaude(
            provider.baseUrl,
            provider.completionEndpoint,
            apiKey,
            model.modelName,
            messages,
            provider.timeoutMs
          );
        } else {
          throw new Error(`Protocolo desconocido: '${provider.protocol}'. Usa 'openai', 'claude' o 'generic'.`);
        }

        // Éxito — registrar en auditoría
        await prisma.auditLog.create({
          data: {
            userId: userId || null,
            action: "AI_GATEWAY_SUCCESS",
            entity: "AiModel",
            details: {
              useCase,
              provider: provider.name,
              model: model.modelName,
              tokensApprox: Math.round(
                messages.reduce((acc, m) => acc + m.content.length / 4, 0) + responseText.length / 4
              ),
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
        console.warn(
          `[AI Gateway] ✗ ${provider.name}/${model.modelName}: ${err.message.slice(0, 150)}. Probando siguiente...`
        );
        lastError = err;

        // Registrar fallo en auditoría (no bloquear si falla)
        prisma.auditLog
          .create({
            data: {
              userId: userId || null,
              action: "AI_GATEWAY_FAILOVER",
              entity: "AiModel",
              details: {
                useCase,
                provider: provider.name,
                model: model.modelName,
                error: err.message?.slice(0, 500) || "Desconocido",
              },
            },
          })
          .catch(() => {});
      }
    }

    // Todos los candidatos fallaron
    throw new Error(
      `Todos los modelos disponibles fallaron para '${useCase}'. ` +
        `Último error: ${lastError?.message?.slice(0, 300)}`
    );
  } catch (error: any) {
    console.error("[AI Gateway Fatal]:", error.message);
    return {
      content: "",
      providerUsed: "none",
      modelUsed: "none",
      success: false,
      error: error.message || "Error fatal en AI Gateway.",
    };
  }
}
