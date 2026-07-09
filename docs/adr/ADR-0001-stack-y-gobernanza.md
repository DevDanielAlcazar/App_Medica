# ADR-0001: Stack Técnico y Gobernanza

**Fecha:** 2026-07-08  
**Estado:** Aceptado

## Contexto

App Médica es una plataforma médica que maneja datos sensibles de salud (PHI) y funcionalidades de IA clínica. La primera versión pública debe ser productiva, no un MVP. El stack técnico debe soportar:

- PWA responsiva con soporte iOS/Android/desktop.
- Consultas en tiempo real con IA.
- Citas médicas con video integrado.
- Pagos reales con Stripe.
- Deploy en servidor Debian accesible vía Cloudflare Tunnel.
- Arquitectura modular para separar dominios clínicos, financieros y operativos.
- Cumplimiento de estándares de seguridad y privacidad médica.

## Decisión

Se adopta el siguiente stack técnico y arquitectura:

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Frontend | Next.js App Router, React, TypeScript estricto | SSR/RSC para datos sensibles, PWA integrada, Server Actions para mutaciones controladas |
| Backend | Node.js modular con Route Handlers | Bounded contexts separados, fácil mantenimiento y testing |
| Base de datos | PostgreSQL | ACID, JSONB para snapshots/versiones clínicas, constraints para reglas inviolables |
| Colas | Redis/BullMQ | Jobs de retención, procesamiento de evidencias, notificaciones asíncronas |
| Storage | File storage cifrado (local en dev, S3-compatible en prod) | Protección de PHI en archivos médicos |
| IA | AI Gateway multi-proveedor | Flexibilidad para cambiar proveedores, fallback automático, control de costos |
| Deploy | PM2 + Cloudflare Tunnel en Debian | Simple, seguro, sin abrir puertos, gestión de procesos |

### Arquitectura modular por bounded contexts

```
packages/
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

Cada bounded context:
- Tiene su propio dominio, aplicación e infraestructura.
- Expone APIs/servicios de dominio no UI.
- Fuerza dependencias explícitas.
- Permite testing aislado.

### AI Gateway multi-proveedor

Soporte para protocolos:
- `openai-compatible` - REST API compatible con OpenAI.
- `claude-compatible` - REST API compatible con Anthropic Claude.
- `generic` - HTTP configurable con headers personalizados.

Características:
- Autorouting basado en use case, riesgo y disponibilidad.
- Fallback automático con healthchecks.
- Límite de presupuesto mensual por proveedor.
- Cifrado de API keys en base de datos.
- Restricción de PHI por proveedor no aprobado.

## Alternativas consideradas

| Alternativa | Razón de rechazo |
|-------------|------------------|
| MERN stack (MongoDB/Express/React/Node) | Falta de constraints ACID para reglas clínicas inviolables |
| Supabase | Lock-in de proveedor, menos control de seguridad |
| Docker + Kubernetes | Complejidad innecesaria para fase 1 en servidor único |
| Firebase | No cumple con requisitos de auditoría y control de datos médicos |
| App Router vs Pages Router | App Router permite Server Actions más controladas y RSC |

## Consecuencias positivas

1. **Transparencia y trazabilidad** - Cada decisión clínica y operativa es audible.
2. **Flexibilidad de proveedores IA** - No dependencia de un solo proveedor.
3. **Despliegue simple y seguro** - Cloudflare Tunnel protege el servidor.
4. **Escalabilidad controlada** - Arquitectura preparada para crecer.
5. **Cumplimiento médico** - Constraints de DB refuerzan reglas clínicas.

## Riesgos

1. **Complejidad inicial** - Arquitectura modular requiere más setup.
2. **Latencia en IA** - Multiple proveedores pueden tener tiempos variables.
3. **Compliance multi-región** - Cada país requiere su propio policy pack.

## Mitigaciones

1. Documentación ADR y DoD clara para alinear al equipo.
2. Healthchecks y timeouts configurables en AI Gateway.
3. Policy packs por región con revisión legal antes de activación.
4. Tests de integración para validar autorouting.

## Referencias

- `06_Arquitectura_Tecnica.md`
- `10_AI_Gateway_Autorouting.md`