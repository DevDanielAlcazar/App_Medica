# Curated Input — Tomo 01 Red Flags/Triage

## Propósito

Esta carpeta recibe el contenido clínico curado por el arquitecto senior para integración al release pack del Tomo 01.

## Archivos esperados

| Archivo | Descripción |
|---------|------------|
| `curated_chunks.input.jsonl` | Chunks clínicos curados (una por línea) |
| `approved_sources.input.json` | Fuentes aprobadas para uso en el tomo |
| `curation_notes.input.md` | Notas de curación del arquitecto |
| `translation_notes.input.md` | Notas de traducción ES/EN |
| `medical_review_notes.input.md` | Notas de revisión médica |
| `legal_review_notes.input.md` | Notas de revisión legal |

## Estado actual

**awaiting_curated_input** - El arquitecto senior debe depositar el contenido curado.

## Instrucciones

1. Depositar archivos de input en esta carpeta.
2. Ejecutar script de validación.
3. Los chunks válidos se mueven a `release/chunks.jsonl`.
4. Las fuentes válidas se mueven a `release/source_map.json`.
5. Actualizar manifest a `release_candidate_clinical_review`.