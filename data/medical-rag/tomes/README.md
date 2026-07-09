# Tomos del Medical Knowledge RAG

Esta carpeta contiene todos los tomos organizados por tema clínico.

## Lista de tomos

| Tomo | Propósito | Prioridad |
|------|-----------|-----------|
| 00_governance | Taxonomía, formatos, políticas | Crítica |
| 01_red_flags_triage | Signos de alarma y triage | Crítica |
| 02_clinical_history_anamnesis | Historia clínica y preguntas clave | Alta |
| 03_general_medicine_adult | Medicina general adulto | Alta |
| 04_pediatrics_safe | Pediatría con guardrails | Alta |
| 05_otc_symptomatic_recommendations | OTC y recomendaciones | Alta |
| 06_frequent_specialties | Especialidades frecuentes | Media |
| 07_imaging_orientation | Orientación de imagenología | Media |
| 08_oncology_red_flags | Oncología y signos de alarma | Media |
| 09_multilingual_regionalization | Regionalización y traducción | Media |

## Estructura de cada tomo

```
<tome_id>/
  README.md                      # Descripción y criterios
  tome_manifest.example.json      # Metadata del tomo
  release/                       # Solo si está approved_for_production
    tome_manifest.json
    chunks.jsonl
    source_map.json
    clinical_review_report.md
    legal_review_report.md
    eval_report.md
    CHANGELOG.md
```

## Estado actual

Todos los tomos están en estado `draft` o `pending_review`. Ningún tomo está listo para producción sin pasar gates médicos y legales.