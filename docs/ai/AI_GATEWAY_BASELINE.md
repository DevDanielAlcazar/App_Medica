# AI Gateway Baseline — App Médica

## Protocolos soportados

| Protocolo | Descripción | Endpoints típicos |
|-----------|-------------|-------------------|
| `openai-compatible` | Compatible con OpenAI API | `/v1/chat/completions`, `/v1/models` |
| `claude-compatible` | Compatible con Anthropic Claude | `/v1/messages`, `/v1/models` |
| `generic` | HTTP configurable con headers personalizados | Configurable por admin |

## Entidades principales

### AiProvider

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `name` | string | Nombre amigable |
| `protocol` | enum | openai-compatible, claude-compatible, generic |
| `baseUrl` | string | URL base del proveedor |
| `modelsEndpoint` | string | Endpoint para listar modelos |
| `completionEndpoint` | string | Endpoint para completions |
| `status` | enum | active, inactive, degraded |
| `priority` | number | Prioridad para autorouting (1=alta) |
| `timeoutMs` | number | Timeout en milisegundos |
| `supportsStreaming` | boolean | ¿Soporta streaming? |
| `supportsVision` | boolean | ¿Soporta visión/imagen? |
| `supportsTools` | boolean | ¿Soporta function calling? |
| `regionPolicy` | string[] | Países/Regiones permitidos |

### AiApiKey

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `providerId` | UUID | Referencia al provider |
| `label` | string | Etiqueta amigable |
| `encryptedSecret` | string | API key cifrada |
| `status` | enum | active, revoked, expired |
| `rateLimit` | number | Requests por minuto |
| `monthlyBudget` | number | Presupuesto mensual USD |
| `createdBy` | UUID | Admin que creó la key |
| `rotatedAt` | Date | Última rotación |

### AiModel

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `providerId` | UUID | Referencia al provider |
| `modelName` | string | Nombre técnico del modelo |
| `displayName` | string | Nombre amigable |
| `capabilities` | string[] | text, vision, tools |
| `maxContext` | number | Tokens máximos de contexto |
| `enabled` | boolean | ¿Modelo habilitado? |
| `clinicalAllowed` | boolean | ¿Permitido usar con PHI? |
| `costTier` | enum | low, medium, high |
| `latencyTier` | enum | low, medium, high |

### RoutingPolicy

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `useCase` | string | clinical_triage, summary, etc |
| `riskLevel` | enum | green, yellow, red |
| `requiredCapabilities` | string[] | Capacidades requeridas |
| `allowedModels` | UUID[] | Modelos permitidos |
| `fallbackChain` | UUID[] | Cadena de fallback |
| `maxCost` | enum | low, medium, high |
| `maxLatency` | enum | low, medium, high |
| `requireClinicalApproved` | boolean | ¿Requiere modelo clínico aprobado? |

### Healthcheck

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `providerId` | UUID | Provider verificado |
| `status` | enum | healthy, degraded, down |
| `latencyMs` | number | Latencia actual |
| `lastChecked` | Date | Timestamp del check |
| `error` | string? | Error si aplica |

### UsageLog

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `requestId` | UUID | ID única de la petición |
| `providerId` | UUID | Provider usado |
| `modelId` | UUID | Modelo usado |
| `promptTokens` | number | Tokens de entrada |
| `completionTokens` | number | Tokens de salida |
| `costUsd` | number | Costo estimado |
| `useCase` | string | Caso de uso |
| `createdAt` | Date | Timestamp |

## Autorouting

Algoritmo de selección de proveedor/modelo:

1. Recibe `useCase`, `riskLevel`, `capabilitiesRequeridas`.
2. Filtra modelos por `enabled = true`.
3. Filtra por `clinicalAllowed = true` si hay PHI.
4. Filtra por `capabilities` compatibles.
5. Ejecuta `healthcheck` del provider.
6. Verifica `monthlyBudget` disponible.
7. Ordena por política: Seguridad > Disponibilidad > Capacidad > Costo > Latencia.
8. Ejecuta petición.
9. Si falla, reintenta con fallback.
10. Registra auditoría en `UsageLog`.

## Fallback

- Si el provider primario falla, se usa el siguiente en `fallbackChain`.
- Si todos fallan, se devuelve error con código específico.
- El usuario ve "Servicio temporalmente no disponible".

## Presupuesto

- Cada API key tiene `monthlyBudget` en USD.
- Se descuenta por usage en `UsageLog`.
- Si excede presupuesto, provider pasa a `degraded`.
- Admin recibe alerta de presupuesto bajo.

## Healthcheck

- Endpoint: `/api/ai/health`.
- Verifica latencia y disponibilidad de cada provider.
- Cache de resultados 60 segundos.
- Endpoint usado por autorouting y dashboard admin.

## Activación/desactivación de modelos

- Admin puede marcar `enabled = false` en dashboard.
- Modelos deshabilitados no aparecen en autorouting.
- Modelos con `clinicalAllowed = false` no reciben PHI.

## Restricción de PHI por proveedor no aprobado

Si `clinicalAllowed = false`:

1. Se desidentifica el prompt eliminando nombres, fechas específicas, ubicaciones exactas.
2. Si no es posible desidentificar, se bloquea la petición.
3. Se registra intento en auditoría.

## Cifrado de API keys

- `encryptedSecret` guardado con AES-256-GCM.
- Key de cifrado separada del resto del sistema.
- Rotación manual o automática cada 90 días.

## No exposición al frontend

- API keys nunca viajan al cliente.
- Solo se expone `model.displayName` y `provider.name` si es necesario.
- Configuración de providers es solo backend.

## Casos de uso soportados

| Caso de uso | Riesgo | Requiere modelo clínico aprobado |
|-------------|--------|---------------------------------|
| clinical_triage | green/yellow/red | Sí |
| clinical_recommendation | green/yellow | Sí |
| pediatric_case | yellow/red | Sí |
| web_medical_search_synthesis | yellow | Sí |
| summary | green | Opcional |
| translation | green | No |
| support_reply | green | No |
| admin_report | green | No |