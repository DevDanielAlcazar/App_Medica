# Prompt 11 — Tomo 01 Medical/Legal Review Packet y Gate de Aprobación Controlada

## Rol operativo
Tu responsabilidad es preparar un paquete de revisión completo, auditable y accionable para que el médico y el abogado de la empresa puedan revisar el Tomo 01 sin fricción.

El arquitecto senior y equipo consafedev son responsables de la curación clínica y legal final. Tú solo debes estructurar, validar, reportar, organizar y dejar mecanismos de aprobación controlada.

## Contexto del proyecto

Repositorio local esperado:

```txt
D:\Desarrollos\App_Medica
```

Tomo activo:

```txt
data/medical-rag/tomes/01_red_flags_triage/
```

Release pack activo:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/
```

Input curado existente:

```txt
data/medical-rag/tomes/01_red_flags_triage/curated_input/
```

Validación existente:

```txt
data/medical-rag/tomes/01_red_flags_triage/validation/
```

El Tomo 01 contiene información de **red flags, triage y derivación inmediata**. Actualmente puede existir contenido curado en estado `release_candidate_clinical_review`, pero **no debe quedar productivo** hasta contar con aprobaciones explícitas y trazables.

## Objetivo del prompt

Crear un paquete integral para revisión médica/legal del Tomo 01 que permita:

1. Revisar todas las fuentes registradas.
2. Revisar todos los chunks clínicos existentes.
3. Confirmar riesgos por dominio clínico.
4. Validar licencias y permisos de uso.
5. Registrar observaciones por fuente y por chunk.
6. Registrar aprobación, rechazo o solicitud de cambios.
7. Mantener el release bloqueado para producción si faltan aprobaciones.
8. Crear un workflow claro para que futuras revisiones de tomos usen la misma metodología.

## Reglas críticas

- No inventes aprobaciones médicas.
- No inventes aprobaciones legales.
- No marques `production_allowed: true`.
- No cambies chunks clínicos salvo correcciones estructurales menores estrictamente necesarias para validar JSON/JSONL.
- No elimines chunks existentes.
- No elimines fuentes existentes.
- No agregues fuentes clínicas nuevas en este prompt.
- No descargues contenido externo.
- No generes recomendaciones médicas nuevas.
- No ocultes gaps, riesgos ni pendientes.
- Si detectas inconsistencias, repórtalas y crea lista de remediación.
- Si un archivo esperado no existe, crea el archivo faltante como plantilla y repórtalo.
- Si hay aprobación verbal mencionada por el usuario, trátala como **avance positivo**, pero no como aprobación formal hasta que exista evidencia documental dentro del repo.

## Archivos de entrada esperados

Verifica, si existen:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/tome_manifest.json
data/medical-rag/tomes/01_red_flags_triage/release/source_map.json
data/medical-rag/tomes/01_red_flags_triage/release/chunks.jsonl
data/medical-rag/tomes/01_red_flags_triage/release/CHANGELOG.md
data/medical-rag/tomes/01_red_flags_triage/validation/anti_under_triage_matrix.json
data/medical-rag/tomes/01_red_flags_triage/validation/evaluation_cases.jsonl
data/medical-rag/tomes/01_red_flags_triage/validation/clinical_safety_rules.json
```

## Salidas obligatorias

Crea la carpeta:

```txt
data/medical-rag/tomes/01_red_flags_triage/review_packet_v0_2/
```

Dentro crea como mínimo:

```txt
README.md
medical_review_guide.md
legal_review_guide.md
source_review_table.md
chunk_review_table.md
risk_domain_review_table.md
approval_matrix.json
approval_matrix.schema.json
review_findings_template.md
medical_signoff_template.md
legal_signoff_template.md
change_request_template.md
release_gate_checklist.md
review_summary.md
```

Además crea o actualiza:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/review_status.json
data/medical-rag/tomes/01_red_flags_triage/release/REVIEW_GATE.md
docs/reports/PROMPT_11_EXECUTION_REPORT.md
```

## Contenido esperado de cada archivo

### 1. `README.md`

Debe explicar:

- Qué contiene el review packet.
- Qué debe revisar el médico.
- Qué debe revisar el abogado.
- Qué no debe considerarse aprobado todavía.
- Cómo registrar hallazgos.
- Cómo emitir aprobación formal.
- Qué archivos son fuente de verdad.

### 2. `medical_review_guide.md`

Debe incluir una guía para revisión médica con enfoque en:

- Red flags correctamente clasificados.
- Riesgo de under-triage.
- Mensaje seguro al usuario.
- Poblaciones vulnerables.
- Consistencia ES/EN.
- Señales de derivación urgente.
- Señales de derivación presencial no urgente.
- Casos donde la IA debe pedir más información.
- Casos donde la IA no debe sugerir autocuidado.
- Verificación de `must_not_say`.
- Verificación de `safe_user_message`.

Incluye checklist con casillas Markdown.

### 3. `legal_review_guide.md`

Debe incluir una guía para revisión legal con enfoque en:

- Licencia de cada fuente.
- Permiso de reutilización.
- Riesgo de copyright.
- Restricciones de scraping, training, redistribución o transformación.
- Diferencia entre lectura, RAG retrieval, redistribución, entrenamiento y contenido derivado.
- Jurisdicción inicial México, Estados Unidos, LatAm y países de habla inglesa.
- Privacidad y datos sensibles.
- Necesidad de disclaimers.
- Trazabilidad de fuentes.
- Retención y eliminación.

Incluye checklist con casillas Markdown.

### 4. `source_review_table.md`

Genera una tabla derivada de `source_map.json` con columnas:

- source_id
- title
- publisher
- url
- jurisdiction
- language
- license_status
- medical_review_status
- legal_review_status
- risk_level
- allowed_use
- not_allowed_use
- reviewer_notes
- decision

Si algún campo no existe, usa `missing` y repórtalo.

### 5. `chunk_review_table.md`

Genera una tabla derivada de `chunks.jsonl` con columnas:

- chunk_id
- language
- clinical_domain
- population
- severity
- action_type
- red_flag_relevant
- source_ids
- medical_review_status
- legal_review_status
- under_triage_risk
- reviewer_notes
- decision

Si el archivo tiene muchos chunks, aun así incluye todos. El objetivo es que el médico pueda revisar uno por uno.

### 6. `risk_domain_review_table.md`

Debe consolidar dominios clínicos y cobertura:

- domain
- covered_by_chunks
- highest_severity
- has_es
- has_en
- source_count
- eval_case_count
- missing_elements
- risk_level
- recommended_next_action

Usa `anti_under_triage_matrix.json` y `evaluation_cases.jsonl` si existen.

### 7. `approval_matrix.schema.json`

Define un JSON Schema para la matriz de aprobación. Debe soportar:

- review_packet_version
- tome_id
- tome_version
- reviewer_type: `medical`, `legal`, `security`, `product`
- reviewer_name
- reviewer_role
- reviewer_license_or_identifier
- reviewed_at
- scope
- source_decisions
- chunk_decisions
- global_decision: `approved`, `approved_with_changes`, `rejected`, `needs_more_review`
- production_allowed
- notes
- signature_reference

### 8. `approval_matrix.json`

Crea una matriz inicial en estado pendiente. No inventes nombres reales. Usa placeholders claros:

```json
{
  "review_packet_version": "0.2.0",
  "tome_id": "01_red_flags_triage",
  "global_decision": "needs_more_review",
  "production_allowed": false
}
```

Completa con estructura válida conforme al schema.

### 9. `review_findings_template.md`

Plantilla para observaciones. Debe permitir registrar:

- ID del hallazgo.
- Tipo: clinical/legal/security/product.
- Severidad.
- Archivo afectado.
- Chunk o source afectado.
- Descripción.
- Evidencia.
- Recomendación.
- Responsable.
- Estado.

### 10. `medical_signoff_template.md`

Debe incluir una plantilla formal para firma médica:

- Nombre del médico.
- Cédula profesional.
- Especialidad.
- Alcance revisado.
- Fecha.
- Decisión.
- Restricciones.
- Firma/acuse.

### 11. `legal_signoff_template.md`

Debe incluir una plantilla formal para firma legal:

- Nombre del abogado/revisor.
- Rol.
- Alcance revisado.
- Fecha.
- Decisión.
- Restricciones.
- Firma/acuse.

### 12. `change_request_template.md`

Debe permitir levantar cambios por fuente, chunk, dominio o regla clínica.

### 13. `release_gate_checklist.md`

Checklist Go/No-Go para liberar el tomo:

- Todas las fuentes con revisión legal.
- Todos los chunks con revisión médica.
- Todos los chunks con revisión legal.
- Todos los chunks S5/S6 con revisión médica explícita.
- Todas las fuentes con licencia compatible.
- 0 chunks con `under_triage_risk = high` sin mitigación.
- 0 campos críticos `missing`.
- Casos de evaluación corren correctamente.
- Disclaimers revisados.
- Trazabilidad completa.
- `production_allowed` solo se puede cambiar con aprobación formal.

### 14. `review_summary.md`

Resumen ejecutivo con:

- total_sources
- total_chunks
- total_eval_cases
- clinical_review_pending
- legal_review_pending
- blockers
- recommended_actions
- release_readiness

### 15. `review_status.json`

Debe reflejar estado actual real:

```json
{
  "tome_id": "01_red_flags_triage",
  "review_packet_version": "0.2.0",
  "status": "pending_medical_and_legal_review",
  "production_allowed": false,
  "formal_medical_approval": false,
  "formal_legal_approval": false
}
```

Completa con conteos reales.

### 16. `REVIEW_GATE.md`

Debe explicar claramente que el tomo no puede usarse en producción hasta que se cumpla el gate formal. Incluye ruta de archivos que deben completarse.

### 17. `PROMPT_11_EXECUTION_REPORT.md`

Debe reportar:

- Archivos creados.
- Archivos modificados.
- Conteos reales de fuentes/chunks/casos.
- Campos faltantes.
- Riesgos detectados.
- Validaciones realizadas.
- Estado final.
- Siguiente prompt sugerido.

## Validaciones obligatorias

Ejecuta validaciones con Node.js o scripts simples del repo.

Valida:

1. `source_map.json` es JSON válido.
2. `tome_manifest.json` es JSON válido.
3. `chunks.jsonl` es JSONL válido.
4. `evaluation_cases.jsonl` es JSONL válido si existe.
5. `approval_matrix.json` cumple razonablemente el schema creado.
6. Ningún archivo contiene `production_allowed: true` salvo que exista aprobación formal explícita, que en este prompt no debe existir.
7. `review_status.json` queda con `production_allowed: false`.

Si hay fallos, corrige solo estructura y reporta.

## Criterios de aceptación

El prompt se considera exitoso si:

- El review packet existe.
- Todas las fuentes y chunks están listados para revisión.
- Existe matriz de aprobación estructurada.
- Existe gate de release explícito.
- El tomo sigue bloqueado para producción.
- Hay reporte final claro.
- No se inventaron aprobaciones.
- No se inventó medicina.

## Output final esperado en consola

Devuelve un resumen con este formato:

```md
# Resultado Prompt 11

## Archivos creados
- ...

## Archivos modificados
- ...

## Conteos
- Fuentes: N
- Chunks: N
- Casos de evaluación: N

## Estado del gate
- medical_review: pending
- legal_review: pending
- production_allowed: false

## Riesgos / bloqueadores
- ...

## Validaciones realizadas
- ...

## Siguiente prompt sugerido
Prompt 12 — Aplicación de feedback médico/legal o expansión curada v0.3 del Tomo 01, según decisión del equipo.
```
