# Tomo 01 Authoring Contract

## Contrato de salida esperado

Cuando el arquitecto senior genere el Tomo 01 real, debe depositar en:

```
data/medical-rag/tomes/01_red_flags_triage/release/
```

## Archivos requeridos

| Archivo | Descripción |
|---------|-------------|
| `tome_manifest.json` | Metadata del tomo, estado `approved_for_production` |
| `chunks.jsonl` | Chunks en formato JSON Lines |
| `source_map.json` | Mapeo fuente → chunks usados |
| `clinical_review_report.md` | Reporte firmado por médico |
| `legal_review_report.md` | Reporte firmado por legal |
| `eval_report.md` | Reporte de evaluación RAG |
| `CHANGELOG.md` | Cambios por versión |

## Tipos de chunk esperados

### red_flag_rule
- Regla de red flag específica.
- Enfoque: evitar under-triage.
- Ejemplo: dolor torácico + diapnea = derivación urgente.

### triage_decision_rule
- Regla de triage acuity.
- Red/Yellow/Green classification.
- ABCDE framework.

### emergency_escalation_rule
- Cuándo escalar a emergencias.
- Qué buscar en paciente mayor.
- Qué buscar en embarazada.

### question_required_before_recommendation
- Pregunta clave antes de orientar.
- Ejemplo: edad exacta para fiebre pediátrica.

### pediatric_safety_rule
- Regla pediátrica específica.
- Edad/peso requerido.
- Derivación obligatoria si falta info.

### jurisdiction_adaptation_note
- Nota de adaptación regional.
- OTC permitidos por país.
- Procedimientos locales.

### source_reference_note
- Referencia a fuente oficial.
- Atribución completa.
- Link a URL original.

## Metadata requerida por chunk

Ver `data/medical-rag/pipeline/metadata_contract.md`.

Campos críticos: `red_flag_relevant`, `clinical_action_type`, `evidence_level`, `license_status`.