# Documento de Desarrollo

## 1. Principios técnicos

- TypeScript estricto.
- Clean Architecture por bounded contexts.
- SOLID aplicado con pragmatismo.
- Dependencias explícitas.
- Sin lógica clínica crítica en componentes UI.
- Sin secretos en repositorio.
- Sin PHI en logs.
- Tests en capas.
- ADR para decisiones relevantes.
- Migraciones versionadas.

## 2. Bounded contexts

```text
apps/
  web/
packages/
  ui/
  config/
  db/
  auth/
  rbac/
  medical-record/
  evidence/
  ai-gateway/
  clinical-guardrails/
  appointments/
  meet/
  payments/
  wallet/
  notifications/
  admin/
  support/
  accounting/
  audit/
  i18n/
  observability/
```

## 3. Estándares de código

### Naming

- Entidades: PascalCase.
- Servicios: `XService`.
- Repositorios: `XRepository`.
- Use cases: `VerbEntityUseCase`.
- DTOs: `XInput`, `XOutput`.
- Validadores: `x.schema.ts`.

### Commits

Usar Conventional Commits:

- `feat:`
- `fix:`
- `refactor:`
- `test:`
- `docs:`
- `chore:`
- `security:`

### Tests mínimos

- Unit tests para use cases.
- Integration tests para repositorios.
- E2E para flujos críticos.
- Security tests para RBAC.
- Clinical scenario tests para guardrails.

## 4. Patrones internos

### Action Receipt

Toda acción sensible produce recibo:

```ts
type ActionReceipt = {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  reversible: boolean;
  createdAt: Date;
}
```

### Clinical Policy Result

```ts
type ClinicalPolicyResult = {
  canRecommend: boolean;
  mustEscalate: boolean;
  missingEvidence: string[];
  redFlags: string[];
  allowedRecommendationTypes: string[];
  riskLevel: 'green' | 'yellow' | 'red';
}
```

### AI Provider Adapter

```ts
interface AiProviderAdapter {
  protocol: 'openai-compatible' | 'claude-compatible' | 'generic';
  listModels(): Promise<AiModel[]>;
  healthcheck(): Promise<ProviderHealth>;
  complete(input: AiCompletionInput): Promise<AiCompletionOutput>;
}
```

## 5. Migrations y datos

- PostgreSQL como fuente transaccional.
- JSONB solo para snapshots o payloads clínicos versionados.
- Constraints para reglas inviolables:
  - Superadmin no bloqueable.
  - Médico no activo no puede tomar citas.
  - Cita pagada no duplica Meet.
  - Wallet por ledger, no saldo mutable sin trazabilidad.

## 6. Seguridad de secretos

- API keys cifradas.
- Variables `.env` fuera de Git.
- Secret rotation.
- Permisos admin separados.
- Nunca exponer API keys al cliente.


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
