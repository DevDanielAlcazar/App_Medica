# Medical Knowledge RAG Gold Standard

## Qué es

Este directorio contiene el **Medical Knowledge RAG Gold Standard** de App Médica. Es una colección estructurada y versionada de conocimiento médico para uso exclusivo en consultas asistidas por IA, con trazabilidad, licenciamiento controlado y evaluación clínica.

## Qué NO es

- **No es entrenamiento de modelo**: No usamos estos datos para entrenar modelos propios. Son solo fuentes de referencia para retrieval.
- **No es sustituto médico**: La IA con este RAG no reemplaza la valoración médica humana.
- **No es scraping libre**: No se ingiere contenido sin licencia explícita y revisión.
- **No es contenido clínico pre-aprobado**: Todo tomo debe pasar gates médicos y legales.

## Flujo de trabajo de tomos

```
Fuente → Validación licencia → Normalización → Chunking → Metadata → Evaluación → Publicación
```

1. **Fuente**: Registro en `source_registry` con licencia y uso permitido.
2. **Validación licencia**: Gate legal para confirmar uso permitido.
3. **Normalización**: Texto estructurado, elimina formatos innecesarios.
4. **Chunking**: Fragmentos con metadata preservando contexto.
5. **Metadata**: Contrato estricto con trazabilidad por chunk.
6. **Evaluación**: Tests clínicos y de seguridad.
7. **Publicación**: Solo tomos `approved_for_production`.

## Estados de un tomo

| Estado | Descripción |
|--------|-------------|
| `draft` | En construcción, contenido preliminar |
| `license_review` | Licencia siendo revisada por legal |
| `medical_review` | Contenido siendo revisado por médico |
| `legal_review` | Revisión final de legal/licencias |
| `approved_for_staging` | Aprobado para entorno de pruebas |
| `approved_for_production` | Aprobado para uso en consultas reales |
| `deprecated` | Retirado de uso, con razón documentada |

## Estructura de carpetas

```
data/medical-rag/
  README.md
  registry/           # Registro de fuentes médicas
  tomes/              # Tomos organizados por tema
    00_governance/    # Normas, taxonomía, formatos
    01_red_flags_triage/
    02_clinical_history_anamnesis/
    03_general_medicine_adult/
    04_pediatrics_safe/
    05_otc_symptomatic_recommendations/
    06_frequent_specialties/
    07_imaging_orientation/
    08_oncology_red_flags/
    09_multilingual_regionalization/
  pipeline/           # Documentación del pipeline
  evaluation/         # Plantillas de evaluación
  governance/         # Políticas y gates
```

## Dónde depositar tomos generados por el arquitecto senior

Cada tomo validado debe depositarse en:

```
data/medical-rag/tomes/<numero_nombre_tomo>/release/
```

### Estructura esperada en `release/`

```
release/
  tome_manifest.json      # Metadata del tomo
  chunks.jsonl           # Chunk en formato JSON Lines
  source_map.json        # Mapeo fuente → chunks
  clinical_review_report.md  # Reporte de revisión médica
  legal_review_report.md     # Reporte de revisión legal
  eval_report.md         # Reporte de evaluación
  CHANGELOG.md           # Cambios por versión
```

## Taxonomía clínica inicial

Ver `tomes/00_governance/` para taxonomía completa.

## Interacción con AI Gateway

- Solo tomos `approved_for_production` pueden ser usados en retrieval.
- Cada chunk tiene `content_hash` y `license_status`.
- Retrieval filtra por metadata: jurisdicción, edad, specialty, evidence_level.
- Response incluye siempre referencias a fuentes usadas.

## Extensibilidad futura

El RAG está diseñado para crecer mediante nuevos tomos, corpus especializados, contribuciones de especialistas y permisos explícitos de autores/instituciones.

## Contribuciones externas

Ninguna contribución entra a producción sin validación de identidad/credenciales, licencia, revisión médica, revisión legal y evaluación RAG. Ver `contributors/` para el proceso completo.

## RAG base vs RAGs adicionales

El RAG base se construye con fuentes públicas/permitidas y curaduría interna. Los RAGs adicionales pueden ser regionales, por especialidad, institucionales o autorizados por autores. Ver `corpus/` para la política de branching.

## Carpeta oficial de releases de tomos

```
data/medical-rag/tomes/<tome_id>/release/
```