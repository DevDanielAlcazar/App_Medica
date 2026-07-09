# Tomo 01 Authoring Pack — Red Flags, Triage y Derivación Inmediata

## Qué es este pack

Plantilla operativa y documental para construir el **Tomo 01 del Medical Knowledge RAG**.

## Qué NO contiene

- **No hay contenido clínico final** - Solo estructura y plantillas.
- **No hay chunks reales** - Solo guía de autoría.
- **No hay fuentes aprobadas** - Solo mapeo candidato.

## Ruta de release futura

El tomo real se depositará en:

```
data/medical-rag/tomes/01_red_flags_triage/release/
```

## Estados de madurez del tomo

| Estado | Descripción |
|--------|-------------|
| `draft` | Estructura inicial creada |
| `source_mapped` | Fuentes mapeadas a dominios |
| `authoring_in_progress` | Chunks en redacción |
| `medical_review` | Revisión clínica activa |
| `legal_review` | Revisión legal activa |
| `release_candidate` | Listo para evaluación |
| `approved_for_production` | Listo para producción |
| `deprecated` | Retirado de uso |

## Regla de no invención clínica

Toda regla clínica debe:

- Tener fuente trazable.
- Pasar medical review.
- Pasar legal review.
- Pasar evaluación RAG.

No se permite contenido clínico sin estos pasos.