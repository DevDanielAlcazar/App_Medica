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
- **Expansión Candidata v0.3 (Prompt 12B):** Se generó la estructura de la expansión candidata v0.3 (nuevas fuentes y chunks sobre fiebre, deshidratación, sobredosis, etc.) en `candidates/v0_3/`, quedando en estado `pending` de revisión médico/legal sin contaminar el entorno de producción.
- **Tomo 02 (Medicina General) - Candidate v0.1:** Se inició la curación del Tomo 02 (Primary Care) con fuentes Gold Standard (ADA 2024 para Diabetes, AHA/ACC para Hipertensión, USPSTF para Screening), generando la estructura candidata pendiente de revisión.
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
8. **Cobertura Exhaustiva (Calidad Gold):** Cada Tomo (especialidad) del RAG debe contener un objetivo de **~5,000 chunks de conocimiento (o más)** para garantizar que la IA cubra todo el espectro de la especialidad, utilizando un pipeline automatizado de minería de literatura científica.

---

## 5. Control de Errores y Hallazgos de la Transición (ChatGPT/Llama -> Gemini)
*   **Decisión de Base de Datos (RESUELTO):** El proyecto original documentaba PostgreSQL, mientras que un volcado posterior sugirió Firebase. **El usuario ha confirmado el uso de PostgreSQL en su servidor.** Se descarta Firebase/Firestore como base de datos primaria. Toda la arquitectura backend se construirá sobre SQL.
*   **Falta de Código:** A pesar de tener mucha documentación (prompts, reglas), no hay un `package.json` ni entorno inicializado de Next.js en la raíz. La transición requiere pasar de la teoría a la inicialización del repositorio.

---

## 6. Próximo Lote de Tareas (Siguiente Paso)
Ya que la carga de prompts estructurales del RAG ha avanzado, el siguiente lote se enfoca en inicializar el entorno técnico:

1.  **Correr Scripts de Validación (Opcional):** Ejecutar scripts en `tools/medical-rag/` si es necesario asegurar el JSON.
2.  **Inicialización del Frontend:** Crear el proyecto Next.js (`npx create-next-app@latest`) con TailwindCSS (si se confirma) en la raíz o subcarpeta.
3.  **Setup de Base de Datos:** Confirmar y configurar el SDK de Firebase o PostgreSQL.

*(Al finalizar una tarea, la IA en turno debe actualizar este documento para reflejar el progreso, marcando con un "✅" y moviendo la tarea de "Pendiente" a "Completada".)*
