# Knowledge Diff Policy

## Comparación de versiones

### Campos comparados

- `chunks_agregados` - Nuevos chunks.
- `chunks_eliminados` - Chunks retirados.
- `chunks_modificados` - Chunks cambiados.
- `metadatas_actualizados` - Metadata actualizada.
- `evidence_level_actualizado` - Evidencia cambiada.
- `jurisdiccion_actualizada` - Jurisdicción cambiada.
- `licencia_actualizada` - Licencia cambiada.

## Formato de diff report

```markdown
# Knowledge Diff Report - v{old} a v{new}

## Chunks agregados
- {chunk_id}: {summary}

## Chunks eliminados
- {chunk_id}: {razón}

## Chunks modificados
- {chunk_id}: {cambio}

## Impacto clínico
- Riesgo: bajo/medio/alto
- Casos afectados: {número}
```

## Validación cruzada

- Cada diff requiere revisión médica.
- Riesgo alto requiere evaluación QA.
- Diff aprobado queda en auditoría.

## Herramientas

- Script `rag-diff` para generar diffs.
- Comparación automática de content_hash.
- Detección de cambios de evidence_level.