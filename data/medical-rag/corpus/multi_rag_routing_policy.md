# Multi-RAG Routing Policy

## Factores de routing

La app decide qué corpus consultar basado en:

1. **País/región** - Usuario en MX → `mx_release`.
2. **Idioma** - Usuario en EN → `en_release`.
3. **Edad del paciente** - < 18 años → `pediatrics_safe`.
4. **Embarazo** - `female` + embarazo → corpus obstetricia.
5. **Síntomas/red flags** - prioriza `red_flags_triage`.
6. **Especialidad probable** - deriva a `frequent_specialties`.
7. **Estado de evidencia** - filtra por `evidence_level`.

## Prioridad de retrieval

1. Seguridad/red flags (siempre primero).
2. Jurisdicción aplicable.
3. Edad/grupo de riesgo.
4. Evidencia más fuerte.
5. Recencia.
6. Especialidad.

## Rutas disponibles

| Usuario | Corpus consultado |
|---------|-------------------|
| MX adulto | mx_release |
| US adulto | us_release |
| LatAm adulto | latam_release |
| Pediátrico | pediatrics_safe (sobre mx/us/latam) |
| Embarazada | mx_release + obstetricia_filter |
| OTC solicitado | mx_release + otc_filter |

## Fallback

Si corpus no disponible:
- Retornar error.
- Preguntar más datos.
- Derivar a médico.