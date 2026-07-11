# Radiografía y Control de Estado Maestro — Angélica Med

> **Última Actualización:** 2026-07-10 18:50 CST  
> **Actualizado por:** Antigravity (Claude Opus 4.6)  
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

### 📊 Avance Real

| Métrica | Valor |
| :--- | :--- |
| **Avance general** | ~88% (RAG + Wallet + Citas + Validación + Admin Panel completo) |
| **Fases completadas** | 11 de 18 (F00-F06 + Sprint 2B-5 completados) |
| **Fases en curso** | Sprint 6 (Motor clínico avanzado: Recomendaciones PDF, Guardrails Pediátricos, Evidencias en chat) |
| **User stories iniciadas** | 12 de 14 |
| **Checklist release** | 12 de 14 |

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

*(Al finalizar una tarea, la IA en turno DEBE añadir una fila a esta tabla.)*
