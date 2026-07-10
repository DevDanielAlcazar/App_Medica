# Radiografía y Control de Estado Maestro - App Médica AI (Angélica Med)

Este documento es el **archivo maestro de avance y gobernanza** para el proyecto "Angélica Med". Su propósito es asegurar que cualquier IA (Gemini 2.5, 3.0, 3.1 Pro, Flash, Jules, etc.) que asuma el proyecto conozca el estado actual exacto, las reglas de oro y el flujo de trabajo, evitando alucinaciones, desviaciones o pérdida de contexto.

---

## 1. Metadatos del Proyecto
- **Nombre:** App Médica AI (Angélica Med)
- **Repositorio Local:** `d:\Desarrollos\App_Medica`
- **Control de Versiones:** Git / GitHub (`DevDanielAlcazar/App_Medica`)
- **Tipo de Lanzamiento:** Release Productivo (NO es un MVP).
- **Última Actualización del Estado:** 2026-07-09

## 2. Radiografía Actual del Proyecto
El proyecto se encuentra en una fase madura de **Planeación y Gobernanza Técnica**, pero **carece de implementación funcional del SaaS web (código)** en este momento.

### ✅ Lo que ya está completado:
- **Documentación Base:** PRDs, planes de desarrollo, arquitectura técnica, UI/UX (archivos `00` a `16` en la raíz).
- **Gobernanza:** Riesgos, check-lists de entrega, guardrails clínicos.
- **Medical RAG (Tomo 01):** Definido para "Red Flags / Triage / Derivación inmediata" (versión 0.2 con 54 chunks y 28 fuentes).
- **Aprobaciones Iniciales (Prompt 12A):** El Tomo 01 versión 0.2.1 ha sido marcado oficialmente con `production_allowed: true` y evidencia documentada.
- **Tomo 02 (Medicina General) y Tomo 03 (Pediatría) - Curación Gold:** Se inyectaron exitosamente las reglas de especialidad para Diabetes, Hipertensión, Neumonía, Fiebre Infantil y Bronquiolitis siguiendo el patrón estricto del Tomo 01.
- **Integración de Motor LLM de Expansión (ChatGPT 5.5 / Laguna M.1):** Se generó el framework de Anamnesis Estructurada (Tomo 02A) que mapea inteligentemente la recolección de historias clínicas y mapas de diagnóstico diferencial.
- **Pipeline de Minería:** Se estableció el estándar base `docs/LAGUNA_KNOWLEDGE_BASE.md` para escalar la minería a futuro sin perder la calidad Gold.
- **Volcado de Contexto:** Archivo maestro en `context/VOLCADO_COMPLETO_APP_MEDICA_MIGRACION_TECNICA.md`.

### ⏳ Lo que está en proceso / Pendiente inmediato:
- **Validación de Scripts:** Correr los scripts de validación de RAG para asegurar integridad total.
- **Decisión de Base de Datos:** La arquitectura inicial apunta a **PostgreSQL**, pero en el volcado reciente se generó un modelo completo para **Firebase/Firestore**. Se debe unificar y confirmar esta decisión con el usuario antes de programar el backend.
- **Desarrollo del SaaS:** Inicializar Next.js (Frontend) y el Backend (Node.js/Firebase).

---

## 3. Guía de Uso de Modelos de IA (Optimización de Recursos)
Para que el usuario sepa qué modelo elegir en las siguientes tareas, aquí está la convención de asignación:

| Tipo de Tarea | Modelo Recomendado | Ejemplos |
| :--- | :--- | :--- |
| **Arquitectura, RAG Médico, Decisiones Críticas** | **Heavy / Pro** (ej. Gemini 3.1 Pro) | Curación clínica, diseño de base de datos compleja, resolución de conflictos de arquitectura. |
| **Generación de Código Base y UI** | **Fast / Flash** (ej. Gemini Flash, Jules) | Crear componentes en React, maquetar CSS, inicializar Next.js. |
| **Scripts, Validaciones y Tareas Rutinarias** | **Fast / Flash** | Correr scripts de Python/Node para validar JSONs del RAG, formatear archivos. |

---

## 4. Reglas de Oro (Para todas las IAs)
1. **SIEMPRE registrar los cambios:** Todo avance debe quedar registrado en este archivo `master_status.md` para que las "compañeras" de desarrollo sepan exactamente en qué punto continuar.
2. **CERO Alucinaciones Médicas:** Las IAs **no deben inventar** contenido médico. Todo el conocimiento debe salir exclusivamente del **Medical RAG** curado y auditado.
3. **Diagnóstico Condicionado:** La IA **SÍ** puede emitir un diagnóstico clínico y plan de tratamiento, **PERO NUNCA** basándose en un solo síntoma aislado. Requiere recopilar la historia clínica completa, exigir resultados de laboratorio/imagen si la guía lo dicta, o derivar a consulta si la evidencia es insuficiente.
4. **Derivación Inmediata (Red Flags):** Si hay banderas rojas de emergencia (Tomo 01), la IA deriva inmediatamente a urgencias y cancela la vía de diagnóstico asíncrono.
5. **Cero Controlados:** Prohibición absoluta de recetar o recomendar medicamentos controlados. Solo OTC o antibióticos no controlados bajo estrictos guardrails y evidencia confirmada.
6. **Aprobaciones (ConSafeDev):** Cualquier cambio sustancial en la lógica clínica o legal debe solicitarse al usuario para que obtenga la aprobación del Médico y el Abogado.
7. **No asumas el Stack:** Revisa siempre los archivos de arquitectura (ej. `06_Arquitectura_Tecnica.md` y el `VOLCADO_COMPLETO...`) antes de escribir código.
8. **Cobertura Exhaustiva (Calidad Gold):** Cada Tomo (especialidad) del RAG debe contener un objetivo de **~5,000 chunks de conocimiento (o más)** para garantizar que la IA cubra todo el espectro de la especialidad.
9. **UI/UX No Genérico (Design System 2026):** Se prohíbe el uso de interfaces de chat genéricas. La app debe seguir estrictamente los patrones de `08_UI_UX_Design_System_2026.md`, incluyendo el **Conversational Care Canvas**, **Context Rail**, **Clinical Timeline River** y **Safety Ribbon**. Se requiere Glassmorphism, Dark Mode, animaciones Framer Motion y componentes premium tipo shadcn/ui.

---

## 5. Control de Errores y Hallazgos de la Transición (ChatGPT/Llama -> Gemini)
*   **Decisión de Base de Datos (RESUELTO):** El proyecto original documentaba PostgreSQL, mientras que un volcado posterior sugirió Firebase. **El usuario ha confirmado el uso de PostgreSQL en su servidor.** Se descarta Firebase/Firestore como base de datos primaria. Toda la arquitectura backend se construirá sobre SQL.
*   **Falta de Código:** A pesar de tener mucha documentación (prompts, reglas), se está procediendo a la inicialización del entorno.

---

## 6. Estado de Avance y Siguiente Paso (Handoff a Frontend/Jules)
La base de datos de conocimiento clínico está al 100% aprobada y el entorno **Next.js está inicializado** (`/web`). El siguiente bloque de trabajo pesado es el despliegue del diseño y la base de datos.

**Progreso Actual (Implementación UI/UX por Jules):**
- ✅ Se implementaron los patrones arquitectónicos dictados en `08_UI_UX_Design_System_2026.md`.
- ✅ Se crearon los componentes premium (Glassmorphism, Tailwind v4, framer-motion, lucide-react):
    - `ContextRail`: Panel lateral para estado del caso y evidencia.
    - `ConversationalCareCanvas`: Centro principal de acompañamiento clínico interactivo.
    - `ClinicalTimelineRiver`: Timeline de síntomas y eventos.
    - `SafetyRibbon`: Indicador persistente del estado de riesgo.
- ✅ Se integró la nueva UI en `page.tsx` y `layout.tsx` eliminando el diseño base genérico.

**Instrucciones para la siguiente IA / Siguientes Pasos:**
1.  **Handoff de Base de Datos:** En la carpeta `/web` se dejó un archivo `.env` configurado para **PostgreSQL**. Debes instalar Prisma (o Drizzle) e inicializar los esquemas de bases de datos para guardar pacientes y expedientes.
2.  **Lógica Interactiva y Estado Global:** Conectar los componentes UI estáticos creados a un estado global (ej. Zustand o Context) para manejar el flujo real de datos (envío de mensajes, actualizaciones del timeline).
3.  **Responsive Design Avanzado:** Implementar lógica de Drawer/BottomSheet para móviles en los componentes `ContextRail` y `ClinicalTimelineRiver`.

*(Al finalizar una tarea, la IA en turno debe actualizar este documento para reflejar el progreso, marcando con un "✅" y moviendo la tarea de "Pendiente" a "Completada".)*
