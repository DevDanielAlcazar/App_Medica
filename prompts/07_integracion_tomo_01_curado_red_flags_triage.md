# Prompt 07 — Integración del Tomo 01 Curado: Red Flags, Triage y Derivación Inmediata

## Rol operativo

Actúa como **desarrollador Jr asistido por IA** dentro del proyecto `App_Medica`.

Tu responsabilidad es **preparar e integrar** el contenido clínico curado del **Tomo 01 — Red Flags, Triage y Derivación Inmediata** dentro del release pack existente.

El contenido médico real será entregado por el arquitecto senior en archivos curados. Tu trabajo es **validar estructura, normalizar, transformar, documentar y dejar trazabilidad**. No debes crear conocimiento clínico desde cero.

---

## Contexto del proyecto

Ruta raíz esperada:

```txt
D:\Desarrollos\App_Medica
```

Ya existen estructuras previas para:

```txt
data/medical-rag/
data/medical-rag/tomes/01_red_flags_triage/authoring/
data/medical-rag/tomes/01_red_flags_triage/release/
data/medical-rag/source-discovery/tome_01_red_flags_triage/
docs/architecture/MEDICAL_RAG_ARCHITECTURE.md
```

Este prompt continúa el trabajo de los prompts 01 a 06.

---

## Objetivo principal

Crear la infraestructura de integración del **Tomo 01 curado v0.1**, de forma que el proyecto pueda recibir contenido clínico revisado por el arquitecto senior y convertirlo en un release pack consistente, auditable y listo para revisión médica/legal.

El resultado debe quedar en:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/
```

Y el punto de entrada para contenido curado debe ser:

```txt
data/medical-rag/tomes/01_red_flags_triage/curated_input/
```

---

## Reglas no negociables

1. **No inventes contenido clínico.**
2. **No descargues fuentes externas.**
3. **No uses web scraping.**
4. **No declares ninguna fuente como aprobada si no está marcada explícitamente como aprobada en los archivos de entrada.**
5. **No cambies licencias de fuentes.**
6. **No conviertas contenido `pending_license_review` en contenido productivo.**
7. **No marques el tomo como listo para producción.**
8. **No agregues recomendaciones farmacológicas específicas si no vienen curadas en el input.**
9. **No agregues medicamentos controlados bajo ningún escenario.**
10. **No elimines archivos previos; si necesitas reemplazar, respalda o documenta el cambio.**
11. **No agregues secretos, API keys, credenciales, tokens ni datos personales reales.**
12. **Todo contenido clínico debe estar trazado a `source_ids`.**
13. **Todo chunk clínico debe tener acción segura para el usuario.**
14. **En caso de conflicto entre chunks, debe prevalecer la acción de mayor severidad.**
15. **La seguridad clínica tiene prioridad sobre UX, conversión, retención o automatización.**

---

## Entrada esperada

Crea esta carpeta si no existe:

```txt
data/medical-rag/tomes/01_red_flags_triage/curated_input/
```

Dentro de esa carpeta deben poder existir estos archivos:

```txt
curated_chunks.input.jsonl
approved_sources.input.json
curation_notes.input.md
translation_notes.input.md
medical_review_notes.input.md
legal_review_notes.input.md
```

Si los archivos de entrada todavía no existen, debes crear únicamente plantillas y reportar que la integración clínica real queda bloqueada por falta de input curado.

---

## Archivos que debes crear o actualizar

### 1. Carpeta de entrada curada

Crear:

```txt
data/medical-rag/tomes/01_red_flags_triage/curated_input/README.md
data/medical-rag/tomes/01_red_flags_triage/curated_input/curated_chunks.input.template.jsonl
data/medical-rag/tomes/01_red_flags_triage/curated_input/approved_sources.input.template.json
data/medical-rag/tomes/01_red_flags_triage/curated_input/curation_notes.input.template.md
data/medical-rag/tomes/01_red_flags_triage/curated_input/medical_review_notes.input.template.md
data/medical-rag/tomes/01_red_flags_triage/curated_input/legal_review_notes.input.template.md
```

### 2. Release pack del Tomo 01

Crear o actualizar sin romper estructura previa:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/tome_manifest.json
data/medical-rag/tomes/01_red_flags_triage/release/source_map.json
data/medical-rag/tomes/01_red_flags_triage/release/chunks.jsonl
data/medical-rag/tomes/01_red_flags_triage/release/coverage_matrix.md
data/medical-rag/tomes/01_red_flags_triage/release/clinical_safety_matrix.md
data/medical-rag/tomes/01_red_flags_triage/release/red_flag_rules.md
data/medical-rag/tomes/01_red_flags_triage/release/es_en_translation_matrix.md
data/medical-rag/tomes/01_red_flags_triage/release/eval_cases_seed.jsonl
data/medical-rag/tomes/01_red_flags_triage/release/eval_report.md
data/medical-rag/tomes/01_red_flags_triage/release/medical_review_report.md
data/medical-rag/tomes/01_red_flags_triage/release/legal_review_report.md
data/medical-rag/tomes/01_red_flags_triage/release/release_notes.md
data/medical-rag/tomes/01_red_flags_triage/release/CHANGELOG.md
```

### 3. Scripts de validación

Crear o actualizar:

```txt
tools/medical-rag/validate_tome_01_curated_input.mjs
tools/medical-rag/validate_tome_01_release.mjs
```

### 4. Reporte de ejecución

Crear:

```txt
docs/reports/PROMPT_07_EXECUTION_REPORT.md
```

---

## Contrato de `approved_sources.input.json`

El archivo debe aceptar un arreglo de fuentes con esta estructura mínima:

```json
[
  {
    "source_id": "T01-SRC-001",
    "title": "Nombre de la fuente",
    "publisher": "Organización responsable",
    "url": "https://example.org/source",
    "jurisdiction": ["global", "mx", "us", "latam"],
    "language": ["en", "es"],
    "source_type": "guideline | official_health_page | clinical_reference | emergency_protocol | contributor_authorized | institution_authorized",
    "license_status": "approved_for_rag | approved_with_restrictions | pending_license_review | restricted | rejected",
    "allowed_use": ["rag_retrieval", "clinical_reference"],
    "not_allowed_use": ["model_training", "redistribution_without_attribution"],
    "requires_attribution": true,
    "requires_medical_review": true,
    "requires_legal_review": true,
    "review_status": "draft | license_review | medical_review | legal_review | approved_for_release | rejected",
    "last_checked_at": "YYYY-MM-DD",
    "notes": "Notas de trazabilidad"
  }
]
```

Reglas:

- `license_status` distinto de `approved_for_rag` o `approved_with_restrictions` debe bloquear uso productivo.
- `review_status` distinto de `approved_for_release` debe bloquear aprobación de producción.
- El release puede quedar como `curated_draft` o `release_candidate_clinical_review`, pero no como `approved_for_production`.

---

## Contrato de `curated_chunks.input.jsonl`

Cada línea JSON debe cumplir esta estructura mínima:

```json
{
  "chunk_id": "T01-CH-000001",
  "tome_id": "01_red_flags_triage",
  "tome_version": "0.1.0",
  "language": "es",
  "jurisdiction": ["global", "mx", "us", "latam"],
  "population": ["adult"],
  "age_group": "adult | pediatric | infant | neonate | older_adult | any",
  "pregnancy_relevance": "not_applicable | possible | pregnancy_specific",
  "clinical_domain": "dolor_toracico",
  "symptom_cluster": ["dolor torácico", "disnea"],
  "severity": "S0 | S1 | S2 | S3 | S4 | S5 | S6",
  "clinical_action_type": "emergency_call | emergency_department | urgent_care | same_day_medical_visit | physical_medical_visit | collect_more_evidence | self_care_possible | admin_safe_message",
  "red_flag_relevant": true,
  "must_ask": ["Pregunta clínica mínima"],
  "must_not_say": ["Frase o recomendación prohibida"],
  "safe_user_message": "Mensaje seguro, claro y no alarmista para el usuario final.",
  "clinician_note": "Nota técnica para médico humano o auditor clínico.",
  "evidence_summary": "Resumen breve de la evidencia curada.",
  "source_ids": ["T01-SRC-001"],
  "license_status": "approved_for_rag | approved_with_restrictions | pending_license_review | restricted | rejected",
  "medical_review_status": "pending | approved | rejected | needs_changes",
  "legal_review_status": "pending | approved | rejected | needs_changes",
  "clinical_review_required": true,
  "legal_review_required": true,
  "is_example_only": false,
  "created_by": "architect_senior",
  "created_at": "YYYY-MM-DD",
  "last_reviewed_at": null,
  "notes": "Notas de curación"
}
```

---

## Taxonomía de severidad obligatoria

Usa esta escala:

| Severidad | Significado | Acción esperada |
|---|---|---|
| S0 | Administrativo / informativo | Mensaje seguro sin orientación clínica |
| S1 | Bajo riesgo aparente | Autocuidado posible solo con evidencia suficiente |
| S2 | Riesgo moderado | Requiere más datos o consulta no urgente |
| S3 | Requiere consulta médica física | Derivación médica presencial |
| S4 | Requiere atención el mismo día | Consulta médica el mismo día / urgencias no críticas |
| S5 | Urgencia | Urgencias / servicio de emergencia |
| S6 | Emergencia crítica | Llamar emergencias inmediatamente |

Regla de conflicto:

```txt
Cuando existan dos posibles severidades, prevalece la más alta.
```

---

## Dominios clínicos mínimos para cobertura

La matriz de cobertura debe contemplar al menos estos dominios:

1. Dolor torácico.
2. Disnea / dificultad respiratoria.
3. Síntomas neurológicos focales.
4. Alteración del estado mental.
5. Síncope.
6. Convulsiones.
7. Cefalea severa o atípica.
8. Fiebre en adultos.
9. Fiebre pediátrica.
10. Fiebre en lactantes/neonatos.
11. Deshidratación.
12. Dolor abdominal severo.
13. Sangrado gastrointestinal.
14. Dolor pélvico / embarazo.
15. Anafilaxia / alergia severa.
16. Trauma.
17. Quemaduras.
18. Intoxicación / sobredosis.
19. Dolor ocular / pérdida visual.
20. Infección grave / posible sepsis.
21. Riesgo suicida o autolesión.
22. Violencia / abuso / riesgo social.
23. Inmunocompromiso.
24. Diabetes con descompensación sospechada.
25. Hipertensión con síntomas de alarma.
26. Dolor lumbar con red flags.
27. Erupción cutánea con signos sistémicos.
28. Dolor testicular agudo.
29. Otorrinolaringología con compromiso respiratorio.
30. Síntomas oncológicos de alarma.

Si no hay chunks curados para un dominio, marcarlo como `gap`.

---

## Comportamiento si NO existe input curado

Si no existen archivos reales:

```txt
curated_chunks.input.jsonl
approved_sources.input.json
```

Entonces:

1. Crea las plantillas.
2. Mantén `chunks.jsonl` únicamente con ejemplos marcados como `is_example_only: true`, o vacío si ya existía así.
3. Mantén `tome_manifest.json.status = "awaiting_curated_input"` o equivalente compatible con estructura previa.
4. Registra el bloqueo en `PROMPT_07_EXECUTION_REPORT.md`.
5. No simules integración clínica.
6. No marques fuentes como aprobadas.

---

## Comportamiento si SÍ existe input curado

Si existen archivos reales:

1. Valida ambos archivos contra el contrato definido.
2. Verifica que cada `source_id` usado por chunks exista en `approved_sources.input.json`.
3. Verifica que ningún chunk tenga `license_status = restricted` o `rejected`.
4. Verifica que cada chunk tenga `safe_user_message`.
5. Verifica que cada chunk tenga `must_not_say`.
6. Verifica que cada chunk tenga `must_ask` cuando `clinical_action_type = collect_more_evidence`.
7. Copia/normaliza fuentes válidas a `source_map.json`.
8. Copia/normaliza chunks válidos a `chunks.jsonl`.
9. Genera matriz de cobertura.
10. Genera matriz de seguridad clínica.
11. Genera reporte de evaluación inicial.
12. Actualiza `tome_manifest.json` a `release_candidate_clinical_review`, nunca a producción.
13. Registra cualquier chunk bloqueado en `eval_report.md` y en el reporte final.

---

## Reglas para mensajes al usuario final

Cada `safe_user_message` debe cumplir:

- Ser claro.
- Ser breve.
- Evitar pánico innecesario.
- Evitar falsa certeza.
- Indicar acción siguiente concreta.
- No sustituir evaluación médica humana cuando exista red flag.
- No prometer diagnóstico definitivo.
- No indicar medicamentos controlados.
- No minimizar síntomas potencialmente graves.

Ejemplo de estilo permitido:

```txt
Por los datos reportados, hay señales que requieren valoración médica urgente. Lo más seguro es acudir a urgencias o contactar servicios de emergencia, especialmente si el síntoma está empeorando o se acompaña de dificultad para respirar, dolor intenso, desmayo o confusión.
```

Ejemplo de estilo prohibido:

```txt
No parece grave, espera en casa y toma cualquier medicamento que tengas.
```

---

## Reglas para `must_not_say`

Cada chunk debe prohibir expresamente frases o patrones inseguros.

Ejemplos:

```txt
"No es urgente" cuando hay signos de alarma.
"Es ansiedad" sin descartar red flags.
"Es normal en niños" sin edad, fiebre, hidratación y estado general.
"Toma antibiótico" sin evaluación médica.
"Puedes manejar a urgencias tú mismo" si hay síncope, confusión, dolor torácico severo o disnea severa.
```

---

## Evaluación inicial

Crear `eval_cases_seed.jsonl` con casos de prueba estructurales, no necesariamente clínicos reales si no hay input curado.

Debe contemplar:

- Casos S6.
- Casos S5.
- Casos S4.
- Casos pediátricos.
- Casos de embarazo.
- Casos de salud mental.
- Casos de intoxicación.
- Casos donde falta información y la acción correcta es pedir datos.
- Casos donde debe prevalecer la severidad mayor.

Cada caso debe tener:

```json
{
  "case_id": "T01-EVAL-001",
  "language": "es",
  "input_summary": "Resumen del caso de prueba",
  "expected_minimum_severity": "S5",
  "expected_action_type": "emergency_department",
  "must_trigger_domains": ["dolor_toracico"],
  "must_not_include": ["no es urgente"],
  "notes": "Caso semilla para futura evaluación automatizada"
}
```

---

## Manifest esperado

Actualizar `tome_manifest.json` con campos mínimos:

```json
{
  "tome_id": "01_red_flags_triage",
  "title": "Red Flags, Triage y Derivación Inmediata",
  "version": "0.1.0",
  "status": "awaiting_curated_input | release_candidate_clinical_review",
  "clinical_purpose": "Identificar señales de alarma y definir rutas seguras de derivación.",
  "production_approved": false,
  "requires_medical_review": true,
  "requires_legal_review": true,
  "requires_translation_review": true,
  "contains_medication_recommendations": false,
  "contains_controlled_substances": false,
  "supported_languages": ["es", "en"],
  "supported_jurisdictions": ["global", "mx", "us", "latam"],
  "chunk_count": 0,
  "source_count": 0,
  "last_updated_at": "YYYY-MM-DD"
}
```

---

## Validaciones obligatorias

Los scripts deben validar:

1. JSON válido.
2. JSONL válido.
3. Campos obligatorios.
4. `source_ids` existentes.
5. Severidad válida.
6. Acción clínica válida.
7. Estado de licencia válido.
8. Ausencia de contenido productivo con `restricted` o `rejected`.
9. Ausencia de `production_approved = true`.
10. Ausencia de medicamentos controlados declarados.
11. Ausencia de secretos.
12. Coherencia de conteos en manifest.

Si una validación falla, el script debe terminar con código distinto de cero.

---

## Criterios de aceptación

La tarea se considera completada si:

- Existe `curated_input/` con README y plantillas.
- Existe o se conserva el release pack del Tomo 01.
- Existen scripts de validación.
- `validate_tome_01_curated_input.mjs` puede ejecutarse sin romper cuando no hay input real.
- `validate_tome_01_release.mjs` puede ejecutarse sobre el release actual.
- No se inventó contenido clínico.
- No se descargaron fuentes.
- No se agregaron secretos.
- No se marcó nada como producción.
- Se generó `docs/reports/PROMPT_07_EXECUTION_REPORT.md`.

---

## Reporte final obligatorio

Al final, responde con un resumen en español que incluya:

```md
# Resultado Prompt 07

## Archivos creados
- ...

## Archivos modificados
- ...

## Estado del input curado
- Disponible / No disponible

## Estado del release pack
- awaiting_curated_input / release_candidate_clinical_review

## Validaciones ejecutadas
- ...

## Riesgos o bloqueadores
- ...

## Siguiente prompt sugerido
Prompt 08 — Construcción curada del contenido clínico real del Tomo 01 por el arquitecto senior: fuentes autorizadas, chunks finales, traducción ES/EN y evaluación anti-under-triage.
```
