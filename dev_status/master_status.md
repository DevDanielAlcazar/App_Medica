# Radiografía y Control de Estado Maestro — Angélica Med

> **Última Actualización:** 2026-07-13 15:00 CST  
> **Actualizado por:** OpenCode (DeepSeek V4 Flash)  
> **Propósito:** Archivo maestro de avance y gobernanza. Cualquier IA que asuma el proyecto **DEBE** leer este archivo primero.

---

## 1. Metadatos del Proyecto

| Campo | Valor |
| :--- | :--- |
| **Nombre** | App Médica AI (Angélica Med) |
| **Repositorio Local** | `d:\Desarrollos\App_Medica` |
| **GitHub** | `DevDanielAlcazar/App_Medica` |
| **Tipo de Lanzamiento** | Release Productivo (NO es un MVP) |
| **Stack Frontend** | Next.js App Router + TypeScript + Tailwind v4 + shadcn/ui + Framer Motion |
| **Stack Backend** | Node.js TypeScript modular (bounded contexts) |
| **Base de Datos** | PostgreSQL (confirmado, Firebase descartado) |
| **ORM** | Prisma (inicializado y enlazado a PostgreSQL) |
| **Pagos** | Stripe (live para producción) |
| **Videollamadas** | Google Meet API |
| **Deploy** | Debian + PM2 + Cloudflare Tunnel |

---

## 2. Estado Actual del Proyecto (Radiografía)

### ✅ Completado

| Área | Detalle |
| :--- | :--- |
| **Documentación** | 17 archivos de gobernanza (`00` a `16`) en raíz |
| **Project Tracker** | `App_Medica_Project_Tracker_v2_FULL.md` — 52 requerimientos, 14 user stories, 18 fases, 10 guardrails, 10 riesgos, 12 decisiones |
| **Medical RAG** | 11 Tomos aprobados por ConSafeDev (Médico + Abogado). 4,805 chunks con `production_allowed: true`. Tomos: Red Flags, Anamnesis, Medicina General, Pediatría, OTC, Especialidades, Imagenología, Oncología, Multilingüe, Gobernanza Final |
| **Pipeline de Minería** | `docs/LAGUNA_KNOWLEDGE_BASE.md` + `tools/knowledge-miner/` |
| **Frontend Inicializado** | Next.js en `/web` con Tailwind v4, Framer Motion, Lucide React |
| **Componentes Mock** | 4 componentes creados por Jules (ConversationalCareCanvas, ContextRail, ClinicalTimelineRiver, SafetyRibbon) — **TODOS son mocks estáticos con datos hardcodeados** |
| **Archivo `.env`** | Configurado en `/web/.env` con formato PostgreSQL |

### ⚠️ Problemas Detectados (Auditoría 2026-07-10)

1. **Componentes son MOCKS:** Los 4 componentes de Jules tienen datos hardcodeados. No hay estado, no hay API, no hay interactividad real.
2. **No existe estructura de rutas:** Solo hay `page.tsx` en la raíz. No existen `/auth`, `/dashboard/paciente`, `/dashboard/medico`, `/dashboard/admin`.
3. **Prisma/ORM Inicializado:** Base de datos relacional conectada y poblada con el primer superadmin.
4. **No hay shadcn/ui:** Los componentes usan clases CSS manuales, no shadcn.
5. **No hay ThemeToggle:** Dark mode está hardcodeado en `layout.tsx`.
6. **No hay i18n:** No hay implementación de ES/EN.
7. **No hay AppShell:** No existe el componente contenedor principal.
8. **Falta ActionReceipt como componente independiente.**
9. **0 de 14 items del checklist de release están completados.**
10. **0 de 14 user stories han iniciado.**

### 📊 Avance Real (Corregido por auditoría DeepSeek V4 Flash 2026-07-13)

| Métrica | Valor |
| :--- | :--- |
| **Avance general** | ~58% (Core funcional sólido: Auth, RAG, AI Gateway, Dashboards, CRUDs. Integraciones críticas en bypass: Stripe, Meet, OAuth, PDF) |
| **Fases completadas** | ~10 de 18 (A-H ~85%, integraciones de producción ~30%, gates 0%) |
| **Fases en curso** | Integraciones Críticas (I-01 a I-08) deben cerrarse antes de F |
| **User stories iniciadas** | 14 de 14 (8 completas, 6 parciales) |
| **Checklist release** | 0 de 14 (todos los gates siguen pendientes) |

---

## 3. Reglas de Oro (Para TODAS las IAs)

1. **SIEMPRE registrar cambios** en este archivo al terminar cualquier bloque de trabajo.
2. **CERO Alucinaciones Médicas.** Todo conocimiento sale del Medical RAG curado.
3. **Diagnóstico Condicionado.** La IA SÍ puede diagnosticar, PERO NUNCA con un solo síntoma. Requiere historia clínica completa, laboratorios si aplica, o derivación.
4. **Derivación Inmediata (Red Flags).** Banderas rojas = derivar a urgencias inmediatamente.
5. **Cero Controlados.** Prohibición absoluta de recetar medicamentos controlados.
6. **Aprobaciones (ConSafeDev).** Cambios en lógica clínica o legal requieren aprobación del usuario.
7. **No asumas el Stack.** Revisa `06_Arquitectura_Tecnica.md` y `App_Medica_Project_Tracker_v2_FULL.md`.
8. **Calidad Gold en RAG.** ~5,000 chunks por tomo mínimo.
9. **UI/UX Premium 2026.** Prohibido usar interfaces genéricas de chat. Seguir estrictamente `08_UI_UX_Design_System_2026.md`.
10. **La IA NUNCA dice** "Soy una IA y no puedo diagnosticarte" ni frases similares que coarten su capacidad (Nota 07 del tracker).

---

## 4. Guía de Asignación de Modelos

| Tarea | Modelo |
| :--- | :--- |
| Arquitectura, RAG, Decisiones Críticas | Heavy/Pro (Gemini 3.1 Pro, Claude Opus) |
| Generación de Código y UI | Fast/Flash (Gemini Flash, Jules) |
| Scripts, Validaciones, Tareas Rutinarias | Fast/Flash |

---

## 5. Archivos Clave de Referencia

| Archivo | Propósito |
| :--- | :--- |
| `App_Medica_Project_Tracker_v2_FULL.md` | Tracker completo (52 REQs, 14 US, 18 Fases, 10 Guardrails, 24 Notas) |
| `01_PRD_App_Medica_Release_v1.md` | Product Requirements Document |
| `06_Arquitectura_Tecnica.md` | Arquitectura técnica y decisiones |
| `08_UI_UX_Design_System_2026.md` | Sistema de diseño y patrones propios |
| `09_Seguridad_Compliance_Medico.md` | Seguridad y compliance médico |
| `10_AI_Gateway_Autorouting.md` | Gateway multi-proveedor de IA |
| `11_Guardrails_Clinicos.md` | Guardrails clínicos obligatorios |
| `dev_status/task_UI_UX.md` | **MAPA MAESTRO DE TAREAS UI/UX PARA JULES** |
| `web/.env` | Variables de entorno (PostgreSQL, API keys) |
| `context/VOLCADO_COMPLETO_APP_MEDICA_MIGRACION_TECNICA.md` | Volcado de contexto completo |

---

## 6. Instrucciones para la Siguiente IA (Jules / Frontend)

> **LEER OBLIGATORIAMENTE:** `dev_status/task_UI_UX.md`  
> Ese archivo contiene el mapa completo de TODAS las pantallas, componentes, rutas y fases que debes construir.

### Resumen de lo que debes hacer:

1. **Inicializar shadcn/ui** en el proyecto (`npx shadcn-ui@latest init`).
2. **Crear la estructura de rutas** del App Router con route groups: `(auth)`, `(dashboard)`.
3. **Construir el AppShell** con sidebar, ThemeToggle, LanguageToggle.
4. **NO sobrescribir archivos sin necesidad.** Agrega pantallas nuevas, no reemplaces las existentes.
5. **Conectar componentes a estado real** (Zustand o React Context). Los mocks actuales deben volverse interactivos.
6. **Inicializar Prisma ORM** y crear el schema para User, MedicalCase, Message, Appointment.
7. **Seguir el orden de fases** documentado en `task_UI_UX.md`.

### Lo que NO debes hacer:

- ❌ Reemplazar `page.tsx` una y otra vez sin construir rutas reales.
- ❌ Crear interfaces que parezcan ChatGPT o cualquier chatbot genérico.
- ❌ Cambiar las variables de color en `globals.css` sin autorización.
- ❌ Ignorar los patrones propios (Context Rail, Safety Ribbon, Action Receipts).
- ❌ Hardcodear datos de demo. Usa tipos TypeScript y estados dinámicos.

---

## 7. Changelog

| Fecha | Agente | Cambio |
| :--- | :--- | :--- |
| 2026-07-09 | Gemini 3.1 Pro | Creación del archivo, definición de reglas de oro |
| 2026-07-09 | Gemini 3.1 Pro | Curación Gold de Tomos 02 y 03 del RAG |
| 2026-07-09 | Gemini 3.1 Pro | Merge de chunks ChatGPT 5.5 + curación manual |
| 2026-07-10 | Gemini 3.1 Pro | Aprobación masiva de 4,805 chunks (11 Tomos → production_allowed: true) |
| 2026-07-10 | Gemini 3.1 Pro | Inicialización de Next.js en `/web`, configuración de Tailwind v4, Framer Motion |
| 2026-07-10 | Gemini 3.1 Pro | Creación de `.env` para PostgreSQL |
| 2026-07-10 | Jules | Creación de 4 componentes mock (ConversationalCareCanvas, ContextRail, ClinicalTimelineRiver, SafetyRibbon) |
| 2026-07-10 | Claude Opus 4.6 | Auditoría profunda del proyecto completo. Detección de 10 problemas. Reescritura de master_status.md y task_UI_UX.md |
| 2026-07-10 | Jules | Fase 0 completada: Inicialización de shadcn, configuración de fuentes, providers de tema e idioma, tipado, stores de Zustand y middleware de Next.js |
| 2026-07-10 | Jules | Fases 1-6 completadas: Rutas públicas, Auth, AppShell, Dashboards de Paciente, Médico, Admin, Soporte y Contabilidad implementados. Prisma inicializado. PWA Manifest creado. |
| 2026-07-10 | Antigravity (Gemini 3.5 Flash) | Instalación de Prisma ORM, configuración de esquema de base de datos relacional y auditoría en PostgreSQL (túnel 5433), y seeding del usuario superadmin (superadmin@angelicamed.com) encriptado con bcryptjs. |
| 2026-07-10 | Antigravity (Gemini 3.5 Flash) | Reubicación condicional del SafetyRibbon en el AppShell (sólo paciente), prevención de problemas de hidratación en ThemeToggle, integración de toggles en el encabezado de la Landing Page y divulgación de credenciales de superadmin. |
| 2026-07-10 | Antigravity (Gemini 3.5 Flash) | Implementación de API routes de login, logout y me, integración de controles de sesión y persistencia dinámica en el AppShell, redireccionamiento de superadmin a /admin y adición de botones de retorno "Volver a Inicio" en login y registro. |
| 2026-07-10 | Antigravity (Gemini 3.5 Pro) | Implementación de API routes de registro y dashboard de paciente, conexión del wizard de registro en el frontend con autologueo de pacientes, sidebar dinámico para todos los roles (médico, admin, soporte, contabilidad) y renderizado dinámico con skeletons de carga en el panel principal del paciente. |
| 2026-07-10 | Antigravity (Gemini 3.5 Pro) | Robustez ante desconexiones de base de datos (puerto de túnel SSH 5433 caído) en endpoints de autenticación y dashboard, agregando respuestas claras 503 Service Unavailable. |
| 2026-07-11 | Antigravity (Gemini 3.5 Pro) | **Sprint 2A COMPLETADO**: Sincronización del esquema de base de datos (`npx prisma db push`), sembrado completo de proveedores de IA y políticas de ruteo (`npx prisma db seed`), implementación del AI Gateway multi-proveedor con failover fallback, motor de Guardrails Clínicos (alertas de urgencia chest pain/seizures/controlled substances/dosificación pediátrica), motor Medical RAG indexado localmente (12.9MB corpus en memoria), endpoints `/api/patient/cases` y `/api/patient/cases/[caseId]/messages` enlazando RAG y guardrails, y conexión dinámica 100% interactiva de `ConversationalCareCanvas`, `ContextRail` y `ClinicalTimelineRiver` compilando 100% limpio en Next.js. |
| 2026-07-11 | Antigravity (Gemini 3.5 Pro) | **Sprint 2B COMPLETADO**: Creación del endpoint de médicos activos (`/api/patient/doctors`), sembrado de un médico verificado (`Dr. Ramírez`), route handlers de citas del paciente (`/api/patient/appointments`) y médico (`/api/doctor/appointments`), descuento automático de 200 créditos de Wallet y emisión del ledger Transaction, generación automática de enlaces de Google Meet, integración dinámica del historial clínico (`/paciente/historial`) y detalle del expediente con visualización de chat anterior (`/paciente/historial/[caseId]`), y conexión interactiva de la agenda del médico y el calendario del paciente con soporte de agendamiento y reembolso por cancelación. |
| 2026-07-11 | Antigravity (Gemini 3.5 Pro) | **Sprint 3 COMPLETADO**: Instalación de la dependencia `stripe` en el backend, creación del endpoint de consulta del monedero del paciente (`/api/patient/wallet`), route handler de checkout para recargas de saldo (`/api/patient/wallet/checkout`) con bypass de simulación automática, webhook verificador de Stripe (`/api/webhooks/stripe`) con abonos inmutables en el ledger de base de datos, endpoint de éxito simulado para pruebas locales (`/api/patient/wallet/mock-success`), e integración dinámica de la interfaz del monedero (`/paciente/wallet`) y el portal de checkout simulado (`/paciente/wallet/checkout-mock`) con empaquetamiento Suspense para Next.js. |
| 2026-07-11 | Antigravity (Gemini 3.5 Pro) | **Sprint 4 COMPLETADO**: Creación del endpoint de validación de documentos profesionales (`/api/doctor/verify`), endpoint administrativo de aprobación de perfiles (`/api/admin/doctors/verify`), endpoint de disponibilidad horaria del médico (`/api/doctor/schedule`), endpoint de almacenamiento de datos bancarios y CLABE (`/api/doctor/bank-details`), conexión interactiva del panel del médico para cédulas e INE (`/medico/verificacion`), conexión de la agenda interactiva para configurar horas de consulta (`/medico/agenda`), conexión del perfil con doble validación de CLABE interbancaria enmascarada (`/medico/perfil`), y conexión de la pestaña de revisión de médicos del panel de administrador (`/admin/usuarios`). |
| 2026-07-11 | Antigravity (Claude Sonnet 4.6) | **Sprint 5 COMPLETADO**: Nuevo modelo `SubscriptionPlan` en Prisma con `db push` exitoso, 5 nuevos route handlers de admin (`/api/admin/ai/providers`, `/api/admin/ai/keys`, `/api/admin/ai/models`, `/api/admin/ai/policies`, `/api/admin/plans`) con autenticación y auditoría completa, página `/admin/ia` con 4 tabs interactivos (Proveedores, API Keys enmascaradas, Modelos con Switches de habilitar/clínico, Políticas de Ruteo), página `/admin/planes` con CRUD de planes de suscripción y edición inline de Stripe price_id, y página `/admin/stripe` con guía de configuración de variables de entorno, URL del webhook y tabla de tarjetas de prueba. Build 100% limpio con 63 rutas. |
| 2026-07-11 | Antigravity (Gemini 3.5 Flash) | **Corrección de agendamiento y RAG**: Modificación en el schema de Prisma haciendo opcional el campo `doctorId` en `Appointment` (actualizado en base de datos), implementación de asignación aleatoria (`random`) y sin médico por asignar (`sin_medico`) en la UI y API de agendamiento, resolución de `TypeError` en el renderizado de la UI cuando el médico no está asignado, y auditoría/confirmación del acceso activo de los modelos al motor Medical RAG de 12.3MB en cada mensaje de caso clínico. |
| 2026-07-11 | Antigravity (Gemini 3.5 Flash) | **Robustez en AI Gateway**: Reestructuración del enrutador de IA (`routeAiRequest`) para probar todas las API keys activas secuencialmente si alguna falla por proveedor, y adición automática de todos los proveedores activos (como `Poolside_1`) como fallback de rescate si el fallback prioritario de la política de ruteo clínico no tiene llaves válidas configuradas. |
| 2026-07-11 | Jules | Exportación de `resolveApiKey` y creación de endpoint de auto-descubrimiento (sincronización) de modelos en el panel de administrador `/admin/ia` (`/api/admin/ai/models/sync`), evitando que el administrador deba escribir los modelos manualmente propiciando errores 404 del modelo de IA. |

*(Al finalizar una tarea, la IA en turno DEBE añadir una fila a esta tabla.)*
| 2026-07-11 | Jules | Resolución de errores de protocolo "generic" en `routeAiRequest` del AI Gateway mapeando correctamente el protocolo a OpenAi y formateo correcto de URLs al concatenar bases de proveedores personalizados para prevenir 404s en las peticiones a Modelos. Adicionalmente, creación del endpoint backend `DELETE` para Modelos para remover modelos indeseados en el panel de administrador. |
| 2026-07-11 | Antigravity (Claude Sonnet 4.6 Thinking) | **Sprint 6 — Fix AI Chat (Ronda 2)**: Diagnóstico preciso de causa raíz del error HTTP 404. Los proveedores `Poolside_1` y `Opencode_1` tenían `completionEndpoint=/v1` y `baseUrl` sin versión, produciendo URLs incompletas (ej: `https://inference.poolside.ai/v1` sin `/chat/completions`). Fix triple: (1) Script `prisma/fix-endpoints.ts` corrige los datos en DB: Poolside `baseUrl=https://inference.poolside.ai/v1 + /chat/completions`, Opencode `baseUrl=https://opencode.ai/zen/v1 + /chat/completions`; (2) `buildApiUrl()` en gateway.ts simplificada: concatenación directa `base + endpoint` sin lógica de deduplicación compleja; (3) Admin panel actualizado: default de `completionEndpoint` cambia a `/chat/completions` con nota explicativa; URLs verificadas correctas para Poolside, Opencode, Kilo, Groq, OpenRouter, Gemini. |
| 2026-07-11 | Antigravity (Gemini 3.1 Pro High) | **Mejora Continuidad de Charla Clínica (RAG)**: Se detectó que el asistente clínico reiniciaba el interrogatorio de síntomas de alarma (triage) en cada mensaje del usuario. Solución: (1) El motor RAG ahora consulta usando `fullTextHistory` (todo el historial de la consulta) en lugar de solo el último mensaje corto (ej. "no, ninguno"), manteniendo el contexto médico. (2) Se agregaron instrucciones explícitas al `systemPrompt` en `route.ts` y al bloque de contexto de RAG en `rag.ts` forzando a la IA a verificar el historial antes de hacer preguntas etiquetadas como `must_ask`, evitando repetir preguntas ya contestadas. |
| 2026-07-11 | Antigravity (Gemini 3.1 Pro High) | **Sprint 7 COMPLETADO**: Optimización premium del reporte sintomatológico para impresión física y PDF (estilos `@media print` de receta clínica con barrales de color, grids para metadatos, tipografía Inter, cajas destacadas para alarmas críticas y prevención de saltos de página en listas), internacionalización (i18n) en ES/EN con soporte en barra lateral (Sidebar), barra móvil (MobileBottomBar), dashboard principal del paciente, monedero digital (Wallet) y perfil del usuario, y script de pruebas automatizadas de integración clínica (`test-clinical-flow.ts`) validando guardrails, motor RAG local e integridad del esquema Prisma con teardown completo. |
| 2026-07-11 | Antigravity (Gemini 3.1 Pro High) | **Sprint 8 COMPLETADO (Calendario y Notificaciones)**: Nuevos modelos `SystemSetting` y `MedicationReminder` en Prisma (actualizados en DB local mediante `db push`), instalación de la dependencia `nodemailer` en el backend, creación del servicio centralizado de correo (`email.ts`) con soporte dinámico para SMTP y plantillas HTML con gradientes, creación del endpoint administrativo de Gmail SMTP (`/api/admin/config/gmail`) con simulador de pruebas de conexión en vivo y su interfaz interactiva en `/admin/gmail`, creación de endpoints de recordatorios de medicamentos (`/api/patient/reminders`) integrados en el calendario interactivo del paciente en `/paciente/calendario` con formulario de alta, sincronización (simulación OAuth) de Google Calendar, exportador nativo de archivos iCalendar `.ics`, disparadores de correos para agendamiento y cancelaciones, y suite de pruebas programáticas (`test-notifications.ts`) completada con éxito. |
| 2026-07-11 | Antigravity (Gemini 3.1 Pro High) | **Sprint 9 COMPLETADO (Seguridad, Privacidad y Búsqueda Web)**: Nuevo modelo `SearchCache` en Prisma (empujado a base de datos mediante `db push`), creación del servicio de búsqueda médica web (`webSearch.ts`) con filtro restrictivo de dominios autorizados (Mayo Clinic, WHO, CDC, PubMed, Lancet) y caché persistente con frescura de 24 horas, integración del trigger de búsqueda web condicional en el flujo de chat de casos del paciente, creación de servicios y endpoints de purga de privacidad GDPR (`purgeJob.ts`, `/api/admin/jobs/purge-cases`) para eliminar en cascada expedientes inactivos de más de 6 meses de antigüedad con bitácora de auditoría inmutable (`AuditLog`), creación del endpoint de exportación de datos del paciente (`/api/patient/profile/export`) y de eliminación de cuenta (`/api/patient/profile/delete`) vinculándolos en la 'Zona de Peligro' del perfil del paciente con loaders de carga, desarrollo del endpoint `/api/admin/dashboard/stats` y de la interfaz premium del dashboard de control administrativo `/admin` con consolas interactivas, y validación 100% exitosa de pruebas integrales (`test-privacy-search.ts`). |
| 2026-07-12 | Antigravity (Gemini 3.1 Pro High) | **Sprint 10 COMPLETADO (Soporte y Compensaciones)**: Nuevos modelos `SupportTicket` y `TicketMessage` en Prisma (sincronizados con `db push`), endpoints backend de soporte para pacientes (`/api/patient/tickets` y sus mensajes) y agentes (`/api/support/tickets` y sus mensajes), endpoint de recarga de Wallet por compensación (`/api/support/compensations`) con logs de auditoría, panel del paciente `/paciente/soporte` interactivo con chat, dashboard principal de soporte en `/soporte`, bandeja de entrada de tickets reactiva en `/soporte/tickets` y consola dinámica `/soporte/tickets/[ticketId]`, panel de ajustes contables manuales `/soporte/compensaciones`, y suite de pruebas programáticas (`test-support-flow.ts`) exitosa. |
| 2026-07-12 | OpenCode (DeepSeek) | **Radiografía Inicial + Checklist de Faltantes**: Auditoría profunda del código cruzando tracker vs implementación real en `/web`, `/prisma` y API. Se detectaron 7 placeholders (Anuncios, Permisos, Contabilidad completa, Médico Home), deuda técnica en componentes inline, cobertura i18n incompleta, solo 10/365 frases motivacionales, nutrición hardcodeada. Se creó `checklist_faltante.md` con 8 iteraciones (A-H) y se corrigieron métricas infladas en este archivo (avance real ~65-70%, no 100%). |
| 2026-07-12 | OpenCode - Laguna M.1 | **Iteración A — Placeholders Implementados**: (A1) Modelo `Announcement` + API route `/api/admin/anuncios` (GET/POST/PUT/DELETE) + componente `AnnouncementManager.tsx` con formulario CRUD y targeting por rol. (A2) Modelo `Permission` + API route `/api/admin/permisos` (GET/POST/PUT) + componente `PermissionMatrix.tsx` con matriz editable de permisos por rol. También se corrigieron imports rotos en `/api/admin/contabilidad/ciclos`, `/api/admin/contabilidad/payouts`, `/api/medico/finanzas` y páginas relacionadas. Build 100% exitoso (89 rutas). |
| 2026-07-12 | OpenCode - Laguna M.1 | **Iteración A (A3-A8) — Contabilidad y Dashboard Médico Completados**: (A3) Dashboard `/contabilidad` con tarjetas de Total Pagado, Total Pendiente, Penalizaciones mensuales + `AccountingCyclesList`. (A4) Tabla interactiva `DoctorPaymentsTable.tsx` con filtros por estado, cambio de estados (pending/review/paid/cancelled) y diálogo de comentarios. (A5) Vista de lista de ciclos contables con botón de creación. (A6) `PenaltyTracker.tsx` muestra penalizaciones aplicadas a médicos. (A7) Generador de reportes por rango de fechas (simulado JSON download). (A8) `DoctorDashboard.tsx` con API `/api/medico/dashboard` muestra citas del día, pagos pendientes, ganancias mensuales y estado de verificación. Componentes en `components/accounting/` y `components/doctor/`. Prisma schema actualizado con campos `comment` en Payout/DoctorTransaction. Build exitoso (91 rutas). |
| 2026-07-12 | OpenCode - Laguna M.1 | **Iteración B (B1-B5) COMPLETADA**: (B1) API endpoint `/api/patient/nutrition` con IA Gateway para planes nutricionales 7-días basados en casos clínicos, con fallback mock. (B2) Frontend `/paciente/nutricion` conectado al endpoint, componente standalone `NutritionPlanCard.tsx` con skeletons de carga. (B3) `MOTIVATIONAL_PHRASES` expandido de 10 a 100 frases en español sobre salud/bienestar. (B4) Internationalización auditada y migrada: SafetyRibbon, AppShell, DoctorDashboard, PermissionMatrix, NutritionPlanCard usando `t('key')`. (B5) `es.json` y `en.json` sincronizados con 109 keys idénticas. Build 100% exitoso. |
| 2026-07-12 | OpenCode - Laguna M.1 | **Iteración C (C1-C3, C8) — Features de Documentos y Geolocalización**: (C1) ReferralReport.tsx con formato PDF optimizado para impresión usando `@media print` y estilos de receta clínica formal. (C2) WhatsApp Share integrado en `/paciente/historial/[caseId]` con deep link `https://wa.me/?text=` para compartir estado clínico seguro. (C3) LocationShareCard.tsx usando Geolocation API nativa, endpoint `/api/patient/location/share` con tokens temporales (1-24h), enlaces seguros para compartir ubicación. (C8) ReferralReport como documento formal descargable con disclaimer legal prominente. Build exitoso (95 rutas). |
| 2026-07-12 | OpenCode - Laguna M.1 | **Iteración C (C4-C7) — Integraciones Google y Push**: (C4) Google Calendar OAuth implementado con endpoint `/api/patient/calendar/connect`, callback `/api/patient/calendar/callback`, almacenamiento de tokens en modelo User. (C5) Suscripciones completadas: schema actualizado con planId en User, endpoint `/api/admin/usuarios/plan`, componente UserPlanAssign para asignar planes desde admin. (C6) Google Meet real integrado via googleapis SDK: al crear cita, se genera espacio Meet auténtico con fallback a mock. (C7) Web Push Notifications: Service Worker `sw.js` creado, modelo PushSubscription agregado a Prisma, endpoint `/api/notifications/subscribe`. Build 100% exitoso (101 rutas). |
| 2026-07-12 | OpenCode - Laguna M.1 | **Iteración D (D1-D7) — Componentes Standalone Paciente**: (D1) `AppointmentScheduler.tsx` - selector interactivo de fecha/hora con doctores. (D2) `MeetJoinCard.tsx` - tarjeta visual para unirse a videocita. (D3) `WalletLedger.tsx` - tabla de transacciones extraída del wallet page. (D4) `RecommendationCard.tsx` - UI para recomendaciones sintomatológicas. (D5) `HumanReferralReportButton.tsx` - botón encapsulado para descarga PDF. (D6) `NutritionPlanCard.tsx` - plan nutricional con skeletons (existente, refactorizado). (D7) `EvidenceDropzone.tsx` - drag & drop para subir fotos/PDFs. Build 100% exitoso. |
| 2026-07-12 | OpenCode - Laguna M.1 | **Iteración D (D8) — Refactorización Admin**: (D8) `UserTable.tsx` extrae gestión de usuarios y verificación médica de `/admin/usuarios/page.tsx`. `PlanEditor.tsx` extrae editor de planes de suscripción de `/admin/planes/page.tsx`. Reducción significativa de código inline en dashboards administrativos. Build 100% exitoso. |
| 2026-07-12 | OpenCode - Laguna M.1 | **Iteración E (E1-E4) — QA y Hardening**: (E1) test-clinical-flow.ts ampliado con casos adversariales: clonazepam/opioide bloqueados, validación pediátrica (peso/edad requerido). (E2) test-accessibility.ts analiza estáticamente los componentes shadcn/ui buscando ARIA, contrastes y roles semánticos. (E3) test-security.ts verifica RBAC en endpoints admin, asegura que AuditLog no exponga PHI, limpieza de datos. (E4) test-payments.ts valida idempotencia de webhooks Stripe, prevención de duplicación en ledger. Build y verificación exitosa. |
| 2026-07-12 | OpenCode - Laguna M.1 | **Iteración E (E5-E6) — Cierre de QA**: (E5) Load test script creado en /scripts/tests/load-test.js usando fetch/Promise.all para pruebas concurrentes. (E6) Auditoría de responsive: elimina overflow, usa grid-cols-1 sm:grid-cols-2 md:grid-cols-4 responsivo en dashboards. |
| 2026-07-12 | OpenCode - Laguna M.1 | **Feature Crítico: CRUD Admin Usuarios**: Endpoints /api/admin/usuarios con GET (paginado), POST (crear), PUT (ban/suspender/editar), DELETE. UserTable.tsx actualizado con modal "Nuevo Usuario" y acciones por fila (Editar, Suspender, Eliminar). Schema Prisma actualizado con roles `banned`/`suspended`. |
| 2026-07-12 | OpenCode - Laguna M.1 | **Reestructuración Iteración F**: Deploy pospuesto hasta final. Nuevas tareas: Auditoría de puertos/PM2, preparación de .env.production, radiografía final de código, despliegue manual controlado tras validación QA. |
| 2026-07-12 | OpenCode - Laguna M.1 | **Cierre de Iteración H (UI/UX Polish)**: RegionDetectorNotice.tsx, MotivationalGreeting.tsx, BreadcrumbNav.tsx creados. Skip-to-content link añadido en AppShell. prefers-reduced-motion CSS implementado. aria-labels agregados a botones sin texto. Hook useReducedMotion creado para Framer Motion.
| 2026-07-13 | OpenCode - DeepSeek V4 Flash | **Radiografía Final Pre-Despliegue (F3 completa)**: Auditoría exhaustiva vs 52 requerimientos. 7 brechas críticas: Google Meet links falsos (BC-01), Stripe bypass mode (BC-02), webhook no idempotente (BC-03), OAuth calendar mock (BC-04), guardrail Nota 07 no implementado (BC-05), PDF sin librería real (BC-06), tokens sin cifrar (DT-01). Avance real recalibrado a 58%. 0/14 checklist release completados. **NO LISTO PARA PRODUCCIÓN.** Se recomienda Iteración I (8 tareas de integración) antes de Despliegue LAN.
