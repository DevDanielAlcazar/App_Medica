# App Médica Project Tracker v2 — Documento consolidado

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Contenido:** todas las pestañas del XLSX, en el orden original.  
> **Marcadores:** cada sección está delimitada por comentarios HTML de inicio y fin.

---

<!-- BEGIN SHEET: Dashboard -->

## App Médica — Release Público v1.0

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Dashboard`  
> **Rango original:** `A1:B19`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Metadatos del release

- **Versión del tracker:** Release tracker v2
- **Fecha base:** 2026-07-08
- **Responsables:** Equipo Glouu · Arquitectura/Dev Senior: ChatGPT

### KPIs

| KPI | Valor |
| --- | --- |
| Avance general | 1.11% |
| Fases completadas | 0 |
| Fases bloqueadas | 0 |
| Requerimientos aprobados | 52 |
| Riesgos críticos | 5 |
| Checklist release pendiente | 14 |
| Decisiones cerradas | 10 |
| Decisiones pendientes | 2 |

### Principios de release

1. Release productivo, no MVP: no se libera sin gates clínicos, legales, seguridad, pagos y soporte.
2. IA con guardrails: puede orientar/diagnosticar y recomendar OTC solo con evidencia suficiente; controlados prohibidos.
3. Datos de salud sensibles: mínimo privilegio, cifrado, auditoría, retención y eliminación por usuario.
4. Multi-país por configuración: México/EE.UU./LatAm/inglés, pero cada país requiere policy pack antes de activación real.
5. Operación eficiente en servidor local Debian: offload seguro al cliente, colas, caché y PM2/Cloudflare Tunnel.

### Fórmulas originales del XLSX

Estas fórmulas se documentan para conservar la lógica del archivo fuente; el Markdown contiene sus valores calculados.

| Celda | Fórmula | Valor calculado |
| --- | --- | --- |
| B5 | =AVERAGE(Seguimiento!G2:G100)/100 | 1.11% |
| B6 | =COUNTIF(Seguimiento!C2:C100,"Completado") | 0 |
| B7 | =COUNTIF(Seguimiento!C2:C100,"Bloqueado") | 0 |
| B8 | =COUNTIF(Requerimientos!G2:G200,"Aprobado") | 52 |
| B9 | =COUNTIF(Riesgos!D2:D100,"Crítico") | 5 |
| B10 | =COUNTIF(Checklist!E2:E100,"Pendiente") | 14 |
| B11 | =COUNTIF(Decisiones!D2:D100,"Cerrada") | 10 |
| B12 | =COUNTIF(Decisiones!D2:D100,"Pendiente*") | 2 |

<!-- END SHEET: Dashboard -->

---

<!-- BEGIN SHEET: Seguimiento -->

## Plan de seguimiento — Release público v1.0

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Seguimiento`  
> **Rango original:** `A1:J21`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| ID | Fase / Workstream | Estado | Prioridad | Inicio | Fin objetivo | % Avance | Responsable | Entregable | Notas |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F00 | Cierre de alcance y gobierno clínico | En curso | P0 Crítico | 2026-07-08 | 2026-07-12 | 20% | Arquitectura + Delivery + Legal/Médico | PRD, políticas base, matriz de riesgos, criterios de release | Cerrar alcance sin MVP; release productivo con gates de seguridad |
| F01 | Fundación técnica y repositorio | Sin empezar | P0 Crítico | 2026-07-13 | 2026-07-19 | 0% | Dev Jr + Arquitectura | Monorepo, CI/CD, ambientes, lint/test/build, PM2 template | Base limpia para escalar sin deuda técnica inicial |
| F02 | Design system y UX core | Sin empezar | P0 Crítico | 2026-07-15 | 2026-07-26 | 0% | UI Jr + Arquitectura | Tokens, AppShell, ThemeToggle, idioma, componentes accesibles | UX moderna, no genérica, responsive y WCAG 2.2 AA |
| F03 | Auth, RBAC y perfiles | Sin empezar | P0 Crítico | 2026-07-20 | 2026-08-02 | 0% | Backend Jr | Login, roles, permisos dinámicos, superadmin protegido | Rol médico queda bloqueado hasta validación humana |
| F04 | Expediente clínico digital | Sin empezar | P0 Crítico | 2026-07-27 | 2026-08-16 | 0% | Backend + Frontend | Casos, timeline, evidencias, estados, exportación, retención | Eje operativo para IA, reportes y seguimiento |
| F05 | AI Gateway multi-proveedor | Sin empezar | P0 Crítico | 2026-08-03 | 2026-08-23 | 0% | Backend + IA | Proveedor OpenAI-compatible, Claude-compatible, genérico, autorouting, healthcheck, fallback | Admin configura API keys, modelos y prioridades sin tocar código |
| F06 | Guardrails clínicos y motor de decisión | Sin empezar | P0 Crítico | 2026-08-10 | 2026-08-30 | 0% | IA + Médico revisor | Triage, red flags, evidencia mínima, derivación, recomendaciones sintomatológicas | Sin medicamentos controlados; recomendación solo con evidencia suficiente |
| F07 | Consulta conversacional + evidencias | Sin empezar | P0 Crítico | 2026-08-17 | 2026-09-06 | 0% | Frontend + IA | Conversational Care Canvas, uploads, action receipts, confirmaciones | Acciones sensibles requieren confirmación del usuario |
| F08 | Calendario y notificaciones | Sin empezar | P1 Alto | 2026-08-31 | 2026-09-13 | 0% | Fullstack | Recordatorios internos, Google Calendar opcional, Gmail SMTP/API configurable | Notificar por app/correo; escalable a push |
| F09 | Médicos, cédula y validación | Sin empezar | P0 Crítico | 2026-09-01 | 2026-09-20 | 0% | Fullstack + Soporte | Registro médico, cédula, INE/cédula adjunta, estatus En revisión/Activo/Rechazado | Solo médicos activos toman citas |
| F10 | Citas humanas y Google Meet | Sin empezar | P0 Crítico | 2026-09-08 | 2026-09-27 | 0% | Fullstack | Agenda, disponibilidad, asignación, Meet link, reasignación | Cita creada solo después de pago confirmado |
| F11 | Pagos, wallet y contabilidad | Sin empezar | P0 Crítico | 2026-09-15 | 2026-10-11 | 0% | Backend + Contabilidad | Stripe, wallet, webhooks idempotentes, cortes médicos, penalizaciones | Pagos reales, no sandbox para release público |
| F12 | Dashboards Admin/Soporte/Contabilidad | Sin empezar | P1 Alto | 2026-09-22 | 2026-10-18 | 0% | Frontend + Backend | KPIs, configuración, reportes, tickets, anuncios, roles | Operación real con control y trazabilidad |
| F13 | Internacionalización y región | Sin empezar | P1 Alto | 2026-10-01 | 2026-10-18 | 0% | Frontend | ES/EN, detección región/idioma, toggle manual, copy médico localizado | México, EE.UU., LatAm y países de habla inglesa |
| F14 | Seguridad, privacidad y auditoría | Sin empezar | P0 Crítico | 2026-10-05 | 2026-10-25 | 0% | Security + Backend | Cifrado, auditoría, consentimiento, políticas, borrado, backups | Datos de salud sensibles; release gate no negociable |
| F15 | Web médica actualizada y RAG | Sin empezar | P0 Crítico | 2026-10-12 | 2026-11-01 | 0% | IA + Backend | Búsqueda web médica con allowlist, citas, caché, freshness, RAG por caso | Fuentes médicas trazables; no navegar sin control |
| F16 | QA clínico, QA técnico y hardening | Sin empezar | P0 Crítico | 2026-10-26 | 2026-11-22 | 0% | QA + Arquitectura + Médico | Pruebas, adversarial, permisos, rendimiento, accesibilidad | Sin pase con red flags fallidas |
| F17 | Release readiness y salida productiva | Sin empezar | P0 Crítico | 2026-11-23 | 2026-12-06 | 0% | Delivery + Arquitectura | Checklist Go/No-Go, rollback, monitoreo, manuales, soporte | Primera versión pública como release, no MVP |

<!-- END SHEET: Seguimiento -->

---

<!-- BEGIN SHEET: Requerimientos -->

## Requerimientos funcionales y no funcionales

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Requerimientos`  
> **Rango original:** `A1:J55`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| ID | Área | Tipo | Prioridad | Requerimiento | Criterio de aceptación | Estado | Riesgo | Owner | Fuente |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| REQ-001 | Producto | Funcional | P0 Crítico | La app será web/PWA 100% responsiva y usable sin APK. | Funciona en móvil 360px, tablet, laptop y desktop; instalación PWA opcional. | Aprobado | Medio | Frontend | Nota usuario |
| REQ-002 | Producto | Funcional | P0 Crítico | Primera versión pública será release productivo, no MVP. | No se libera sin checklist legal, médico, seguridad, pagos reales y soporte. | Aprobado | Alto | Delivery | Confirmación usuario |
| REQ-003 | UX | No funcional | P0 Crítico | UI moderna, intuitiva, elegante, confiable y no basada en dashboard genérico. | Implementa Conversational Care Canvas, Context Rail, Timeline River, Safety Ribbon y Action Receipts. | Aprobado | Medio | UI/UX | Arquitectura |
| REQ-004 | UX | No funcional | P0 Crítico | Modo claro/oscuro con botón intuitivo en AppShell. | Toggle visible, persiste preferencia y respeta sistema en primer ingreso. | Aprobado | Bajo | Frontend | Confirmación usuario |
| REQ-005 | I18N | Funcional | P1 Alto | La app tendrá español e inglés con toggle manual. | Primer acceso detecta región/idioma; usuario puede cambiar idioma en cualquier momento. | Aprobado | Medio | Frontend | Confirmación usuario |
| REQ-006 | Legal | Funcional | P0 Crítico | Login mostrará disclaimer discreto pero visible de aceptación de políticas. | Texto visible antes de login: al iniciar sesión acepta políticas; enlace a Política de Privacidad. | Aprobado | Alto | Legal/Frontend | Confirmación usuario |
| REQ-007 | Legal | No funcional | P0 Crítico | Se generará Política de Privacidad propia con enlace desde login. | Documento versionado, visible, descargable y registrado en auditoría de aceptación. | Aprobado | Alto | Legal/Admin | Confirmación usuario |
| REQ-008 | IA Clínica | Funcional | P0 Crítico | La IA podrá diagnosticar/orientar clínicamente dentro de límites y guardrails. | Emite diagnóstico orientativo con incertidumbre, evidencia usada, red flags revisados y plan de seguimiento. | Aprobado | Crítico | IA + Médico | Confirmación usuario |
| REQ-009 | IA Clínica | Funcional | P0 Crítico | La IA nunca recetará medicamentos controlados. | Ante posible controlado, deriva a médico humano/físico y genera reporte. | Aprobado | Crítico | IA | Confirmación usuario |
| REQ-010 | IA Clínica | Funcional | P0 Crítico | La IA podrá emitir documento llamado Recomendación Sintomatológica. | Documento incluye disclaimer, evidencia, red flags, recomendaciones OTC si aplica, cuándo suspender y cuándo acudir a urgencias. | Aprobado | Crítico | IA + Backend | Confirmación usuario |
| REQ-011 | IA Clínica | Funcional | P0 Crítico | La IA puede recomendar OTC solo con evidencia suficiente. | Si falta evidencia, pide datos; si hay gravedad o incertidumbre relevante, deriva. | Aprobado | Crítico | IA | Confirmación usuario |
| REQ-012 | Pediatría | Funcional | P0 Crítico | La IA podrá tratar casos de niños bajo guardrails específicos. | Pide edad, peso, tutor, síntomas, tiempo, temperatura y red flags pediátricas; deriva si falta evidencia. | Aprobado | Crítico | IA + Médico | Confirmación usuario |
| REQ-013 | Expediente | Funcional | P0 Crítico | Cada usuario tendrá expediente clínico digital organizado por casos/padecimientos. | Casos tienen timeline, evidencias, documentos, resúmenes, estados y exportación. | Aprobado | Alto | Backend | Notas usuario |
| REQ-014 | Expediente | Funcional | P0 Crítico | Estados de expediente: En análisis, Enfermo(a), Derivado a cita física, En tratamiento, Curado(a), Archivado. | Estados actualizables por usuario o IA con confirmación; cambios quedan auditados. | Aprobado | Medio | Backend | Notas usuario |
| REQ-015 | Retención | Funcional | P0 Crítico | Usuario puede eliminar expedientes en cualquier momento. | Muestra advertencia: si elimina, la IA no podrá recuperar ni usar la información. | Aprobado | Alto | Privacidad | Confirmación usuario |
| REQ-016 | Retención | Funcional | P0 Crítico | Expedientes curados se eliminan después de 6 meses. | Job programado elimina o anonimiza según configuración; evidencia en audit log. | Aprobado | Alto | Backend | Confirmación usuario |
| REQ-017 | Médicos | Funcional | P0 Crítico | Médicos registran número de cédula profesional. | Campo obligatorio; se valida formato y unicidad. | Aprobado | Alto | Backend | Confirmación usuario |
| REQ-018 | Médicos | Funcional | P0 Crítico | Médicos adjuntan INE o cédula para validar identidad. | Archivo cifrado, visible solo para admins/soporte autorizado. | Aprobado | Crítico | Backend/Security | Confirmación usuario |
| REQ-019 | Médicos | Funcional | P0 Crítico | Médicos quedan En revisión hasta validación humana. | No pueden tomar citas hasta que admin/soporte cambie a Activo. | Aprobado | Crítico | Soporte/Admin | Confirmación usuario |
| REQ-020 | Videocita | Funcional | P0 Crítico | Videoconsulta será con Google Meet. | Al pagar cita se crea espacio/link Meet y se asocia a la cita. | Aprobado | Medio | Backend | Confirmación usuario |
| REQ-021 | Pagos | Funcional | P0 Crítico | Pagos reales desde release público. | Stripe en modo live para producción; sandbox solo QA. | Aprobado | Alto | Backend | Confirmación usuario |
| REQ-022 | Pagos | Funcional | P0 Crítico | Wallet permite comprar saldo y consumirlo en citas/servicios. | Movimientos ledger inmutables; saldo calculado por movimientos. | Aprobado | Alto | Backend | Notas usuario |
| REQ-023 | Pagos | No funcional | P0 Crítico | Webhooks de pago deben ser idempotentes. | Evento duplicado no duplica saldo ni cita. | Aprobado | Alto | Backend | Arquitectura |
| REQ-024 | IA Admin | Funcional | P0 Crítico | Dashboard admin permite agregar proveedores IA compatibles con OpenAI, Claude o genérico. | Admin configura nombre, protocolo, base URL, headers, API key, endpoint modelos, estado y prioridad. | Aprobado | Alto | Confirmación usuario | Backend/Admin |
| REQ-025 | IA Admin | Funcional | P0 Crítico | Al guardar API key, la app consulta modelos disponibles. | Se validan credenciales; modelos aparecen para activar/desactivar. | Aprobado | Medio | Backend/IA | Confirmación usuario |
| REQ-026 | IA Routing | Funcional | P0 Crítico | Autorouting usa cualquier cantidad de proveedores, modelos y API keys activas. | Router elige por disponibilidad, salud, costo, latencia, capacidad y policy clínica. | Aprobado | Alto | IA Gateway | Confirmación usuario |
| REQ-027 | IA Routing | No funcional | P0 Crítico | La app debe trabajar sin IA lo que no requiera IA. | CRUD, calendario, pagos, dashboards y exportaciones no dependen de llamadas LLM. | Aprobado | Medio | Arquitectura | Confirmación usuario |
| REQ-028 | IA Routing | Funcional | P0 Crítico | La app iniciará con proveedores como OpenCode/Poolside pero permitirá cualquiera compatible. | No hay acoplamiento a proveedor; base URL/adapter configurable. | Aprobado | Medio | IA Gateway | Confirmación usuario |
| REQ-029 | Web Médica | Funcional | P0 Crítico | Se permitirá búsqueda web médica desde release. | Búsqueda controlada con allowlist, freshness, citas, caché y trazabilidad. | Aprobado | Crítico | IA + Compliance | Confirmación usuario |
| REQ-030 | Notificaciones | Funcional | P1 Alto | Admin configura correo Gmail para enviar notificaciones. | Dashboard admin permite alta/edición/prueba del correo; envío queda auditado. | Aprobado | Medio | Backend/Admin | Confirmación usuario |
| REQ-031 | Notificaciones | Funcional | P1 Alto | Notificaciones pueden enviarse por app y correo. | Citas, recordatorios, soporte, reasignaciones y pagos generan eventos notificables. | Aprobado | Medio | Fullstack | Confirmación usuario |
| REQ-032 | Calendario | Funcional | P1 Alto | Calendario integrado para citas y medicamentos. | Permite recordatorios configurables y vista diaria/semanal/mensual. | Aprobado | Medio | Frontend | Notas usuario |
| REQ-033 | Google Calendar | Funcional | P2 Medio | Permitir conectar Google Calendar del usuario. | OAuth, permisos mínimos, sincronización opcional, desconexión. | Aprobado | Medio | Backend | Notas usuario |
| REQ-034 | WhatsApp | Funcional | P2 Medio | Compartir reportes/resúmenes a contactos de WhatsApp. | Usa share links/deep links seguros; evita enviar datos sensibles sin confirmación. | Aprobado | Alto | Frontend | Notas usuario |
| REQ-035 | Ubicación | Funcional | P2 Medio | Compartir ubicación en tiempo real con enlace temporal. | Expira en 1/4/8/12/24/72h y puede revocarse. | Aprobado | Alto | Backend | Notas usuario |
| REQ-036 | Soporte | Funcional | P1 Alto | Chat/tickets de soporte con resoluciones activas y solucionadas. | Usuario puede crear reportes vinculados a cita, expediente o módulo. | Aprobado | Medio | Fullstack | Notas usuario |
| REQ-037 | Soporte | Funcional | P1 Alto | Soporte puede resolver quejas, ban/desbloqueo, reembolsos/créditos y escalaciones. | Acciones quedan auditadas y notificadas. | Aprobado | Alto | Soporte Dashboard | Notas usuario |
| REQ-038 | Admin | Funcional | P0 Crítico | Admin puede gestionar roles, permisos, planes, costos, Stripe price_id, anuncios y usuarios. | Cambios tienen auditoría y control de permisos. | Aprobado | Alto | Admin Dashboard | Notas usuario |
| REQ-039 | Superadmin | No funcional | P0 Crítico | Debe existir superadministrador que no pueda ser bloqueado por admin. | Regla de negocio y constraint en backend. | Aprobado | Alto | Backend | Notas usuario |
| REQ-040 | Médico Dashboard | Funcional | P1 Alto | Médico gestiona horario, citas, disponibles, pagos y datos bancarios. | CLABE con doble captura y enmascaramiento; recurrencia de pago semanal/quincenal/mensual. | Aprobado | Alto | Fullstack | Notas usuario |
| REQ-041 | Contabilidad | Funcional | P1 Alto | Contabilidad visualiza pagos médicos, cortes, penalizaciones y reportes. | Estados: Pendiente, En revisión, Pagado, Anulado con comentarios según regla. | Aprobado | Alto | Fullstack | Notas usuario |
| REQ-042 | Especialistas | Funcional | P1 Alto | IA determina si requiere especialista y cuál. | Reporte de derivación usa lenguaje médico y especialidad sugerida. | Aprobado | Crítico | IA + Médico | Notas usuario |
| REQ-043 | Nutrición | Funcional | P2 Medio | Pantalla de menús y consejos personalizados según padecimientos. | No contradice restricciones, alergias ni padecimientos; usa evidencia del expediente. | Aprobado | Alto | IA + Frontend | Notas usuario |
| REQ-044 | Suscripciones | Funcional | P1 Alto | Admin configura módulos y límites por plan. | Limita módulos, expedientes activos, consultas al mes y features premium. | Aprobado | Medio | Backend/Admin | Notas usuario |
| REQ-045 | Suscripciones | Funcional | P1 Alto | Admin puede asignar manualmente suscripción y saldo. | Cambios visibles en ledger/auditoría. | Aprobado | Medio | Admin Dashboard | Notas usuario |
| REQ-046 | Deploy | No funcional | P0 Crítico | Desplegable desde GitHub a Debian con PM2 y Cloudflare Tunnel. | Script documentado: clone, env, build, migrate, pm2 start, cloudflared service. | Aprobado | Alto | DevOps | Solicitud usuario |
| REQ-047 | Arquitectura | No funcional | P0 Crítico | Clean code, SOLID, arquitectura modular y documentación mantenible. | Estructura por bounded contexts, ADRs y tests obligatorios. | Aprobado | Medio | Arquitectura | Solicitud usuario |
| REQ-048 | Rendimiento | No funcional | P0 Crítico | Optimizar carga del servidor local Debian; mover al cliente lo que sea seguro y razonable. | SSR/RSC para datos sensibles; client-side para UI no crítica; colas para IA/pagos/notificaciones. | Aprobado | Alto | Arquitectura | Confirmación usuario |
| REQ-049 | Seguridad | No funcional | P0 Crítico | Datos sensibles cifrados y acceso con mínimo privilegio. | Cifrado en reposo para secretos/documentos; logs sin PHI; RBAC auditado. | Aprobado | Crítico | Security | Compliance |
| REQ-050 | Auditoría | No funcional | P0 Crítico | Auditar cambios clínicos, consentimiento, accesos a expediente y acciones admin. | Audit log append-only con usuario, rol, acción, entidad, IP, fecha. | Aprobado | Alto | Backend | Compliance |
| REQ-051 | Accesibilidad | No funcional | P0 Crítico | Cumplimiento WCAG 2.2 AA. | Pruebas automatizadas y manuales por teclado/lector en flujos críticos. | Aprobado | Medio | Frontend/QA | Fuentes |
| REQ-052 | Release | No funcional | P0 Crítico | No se libera si falla un gate clínico, legal, seguridad, pagos o privacidad. | Go/No-Go con firmas responsables. | Aprobado | Crítico | Delivery | Arquitectura |

<!-- END SHEET: Requerimientos -->

---

<!-- BEGIN SHEET: Backlog Release -->

## Backlog de release público

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Backlog Release`  
> **Rango original:** `A1:G17`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| ID | Rol | Historia / Feature | User story | Prioridad | Fase | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| US-001 | Paciente | Iniciar consulta IA con texto/imagen/PDF | Como paciente quiero iniciar una consulta y adjuntar evidencia para recibir orientación clínica contextual. | P0 Crítico | F07 | Sin empezar |
| US-002 | Paciente | Actualizar expediente desde conversación | Como paciente quiero que la IA proponga guardar datos en mi expediente y me pida confirmación. | P0 Crítico | F04/F07 | Sin empezar |
| US-003 | Paciente | Descargar reporte de derivación | Como paciente quiero descargar un reporte claro para llevarlo a consulta física. | P0 Crítico | F04/F06 | Sin empezar |
| US-004 | Paciente | Recibir Recomendación Sintomatológica | Como paciente quiero recibir recomendaciones cuando exista evidencia suficiente y sin receta controlada. | P0 Crítico | F06/F07 | Sin empezar |
| US-005 | Paciente | Eliminar expediente | Como paciente quiero eliminar mi expediente con advertencia de pérdida de contexto. | P0 Crítico | F04/F14 | Sin empezar |
| US-006 | Médico | Registro con cédula y documento de identidad | Como médico quiero registrarme y adjuntar documentos para validar mi perfil. | P0 Crítico | F09 | Sin empezar |
| US-007 | Admin/Soporte | Validar médico | Como soporte/admin quiero validar cédula e identidad y activar al médico. | P0 Crítico | F09 | Sin empezar |
| US-008 | Paciente | Pagar cita y recibir Google Meet | Como paciente quiero pagar una cita y recibir automáticamente el enlace de Meet. | P0 Crítico | F10/F11 | Sin empezar |
| US-009 | Admin | Configurar proveedor IA | Como admin quiero agregar API keys y modelos de cualquier proveedor compatible. | P0 Crítico | F05 | Sin empezar |
| US-010 | Sistema | Autorouting IA | Como sistema quiero enrutar al proveedor/modelo activo más adecuado y hacer fallback. | P0 Crítico | F05 | Sin empezar |
| US-011 | Admin | Configurar Gmail notificador | Como admin quiero configurar el correo Gmail para envío de notificaciones. | P1 Alto | F08 | Sin empezar |
| US-012 | Soporte | Resolver incidencia con crédito | Como soporte quiero compensar con saldo si una incidencia procede. | P1 Alto | F12 | Sin empezar |
| US-013 | Contabilidad | Marcar pago médico | Como contabilidad quiero marcar pagos a médicos y dejar comentarios. | P1 Alto | F11/F12 | Sin empezar |
| US-014 | Usuario | Cambiar idioma y tema | Como usuario quiero cambiar idioma y tema desde la app. | P1 Alto | F02/F13 | Sin empezar |

<!-- END SHEET: Backlog Release -->

---

<!-- BEGIN SHEET: Arquitectura -->

## Arquitectura técnica objetivo

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Arquitectura`  
> **Rango original:** `A1:C15`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| Capa | Decisión | Racional / notas |
| --- | --- | --- |
| Frontend/PWA | Next.js App Router + React + TypeScript | SSR/RSC para datos sensibles; Client Components para interacción local; PWA responsive. |
| UI System | shadcn/ui + Radix/Base UI + Tailwind tokens | Componentes accesibles, open code, theming claro/oscuro, density modes. |
| Backend/API | Node.js TypeScript modular | Bounded contexts: auth, expediente, IA, citas, pagos, notificaciones, admin. |
| DB | PostgreSQL | Relacional para transacciones; JSONB para snapshots clínicos auditables; índices y migrations. |
| Queue | BullMQ/Redis o equivalente | IA, notificaciones, eliminación 6 meses, webhooks, Meet creation. |
| IA Gateway | Adapters OpenAI-compatible, Claude-compatible, genérico | Autorouting, healthcheck, fallback, policy por caso de uso. |
| Files | Storage local cifrado/S3-compatible futuro | Evidencias, INE/cédulas, PDFs; URLs temporales y permisos. |
| Meet | Google Meet API / Calendar conferenceData | Creación de espacio/link al confirmar pago. |
| Payments | Stripe live + sandbox QA | Checkout, price_id configurable, webhooks idempotentes, wallet ledger. |
| Notifications | App events + Gmail configurable | Correo admin-configurable; futuro push/web push. |
| DevOps | GitHub + PM2 + Cloudflare Tunnel en Debian | Sin abrir puertos; process manager; healthchecks; backups. |
| Security | RBAC/ABAC, cifrado, audit logs | Mínimo privilegio y protección de datos sensibles. |

<!-- END SHEET: Arquitectura -->

---

<!-- BEGIN SHEET: IA Routing -->

## Diseño del AI Gateway multi-proveedor

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `IA Routing`  
> **Rango original:** `A1:D9`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| Entidad | Campos clave | Operación | Controles |
| --- | --- | --- | --- |
| Provider | id, name, protocol, base_url, status, priority, timeout_ms, cost_policy, region_policy | Admin CRUD | No almacenar API key en claro. |
| ApiKey | provider_id, encrypted_secret, label, status, rate_limit, last_healthcheck | Admin CRUD | Rotación y revocación. |
| Model | provider_id, model_id, display_name, capabilities, enabled, clinical_allowed, max_tokens | Auto-descubrimiento + selección admin | No todo modelo puede usarse en clínica. |
| RoutingPolicy | use_case, required_capabilities, risk_level, preferred_models, fallback_chain | Admin + arquitectura | Casos clínicos críticos exigen modelos aprobados. |
| Healthcheck | latency, error_rate, quota_state, last_success, degraded_until | Sistema | Ruteo evita proveedores degradados. |
| Audit | request_id, user_id, case_id, model, provider, tokens, policy, outcome | Sistema | Sin registrar PHI en prompts completos salvo entorno cifrado autorizado. |

<!-- END SHEET: IA Routing -->

---

<!-- BEGIN SHEET: Guardrails -->

## Guardrails clínicos obligatorios

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Guardrails`  
> **Rango original:** `A1:E13`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| ID | Guardrail | Regla | Acción del sistema | Severidad |
| --- | --- | --- | --- | --- |
| G-001 | Evidencia mínima | No emitir recomendación sintomatológica si faltan datos esenciales. | Pedir información faltante o derivar. | Crítico |
| G-002 | Red flags | Validar signos de urgencia antes de orientar. | Derivar a urgencias/consulta física. | Crítico |
| G-003 | Controlados | Prohibido recetar controlados. | Explicar que requiere médico humano/físico y reporte. | Crítico |
| G-004 | Pediatría | Niños requieren edad, peso, tutor, duración, temperatura y síntomas clave. | Si falta alguno o hay red flag: derivar. | Crítico |
| G-005 | Embarazo | Si embarazo o sospecha, umbral de derivación sube. | Evitar OTC sin validación robusta. | Alto |
| G-006 | Alergias/interacciones | Antes de OTC debe revisar alergias, enfermedades, medicamentos actuales. | Si no hay datos, preguntar. | Crítico |
| G-007 | Seguimiento | Toda recomendación debe incluir señales para suspender y cuándo buscar atención. | Action receipt + recordatorio opcional. | Alto |
| G-008 | Fuentes | Búsqueda web médica debe citar fuentes y fecha. | Mostrar trazabilidad en detalle técnico/reporte. | Alto |
| G-009 | Privacidad | La IA solo accede al expediente relacionado al caso. | No mezclar padecimientos sin relación. | Crítico |
| G-010 | Humano en el loop | Casos de alto riesgo se derivan a médico humano cuando no sea posible tratar sintomas y requieramos datos de estudios o revisión fisica. | Bloquear recomendación final. | Crítico |

<!-- END SHEET: Guardrails -->

---

<!-- BEGIN SHEET: Checklist -->

## Checklist de delivery y release

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Checklist`  
> **Rango original:** `A1:F17`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| ID | Etapa | Criterio | Prioridad | Estado | Owner |
| --- | --- | --- | --- | --- | --- |
| CL-01 | PRD | Objetivos, alcance release y no objetivos cerrados | P0 | Pendiente | Delivery |
| CL-02 | Legal | Política de privacidad versionada y disclaimer login | P0 | Pendiente | Legal/Admin |
| CL-03 | Legal | Matriz país/región con activación controlada | P0 | Pendiente | Legal |
| CL-04 | Médico | Catálogo red flags adulto/pediátrico | P0 | Pendiente | Médico |
| CL-05 | Médico | Catálogo OTC y reglas de exclusión | P0 | Pendiente | Médico |
| CL-06 | Arquitectura | ADRs aprobados para stack y módulos | P0 | Pendiente | Arquitectura |
| CL-07 | Security | RBAC, cifrado, secretos y auditoría probados | P0 | Pendiente | Security |
| CL-08 | IA | Autorouting, fallback, cuotas y healthchecks | P0 | Pendiente | IA |
| CL-09 | QA | Pruebas adversariales de IA clínica | P0 | Pendiente | QA/Médico |
| CL-10 | Pagos | Stripe live, webhooks idempotentes, rollback | P0 | Pendiente | Backend |
| CL-11 | Meet | Creación de link Meet y reintentos | P0 | Pendiente | Backend |
| CL-12 | UX | Responsive, claro/oscuro, i18n y WCAG 2.2 AA | P0 | Pendiente | Frontend |
| CL-13 | DevOps | PM2, Cloudflare Tunnel, backups y monitoreo | P0 | Pendiente | DevOps |
| CL-14 | Release | Go/No-Go firmado por Delivery, Arquitectura, Médico, Legal | P0 | Pendiente | Dirección |

<!-- END SHEET: Checklist -->

---

<!-- BEGIN SHEET: Riesgos -->

## Registro de riesgos

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Riesgos`  
> **Rango original:** `A1:H13`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| ID | Categoría | Riesgo | Severidad | Probabilidad | Impacto | Mitigación | Fase |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | Clínico | Diagnóstico o recomendación incorrecta por evidencia insuficiente. | Crítico | Alta | Alta | Guardrails, red flags, evidencia mínima, derivación obligatoria, revisión médica de pruebas. | F06/F16 |
| R-002 | Legal | Operar múltiples países sin matriz regulatoria local. | Crítico | Media | Alta | Bloquear activación de país hasta configurar policy pack y revisión legal local. | F00/F14 |
| R-003 | Privacidad | Exposición de datos de salud o identidad médica. | Crítico | Media | Alta | Cifrado, RBAC, audit logs, acceso mínimo, revisión de logs sin PHI. | F14 |
| R-004 | Pagos | Doble saldo por webhook duplicado. | Alto | Media | Alta | Idempotencia por event_id y ledger inmutable. | F11 |
| R-005 | IA | Proveedor IA gratuito se cae o limita uso. | Alto | Alta | Alta | Autorouting multi-proveedor, healthchecks, cola y fallback. | F05 |
| R-006 | Meet | Google Meet API/Calendar OAuth falla. | Medio | Media | Media | Reintentos, fallback a link manual administrado, cola de creación. | F10 |
| R-007 | Performance | Servidor local sobrecargado por IA o SSR excesivo. | Alto | Media | Alta | Client-side seguro, colas, caché, streaming, límites de concurrencia. | F01/F05/F15 |
| R-008 | Pediatría | Recomendaciones en niños sin datos mínimos. | Crítico | Media | Alta | Checklist pediátrico obligatorio y derivación al faltar edad/peso/red flags. | F06 |
| R-009 | Soporte | Médico no validado toma citas. | Crítico | Baja | Alta | Constraint backend: solo status Activo puede tomar citas. | F09/F10 |
| R-010 | UX | La UX parece chatbot genérico y pierde confianza. | Medio | Media | Media | Patrones propios, pruebas de usabilidad y contenido empático. | F02/F07 |

<!-- END SHEET: Riesgos -->

---

<!-- BEGIN SHEET: Decisiones -->

## Decisiones de arquitectura/producto

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Decisiones`  
> **Rango original:** `A1:E15`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| ID | Tema | Decisión | Estado | Notas |
| --- | --- | --- | --- | --- |
| D-001 | Jurisdicción inicial | México, Estados Unidos, LatAm y países de habla inglesa con detección de región/idioma. | Cerrada | Requiere policy packs por país antes de activación real. |
| D-002 | Disclaimer login | Mostrar aceptación de políticas al iniciar sesión con enlace visible. | Cerrada | Debe guardar versión aceptada por usuario. |
| D-003 | Alcance clínico | IA puede diagnosticar/orientar y emitir Recomendación Sintomatológica, sin controlados y con guardrails. | Cerrada | Gate de seguridad clínica obligatorio. |
| D-004 | Validación médicos | Cédula + INE/cédula adjunta; estatus En revisión hasta validación humana. | Cerrada | Admin/soporte activan manualmente. |
| D-005 | Videollamada | Google Meet. | Cerrada | Usar Meet API o Calendar conferenceData según viabilidad. |
| D-006 | IA | Proveedor dinámico: OpenAI-compatible, Claude-compatible o genérico; N API keys/modelos. | Cerrada | Autorouting por disponibilidad/política. |
| D-007 | Retención | Usuario puede eliminar; curados se eliminan a 6 meses. | Cerrada | Advertencia clara antes de borrar. |
| D-008 | Notificaciones correo | Gmail configurable por admin. | Cerrada | Usar OAuth/app password según decisión técnica segura. |
| D-009 | Búsqueda web médica | Sí desde release. | Cerrada | Allowlist y citas obligatorias. |
| D-010 | Pagos | Reales en release público; sandbox solo QA. | Cerrada | Go-live con checklist financiero. |
| D-011 | Pendiente legal | Validación final por abogado/asesor sanitario por país. | Pendiente no bloqueante para documentación | No libera producción sin revisión. |
| D-012 | Pendiente médico | Definir catálogo médico inicial de red flags, OTC y reglas pediátricas. | Pendiente de fase | Debe cerrarse en F06 antes de QA clínico. |

<!-- END SHEET: Decisiones -->

---

<!-- BEGIN SHEET: Compliance -->

## Matriz de cumplimiento por región

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Compliance`  
> **Rango original:** `A1:E7`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| Región | Tema | Referencia base | Decisión operativa | Riesgo |
| --- | --- | --- | --- | --- |
| México | Datos salud sensibles, expediente clínico, privacidad, receta/recomendación | LFPDPPP, Ley General de Salud, NOM-004, NOM-024 | Activable con revisión legal/médica local | Alto |
| Estados Unidos | HIPAA/FTC/FDA CDS, licenciamiento estatal, telehealth | HHS health apps, FDA CDS guidance | Activar con BAA/vendor/legal si aplica | Crítico |
| LatAm | Datos sensibles y telemedicina varían por país | Policy pack por país | No activar país sin revisión local | Alto |
| Países habla inglesa | Privacidad, consumer health data, telehealth local | Policy pack por país/estado | Activación progresiva | Alto |

<!-- END SHEET: Compliance -->

---

<!-- BEGIN SHEET: Prompts -->

## Índice de prompts para OpenCode/AionUI/IA Jr

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Prompts`  
> **Rango original:** `A1:C19`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| Archivo | Propósito | Uso recomendado |
| --- | --- | --- |
| 00_master_orquestador.md | Orquestación general de desarrollo con IA Jr | Arquitectura |
| 01_repo_base.md | Inicialización de monorepo, estándares, CI | Dev Jr |
| 02_design_system_ui.md | Design system, AppShell, theme toggle, i18n | UI Jr |
| 03_auth_rbac.md | Auth, RBAC, permisos dinámicos, superadmin | Backend Jr |
| 04_medical_record.md | Expediente clínico, timeline, evidencias, retención | Fullstack Jr |
| 05_ai_gateway.md | Gateway multi-proveedor, modelos, keys, autorouting | Backend IA |
| 06_clinical_guardrails.md | Guardrails, triage, red flags, recomendaciones | IA/Médico |
| 07_conversational_care.md | Chat clínico, uploads y action receipts | Frontend IA |
| 08_calendar_notifications_gmail.md | Calendario, Gmail, recordatorios | Fullstack Jr |
| 09_doctor_verification_meet.md | Médicos, validación, citas, Google Meet | Fullstack Jr |
| 10_payments_wallet_accounting.md | Stripe, wallet, pagos médicos, contabilidad | Backend Jr |
| 11_admin_support_dashboards.md | Admin, soporte, contabilidad | Fullstack Jr |
| 12_i18n_release_regions.md | Traducción ES/EN y detección de región | Frontend Jr |
| 13_deploy_pm2_cloudflare.md | Deploy Debian + PM2 + Cloudflare | DevOps Jr |
| 14_qa_security_clinical.md | QA técnico, clínico, seguridad, accesibilidad | QA Jr |
| 15_review_refactor_senior.md | Revisión senior y refactor incremental | Arquitectura |

<!-- END SHEET: Prompts -->

---

<!-- BEGIN SHEET: Fuentes -->

## Fuentes investigadas / referencias

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Fuentes`  
> **Rango original:** `A1:C25`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Tabla principal

| Fuente | Uso | URL |
| --- | --- | --- |
| WCAG 2.2 | Accesibilidad web | https://www.w3.org/TR/WCAG22/ |
| WAI WCAG Overview | Principios y niveles de conformidad | https://www.w3.org/WAI/standards-guidelines/wcag/ |
| Material Design 3 Dynamic Color | Temas claro/oscuro y color dinámico | https://m3.material.io/styles/color/dynamic |
| shadcn/ui | Componentes accesibles y enfoque open code | https://ui.shadcn.com/docs |
| Radix Primitives | Primitivas accesibles para React | https://www.radix-ui.com/primitives |
| Base UI | Componentes accesibles sin estilos | https://base-ui.com/ |
| Google Meet API | Crear y administrar espacios Meet | https://developers.google.com/workspace/meet/api/guides/overview |
| Google Meet spaces | Gestión de meeting spaces | https://developers.google.com/workspace/meet/api/guides/meeting-spaces |
| Cloudflare Tunnel Linux service | Tunnel como servicio Linux | https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/as-a-service/linux/ |
| Cloudflare published apps | Publicar apps locales por hostname | https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/ |
| Node.js releases | Usar Active/Maintenance LTS en producción | https://nodejs.org/en/about/previous-releases |
| PM2 | Process manager para Node | https://pm2.keymetrics.io/ |
| PostgreSQL JSONB | JSON/JSONB para datos clínicos estructurados | https://www.postgresql.org/docs/current/datatype-json.html |
| HHS health apps | Guía para apps de salud y leyes federales US | https://www.hhs.gov/hipaa/for-professionals/special-topics/health-apps/index.html |
| FDA CDS 2026 | Clinical Decision Support guidance | https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software |
| WHO LMM health AI | Ética y gobernanza de IA generativa en salud | https://www.who.int/publications/i/item/9789240084759 |
| LFPDPPP México | Protección de datos personales en particulares | https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf |
| Ley General de Salud México | Marco general salud | https://www.diputados.gob.mx/LeyesBiblio/pdf_mov/Ley_General_de_Salud.pdf |
| NOM-004-SSA3-2012 | Expediente clínico | https://dof.gob.mx/nota_detalle_popup.php?codigo=5272787 |
| NOM-024-SSA3-2012 | Sistemas de información de registro electrónico en salud | https://www.dgis.salud.gob.mx/descargas/normatividad/normas/DOF-30NOV12-NOM-024-SSA3-2012.pdf |
| OpenAI API Models | Modelos y API | https://developers.openai.com/api/docs/models |
| Anthropic Claude docs | Modelos Claude/API | https://platform.claude.com/docs/en/about-claude/models/overview |

<!-- END SHEET: Fuentes -->

---

<!-- BEGIN SHEET: Notas Originales -->

## Notas originales consolidadas

> **Archivo fuente:** `App_Medica_Project_Tracker_v2.xlsx`  
> **Pestaña fuente:** `Notas Originales`  
> **Rango original:** `A1:B27`  
> **Codificación:** UTF-8  
> **Conversión:** se conserva el orden de filas y columnas del XLSX.

### Estructura

Cada bloque corresponde a una fila de la pestaña original. Se usa formato por secciones porque las notas son extensas y una tabla Markdown reduciría su legibilidad para agentes de IA.

### Nota 01 — 2026-06-07

- **Fila original:** `4`
- **Fecha:** `2026-06-07`

App multiplataforma (Web, Android)

### Nota 02 — 2026-06-07

- **Fila original:** `5`
- **Fecha:** `2026-06-07`

Debe contar con una pantalla con interfaz amigable similar a la dinamica de whatsapp que permita enviar texto, imagenes, pdf. que permita la interacción natural, dinamica y fluida entre el usuario y la IA para llevar a cabo, consultas médica virtual, inicio, actualización, seguimiento, recordatorios de expedientes medicos. El usuario podrá interactuar con esta interfaz como si se tratara de un médico, podrá iniciar conversaciónes para consultar algun sintoma o dar seguimiento a algún tratamiento o enfermedad en la que se encuentre, la IA analizará la petición del usuario, realizará las preguntas que necesite para clarificar la información, podrá consultar la base de datos del usuario para conocer el estatus previo, si ya existe seguimiento o RAG del padecimiento, sintoma, mejoria, empeoramiento, conocer el momento para acudir a sus citas, agregar recordatorios que queden agendados y notifiquen al usuario ya sea sobre citas o medicamentos, sin necesidad de que el usuario tenga conocimiento tecnico o medico, durante el tiempo de cada "Consulta virtual" la IA podrá acceder al "Expediente Digital" del usuario, para realizar operaciónes CRUD y conocer el estado actual o hacer cambios confirmando al usuario antes de ejecutar la acción y tener siempre un RAG o BD del conocimiento e historial clinico del usuario para mejorar la calidad y precision de la ayuda médica. Deberá poder llevar al usuario al cuidado, mejoria del padecimiento o sintoma, tranquilizar, o recomendar cuando ya es momento para acudír a consulta medica fisica basandose en la conversación actual y en el historial del usuario. Podrá recomendar medicamentos (nunca recetar) siempre y cuando sean de estricto uso libre (en caso contrario ser honesto con el usuario y recomendar el medicamento de receta pero mencionar que es con receta controlado y debe acudir a cita médica fisica para que un médico lo recete (dando posibilidad de descargar el reporte de derivación a cita fisica)) y absolutamente necesarios por estar bien identificado el sintoma, por mencionar algunos sin limitar: Antihistaminicos, antiinflamatorios, jarabes, acido acetilsalicilico, paracetamol, ibuprofeno, lactulosa, senosidos, etc, entendiendose toda la gama medicamentosa de venta libre cuando el padecimiento haya quedado claro y pueda ser tratado bajo sintomatología con el debido seguimiento en la app (conduciendo al alivio eficaz y recomendando cita fisica cuando por el seguimiento y los sintomas, no se vea mejoría en el usuario), "cerrando" o marcando como "Curado" un padecimiento cuando ya haya resuelto el malestar, enfermedad o padecimiento, o cuando el usuario deje de cencionar el padecimiento de un caso que lleve mas de 6 meses sin actualizarse. Debe ser inteligente, funcional, util, sincero, hablar de forma muy humana y amable, brindando cercania, confort, contar con un "médico amigo" y consejos que de verdad ayuden a aliviar, curar y derivar cuando ya lo amerita en verdad y se tiene suficiente evidencia o llevar el control cuando el usuario ya tiene un diagnostico medico (fisico) y desea llevar el seguimiento de sus medicamentos, control de avance, y tratamiento en la app. Debe contar con un "chat" de soporte que permita consultar las resoluciones de reportes activos y/o solucionados, levantar nuevos reportes (tener la posibilidad de relacionarlo a algun expediente, cita, módulo de la app, etc) y hablar con soporte tanto en vivo como de forma asincrona. Contar con una pantalla de wallet o billetera que permita poder comprar crédito de la app y visualizar el crédito restante (el credito podrá ser comprado con elementos de stripe los cuales serán configurados por los usuarios administradores y se irá agotando según sea usado (ej. en citas medicas humanas virtuales)) el usuario podrá elegir el metodo de pago en caso de contar con saldo en su wallet, podrá seleccionarlo o elegir el elemento configurado para el costo de esa cita (botón que tenga relacionado un price_id de stripe que redirigirá a stripe o que cobrará con integracion de stripe a la app) y en caso de no tener saldo en wallet, solo dar la opcion con stripe. debe de contar tambien con un historial de conversaciónes, independientemente de que toda la información vaya actualizando y se guarde en cada expediente medico que corresponda.

### Nota 03 — 2026-06-07

- **Fila original:** `6`
- **Fecha:** `2026-06-07`

Debe contar con un calendario integrado que te envíe notificaciónes cuando estén cerca citas, recordatorios, horario de medicamentos, etc.

### Nota 04 — 2026-06-07

- **Fila original:** `7`
- **Fecha:** `2026-06-07`

Permitir compartir, archivos, evidencias, fotos, diagnosticos, reportes, recordatorios, etc a N cantidad de contactos de whatsapp para mejorar distribución de información con resumen inteligente y breve sobre la información. Permitir agregar contactos desde agenda o por número a los que se desee agregar como grupo de notificaciónes y despues con un botón se comparta la información a todos los contactos de la lista.

### Nota 05 — 2026-06-07

- **Fila original:** `8`
- **Fecha:** `2026-06-07`

Permitir compartir la ubicación en tiempo real generando un enlace de visualización que expire en 1, 4, 8, 12, 24, o 72 horas.

### Nota 06 — 2026-06-07

- **Fila original:** `9`
- **Fecha:** `2026-06-07`

Permitir que el usuario envíe foto, pdf o datos sobre los medicamentos que debe tomar, cada cuanto tiempo los debe tomar, y cuando va a iniciar el primero, y si debe tomarlos juntos o con cierto tiempo de separación entre cada uno y agregar recordatorios al calendario con notificaciónes reales para el usuario con tiempos configurables (ej. para citas médicas con recordatorios a 2 días, 1 día, 5,4,3,2,1 horas, para medicamentos, 10, 5, 1 minutos.)

### Nota 07 — 2026-06-07

- **Fila original:** `10`
- **Fecha:** `2026-06-07`

Debe evitar frases como "Soy una IA y no puedo darte un diagnostico", "te recomiendo consultar con tu médico", "no puedo proporcionarte esa información", entre otras que coarten la capacidad de la aplicación para brindar el apoyo, seguimiento, acompañamiento, diagnosticos, recomendaciónes médicas, y recomendación de consultas físicas cuando en verdad sean necesarias y se tenga la evidencia para ello, proporcionando al usuario la posibilidad de descargar el reporte completo de todo el seguimiento necesario para ese padecimiento que requiera seguimiento con un médico "humano" (Sin mencionar si no es necesario otras consultas o información de padecimientos o consultas previas que no estén relacionadas al padecimiento actual que se deriva a consulta fisica y mencionando todo lo que si esté relacionado) para que el medico fisico pueda ahorrar tiempo y conocer todo el seguimiento, prediagnostico o sospechas clinicas y revisiones o tratamientos recomendados por derivación y directo.

### Nota 08 — 2026-06-07

- **Fila original:** `11`
- **Fecha:** `2026-06-07`

Debe tener una pantalla con el calendario y/o permitir además conectar el calendario de google con el del usuario para permitirle añadir eventos, notificaciónes, citas, recordatorios. El usuario podrá agregarlos desde la app o se podrán crear derivados de cada "consulta medica virtual"

### Nota 09 — 2026-06-07

- **Fila original:** `12`
- **Fecha:** `2026-06-07`

Debe tener una pantalla del historial clinico del usuario, en donde se encuentren el o los diversos expedientes medicos de cada padecimiento registrado, para permitirle al usuario llevar un control, descargar el expediente, el reporte clinico y de derivación a cita fisica (el cual debe poderse descargar desde esta pantalla o desde la conversación cuando así se necesite o solicite en la primer pantalla mencionada (Cita virtual)), cada expediente medico deberá estar cuidadosamente organizado cronologicamente, contener las notas reelevantes, resumenes, evidencias, documentos, y todo lo que el usuario y la IA vayan recabando de cada caso, así como su estatus (En análisis, Enfermo(A), derivado a cita fisica, en tratamiento, curado(a)), y permitir que el usuario pueda actualizar el estatus manualmente o a travez de las conversaciónes con la IA (De igual manera se puede cambiar de curado a enfermo si la IA detecta nuevamente el padecimiento siempre y cuando se derive del mismo padecimiento (ej. si se contrae gripa y fue curado pero, en días posteriores los sintomas vuelven, se debe retomar a enfermo o en tratamiento segun resulte el caso, pero, si se contrajo gripa y despues de 2 meses se regresan los sintomas, sería entonces una nueva gripa y no la misma de la vez pasada por lo que deberá tratarse como nuevo padecimiento). De igual manera se podrá permitir compartir el expediente completo por whatsapp a todos sus contactos de agenda que el usuario elija.

### Nota 10 — 2026-06-07

- **Fila original:** `13`
- **Fecha:** `2026-06-07`

Debe permitir agregar una evidencia (ejemplo: una foto) y si la IA detecta que no tiene contexto, ser lo suficientemente util e inteligente para preguntarle al usuario si se trata de un padecimiento o seguimiento que ya tenga (y en caso afirmativo se añada la o las evidencias al expediente del usuario para su seguimiento, consulta y resguardo, si el usuario continua enviando, permitirle enviar las que necesite y despues preguntar si ya envió toda la información y al recibir la respuesta confirmatoria preguntar lo que falte, contexto, datos, para saber si es nuevo caso o si se desea agregar a un expediente existente (ayudando al usuario sin entorpecer el acumular, agregar o aumentar la información en cada caso)

### Nota 11 — 2026-06-07

- **Fila original:** `14`
- **Fecha:** `2026-06-07`

Permitir guardar expedientes de casos durante el tiempo necesario hasta que se encuentren como "curado" al menos 6 meses

### Nota 12 — 2026-06-07

- **Fila original:** `15`
- **Fecha:** `2026-06-07`

Contar con una pantalla que permita agendar una "cita humana virtual" en donde se podrá establecer un costo (desde dashboard admin) y donde medicos humanos podrán llevar a cabo una cita virtual con el usuario para un mejor seguimiento estilo meet o videollamada.

### Nota 13 — 2026-06-07

- **Fila original:** `16`
- **Fecha:** `2026-06-07`

Debe contar con un dashboard para administradores, que permita realizar las configuraciones de la app como costos, apikeys de IAs actuales (podrá trabajarse con N cantidad de apikeys y si alguna no estuviese disponible trabajar con la siguiente, permitiendo trabajar con cualquier proveedor compatible con openIA, claude, generico, y permitir consultar los modelos disponibles para que el administrador pueda seleccionar uno o varios modelos de los disponibles por cada proveedor y se realice un autorouting en la app para usar la IA y modelo disponible), visualizar la cantidad de usuarios, graficas de uso y rendimiento actuales, en tiempo real, por día, semana, mes y año. Configurar los price_id de stripe para cada elemento con costo (por ejemplo suscripciones en cualquier nivel, citas humanas virtuales, apartados premium, etc), visualizar y copiar el webhook actual que debe estar configurado en stripe para el correcto funcionamiento de los pagos en la app. Configuración para modificar permisos para los roles de usuarios como (Paciente, Medico, Soporte, Contabilidad, cualquier otro necesario), permitir añadir mas usuarios manualmente y asignarles un rol incluyendo paciente, medico, administrador, permitir banear, suspender, desbloquear, a cualquier usuario en la app (debe existir un superadministrador que no pueda ser bloqueado por un administrador para proteger la integridad del propietario). Debe poder enviar notificaciónes a algún usuario, o a N cantidad de usuarios o a todos los usuarios de la app y que se muestre en la app, como notificación aunque la app esté cerrada, y como notificaciónes toast. debe poder establecer un anuncio que quede fijado en la app durante un periodo de tiempo (ejemplo: un mensaje de aviso de mantenimiento que dure desde y hasta que se establezca en el dashboard). Debe poder asignar, habilitar la autoasignación, o reasignar citas para un usuario médico.

### Nota 14 — 2026-06-07

- **Fila original:** `17`
- **Fecha:** `2026-06-07`

Debe contar con un dashboard para el médico, que le permita visualizar cuantas citas tiene agendadas (puede haber n cantidad de médicos) poder ingresar a cada "Cita virtual" misma que podrá desarrollarse nativamente en la app o en un google meet que sea creado por la app cuando sea agendada la cita (y haya sido pagada). Debe poder establecer su horario de trabajo (la app debe poder asignar las citas a medicos que se vayan a encontrar dentro de su horario de trabajo de forma autonoma a no ser que algún administrador o soporte reasigne la cita), debe poder enviarle notificaciónes aunque la app esté cerrada cuando su horario vaya a iniciar para que se conecte. tambien podrá rechazar alguna cita colocando el motivo para que sea reasignada de forma autonoma a cualquier medico con diponibilidad, o reasignada por un administrador o soporte cuando se encuentre como "sin médico". Podran acceder a otro módulo "Citas disponibles" que muestre las siguientes citas de los proximos 3 días que se encuentren "Sin Médico" para tomar la cita y asignarse alguna cita disponible, visualizar la cantidad de citas del día, semana, mes, año, así como el pago cobrado, pendiente, y proximo calculado por sus citas llevadas a cabo. poder observar incidencias y si esto conllevó alguna penalización economica (ejemplo, un usuario reporta al médico porque no se conectó a la cita, soporte determina que el médico no dió clic al botón para ingresar al meet y por lo tanto no tomó la reunion entonces penaliza al medico disminuyendo esa cita de su balance para proximo pago, soporte podrá reagendar la cita para el usuario sin perjuicio para el usuario enviandole notificaciónes). Debe tener una pantalla para agregar sus datos bancarios con minimo Banco, CLABE, Nombre completo. debe de tener doble validación para la CLABE para evitar errores (ocultando la CLABE durante la confirmación). debe poder elegír sus fechas de pago, Semanal, quincenal, mensual (el médico podrá cambiar la recurrencia siempre, sin embargo surtirá efectos hasta pasado el ultimo corte vigente)

### Nota 15 — 2026-06-07

- **Fila original:** `18`
- **Fecha:** `2026-06-07`

Debe contar con un dashboard para soporte, que permita realizar seguimiento de actividades tanto de usuarios como medicos, problemas de pago, incidencias con la app, reportes de Ban/desbloqueo de usuarios, medicos, etc. Solución a reportes relacionados a quejas de usuarios, reportes de usuarios hacia medicos, analizar motivos y evidencias, emitir una resolución, notificar al usuario aunque la app esté cerrada, recompensarlo (con por ejemplo credito en la app por el monto que soporte elija). Deben poder hacer ajustes y configuraciónes necesarias suficientes para solucionar, corregir, solventar o escalar a administradores alguna incidencia reportada. Visualizar reportes e información estrictamente necesaria para atender reportes de o hacia Contabilidad.

### Nota 16 — 2026-06-07

- **Fila original:** `19`
- **Fecha:** `2026-06-07`

Debe contar con un dashboard para usuario "Contabilidad" al cual le permita visualizar los datos bancarios para los usuarios (para realizar los pagos por vía transferencia a los usuarios (deben poder marcar el pago como "Pendiente", "En revisión", "Pagado", "Anulado" siempre con la posibilidad de agregar un comentario que podrá ser visualizado por el usuario médico en el desgloce de cada pago en cada corte de acuerdo a la recurrencia de pago seleccionada por el médico, en el caso de "Pagado" o "Pendiente" se podrá modificar sin necesidad de agregar un comentario)). podrán visualizar los movimientos realizados para el médico, tambien penalizaciónes y el motivo del descuento en caso de haber sido penalizado por soporte, así como visualizar el total despues de penalizaciónes (no necesitará agregar mayores comentarios ya que el médico podrá visualizar el motivo del descuento o penalización en el desgloce del pago en la app con el comentario de soporte) a no ser que el usuario Contabilidad cambie el estatus a En revision o Anulado. Deben poder visualizar cuales son los usuarios del día a pagar con el desgloce completo, así mismo los de los próximos días (hasta 3 meses en caso de necesitarlo). poder consultar, visualizar, descargar el reporte de los pagos con el desgloce de cual usuario de contabilidad realizó el pago con un tiempo de hasta 1 año.

### Nota 17 — 2026-07-07

- **Fila original:** `20`
- **Fecha:** `2026-07-07`

Debe contar con una pantalla para contar con menús alimenticios, consejos de cuidados especificos y personalizados de acuerdo al o a los padecimientos actuales del usuario; debe ser proactivo sin necesidad de que el usuario lo esté pidiendo pero tambien generar menús acordes a lo que pida el usuario pero que sean aptos para él.

### Nota 18 — 2026-07-07

- **Fila original:** `21`
- **Fecha:** `2026-07-07`

debe permitir a los administradores seleccionar los modulos y funciones a los que se tendrá acceso con cada plan de suscripción; permitiedo limitar tanto modulos y funcionalidades como cantidad por ejemplo de expedientes activos, consultas por mes (excepto consultas medicas humanas virtuales que serán ilimitadas previo pago).

### Nota 19 — 2026-07-07

- **Fila original:** `22`
- **Fecha:** `2026-07-07`

Si el usuario necesita la atención o derivación con un medico "especialista" y no solo un medico general, debe de poder determinar cual, y siempre creando el reporte de derivación para cualquier médito en lenguaje médico actual, técnico moderno y especificar correctamente siempre cualquier situación o mencion necesaria.

### Nota 20 — 2026-07-07

- **Fila original:** `23`
- **Fecha:** `2026-07-07`

debe de poder ser capaz de utilizar las apikeys de IA solo para lo que si es necesario, y trabajar sin IA lo que no la necesite, ahorrando recursos y mejorando la velocidad, rendimiento y respuesta de la app.

### Nota 21 — 2026-07-07

- **Fila original:** `24`
- **Fecha:** `2026-07-07`

debe de poderse actualizar tanto web como app android de forma automática sin necesidad de que el usuario tenga que volver a descargar el apk para el caso de la app android.

### Nota 22 — 2026-07-07

- **Fila original:** `25`
- **Fecha:** `2026-07-07`

Debe permitir que un administrador le otorgue a algun usuario un estado de suscripción mayor o menor, asignar saldo de la app, etc.

### Nota 23 — 2026-07-07

- **Fila original:** `26`
- **Fecha:** `2026-07-07`

De ser posible, debe permitir que la IA busque en internet para obtener respuestas actuales. en caso de recomendar medicamentos, de acuerdo al lugar de residencia (guardado en el expediente general del usuario) y al presupuesto del usuario debe recomendar medicamentos tanto de patente como genericos cuando sea posible, a no ser que, por el padecimiento o por ser estrictamente necesario, deberá poder recomendar el uso de medicamento de patente y explicar el porque.

### Nota 24 — 2026-07-07

- **Fila original:** `27`
- **Fecha:** `2026-07-07`

debe de mostrar en el dashboard principal, donde el usuario podría iniciar una nueva conversación, un mensaje agradable y dinamico similar a "Excelente tarde {nombre de usuario} ¿como te ayudaré el día de hoy?" o similares. y como texto secundario sin confundir, una frase que de motivación, apoyo, empatico, agradable, calido, que siempre brinde apoyo, cercania, confianza, etc, podrá ser un banco de frases que cubra al menos un minimo de 365 frases y un promedio de 1000 frases para evitar repeticiónes tan recurrentes hasta que pasen las que no han pasado.

<!-- END SHEET: Notas Originales -->
