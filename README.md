# App Médica

**Fecha:** 2026-07-08  
**Estado:** Baseline de gobernanza técnica listo. Preparación para desarrollo controlado.  
**Enfoque:** Release productivo, no MVP.

## Advertencia de dominio sensible

Este proyecto maneja **datos personales sensibles de salud (PHI)** y funcionalidades de **IA clínica**. Cualquier contribución, modificación o despliegue debe cumplir con:

- Guardrails clínicos estrictos.
- Control de acceso basado en roles (RBAC).
- Auditoría de todas las acciones sensibles.
- No exponer datos de salud ni secretos al frontend.
- No guardar PHI en logs ordinarios.

## Stack objetivo

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js App Router, React, TypeScript estricto, PWA |
| Backend | Node.js modular, Server Actions/Route Handlers |
| Base de datos | PostgreSQL |
| Colas | Redis/BullMQ o equivalente |
| Storage | File storage cifrado |
| IA | AI Gateway multi-proveedor (OpenAI-compatible, Claude-compatible, genérico HTTP) |
| Video | Google Meet API |
| Pagos | Stripe (live en producción, sandbox solo en QA) |
| Deploy | GitHub → Debian → PM2 → Cloudflare Tunnel |
| Observabilidad | Logs estructurados, healthchecks, métricas |

## Principios de desarrollo

1. **TypeScript estricto** - `strict: true` en `tsconfig.json`.
2. **Clean Architecture por bounded contexts** - Separación estricta de dominios.
3. **Pruebas obligatorias** - Unit, integration y E2E para flujos críticos.
4. **ADRs** - Cada decisión técnica relevante queda documentada.
5. **Sin lógica clínica en UI** - La toma de decisiones clínicas está en el backend.
6. **Auditoría append-only** - Toda acción sensible genera un ActionReceipt.
7. **Nada de secretos en repositorio** - Variables en `.env` fuera de Git.

## Estructura documental

```
docs/
  adr/           # Architecture Decision Records
  ai/            # AI Gateway y políticas de IA
  clinical/      # Guardrails y decisiones clínicas
  compliance/    # Legal y regulatory baseline
  delivery/      # Gates de release y checklist
  quality/       # Definition of Done, testing standards
  security/      # Seguridad y privacidad
  reports/       # Reports de ejecución de prompts
prompts/         # Library de prompts para IA Jr
```

## Cómo trabajar con prompts

1. Cada prompt es una tarea acotada.
2. La IA Jr no decide arquitectura.
3. La IA Jr no modifica seguridad/IA clínica sin permiso.
4. Todo cambio debe incluir tests.
5. Todo módulo debe tener README interno.
6. No se aceptan PRs sin build, lint y tests verdes.

## Gates antes de producción

- Gate legal (política de privacidad, términos, policy packs por país).
- Gate médico (red flags, pediatría, OTC, controlados, escalación humana).
- Gate seguridad (RBAC, cifrado, auditoría, logs sin PHI).
- Gate pagos (Stripe live, webhooks idempotentes, wallet ledger).
- Gate accesibilidad (WCAG 2.2 AA).
- Gate rendimiento (load test, healthchecks).
- Go/No-Go final firmado.

## Variables de entorno

Copiar `.env.example` a `.env` y completar con valores reales. **Nunca se debe agregar `.env` al repositorio.**

## Referencias

- PRD: `01_PRD_App_Medica_Release_v1.md`
- Plan: `02_Plan_Desarrollo.md`
- Arquitectura: `06_Arquitectura_Tecnica.md`
- Seguridad: `09_Seguridad_Compliance_Medico.md`
- AI Gateway: `10_AI_Gateway_Autorouting.md`
- Guardrails: `11_Guardrails_Clinicos.md`