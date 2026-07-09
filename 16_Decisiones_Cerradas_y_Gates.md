# Decisiones Cerradas y Gates

## Decisiones cerradas

| ID | Tema | Decisión |
|---|---|---|
| D-001 | Jurisdicción | México, EE.UU., LatAm y países de habla inglesa por configuración |
| D-002 | Disclaimer | Visible en login con enlace a política |
| D-003 | Alcance clínico | IA puede orientar/diagnosticar bajo guardrails |
| D-004 | Recomendación | Usar título Recomendación Sintomatológica |
| D-005 | Controlados | Nunca recetar controlados |
| D-006 | Médicos | Cédula + identidad; En revisión hasta validación |
| D-007 | Videocita | Google Meet |
| D-008 | IA | Proveedores dinámicos OpenAI/Claude/genérico |
| D-009 | Retención | Usuario elimina cuando quiera; curado + 6 meses |
| D-010 | Notificaciones | Gmail configurable por admin |
| D-011 | Web médica | Permitida desde release con control |
| D-012 | Pagos | Reales en release productivo |

## Gates obligatorios

### Gate Legal
- Política privacidad aprobada.
- Términos aprobados.
- País/región activada solo con policy pack.
- Evidencia de consentimiento.

### Gate Médico
- Red flags aprobadas.
- Pediatría aprobada.
- OTC aprobado.
- Controlados bloqueados.
- Escalación humana probada.

### Gate Seguridad
- RBAC.
- Cifrado.
- Audit logs.
- Logs sin PHI.
- Eliminación.

### Gate Pagos
- Stripe live.
- Webhooks idempotentes.
- Wallet ledger.
- Cortes médicos.
- Reembolsos/créditos soporte.

### Gate DevOps
- PM2.
- Cloudflare Tunnel.
- Backups.
- Healthchecks.
- Rollback.
