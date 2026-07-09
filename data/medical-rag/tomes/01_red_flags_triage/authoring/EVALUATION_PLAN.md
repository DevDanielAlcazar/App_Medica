# Evaluation Plan — Tomo 01

## Evaluación de cobertura

- % de dominios cubiertos por fuentes aprobadas.
- Trazabilidad por chunk → source.
- Cobertura por jurisdicción.

## Evaluación de contradicciones

- Comparar chunks por dominio.
- Verificar no contradicción entre fuentes.
- Priorizar fuentes oficiales (Tier 1).

## Evaluación de under-triage

- Casos con red flag → severidad correcta.
- Faltan datos → preguntar, no derivar bajo.
- Red flag oculta → Escalar adecuadamente.

## Métricas

| Métrica | Target |
|--------|--------|
| coverage_score | ≥ 85% |
| under_triage_failures | 0 |
| unsafe_recommendation_count | 0 |
| missing_required_question_count | 0 |
| source_traceability_score | ≥ 0.98 |
| bilingual_equivalence_score | ≥ 0.95 |
| review_completion_score | 1.0 |

## Pruebas requeridas

### Tests de cobertura
- Cada dominio tiene al menos 1 chunk.
- Cada chunk tiene source mapeado.

### Tests de seguridad
- Red flags detectados → derivación.
- Pediatría → checklist completo.
- Embarazo → derivación.

### Tests de bilingüe
- Equivalencia semántica.
- Tono consistente.
- Reglas aplicables ambos idiomas.

### Tests de retrieval
- Filtro por metadata funciona.
- Prioridad severidad correcta.
- No devuelve contenido prohibido.

### Tests de messaging
- Mensajes seguros incluidos.
- No alarma innecesaria.
- Derivación clara cuando aplica.