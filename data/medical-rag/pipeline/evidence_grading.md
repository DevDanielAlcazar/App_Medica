# Grading de Evidencia para Medical Knowledge RAG

## Niveles internos

| Nivel | Descripción | Uso permitido |
|-------|-------------|---------------|
| A | Guía clínica oficial / organismo sanitario | Uso directo en diagnóstico diferencial |
| B | Revisión sistemática / consenso robusto | Uso con referencia explícita |
| C | Referencia clínica reconocida con licencia | Uso con atribución y limitaciones |
| D | Educación al paciente | Solo educación, no recomendación clínica |
| X | No apta para recomendación clínica | No usar en retrieval clínico |

## Regla de oro

**La IA no debe mezclar niveles como si fueran equivalentes.** El retrieval prioriza nivel A > B > C > D.

## Scoring adicional

- `recency_years`: Años desde publicación.
- `citation_count`: Referencias bibliográficas.
- `peer_reviewed`: Boolean si fue revisado por pares.

## Filtros por nivel

- Casos pediátricos: solo niveles A-C.
- Embarazo: solo niveles A-B.
- Oncología: solo nivel A.
- OTC: solo niveles A-C con catálogo médico interno.