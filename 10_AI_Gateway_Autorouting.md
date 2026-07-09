# AI Gateway y Autorouting Multi-proveedor

## Objetivo

Permitir que admins agreguen cualquier proveedor IA compatible con:

- OpenAI-compatible.
- Claude-compatible.
- Genérico HTTP configurable.

La app debe consultar modelos disponibles, permitir activar/desactivar modelos y enrutar automáticamente al proveedor/modelo disponible y autorizado.

## Entidades

### AiProvider

- id.
- name.
- protocol.
- baseUrl.
- modelsEndpoint.
- completionEndpoint.
- status.
- priority.
- timeoutMs.
- supportsStreaming.
- supportsVision.
- supportsTools.
- regionPolicy.

### AiApiKey

- id.
- providerId.
- label.
- encryptedSecret.
- status.
- rateLimit.
- monthlyBudget.
- createdBy.
- rotatedAt.

### AiModel

- id.
- providerId.
- modelName.
- displayName.
- capabilities.
- maxContext.
- enabled.
- clinicalAllowed.
- costTier.
- latencyTier.

### RoutingPolicy

- useCase.
- riskLevel.
- requiredCapabilities.
- allowedModels.
- fallbackChain.
- maxCost.
- maxLatency.
- requireClinicalApproved.

## Use cases

- clinical_triage.
- clinical_recommendation.
- pediatric_case.
- web_medical_search_synthesis.
- summary.
- translation.
- support_reply.
- admin_report.

## Algoritmo de autorouting

1. Recibe use case.
2. Evalúa riesgo clínico.
3. Filtra modelos activos.
4. Filtra modelos con capacidad requerida.
5. Filtra modelos aprobados para contexto clínico si aplica.
6. Revisa healthcheck.
7. Revisa cuota/presupuesto.
8. Ordena por política: seguridad > disponibilidad > capacidad > costo > latencia.
9. Ejecuta.
10. Si falla, reintenta con fallback.
11. Registra auditoría.

## Reglas de seguridad

- Nunca enviar PHI a proveedor no aprobado.
- Si proveedor no tiene política compatible con datos de salud, usar desidentificación o bloquear.
- Cifrar keys.
- No exponer keys al frontend.
- No guardar prompts completos en logs ordinarios.
- Mantener request_id trazable.

## Admin UI

Campos:

- Nombre proveedor.
- Protocolo.
- Base URL.
- API key.
- Endpoint modelos.
- Endpoint completions/messages.
- Estado.
- Prioridad.
- Capabilities.
- Botón probar conexión.
- Botón consultar modelos.
- Activar/desactivar modelos.
- Marcar modelo como aprobado para clínica.


## Fuentes y referencias base

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI WCAG Overview: https://www.w3.org/WAI/standards-guidelines/wcag/
- Material Design 3 Dynamic Color: https://m3.material.io/styles/color/dynamic
- shadcn/ui: https://ui.shadcn.com/docs
- Radix Primitives: https://www.radix-ui.com/primitives
- Base UI: https://base-ui.com/
- Google Meet API: https://developers.google.com/workspace/meet/api/guides/overview
- Google Meet spaces: https://developers.google.com/workspace/meet/api/guides/meeting-spaces
- Cloudflare Tunnel Linux service: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/as-a-service/linux/
- Cloudflare Tunnel published apps: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/
- Node.js releases: https://nodejs.org/en/about/previous-releases
- PM2: https://pm2.keymetrics.io/
- PostgreSQL JSON/JSONB: https://www.postgresql.org/docs/current/datatype-json.html
- HHS health apps: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-apps/index.html
- FDA Clinical Decision Support Software guidance: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software
- WHO guidance on LMMs for health: https://www.who.int/publications/i/item/9789240084759
- LFPDPPP México: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
- Ley General de Salud México: https://www.diputados.gob.mx/LeyesBiblio/pdf_mov/Ley_General_de_Salud.pdf
- NOM-004-SSA3-2012: https://dof.gob.mx/nota_detalle_popup.php?codigo=5272787
- NOM-024-SSA3-2012: https://www.dgis.salud.gob.mx/descargas/normatividad/normas/DOF-30NOV12-NOM-024-SSA3-2012.pdf
- OpenAI API models: https://developers.openai.com/api/docs/models
- Anthropic Claude models: https://platform.claude.com/docs/en/about-claude/models/overview
