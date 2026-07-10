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
| **ORM** | Prisma (pendiente de inicializar) |
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
3. **No hay Prisma/ORM:** La base de datos no está inicializada.
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
| Avance general | ~2% (F00 parcial + RAG completo) |
| Fases completadas | 0 de 18 |
| Fases en curso | F00 (Gobierno clínico) — 20% |
| User stories iniciadas | 0 de 14 |
| Checklist release | 0 de 14 |

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

*(Al finalizar una tarea, la IA en turno DEBE añadir una fila a esta tabla.)*
