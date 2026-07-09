# Fuentes Pendientes de Revisión

Este documento lista fuentes identificadas para futuro análisis de licencia y uso.

Ninguna fuente en esta lista debe usarse en tomos productivos sin:
1. Análisis de licencia y aceptación en `source_registry`.
2. Aprobación legal en `governance/legal_review_gate.md`.
3. Aprobación médica en `governance/medical_review_gate.md`.

## Fuentes identificadas

| source_id | Título | Tipo | Editorial/Organización | Riesgo licencia | Prioridad |
|-----------|--------|------|------------------------|-----------------|-----------|
| who-001 | WHO Clinical Guidelines | guideline | WHO | CC BY-NC, NoDerivs posible | Alta |
| cdc-001 | CDC Health Topics | official_site | CDC | Public Domain US Gov | Media |
| nih-medlineplus-001 | MedlinePlus | official_site | NIH | Public Domain US Gov | Media |
| ncbi-bookshelf-001 | NCBI Bookshelf | textbook | NCBI | Varies by work | Alta |
| icd-001 | ICD-11 | ontology | WHO | NoDerivs | Media |
| mesh-001 | MeSH | ontology | NIH | Public Domain | Baja |
| snomed-001 | SNOMED CT | ontology | IHSTDO | Territorial | Alta |

## Criterios de prioridad

- **Alta**: Guías oficiales, terminologías médicas, libros de referencia.
- **Media**: Contenido de educación paciente, artículos clínicos.
- **Baja**: Ontologías secundarias, glosarios auxiliares.

## Proceso de ingesta

1. Agregar fuente a `source_registry.example.json`.
2. Marcar como `pending_review`.
3. Enviar a revisión legal.
4. Si aprobada, crear tomo correspondiente.
5. Solo después de `approved_for_production` puede usarse en retrieval.