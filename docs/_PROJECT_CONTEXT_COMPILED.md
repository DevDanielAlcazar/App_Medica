# Contexto Consolidado del Proyecto — App Médica

## Resumen del producto

App Médica es una plataforma web/PWA médica responsiva, bilingüe (ES/EN), con operación inicial en México, Estados Unidos, Latinoamérica y países de habla inglesa. La experiencia principal es una consulta virtual conversacional soportada por IA, con expediente clínico digital, seguimiento por padecimiento, recordatorios, recomendaciones sintomatológicas, búsqueda web médica controlada, citas humanas por Google Meet, pagos reales, wallet, dashboards operativos y administración dinámica de proveedores IA.

La primera salida pública será un **release productivo**, no un MVP.

## Roles del sistema

| Rol | Descripción | Permisos clave |
|-----|-------------|----------------|
| Paciente | Usuario final que busca orientación médica | Chat, evidencias, expediente propio, citas, pagos |
| Médico | Profesional de la salud validado | Agenda, Meet, expediente autorizado, pagos médicos |
| Admin | Operador de plataforma | Configuración IA, precios, anuncios, métricas |
| Soporte | Asistencia operativa | Incidencias, quejas, reasignaciones, créditos |
| Superadmin | Control de negocio máximo | Permisos máximos, no bloqueable por admins |

## Dominios funcionales (Bounded Contexts)

- Auth - Autenticación y sesiones
- RBAC/ABAC - Control de acceso basado en roles
- Medical Record - Expedientes clínicos
- Evidence - Evidencias médicas (imágenes, PDFs)
- AI Gateway - Integración multi-proveedor IA
- Clinical Guardrails - Motor de guardrails clínicos
- Appointments - Citas médicas
- Meet - Integración Google Meet
- Payments - Stripe y wallet
- Wallet - Ledger de saldos
- Notifications - Gmail notificador
- Admin - Dashboard administrativo
- Support - Dashboard soporte
- Accounting - Dashboard contabilidad
- Audit - Registro de auditoría
- I18n - Internacionalización
- Observability - Monitoreo y métricas

## Decisiones cerradas

| ID | Tema | Decisión |
|----|------|----------|
| D-001 | Jurisdicción | México, EE.UU., LatAm y países de habla inglesa por configuración |
| D-002 | Disclaimer | Visible en login con enlace a política |
| D-003 | Alcance clínico | IA puede orientar/diagnosticar bajo guardrails |
| D-004 | Recomendación | Usar título "Recomendación Sintomatológica" |
| D-005 | Controlados | Nunca recetar medicamentos controlados |
| D-006 | Médicos | Cédula profesional + INE/cédula; estatus "En revisión" hasta validación humana |
| D-007 | Videocita | Google Meet |
| D-008 | IA | Proveedores dinámicos OpenAI-compatible, Claude-compatible o genérico HTTP |
| D-009 | Retención | Usuario elimina cuando quiera; expedientes en "Curado" + 6 meses se eliminan automáticamente |
| D-010 | Notificaciones | Gmail configurable por admin |
| D-011 | Web médica | Permitida desde release con control |
| D-012 | Pagos | Reales en release productivo (Stripe live) |

## Pendientes no bloqueantes

- Política de privacidad requiere revisión legal final.
- Términos/disclaimer requieren revisión legal final.
- Policy pack por región en desarrollo.
- Catálogo completo de red flags en validación médica.
- Catálogo OTC en validación médica.

## Gates bloqueantes/gates antes de producción

- Validación legal por país/estado.
- Validación médica del catálogo de red flags, OTC, pediatría y derivaciones.
- Pruebas clínicas adversariales y de seguridad.
- QA accesibilidad (WCAG 2.2 AA).
- QA pagos reales (Stripe live, webhooks idempotentes).
- Backup y rollback probados.
- Manuales operativos (admin, soporte, médico, contabilidad).

## Riesgos principales

| ID | Riesgo | Severidad | Mitigación |
|----|--------|-----------|------------|
| R-001 | Diagnóstico/recomendación incorrecta | Crítico | Guardrails, red flags, evidencia mínima, pruebas clínicas |
| R-002 | Multi-país sin revisión local | Crítico | Policy pack por país antes de activación |
| R-003 | Exposición de datos sensibles | Crítico | Cifrado, RBAC, auditoría, logs sin PHI |
| R-004 | Doble saldo por Stripe | Alto | Webhooks idempotentes y ledger |
| R-005 | Proveedor IA no disponible | Alto | Autorouting, fallback, healthchecks |
| R-006 | Médico no validado toma cita | Crítico | Constraint backend y estatus "Activo" |
| R-007 | Pediatría sin datos mínimos | Crítico | Checklist pediátrico obligatorio |
| R-008 | Servidor local saturado | Alto | Offload seguro, colas, caché, límites |

## No negociables técnicos

1. TypeScript estricto en todo el codebase.
2. Clean Architecture con bounded contexts separados.
3. Cero secretos en repositorio.
4. Cero PHI en logs ordinarios.
5. Auditoría append-only para acciones sensibles.
6. Médico no activo NO puede tomar citas (constraint de base de datos).
7. Proveedores IA no aprobados NO reciben PHI sin desidentificación.
8. Eliminación automática de expedientes en estado "Curado" tras 6 meses.

## Glosario

| Término | Definición |
|---------|------------|
| Expediente | Registro clínico digital organizado por caso/padecimiento |
| Curado | Estado del expediente cuando el caso se resuelve positivamente |
| Recomendación Sintomatológica | Documento generado por IA indicando orientación no farmacológica basada en evidencia disponible |
| Red flags | Señales clínicas de alarma que requieren derivación urgente |
| AI Gateway | Servicio interno que enruta peticiones IA a múltiples proveedores según política |
| Proveedor IA | Entidad que ofrece modelo compatible (OpenAI, Claude, genérico HTTP) |
| Modelo activo | Modelo IA habilitado y aprobado para uso clínico |
| Médico en revisión | Estado de registro médico pendiente de validación humana por admin/soporte |