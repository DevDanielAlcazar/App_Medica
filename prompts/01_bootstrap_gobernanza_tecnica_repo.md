# Prompt 01 — Bootstrap de gobernanza técnica, lectura crítica y baseline del repositorio

## Propósito del prompt


La intención de esta primera tarea **no es construir features todavía**. El objetivo es que el dev junior asistido por IA lea la documentación existente, consolide el contexto del proyecto, identifique riesgos/gates y deje el repositorio preparado para trabajar con trazabilidad, orden y control técnico.

---

## Modelos recomendados para ejecutar este prompt

### Opción 1 — Poolside Laguna M.1
**Uso recomendado:** modelo principal para esta tarea.

**Por qué:** es una buena opción para trabajo de ingeniería de software, lectura de contexto, decisiones de repo, documentación técnica y tareas agentic coding con varios archivos. Para esta tarea conviene porque debe inspeccionar carpetas, razonar sobre arquitectura y generar varios documentos de control sin saltarse pasos.

**Cuándo usarlo:** si tienes acceso desde Poolside, OpenRouter, OpenCode o AionUI y responde estable con contexto largo.

**Si no está disponible:** usa Qwen3 Coder 480B A35B o DeepSeek V4 Flash.

---

### Opción 2 — Qwen3 Coder 480B A35B
**Uso recomendado:** alternativa principal para análisis de repositorio y generación ordenada de archivos.

**Por qué:** está orientado a tareas de coding agentic, uso de herramientas, razonamiento sobre repositorios y contexto largo. Es especialmente útil para seguir instrucciones detalladas y producir estructura técnica consistente.

**Cuándo usarlo:** si Laguna no está disponible, si necesitas mayor contexto o si estás trabajando vía OpenRouter.

**Si no está disponible:** usa DeepSeek V4 Flash para la ejecución y Nemotron Ultra como revisor.

---

### Opción 3 — DeepSeek V4 Flash / DeepSeek Flash Free
**Uso recomendado:** alternativa costo/velocidad para iteraciones rápidas.

**Por qué:** suele ser eficiente para tareas de documentación técnica, refactor ligero, generación de estructura y seguimiento de instrucciones. Es buena opción si quieres ahorrar créditos o usar modelos gratuitos.

**Cuándo usarlo:** cuando quieras generar rápido el baseline y luego pedir revisión a otro modelo más fuerte.

**Si no está disponible:** usa GPT-OSS-120B o Qwen Coder disponible en tu proveedor.

---

### Opción 4 — Nemotron Ultra / Nemotron 3 Ultra
**Uso recomendado:** revisor, no necesariamente ejecutor principal.

**Por qué:** puede funcionar muy bien como segunda opinión para riesgos, consistencia, gobernanza y validación de criterios de aceptación. Para esta tarea lo usaría después de generar los documentos, pidiéndole auditar omisiones y puntos débiles.

**Cuándo usarlo:** después de que Laguna, Qwen o DeepSeek generen los archivos.

---

### Opción 5 — GPT-OSS-120B / GPT-OSS-20B
**Uso recomendado:** razonamiento técnico, revisión de consistencia y generación de documentación si está disponible en Groq, Cerebras, OpenRouter u otro proveedor.

**Por qué:** es útil cuando necesitas un modelo abierto con buena capacidad de razonamiento, especialmente para revisar arquitectura y criterios de calidad.

**Cuándo usarlo:** como fallback si Poolside/Qwen/DeepSeek no están disponibles o como revisor final.

---

## Prompt para copiar y pegar en OpenCode / AionUI / Antigravity / Gemini CLI

```md
# Rol

Actúa como **desarrollador senior de software**, trabajando bajo la dirección de un **arquitecto senior**. Tu responsabilidad es ejecutar la tarea con disciplina, sin improvisar alcance, sin inventar requisitos y sin modificar destructivamente el proyecto.

Estás trabajando en una aplicación médica web/PWA llamada **App Médica**. Este sistema tendrá IA clínica, médicos humanos validados, expedientes clínicos, videocitas por Google Meet, pagos reales, dashboard administrativo, AI Gateway multi-proveedor, modo claro/oscuro, internacionalización ES/EN y operación inicial para México, Estados Unidos, Latinoamérica y países de habla inglesa.

Este proyecto maneja datos sensibles de salud, por lo que debes priorizar seguridad, trazabilidad, privacidad, auditoría y gates clínico-legales.

---

# Directorio de trabajo

Trabaja dentro de:

```text
D:\Desarrollos\App_Medica
```

Antes de hacer cualquier cambio:

1. Confirma en qué carpeta estás.
2. Lista los archivos y carpetas existentes.
3. Identifica si ya existe `.git`, `package.json`, `README.md`, carpetas `docs`, `src`, `app`, `packages` o similares.
4. Lee todos los documentos `.md` existentes en la raíz o subcarpetas directas.
5. Si existe un Excel del tracker, intenta identificarlo, pero no dependas de poder leerlo. Si no puedes leerlo, repórtalo y continúa usando los `.md`.

---

# Objetivo de esta tarea

Generar un **bootstrap documental y de gobernanza técnica** para que el proyecto pueda iniciar desarrollo sin perder trazabilidad.

No debes construir funcionalidades todavía. No debes crear pantallas, APIs clínicas, autenticación, pagos, IA real ni base de datos. Esta tarea es de preparación profesional del repositorio.

---

# Decisiones cerradas que debes respetar

- La app será web/PWA 100% responsiva.
- No se trabajará como MVP básico; la primera versión pública debe ser un release productivo.
- Stack objetivo documentado: Next.js App Router, React, TypeScript estricto, Node.js modular, PostgreSQL, Redis/BullMQ o equivalente, file storage cifrado, AI Gateway multi-proveedor, Clinical Guardrails, PM2, Cloudflare Tunnel y Debian.
- Debe tener modo claro/oscuro con botón intuitivo dentro de la app.
- Debe tener i18n ES/EN y detección inicial de región/idioma.
- Médicos: deben registrarse con cédula profesional y adjuntar INE o cédula. Quedan en estatus `En revisión` hasta validación humana por admin/soporte. Solo en estatus `Activo` pueden tomar citas.
- Videocitas: Google Meet.
- IA: debe permitir proveedores dinámicos OpenAI-compatible, Claude-compatible y genérico HTTP configurable.
- La IA puede emitir diagnóstico/orientación y `Recomendación Sintomatológica`, pero nunca medicamentos controlados.
- OTC y pediatría pueden contemplarse únicamente con guardrails, evidencia suficiente, red flags y derivación a consulta médica presencial cuando corresponda.
- Expedientes: el usuario puede eliminarlos manualmente. Si no los elimina, después de 6 meses en estado `Curado` deben eliminarse para ahorrar espacio y proteger privacidad.
- Notificaciones: Gmail configurable por admin.
- Pagos: reales en producción; sandbox solo en QA.
- Deploy: GitHub → servidor Debian → PM2 → Cloudflare Tunnel.
- No exponer secretos al frontend.
- No guardar PHI/datos sensibles en logs ordinarios.
- No hardcodear API keys.

---

# Alcance permitido

Puedes crear o actualizar únicamente archivos de documentación, configuración base segura y control de proyecto.

Puedes crear, si no existen:

```text
README.md
.gitignore
.editorconfig
.env.example
docs/
docs/adr/
docs/ai/
docs/clinical/
docs/compliance/
docs/delivery/
docs/quality/
docs/security/
docs/reports/
prompts/
prompts/README.md
```

No inicialices una aplicación Next.js todavía.
No instales dependencias.
No ejecutes migraciones.
No crees base de datos.
No implementes servicios reales.
No crees UI todavía.
No modifiques archivos originales de documentación masivamente.
Si necesitas actualizar un archivo existente, hazlo con cambios mínimos y explica qué cambiaste.

---

# Archivos que debes generar o actualizar

## 1. `README.md`

Debe contener:

- Nombre del proyecto.
- Descripción ejecutiva.
- Advertencia de dominio sensible: salud, datos personales sensibles, IA clínica.
- Estado actual del proyecto.
- Stack objetivo.
- Principios de desarrollo.
- Estructura documental.
- Cómo trabajar con prompts.
- Gates antes de producción.
- Nota clara: ningún secreto debe entrar al repositorio.

Si ya existe, conserva lo útil y mejora sin borrar contexto importante.

---

## 2. `.gitignore`

Debe cubrir como mínimo:

- Node/Next.
- Logs.
- `.env` y variantes reales.
- Builds.
- Cache.
- Archivos temporales.
- Uploads locales.
- Backups.
- Bases SQLite temporales si aparecen.
- Storage local sensible.

No ignores `.env.example`.

---

## 3. `.editorconfig`

Usa una configuración estándar y estricta:

- UTF-8.
- LF.
- indentación de 2 espacios para JS/TS/JSON/MD/YAML.
- trim trailing whitespace.
- insert final newline.

---

## 4. `.env.example`

Debe incluir variables placeholder, nunca secretos reales.

Agrupa por secciones:

- App.
- Base de datos.
- Redis/Queue.
- Auth.
- File storage.
- Encryption.
- Gmail notifications.
- Google Meet.
- Payments.
- AI Gateway.
- Observability.
- Retention jobs.

Todas las variables deben traer valor de ejemplo seguro o comentario claro.

---

## 5. `docs/_PROJECT_CONTEXT_COMPILED.md`

Documento consolidado del proyecto.

Debe incluir:

- Resumen del producto.
- Roles: paciente, médico, admin, soporte, superadmin.
- Dominios funcionales.
- Decisiones cerradas.
- Pendientes no bloqueantes.
- Pendientes bloqueantes/gates antes de producción.
- Riesgos principales.
- No negociables técnicos.
- Glosario: expediente, curado, Recomendación Sintomatológica, red flags, AI Gateway, proveedor IA, modelo activo, médico en revisión.

---

## 6. `docs/adr/ADR-0001-stack-y-gobernanza.md`

Crea un ADR formal con:

- Contexto.
- Decisión.
- Alternativas consideradas.
- Consecuencias positivas.
- Riesgos.
- Mitigaciones.
- Fecha.
- Estado: `Aceptado`.

Debe dejar claro por qué se usará:

- Next.js App Router.
- TypeScript estricto.
- PostgreSQL.
- Redis/BullMQ o equivalente.
- Arquitectura modular por bounded contexts.
- PM2 + Cloudflare Tunnel en Debian.
- AI Gateway multi-proveedor.

---

## 7. `docs/delivery/RELEASE_GATES.md`

Checklist Go/No-Go para release productivo.

Debe incluir secciones:

- Legal/compliance.
- Seguridad.
- Privacidad.
- Clínica/guardrails.
- Médicos humanos.
- Pagos.
- Google Meet.
- AI Gateway.
- Observabilidad.
- Rendimiento.
- Accesibilidad.
- UX.
- Retención/eliminación.
- Backups.
- Rollback.

Cada ítem debe tener columnas en Markdown:

```text
ID | Gate | Responsable sugerido | Evidencia requerida | Estado
```

Estados permitidos:

- Pendiente
- En progreso
- Bloqueado
- Validado

---

## 8. `docs/quality/DEFINITION_OF_DONE.md`

Define la DoD del proyecto.

Debe incluir:

- DoD para feature.
- DoD para API.
- DoD para UI.
- DoD para módulo clínico.
- DoD para IA.
- DoD para pagos.
- DoD para datos sensibles.
- DoD para release.

Incluye reglas:

- Tests mínimos.
- Validación de accesibilidad.
- Revisión de seguridad.
- Logs sin PHI.
- Documentación actualizada.
- Manejo de errores.
- Auditoría.

---

## 9. `docs/security/SECURITY_AND_PRIVACY_BASELINE.md`

Debe documentar baseline de seguridad:

- Principios.
- Clasificación de datos.
- Datos sensibles de salud.
- Secretos.
- Cifrado.
- Logs.
- Auditoría.
- RBAC/ABAC.
- Sesiones.
- Rate limiting.
- Eliminación de expediente.
- Retención 6 meses en estado `Curado`.
- Backups.
- Incidentes.

No prometas cumplimiento legal absoluto. Usa lenguaje de control técnico y gates.

---

## 10. `docs/clinical/CLINICAL_GUARDRAILS_INDEX.md`

Debe consolidar guardrails clínicos de alto nivel, sin crear motor clínico todavía.

Incluye:

- Qué puede hacer la IA.
- Qué no puede hacer.
- Prohibición de medicamentos controlados.
- Condiciones para emitir `Recomendación Sintomatológica`.
- Manejo de pediatría.
- Red flags.
- Cuándo pedir más evidencia.
- Cuándo derivar a consulta médica presencial.
- Participación de médico humano.
- Auditoría de decisiones clínicas.
- Disclaimer operativo.

Incluye frase clave:

> Si la evidencia clínica es insuficiente, contradictoria o existen red flags, la IA debe detener recomendación sintomatológica y derivar a evaluación humana/presencial según riesgo.

---

## 11. `docs/ai/AI_GATEWAY_BASELINE.md`

Debe documentar:

- Protocolos soportados: OpenAI-compatible, Claude-compatible, genérico HTTP.
- Entidades principales: Provider, ApiKey, Model, RoutingPolicy, Healthcheck, UsageLog.
- Autorouting.
- Fallback.
- Presupuesto.
- Healthcheck.
- Activación/desactivación de modelos.
- Restricción de PHI por proveedor no aprobado.
- Cifrado de API keys.
- No exposición al frontend.
- Casos de uso: triage, recomendación sintomatológica, resumen, traducción, búsqueda web médica, soporte, admin.

No implementes código todavía.

---

## 12. `docs/reports/PROMPT_01_EXECUTION_REPORT.md`

Reporte final de ejecución.

Debe incluir:

- Fecha/hora local si puedes obtenerla.
- Modelo usado si el entorno lo expone o si lo sabes.
- Archivos inspeccionados.
- Archivos creados.
- Archivos modificados.
- Decisiones detectadas.
- Riesgos detectados.
- Bloqueadores.
- Dudas para el arquitecto senior.
- Recomendación del siguiente prompt.
- Comandos ejecutados.

---

# Reglas de calidad obligatorias

1. No inventes requisitos clínicos finos.
2. No generes consejos médicos reales.
3. No implementes features.
4. No instales paquetes.
5. No crees secretos reales.
6. No borres documentos existentes.
7. No cambies nombres de archivos existentes salvo que sea estrictamente necesario.
8. No prometas cumplimiento legal absoluto.
9. No uses frases ambiguas como “esto garantiza seguridad total”.
10. Mantén el tono técnico, claro y operativo.
11. Todo documento debe estar escrito en español.
12. Todo debe quedar listo para que otro agente continúe con el Prompt 02.

---

# Validación antes de terminar

Antes de finalizar:

1. Ejecuta una revisión de archivos creados/modificados.
2. Verifica que no se crearon `.env` reales.
3. Verifica que `.env.example` no tenga secretos.
4. Verifica que no se implementó código de negocio.
5. Verifica que todos los documentos tienen contenido real, no placeholders vacíos.
6. Si hay Git disponible, muestra `git status --short`. Si no hay Git, repórtalo.
7. Genera el reporte `docs/reports/PROMPT_01_EXECUTION_REPORT.md`.

---

# Formato de respuesta final

Responde con este formato:

```md
## Resultado Prompt 01

### Archivos creados
- ...

### Archivos modificados
- ...

### Riesgos o bloqueadores detectados
- ...

### Validaciones realizadas
- ...

### Siguiente prompt sugerido
Prompt 02 — Scaffolding técnico Next.js/TypeScript y estructura modular inicial.

### Notas para el arquitecto senior
- ...
```

No devuelvas explicaciones largas fuera de este formato.
```

---

## Criterio de aceptación del arquitecto senior

Este prompt se considera exitoso si al terminar existe un baseline claro para que el siguiente agente pueda crear el scaffolding técnico sin perder contexto, sin duplicar decisiones y sin comprometer seguridad o cumplimiento médico.

