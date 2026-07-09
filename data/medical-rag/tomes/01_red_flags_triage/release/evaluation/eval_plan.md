# Evaluation Plan — Tomo 01 Release

## Objetivo

Evaluar que el Tomo 01 no haga under-triage y responda adecuadamente a signos de alarma.

## Tipos de evaluación

1. **Cobertura** - % de dominios cubiertos.
2. **Seguridad** - Red flags detectados correctamente.
3. **Bilingüe** - Equivalencia ES/EN.
4. **Retrieval** - Filtrado y ranking correctos.
5. **Under-triage** - Casos críticos no bajen severidad.

## Métricas

| Métrica | Target |
|--------|--------|
| coverage_score | ≥ 85% |
| under_triage_failures | 0 |
| unsafe_recommendation_count | 0 |
| missing_question_count | 0 |

## Casos a evaluar

Ver `eval_cases.schema.json` para estructura.

## Pasos

1. Ejecutar retrieval por dominio.
2. Verificar severidad devuelta.
3. Verificar preguntas requeridas.
4. Verificar mensajes seguros.
5. Documentar resultados en `eval_report.md`.