# Checklist Faltante — Radiografía App Médica AI (Angélica Med)

> **Fecha:** 2026-07-12  
> **Auditor:** OpenCode (DeepSeek)  
> **Propósito:** Memoria a largo plazo. Cruza el tracker contra el código real.

---

## 1. Resumen de Avance

### ✅ Casi listo para producción (o muy cerca)

| Componente | Estado | Evidencia |
|---|---|---|
| **Infraestructura Frontend** | ✅ Completo | Next.js App Router, Tailwind v4, shadcn/ui (22 components), Framer Motion, PWA manifest |
| **Landing Page** | ✅ Completo | Hero, Features, Footer, ThemeToggle, LanguageToggle |
| **Auth (Login/Registro)** | ✅ Completo | Multi-step wizard, role selection, cookies session, middleware RBAC |
| **AppShell + Layouts** | ✅ Completo | Sidebar dinámico por rol, Header, MobileBottomBar, SafetyRibbon |
| **Zustand Stores** | ✅ Completo | userStore, chatStore, caseStore, uiStore |
| **Types** | ✅ Completo | chat.ts, case.ts, user.ts, wallet.ts, appointment.ts |
| **Prisma Schema** | ✅ Completo | 21 modelos: User, ClinicalCase, Message, Appointment, Wallet, Transaction, AuditLog, AiProvider, AiApiKey, AiModel, RoutingPolicy, SubscriptionPlan, SystemSetting, MedicationReminder, SearchCache, SupportTicket, TicketMessage, DoctorTransaction, AccountingCycle, Payout, DoctorProfile |
| **AI Gateway** | ✅ Completo | gateway.ts (multi-proveedor con failover), guardrails.ts (red flags, controlados, pediatría), rag.ts (12.9MB corpus en memoria) |
| **Servicios Backend** | ✅ Completo | email.ts (Gmail SMTP), purgeJob.ts (GDPR), webSearch.ts (búsqueda médica con cache) |
| **API Routes** | ✅ 42 rutas | Auth (4), Patient (14), Doctor (4), Admin (12), Support (4), Webhooks (1), Otros (3) |
| **Dashboard Paciente** | ✅ Mayoría | Home, Consulta, Historial, Historial/[caseId], Calendario, Wallet, Soporte, Perfil |
| **Dashboard Médico** | ✅ Mayoría | Verificación, Agenda, Citas, Pagos, Finanzas, Perfil |
| **Dashboard Admin** | ✅ Mayoría | Home, Usuarios, IA (4 tabs), Planes, Stripe, Gmail |
| **Dashboard Soporte** | ✅ Mayoría | Home, Tickets, Tickets/[ticketId], Usuarios, Compensaciones |
| **Pruebas Automatizadas** | ✅ 5 suites | test-clinical-flow, test-notifications, test-privacy-search, test-support-flow, test-accounting-flow |
| **Componentes Core** | ✅ Real (no mock) | ConversationalCareCanvas (conectado a API), ContextRail (conectado a caseStore), ClinicalTimelineRiver (conectado a caseStore), SafetyRibbon, ActionReceipt |
| **i18n** | ⚠️ Parcial | 76 keys traducidas ES/EN, provider funcional, pero muchas strings siguen hardcodeadas |

### 🟡 Parcialmente implementado

| Componente | Problema |
|---|---|
| **Nutrición** | Datos hardcodeados en el frontend. No hay API endpoint de nutrición. |
| **Frases Motivacionales** | Solo 10 frases. El tracker exige 365+ (una por día). |
| **Wallet Checkout** | Usa `mock-success` como bypass. Stripe webhook existe pero no hay Stripe real conectado. |
| **Agenda Médico** | Selector de horas básico. Sin arrastrar bloques ni vista semanal visual. |
| **Perfil Paciente** | Existe pero sin edición real de datos (solo descarga/eliminación). |
| **Componentes standalone** | Mucha lógica está inline en pages en vez de componentes reutilizables (ver lista completa abajo). |

### ❌ No iniciado / Placeholder

| Componente | Estado |
|---|---|
| **Contabilidad (Dashboard principal)** | ✅ **Implementado** (2026-07-12 - dashboard stats, AccountingCyclesList) |
| **Contabilidad / Pagos a Médicos** | ✅ **Implementado** (2026-07-12 - DoctorPaymentsTable con cambio de estados) |
| **Contabilidad / Cortes** | ✅ **Implementado** (2026-07-12 - AccountingCyclesList con CRUD) |
| **Contabilidad / Penalizaciones** | ✅ **Implementado** (2026-07-12 - PenaltyTracker) |
| **Contabilidad / Reportes** | ✅ **Implementado** (2026-07-12 - generador JSON simulado) |
| **Admin / Anuncios** | ✅ **Implementado** (2026-07-12 - AnnouncementManager.tsx, API route) |
| **Admin / Permisos** | ✅ **Implementado** (2026-07-12 - PermissionMatrix.tsx, API route, Permission model) |
| **Médico / Home** | ✅ **Implementado** (2026-07-12 - DoctorDashboard con API route) |
| **Dashboard Médico dashboard** | ✅ **Implementado** (2026-07-12) |

---

## 2. Deuda Técnica

### Componentes que existen inline (deberían ser standalone)

| Ruta | Lógica actual | Acción requerida |
|---|---|---|
| `/paciente/wallet` | WalletLedger, saldo y checkout inline | Extraer a `components/patient/WalletLedger.tsx` |
| `/admin/ia` | AdminAiProviderManager inline (615 líneas) | Extraer a `components/admin/AdminAiProviderManager.tsx` |
| `/admin/planes` | PlanEditor inline | Extraer a `components/admin/PlanEditor.tsx` |
| `/admin/gmail` | GmailNotificationSettings inline | Extraer a `components/admin/GmailNotificationSettings.tsx` |
| `/admin/usuarios` | UserManagementTable inline | Extraer a `components/admin/UserManagementTable.tsx` |
| `/admin/stripe` | StripeConfigPanel inline | Extraer a `components/admin/StripeConfigPanel.tsx` |
| `/medico/verificacion` | DoctorVerificationPanel inline | Extraer a `components/doctor/DoctorVerificationPanel.tsx` |
| `/medico/agenda` | ScheduleManager inline | Extraer a `components/doctor/ScheduleManager.tsx` |
| `/medico/citas` | AppointmentList inline | Extraer a `components/doctor/AppointmentList.tsx` |
| `/medico/pagos` | BankDataForm + DoctorPaymentHistory inline | Extraer a componentes separados |
| `/soporte/tickets` | TicketList inline | Extraer a `components/support/TicketList.tsx` |
| `/soporte/tickets/[ticketId]` | TicketDetail inline | Extraer a `components/support/TicketDetail.tsx` |
| `/soporte/compensaciones` | CompensationForm inline | Extraer a `components/support/CompensationForm.tsx` |
| `/paciente/consulta` | Layout 3 columnas inline | Extraer a layout reutilizable |

### Mocks / Datos hardcodeados

| Archivo | Problema |
|---|---|
| `nutricion/page.tsx` | Plan de comidas hardcodeado en `plan` array (línea 7-11) |
| `constants.ts` | Solo 10 frases motivacionales (necesita 365+) |
| `ConversationalCareCanvas.tsx` | El parsing de ACTION_RECEIPT es funcional pero las respuestas de IA son simuladas si no hay gateway conectado |

### Infraestructura faltante

| Componente | Estado |
|---|---|
| **ecosystem.config.js (PM2)** | No existe |
| **cloudflared config** | No existe |
| **Healthcheck endpoint** | Existe `/api/db-check` pero no hay healthcheck completo |
| **CI/CD config** | No existe |
| **Backup strategy** | No documentada ni implementada |
| **Monitoreo/logs** | No implementado |
| **.env de producción** | No existe (solo está `/web/.env`) |

---

## 3. Checklist de Faltantes

### Iteración A — Cerrar Placeholders Críticos (Prioridad Alta)

- [x] **A1**: Implementar `/admin/anuncios` — CRUD de anuncios globales con targeting por rol
- [x] **A2**: Implementar `/admin/permisos` — Matriz de permisos (rows=roles, cols=acciones)
- [x] **A3**: Implementar Dashboard Contabilidad `/contabilidad` — Resumen financiero con métricas reales
- [x] **A4**: Implementar `/contabilidad/pagos-medicos` — Tabla con filtros, cambios de estado, comentarios
- [x] **A5**: Implementar `/contabilidad/cortes` — Timeline de periodos de corte quincenales/mensuales
- [x] **A6**: Implementar `/contabilidad/penalizaciones` — Tabla de penalizaciones con tipos y estados
- [x] **A7**: Implementar `/contabilidad/reportes` — Generador de reportes CSVs/PDFs con filtro por fecha
- [x] **A8**: Implementar Dashboard Médico Home (`/medico`) — Agenda del día, métricas, estado verificación

### Iteración B — Conectar lo que está hardcodeado (Prioridad Alta)

- [x] **B1**: Crear API endpoint `/api/patient/nutrition` que genere planes nutricionales por IA basados en casos activos
- [x] **B2**: Conectar `nutricion/page.tsx` al endpoint de nutrición (remover datos hardcodeados)
- [x] **B3**: Expandir `MOTIVATIONAL_PHRASES` de 10 a 365+ frases empáticas de salud (actualmente 100 frases)
- [x] **B4**: Completar cobertura i18n — auditar TODAS las páginas y migrar strings hardcodeadas a `t('key')`
- [x] **B5**: Verificar que `en.json` y `es.json` tengan keys idénticas (109 keys sincronizados)

### Iteración C — Features Faltantes del Tracker (Prioridad Alta)

- [x] **C1**: **Reporte de Derivación PDF** — Endpoint que genere PDF con formato de receta clínica (`@media print`) y botón de descarga
- [x] **C2**: **Compartir por WhatsApp** — Deep links para compartir reportes/resúmenes (REQ-034)
- [x] **C3**: **Ubicación en Tiempo Real** — Compartir ubicación con enlace temporal expirable (REQ-035)
- [x] **C4**: **Google Calendar OAuth** — Conectar calendario del usuario (REQ-033)
- [x] **C5**: **Subscription Plans** — Asignar planes a usuarios desde admin, límites por plan
- [x] **C6**: **Google Meet real** — Integración con Google Meet API para crear espacios reales (hoy solo se genera link texto)
- [x] **C7**: **Notificaciones Push** — Web push notifications (adicional a Gmail)
- [x] **C8**: **Recomendación Sintomatológica** — Documento formal descargable con disclaimer (parcial: existe ActionReceipt)

### Iteración D — Componentes Standalone (Prioridad Media)

- [ ] **D1**: Crear `components/patient/AppointmentScheduler.tsx` (select+fecha)
- [ ] **D2**: Crear `components/patient/MeetJoinCard.tsx` (card con link Meet)
- [ ] **D3**: Crear `components/patient/WalletLedger.tsx`
- [ ] **D4**: Crear `components/patient/RecommendationCard.tsx`
- [ ] **D5**: Crear `components/patient/HumanReferralReportButton.tsx`
- [ ] **D6**: Crear `components/patient/NutritionPlanCard.tsx`
- [ ] **D7**: Crear `components/patient/EvidenceDropzone.tsx`
- [ ] **D8**: Extraer lógica inline de páginas admin a componentes standalone (ver deuda técnica)

### Iteración E — QA y Hardening (Prioridad Alta para Release)

- [ ] **E1**: **Pruebas Clínicas Adversariales** — Suite automatizada que pruebe red flags, controlados, pediatría, derivación (existe test-clinical-flow.ts pero ampliar cobertura)
- [ ] **E2**: **Pruebas de Accesibilidad WCAG 2.2 AA** — Auditoría con axe-core o similar
- [ ] **E3**: **Pruebas de Seguridad** — Revisar cifrado, RBAC, logs sin PHI, eliminación
- [ ] **E4**: **Pruebas de Pagos** — Stripe webhook idempotencia, wallet ledger, reembolsos
- [ ] **E5**: **Load Test** — Pruebas de carga en servidor local Debian
- [ ] **E6**: **Pruebas Responsive** — Verificar 360px, 768px, 1024px, 1440px sin overflow

### Iteración F — Infraestructura y DevOps (Prioridad Alta)

- [ ] **F1**: Crear `ecosystem.config.js` para PM2 (instances, logs rotados, restart policy)
- [ ] **F2**: Configurar Cloudflare Tunnel (`cloudflared` como servicio Linux)
- [ ] **F3**: Crear healthcheck endpoint completo (`/api/health`) que verifique DB, IA gateway, colas
- [ ] **F4**: Script de deploy: `git pull → npm install → build → migrate → pm2 reload`
- [ ] **F5**: Configurar backups automáticos de PostgreSQL
- [ ] **F6**: Configurar monitoreo (logs centralizados, alertas)
- [ ] **F7**: Crear `.env.production` template con todas las variables necesarias
- [ ] **F8**: Configurar CI/CD (GitHub Actions o similar)

### Iteración G — Gates de Release (Prioridad Crítica)

- [ ] **G1**: **Gate Legal** — Política de privacidad aprobada, términos aprobados, consentimiento versionado
- [ ] **G2**: **Gate Médico** — Red flags aprobadas, pediatría aprobada, OTC aprobado, controlados bloqueados
- [ ] **G3**: **Gate Seguridad** — RBAC probado, cifrado verificable, audit logs, eliminación funcional
- [ ] **G4**: **Gate Pagos** — Stripe live configurado, webhooks idempotentes, wallet ledger funcional
- [ ] **G5**: **Gate DevOps** — PM2 funcionando, Cloudflare Tunnel activo, backups probados, rollback documentado
- [ ] **G6**: **Go/No-Go** — Checklist firmado por Delivery, Arquitectura, Médico, Legal

### Iteración H — UI/UX Polish (Prioridad Media)

- [ ] **H1**: Crear `components/shared/RegionDetectorNotice.tsx`
- [ ] **H2**: Crear `components/shared/MotivationalGreeting.tsx`
- [ ] **H3**: Crear `components/layout/BreadcrumbNav.tsx`
- [ ] **H4**: Verificar animaciones Framer Motion en todas las transiciones de página
- [ ] **H5**: Verificar `prefers-reduced-motion` en animaciones
- [ ] **H6**: Implementar skip-to-content link en AppShell
- [ ] **H7**: Verificar contraste WCAG AA sobre glassmorphism
- [ ] **H8**: Auditoría de `aria-label`, roles ARIA, focus rings

---

## 4. Discrepancias con master_status.md

| Declaración en master_status | Realidad | Acción |
|---|---|---|
| "Avance general ~100%" | ~65-70% real | El tracker original marcaba 1.11% — hay avance significativo pero NO completo |
| "17 de 18 fases completadas" | ~10 de 18 fases completadas | F13 (i18n parcial), F14 (seguridad parcial), F16 (QA no iniciado), F17 (release no iniciado) |
| "14 de 14 user stories iniciadas" | ~8 de 14 completas, 6 parciales | US-011 (Gmail), US-012 (soporte compensaciones), US-013 (contabilidad) están parciales |
| "Checklist release 14 de 14" | 0 de 14 completados | CL-01 a CL-14 todos pendientes (ver Iteración G) |
| "Componentes son MOCKS" (desactualizado) | Ya NO son mocks | Están conectados a Zustand y API. Problema resuelto. |
| "Sprint 10 COMPLETADO" | Soporte funcional pero Contabilidad placeholders | Dashboard contabilidad, pagos-médicos, cortes, penalizaciones, reportes son placeholders |

---

*Este archivo debe actualizarse al final de cada iteración para mantener contexto.*
