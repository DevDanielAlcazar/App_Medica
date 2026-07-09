# Prompt 06 — Construcción del Tomo 01 Release Pack v0.1

## Rol operativo

Actúa como **desarrollador senior** dentro del proyecto `App_Medica`.

El arquitecto senior ya definió la estrategia: el **Tomo 01 — Red Flags, Triage y Derivación Inmediata** será el primer bloque crítico del Medical RAG. Tu trabajo en este prompt **NO es inventar medicina**, **NO es diagnosticar**, **NO es escribir recomendaciones clínicas finales** y **NO es descargar fuentes externas**.

Tu responsabilidad es construir el **release pack técnico/documental v0.1** donde posteriormente el arquitecto senior depositará los chunks clínicos curados, con evidencia, licencias revisadas y validación médica/legal.

---

## Contexto obligatorio del proyecto

Proyecto local:

```text
D:\Desarrollos\App_Medica
```

Estructuras existentes esperadas por prompts previos:

```text
data/medical-rag/
data/medical-rag/registry/
data/medical-rag/source-discovery/tome_01_red_flags_triage/
data/medical-rag/tomes/01_red_flags_triage/authoring/
data/medical-rag/governance/
data/medical-rag/lifecycle/
docs/architecture/
docs/reports/
```

Carpeta objetivo para este prompt:

```text
data/medical-rag/tomes/01_red_flags_triage/release/
```

---

## Principios no negociables

1. **No crear contenido clínico final inventado.**
2. **No marcar ninguna fuente como aprobada si sigue pendiente de revisión legal/médica.**
3. **No hacer scraping, descargas ni llamadas web.**
4. **No copiar texto largo de fuentes externas.**
5. **No agregar secretos, API keys, tokens ni credenciales.**
6. **No modificar arquitectura previa de forma destructiva.**
7. **No borrar archivos existentes.**
8. **No romper rutas creadas en prompts anteriores.**
9. **No declarar el tomo como listo para producción.**
10. **No usar lenguaje de autonomía médica absoluta.**

Este release pack debe quedar en estado:

```text
release_candidate_draft
```

No debe quedar en estado:

```text
approved_for_production
```

---

## Objetivo del prompt

Crear un paquete base para el Tomo 01 con:

- Manifest del tomo.
- Mapa de fuentes.
- Contrato de chunks.
- Archivo JSONL de chunks vacío o con ejemplos no clínicos claramente marcados como `example_only`.
- Política de retrieval.
- Política de seguridad anti under-triage.
- Plantillas de revisión clínica/legal.
- Checklist de release.
- Reporte de ejecución.
- Script simple de validación estructural sin dependencias externas.

---

## Tareas obligatorias

### 1. Inspección inicial del repositorio

Antes de escribir archivos, revisa si existen:

```text
data/medical-rag/README.md
data/medical-rag/registry/source_registry.schema.json
data/medical-rag/source-discovery/tome_01_red_flags_triage/
data/medical-rag/tomes/01_red_flags_triage/authoring/
docs/architecture/MEDICAL_RAG_ARCHITECTURE.md
```

Si algo no existe, no falles agresivamente. Registra el faltante en el reporte y crea únicamente lo necesario para continuar sin romper el proyecto.

---

### 2. Crear carpeta release

Crea:

```text
data/medical-rag/tomes/01_red_flags_triage/release/
```

Dentro crea también:

```text
data/medical-rag/tomes/01_red_flags_triage/release/reviews/
data/medical-rag/tomes/01_red_flags_triage/release/evaluation/
data/medical-rag/tomes/01_red_flags_triage/release/contracts/
data/medical-rag/tomes/01_red_flags_triage/release/examples/
```

---

### 3. Crear `tome_manifest.json`

Ruta:

```text
data/medical-rag/tomes/01_red_flags_triage/release/tome_manifest.json
```

Debe incluir como mínimo:

```json
{
  "tome_id": "01_red_flags_triage",
  "tome_name": "Red Flags, Triage y Derivación Inmediata",
  "version": "0.1.0-draft",
  "status": "release_candidate_draft",
  "clinical_status": "pending_medical_review",
  "legal_status": "pending_legal_review",
  "license_status": "pending_license_review",
  "intended_use": [
    "triage_safety_support",
    "red_flag_detection_support",
    "urgent_care_escalation_support",
    "clinical_decision_support"
  ],
  "prohibited_use": [
    "autonomous_diagnosis_without_review",
    "controlled_medication_prescription",
    "replacement_of_emergency_services",
    "replacement_of_human_medical_judgment"
  ],
  "jurisdictions_initial": ["MX", "US", "LATAM", "EN_SPEAKING"],
  "languages_initial": ["es", "en"],
  "population_scope": [
    "adult",
    "pediatric",
    "pregnancy",
    "older_adult",
    "immunocompromised"
  ],
  "highest_priority_rule": "when_in_doubt_escalate_to_human_or_emergency_care",
  "production_gate": {
    "requires_medical_signoff": true,
    "requires_legal_signoff": true,
    "requires_license_signoff": true,
    "requires_under_triage_eval_pass": true,
    "requires_bilingual_review": true
  }
}
```

Puedes enriquecerlo, pero no elimines estos campos.

---

### 4. Crear `source_map.json`

Ruta:

```text
data/medical-rag/tomes/01_red_flags_triage/release/source_map.json
```

Debe mapear las fuentes candidatas creadas en el Prompt 04. Si puedes leer un archivo de fuentes candidatas dentro de:

```text
data/medical-rag/source-discovery/tome_01_red_flags_triage/
```

úsalo para poblar el mapa. Si no puedes determinar la estructura exacta, crea un mapa base con esta forma:

```json
{
  "tome_id": "01_red_flags_triage",
  "source_policy": "candidate_sources_only_until_reviewed",
  "sources": [
    {
      "source_id": "F001",
      "title": "Candidate source from discovery pack",
      "publisher": "pending",
      "url": "pending",
      "license_status": "pending_license_review",
      "medical_status": "pending_medical_review",
      "legal_status": "pending_legal_review",
      "allowed_for_chunking": false,
      "allowed_for_production": false,
      "notes": "Replace with source discovery metadata when available."
    }
  ]
}
```

Regla obligatoria: todos los `allowed_for_production` deben estar en `false` en este prompt.

---

### 5. Crear contrato de chunk clínico

Ruta:

```text
data/medical-rag/tomes/01_red_flags_triage/release/contracts/chunk_contract.schema.json
```

Debe definir un contrato JSON Schema para cada chunk. Campos mínimos:

```json
{
  "chunk_id": "string",
  "tome_id": "string",
  "version": "string",
  "language": "es|en",
  "source_ids": ["string"],
  "license_status": "pending_license_review|approved|restricted|rejected",
  "clinical_status": "draft|pending_medical_review|approved|rejected|deprecated",
  "legal_status": "pending_legal_review|approved|restricted|rejected",
  "specialty": "string",
  "clinical_domain": "string",
  "population": ["adult|pediatric|pregnancy|older_adult|immunocompromised|general"],
  "severity_level": "S0|S1|S2|S3|S4|S5|S6",
  "red_flag_relevant": "boolean",
  "clinical_action_type": "emergency_now|urgent_same_day|medical_visit|self_care_possible|ask_more_questions|insufficient_evidence",
  "must_ask": ["string"],
  "must_not_say": ["string"],
  "safe_user_message": "string",
  "internal_reasoning_summary": "string",
  "evidence_summary": "string",
  "retrieval_keywords": ["string"],
  "created_at": "string",
  "reviewed_at": "string|null",
  "reviewers": ["string"],
  "is_example_only": "boolean",
  "production_allowed": "boolean"
}
```

Agrega validaciones razonables de tipos, enums y required fields.

---

### 6. Crear `chunks.jsonl`

Ruta:

```text
data/medical-rag/tomes/01_red_flags_triage/release/chunks.jsonl
```

Debe quedar vacío o contener máximo 1 ejemplo **no clínico** marcado como:

```json
"is_example_only": true,
"production_allowed": false
```

Si decides incluir un ejemplo, que sea un ejemplo estructural sin recomendación médica real. Ejemplo aceptable:

```json
{"chunk_id":"EXAMPLE_ONLY_DO_NOT_USE","tome_id":"01_red_flags_triage","version":"0.1.0-draft","language":"es","source_ids":[],"license_status":"pending_license_review","clinical_status":"draft","legal_status":"pending_legal_review","specialty":"example","clinical_domain":"example","population":["general"],"severity_level":"S0","red_flag_relevant":false,"clinical_action_type":"insufficient_evidence","must_ask":["Campo requerido de ejemplo"],"must_not_say":["No usar este ejemplo en producción"],"safe_user_message":"Ejemplo estructural no clínico. No usar en producción.","internal_reasoning_summary":"Ejemplo para validar estructura JSONL.","evidence_summary":"Sin evidencia clínica; ejemplo estructural.","retrieval_keywords":["example"],"created_at":"2026-07-08","reviewed_at":null,"reviewers":[],"is_example_only":true,"production_allowed":false}
```

No agregues chunks clínicos reales en este prompt.

---

### 7. Crear política de retrieval

Ruta:

```text
data/medical-rag/tomes/01_red_flags_triage/release/retrieval_policy.json
```

Debe definir reglas para que el Tomo 01 prevalezca sobre tomos menos críticos:

- Si un chunk `red_flag_relevant=true`, debe elevar prioridad.
- Si hay conflicto entre severidades, gana la severidad más alta.
- Si hay población vulnerable, aumenta cautela.
- Si falta evidencia, debe pedir datos mínimos o derivar.
- Si la intención del usuario implica urgencia, activar recuperación prioritaria del Tomo 01.
- Si el modelo no encuentra evidencia suficiente, debe responder con insuficiencia de evidencia y ruta segura.

Incluye una política de ranking conceptual:

```text
severity_level > population_risk > source_evidence_level > recency > jurisdiction_match > language_match
```

---

### 8. Crear política anti under-triage

Ruta:

```text
data/medical-rag/tomes/01_red_flags_triage/release/anti_under_triage_policy.md
```

Debe establecer:

- Definición de under-triage.
- Por qué es un riesgo crítico.
- Regla de prevalencia de severidad alta.
- Conducta ante síntomas ambiguos.
- Conducta ante poblaciones vulnerables.
- Conducta ante falta de datos.
- Conducta ante contradicción de fuentes.
- Frases prohibidas para minimizar urgencias.
- Frases seguras para derivación.

No incluyas recomendaciones clínicas específicas finales; mantén el documento como política de seguridad.

---

### 9. Crear plantillas de revisión

Crear:

```text
data/medical-rag/tomes/01_red_flags_triage/release/reviews/clinical_review_report.md
data/medical-rag/tomes/01_red_flags_triage/release/reviews/legal_review_report.md
data/medical-rag/tomes/01_red_flags_triage/release/reviews/license_review_report.md
```

Cada plantilla debe incluir:

- Estado.
- Reviewer.
- Fecha.
- Alcance.
- Hallazgos.
- Bloqueadores.
- Decisión.
- Firma.
- Cambios requeridos.
- Riesgo residual.

Estados permitidos:

```text
pending
approved
approved_with_conditions
rejected
```

---

### 10. Crear evaluación base

Crear:

```text
data/medical-rag/tomes/01_red_flags_triage/release/evaluation/eval_plan.md
data/medical-rag/tomes/01_red_flags_triage/release/evaluation/eval_cases.schema.json
data/medical-rag/tomes/01_red_flags_triage/release/evaluation/eval_cases_seed.jsonl
data/medical-rag/tomes/01_red_flags_triage/release/evaluation/eval_report.md
```

`eval_cases_seed.jsonl` puede contener placeholders de casos sin detalle clínico real o con campos vacíos para completar posteriormente. Cada caso debe incluir:

```json
{
  "case_id": "string",
  "language": "es|en",
  "population": "adult|pediatric|pregnancy|older_adult|immunocompromised|general",
  "input_summary": "string",
  "expected_minimum_action": "emergency_now|urgent_same_day|medical_visit|self_care_possible|ask_more_questions|insufficient_evidence",
  "must_detect": ["string"],
  "must_not_say": ["string"],
  "source_ids_expected": ["string"],
  "review_status": "draft|medical_reviewed|rejected"
}
```

No crear 60 casos médicos reales todavía. Solo crear schema, plan y placeholders suficientes para que el arquitecto senior pueda cargar la evaluación real después.

---

### 11. Crear checklist de release

Ruta:

```text
data/medical-rag/tomes/01_red_flags_triage/release/RELEASE_CHECKLIST.md
```

Debe tener checklist para:

- Fuentes.
- Licencias.
- Chunking.
- Traducción ES/EN.
- Revisión médica.
- Revisión legal.
- Evaluación anti under-triage.
- QA técnico.
- Seguridad.
- Observabilidad.
- Rollback.
- Aprobación final.

Debe dejar claro que este release pack **no está listo para producción**.

---

### 12. Crear `CHANGELOG.md`

Ruta:

```text
data/medical-rag/tomes/01_red_flags_triage/release/CHANGELOG.md
```

Primera entrada:

```text
## 0.1.0-draft
- Created release pack structure for Tome 01.
- Added manifest, source map, chunk contract, retrieval policy, review templates and evaluation skeleton.
- No clinical production chunks included.
```

---

### 13. Crear script de validación estructural

Crea o actualiza sin romper:

```text
data/medical-rag/pipeline/validate_tome_release.mjs
```

El script debe:

- Recibir ruta del tomo por argumento o usar por defecto `data/medical-rag/tomes/01_red_flags_triage/release`.
- Validar existencia de archivos obligatorios.
- Validar que `tome_manifest.json` sea JSON válido.
- Validar que `source_map.json` sea JSON válido.
- Validar que todos los sources tengan `allowed_for_production=false` si el manifest está en draft.
- Validar que cada línea de `chunks.jsonl`, si existe, sea JSON válido.
- Validar que ningún chunk tenga `production_allowed=true` en esta etapa.
- Imprimir reporte legible.
- Salir con código `0` si pasa y `1` si falla.

No agregues dependencias externas. Usa Node.js estándar.

Ejemplo de ejecución esperada:

```bash
node data/medical-rag/pipeline/validate_tome_release.mjs
```

---

### 14. Actualizar documentación existente

Actualizar de forma no destructiva:

```text
data/medical-rag/README.md
docs/architecture/MEDICAL_RAG_ARCHITECTURE.md
```

Agregar una sección corta indicando que existe el release pack:

```text
data/medical-rag/tomes/01_red_flags_triage/release/
```

Y que el estado es:

```text
release_candidate_draft
```

---

### 15. Crear reporte de ejecución

Ruta:

```text
docs/reports/PROMPT_06_EXECUTION_REPORT.md
```

Debe incluir:

- Archivos creados.
- Archivos modificados.
- Decisiones técnicas aplicadas.
- Riesgos/bloqueadores.
- Validaciones realizadas.
- Resultado del script de validación.
- Siguiente prompt sugerido.

Siguiente prompt sugerido:

```text
Prompt 07 — Generación curada del Tomo 01 v0.1 por el arquitecto senior: fuentes aprobadas, chunks clínicos reales, source map final y evaluación inicial.
```

---

## Validaciones obligatorias antes de terminar

Ejecuta, si es posible:

```bash
node data/medical-rag/pipeline/validate_tome_release.mjs
```

Si falla, corrige.

Si no puedes ejecutar Node.js, indícalo en el reporte y valida manualmente estructura y JSON.

---

## Definition of Done

El prompt se considera completo solo si:

- Existe `data/medical-rag/tomes/01_red_flags_triage/release/`.
- Existe `tome_manifest.json` válido.
- Existe `source_map.json` válido.
- Existe contrato de chunk.
- Existe `chunks.jsonl` sin contenido clínico productivo.
- Existe política anti under-triage.
- Existen plantillas de revisión clínica/legal/licencia.
- Existe evaluación base.
- Existe checklist de release.
- Existe script de validación estructural.
- El script pasa o se documenta claramente por qué no pudo ejecutarse.
- No se agregó contenido clínico inventado.
- No se declaró nada como aprobado para producción.

---

## Salida esperada en consola

Entrega un resumen final con este formato:

```markdown
# Resultado Prompt 06

## Archivos creados
- ...

## Archivos modificados
- ...

## Validaciones realizadas
- ...

## Riesgos o bloqueadores
- ...

## Estado del release pack
release_candidate_draft

## Carpeta donde el arquitecto senior depositará el Tomo 01 real
`data/medical-rag/tomes/01_red_flags_triage/release/`

## Siguiente prompt sugerido
Prompt 07 — Generación curada del Tomo 01 v0.1 por el arquitecto senior.
```
