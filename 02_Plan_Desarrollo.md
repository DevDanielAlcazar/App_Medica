# Plan de Desarrollo — App Médica Release v1.0

## Metodología recomendada

Usaremos una metodología híbrida:

- **Dual-track delivery:** Discovery/control de riesgos en paralelo con desarrollo.
- **Stage-gates:** no avanza a release si no pasa gates clínicos, legales, seguridad y pagos.
- **IA Jr asistida:** OpenCode/AionUI/otros modelos ejecutan tareas acotadas con prompts controlados.
- **Revisión senior obligatoria:** toda salida de IA Jr pasa por revisión arquitectónica.
- **ADRs:** cada decisión técnica relevante queda documentada.

## Ciclos de trabajo

### Ciclo 0 — Gobierno y base
- Cerrar PRD.
- Definir policy packs por región.
- Definir catálogo inicial de red flags.
- Definir stack final y estructura repo.

### Ciclo 1 — Plataforma base
- Monorepo.
- Auth/RBAC.
- AppShell.
- Design system.
- i18n.
- Tema claro/oscuro.

### Ciclo 2 — Núcleo clínico
- Expediente.
- Timeline.
- Evidencias.
- Retención.
- Reportes.
- Auditoría.

### Ciclo 3 — IA controlada
- AI Gateway.
- Proveedores.
- Modelos.
- Autorouting.
- Guardrails.
- Búsqueda web médica.
- Recomendación Sintomatológica.

### Ciclo 4 — Operación humana
- Registro médico.
- Validación de cédula/identidad.
- Citas.
- Google Meet.
- Dashboards médicos/soporte/admin.

### Ciclo 5 — Monetización
- Stripe real.
- Wallet.
- Suscripciones.
- Cortes médicos.
- Contabilidad.

### Ciclo 6 — Hardening y release
- QA funcional.
- QA clínico adversarial.
- QA seguridad.
- QA accesibilidad.
- Performance.
- Go/No-Go.

## Reglas de trabajo con IA Jr

- Un prompt = una tarea cerrada.
- La IA Jr no decide arquitectura.
- La IA Jr no modifica seguridad sin revisión.
- La IA Jr no crea recomendaciones médicas finales sin policy.
- Todo cambio debe incluir tests.
- Todo módulo debe tener README interno.
- No se aceptan PRs sin build, lint y tests verdes.

## Definition of Done

Una tarea se considera lista cuando:

- Código compila.
- Tests unitarios/integración pasan.
- No rompe RBAC.
- No expone datos sensibles.
- UI responsive.
- A11y básica validada.
- Logs limpios de PHI.
- Documentación actualizada.
- Revisión senior aprobada.


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
