# Arquitectura Técnica

## Arquitectura objetivo

```text
Usuario Web/PWA
  ↓
Next.js App Router / React / TypeScript
  ↓
API modular / Server Actions controladas / Route handlers
  ↓
PostgreSQL + Redis/Queue + File Storage cifrado
  ↓
AI Gateway multi-proveedor + Clinical Guardrails
  ↓
Servicios externos: Stripe, Google Meet, Gmail, búsqueda web médica controlada
  ↓
Debian + PM2 + Cloudflare Tunnel
```

## Decisión frontend

- PWA web-first.
- SSR/RSC para datos sensibles.
- Client-side para interacciones UI, tema, drafts, formularios y componentes que no requieran datos clínicos sensibles.
- Evitar sobrecargar servidor con renders innecesarios.
- Streaming para respuestas IA.
- Carga lazy de dashboards administrativos.

## Decisión backend

- Node.js/TypeScript modular.
- PostgreSQL.
- Redis/BullMQ o equivalente para jobs.
- Auditoría append-only.
- Archivos sensibles cifrados.
- Separación estricta de dominios.

## Módulos

1. Auth.
2. RBAC/ABAC.
3. Medical Record.
4. Evidence.
5. AI Gateway.
6. Clinical Guardrails.
7. Appointments.
8. Google Meet.
9. Payments.
10. Wallet.
11. Notifications.
12. Admin.
13. Support.
14. Accounting.
15. Audit.
16. I18n.
17. Compliance.

## Deploy

### Flujo

1. Push a GitHub.
2. Pull en servidor Debian.
3. Instalar deps.
4. Build.
5. Migraciones.
6. PM2 reload/start.
7. Cloudflare Tunnel enruta hostname público.
8. Healthcheck.
9. Monitoreo y logs.

### PM2

- Usar `ecosystem.config.js`.
- Definir `instances` según capacidad.
- Logs rotados.
- Restart policy.
- Healthcheck y alerta.

### Cloudflare Tunnel

- Publicar app local sin abrir puertos.
- Correr `cloudflared` como servicio Linux.
- Configurar hostname público hacia puerto local.

## Escalabilidad

- Server local inicialmente.
- Separar workers de IA si crece carga.
- Migrar a VPS o cloud cuando ROI lo justifique.
- Storage S3-compatible futuro.
- Vector DB futuro si RAG crece.


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
