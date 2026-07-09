# Matriz de Riesgos

| ID | Riesgo | Severidad | Mitigación |
|---|---|---|---|
| R-001 | Diagnóstico/recomendación incorrecta | Crítico | Guardrails, red flags, evidencia mínima, pruebas clínicas |
| R-002 | Multi-país sin revisión local | Crítico | Policy pack por país antes de activación |
| R-003 | Exposición de datos sensibles | Crítico | Cifrado, RBAC, auditoría, logs sin PHI |
| R-004 | Doble saldo por Stripe | Alto | Webhooks idempotentes y ledger |
| R-005 | Proveedor IA no disponible | Alto | Autorouting, fallback, healthchecks |
| R-006 | Médico no validado toma cita | Crítico | Constraint backend y estatus Activo |
| R-007 | Pediatría sin datos mínimos | Crítico | Checklist pediátrico obligatorio |
| R-008 | Servidor local saturado | Alto | Offload seguro, colas, caché, límites |
| R-009 | Meet no se genera | Medio | Reintentos y fallback operativo |
| R-010 | UX genérica/desconfianza | Medio | Patrones propios y pruebas de usabilidad |

## Riesgos que bloquean release

- Cualquier riesgo crítico sin mitigación implementada.
- Cualquier falla en red flags.
- Cualquier falla de privacidad.
- Cualquier falla de pagos reales.
- Cualquier falla RBAC en expedientes.
