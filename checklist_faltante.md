# Checklist Faltante — Radiografía App Médica AI (Angélica Med)

> **Fecha:** 2026-07-13  
> **Auditor:** OpenCode (DeepSeek V4 Flash)  
> **Propósito:** Memoria a largo plazo. Cruza el tracker contra el código real.

---

## 0. Radiografía Final Pre-Despliegue (Auditoría DeepSeek)

### 0.1 Métricas de Avance

| Métrica | Valor | Cálculo |
|---|---|---|
| **Avance Real (ponderado)** | **58%** | 30.25/52 requerimientos ponderados |
| **Avance User Stories** | 57% | 8/14 completas, 6 parciales |
| **Requerimientos Aprobados** | 52 (100%) | Pero solo ~30 implementados aceptablemente |
| **Fases Código (A-H)** | ~85% del frontend/backend core | Falta pulido producción |
| **Gates Release (G1-G6)** | 0% | Ningún gate aprobado |
| **Checklist Release (CL-01 a CL-14)** | 0% | Todo pendiente |

### 0.2 Brechas Críticas (Bloqueantes para Producción)

| ID | Hallazgo | Severidad | Archivo | Líneas |
|---|---|---|---|---|
| **BC-01** | **Google Meet: todos los links son falsos** - createGoogleMeetSpace() siempre falla por falta de GOOGLE_SERVICE_ACCOUNT_KEY. generateMeetLink() crea URLs aleatorias que no abren salas reales. | **CRÍTICO** | `api/patient/appointments/route.ts` | 8-54, 203 |
| **BC-02** | **Stripe: bypass mode activo** - Sin STRIPE_SECRET_KEY en .env. Checkout redirige a mock-success. Pagos no son reales. | **CRÍTICO** | `api/patient/wallet/checkout/route.ts` | 35-42, web/.env |
| **BC-03** | **Webhook no idempotente** - Sin verificación de event_id. Reintentos de Stripe duplican créditos. | **CRÍTICO** | `api/webhooks/stripe/route.ts` | 37-113 |
| **BC-04** | **Google Calendar OAuth: mock con localStorage** - Botón "Sync Google" solo escribe localStorage. El callback real tiene bug: fetch("/api/auth/me") relativo en servidor nunca funciona. Variables GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET mal nombradas en .env (usando `:` en vez de `=`). | **CRÍTICO** | `paciente/calendario/page.tsx`, `api/patient/calendar/callback/route.ts`, web/.env | 228-240, 35, 24-25 |
| **BC-05** | **Guardrail "No decir soy una IA" no implementado** - Nota 07 del cliente exige explícitamente que la IA NUNCA diga "Soy una IA y no puedo diagnosticarte". Documentado en dev_status pero NO en system prompt ni guardrails. | **ALTO** | `lib/ai/guardrails.ts`, `api/patient/cases/[caseId]/messages/route.ts` | Todo el archivo, 184-201 |
| **BC-06** | **PDF de derivación usa window.print() en vez de librería real** - No es un PDF real. Faltan campos: contraindicaciones, versión de policy, nombre real del paciente, evidencias reales. | **ALTO** | `components/patient/ReferralReport.tsx` | 37 |
| **BC-07** | **Webhook Stripe debe usar idempotencia por event_id** - Sin deduplicación, reintentos generan transacciones duplicadas en wallet. | **CRÍTICO** | `api/webhooks/stripe/route.ts` | 73-106 |

### 0.3 Deuda Técnica Residual

| ID | Hallazgo | Severidad | Archivo |
|---|---|---|---|
| **DT-01** | Google OAuth tokens almacenados en texto plano en User model (sin cifrado) | **ALTO** | `prisma/schema.prisma:18-20` |
| **DT-02** | OAuth flow sin parámetro state (vulnerable a CSRF) | **ALTO** | `api/patient/calendar/connect/route.ts:13` |
| **DT-03** | Ruta mock-success existe en producción (aunque con guarda condicional) | **MEDIO** | `api/patient/wallet/mock-success/route.ts` |
| **DT-04** | Nutrición solo envía título del caso (timeline seleccionado pero descartado) | **MEDIO** | `api/patient/nutrition/route.ts:29-33,43-45` |
| **DT-05** | Location share: faltan opciones 8h/72h, endpoint de vista no encontrado | **MEDIO** | `components/patient/LocationShareCard.tsx:112` |
| **DT-06** | WhatsApp: sin lista de contactos ni grupos, solo wa.me link básico | **MEDIO** | `historial/[caseId]/page.tsx:37-45` |
| **DT-07** | Sin seed data para AiProvider (tabla vacía, gateway falla si no hay admin configurando) | **BAJO** | `prisma/schema.prisma:129-148` |
| **DT-08** | Fallback de nutrición hardcodeado (oculta errores de IA silenciosamente) | **BAJO** | `api/patient/nutrition/route.ts:67-76` |
| **DT-09** | Sin recordatorios push reales para medicamentos (solo mock localStorage) | **MEDIO** | `paciente/calendario/page.tsx` |
| **DT-10** | Sin Android app ni APK (Nota 01 del cliente) | **MEDIO** | No existe |

### 0.4 Evaluación por Gate de Release

| Gate | Estado | Notas |
|---|---|---|
| **G1 - Legal** | ❌ No aprobado | Política de privacidad existe pero necesita revisión legal. Sin consentimiento versionado. |
| **G2 - Médico** | ❌ No aprobado | Red flags existen, pero catálogo OTC no está formalizado. Sin firma médica. |
| **G3 - Seguridad** | ❌ Parcial | RBAC implementado, audit logs existen. OAuth sin CSRF, tokens sin cifrar. |
| **G4 - Pagos** | ❌ No aprobado | Stripe bypass mode. Webhook no idempotente. Sin Stripe live. |
| **G5 - DevOps** | ❌ No iniciado | PM2, Cloudflare, backups, monitoreo no configurados. |
| **G6 - Go/No-Go** | ❌ Pendiente | Sin firmas de Delivery, Arquitectura, Médico, Legal. |

### 0.5 Conclusión

**NO LISTO PARA PRODUCCIÓN.** Se requiere resolver las 7 brechas críticas (BC-01 a BC-07) antes de considerar despliegue en LAN. El código base tiene ~58% de avance real. El frontend/backend core está sólido, pero las integraciones críticas (pagos reales, Meet real, OAuth real, PDF real) son placeholders funcionales. Se recomienda una iteración específica de "Cierre de Integraciones" antes de F (Despliegue).

---

## 1. Resumen de Avance

### ✅ Completado (con deuda)

| Componente | Estado | Evidencia |
|---|---|---|
| **Infraestructura Frontend** | ✅ Completo | Next.js App Router, Tailwind v4, shadcn/ui (22 components), Framer Motion, PWA manifest |
| **Landing Page** | ✅ Completo | Hero, Features, Footer, ThemeToggle, LanguageToggle |
| **Auth (Login/Registro)** | ✅ Completo | Multi-step wizard, role selection, cookies session, middleware RBAC |
| **AppShell + Layouts** | ✅ Completo | Sidebar dinámico por rol, Header, MobileBottomBar, SafetyRibbon |
| **Zustand Stores** | ✅ Completo | userStore, chatStore, caseStore, uiStore |
| **Types** | ✅ Completo | chat.ts, case.ts, user.ts, wallet.ts, appointment.ts |
| **Prisma Schema** | ✅ Completo | 21 modelos |
| **AI Gateway** | ✅ Completo (sin seed data) | gateway.ts multi-provider, guardrails.ts, rag.ts (12.9MB corpus) |
| **Servicios Backend** | ✅ Completo | email.ts, purgeJob.ts, webSearch.ts |
| **API Routes** | ✅ 48 rutas | Auth, Patient, Doctor, Admin, Support, Webhooks |
| **Dashboards** | ✅ Estructura completa | Paciente, Médico, Admin, Soporte, Contabilidad |
| **Pruebas Automatizadas** | ✅ 5 suites + 4 QA | tests clínicos, seguridad, accesibilidad, pagos, carga |
| **Componentes Core** | ✅ Real (no mock) | ConversationalCareCanvas, ContextRail, ClinicalTimelineRiver, SafetyRibbon |
| **i18n** | ✅ 117 keys | es.json/en.json sincronizados, provider funcional |
| **Iteración H (UI Polish)** | ✅ Completa | BreadcrumbNav, MotivationalGreeting, RegionDetectorNotice, skip-to-content, prefers-reduced-motion |

### 🟡 Parcial / Con Deuda

| Componente | Problema |
|---|---|
| **Google Meet** | Todos los links son falsos (mock generateMeetLink). API real siempre falla. |
| **Stripe Payments** | Bypass mode activo. Sin llaves reales. Webhook no idempotente. |
| **Google Calendar** | OAuth mock con localStorage. Variables de entorno mal nombradas. |
| **PDF Reports** | window.print() en vez de librería. Faltan campos requeridos. |
| **Guardrails** | No implementa la regla "No decir soy una IA" (Nota 07 del cliente). |
| **Nutrición** | IA real pero solo envía título del caso, no timeline ni alergias. |
| **WhatsApp** | Solo wa.me link básico. Sin lista de contactos ni grupos. |
| **Location Share** | Faltan opciones 8h/72h. Endpoint de vista no encontrado. |
| **Medication Reminders** | Sin notificaciones push reales. Sin foto/PDF upload. |
| **Android App** | No existe. Solo PWA web. |

### ❌ No Iniciado / Placeholder

| Componente | Estado |
|---|---|
| **Gates de Release** | Todos pendientes (G1-G6) |
| **Checklist Release** | Todos pendientes (CL-01 a CL-14) |
| **Deploy PM2/Cloudflare** | Pospuesto (Iteración F) |
| **Stripe Live** | No configurado |
| **Google Meet Real** | No funcional |
| **Contabilidad reportes reales** | JSON simulado |
| **Monitoreo/logs/backups** | No implementado |

---

## 2. Checklist de Iteraciones (A-H)

### Iteración A — ✅ Cerrar Placeholders Críticos

- [x] A1-A8: Anuncios, permisos, contabilidad, pagos médicos, cortes, penalizaciones, reportes, dashboard médico.

### Iteración B — ✅ Conectar hardcodeados

- [x] B1-B5: Nutrición endpoint IA, frases motivacionales (100/365+), i18n completo (117 keys).

### Iteración C — ✅ Features faltantes del tracker

- [x] C1-C8: PDF derivación, WhatsApp, ubicación, Google Calendar OAuth (mock), planes, Meet (mock), push notifications, recomendación sintomatológica.

### Iteración D — ✅ Componentes Standalone

- [x] D1-D8: AppointmentScheduler, MeetJoinCard, WalletLedger, RecommendationCard, HumanReferralReportButton, NutritionPlanCard, EvidenceDropzone, UserTable/PlanEditor.

### Iteración E — ✅ QA y Hardening

- [x] E1-E6: Tests clínicos adversariales, accesibilidad, seguridad, pagos, carga, responsive.

### Iteración F — ⏳ Infraestructura y DevOps (En Espera)

- [ ] F1: Auditoría de Puertos y PM2
- [ ] F2: Preparación de Variables de Entorno de Producción
- [ ] F3: ✅ Radiografía Final de Código (este documento)
- [ ] F4: Despliegue Manual Controlado

### Iteración G — ❌ Gates de Release (Bloqueado)

- [ ] G1: Gate Legal
- [ ] G2: Gate Médico
- [ ] G3: Gate Seguridad
- [ ] G4: Gate Pagos
- [ ] G5: Gate DevOps
- [ ] G6: Go/No-Go

### Iteración H — ✅ UI/UX Polish

- [x] H1-H8: RegionDetectorNotice, MotivationalGreeting, BreadcrumbNav, prefers-reduced-motion, skip-to-content, aria-labels, WCAG contrast.

---

## 3. Plan de Acción Recomendado (Previo a Despliegue)

### Iteración I (COMPLETADA) — Cierre de Integraciones Críticas (Prioridad MÁXIMA)

| ID | Tarea | Estado |
|---|---|---|
| **I-01** | Configurar variables GOOGLE_* en .env con formato correcto (= en vez de :) | ✅ Completado |
| **I-02** | Implementar idempotencia en webhook Stripe (check event_id antes de procesar) | ✅ Completado |
| **I-03** | Reforzar guarda en mock-success: devuelve 404 en producción con Stripe configurado | ✅ Completado |
| **I-04** | Google Meet real integrado (requiere GOOGLE_SERVICE_ACCOUNT_KEY en .env) | ✅ Implementado (espera credenciales) |
| **I-05** | Arreglar callback OAuth: usar NEXT_PUBLIC_APP_URL absoluto y pasar cookies | ✅ Completado |
| **I-06** | Agregar state parameter CSRF en OAuth flow con cookie HTTP-only | ✅ Completado |
| **I-07** | Añadir "NUNCA digas soy una IA" en system prompt | ✅ Completado |
| **I-08** | Reemplazar window.print() con jsPDF + html2canvas | ✅ Completado |

### Luego de Iteración I → Iteración F (Despliegue LAN)

---
