# Deprecation Policy

## Razones de deprecación

1. **Obsolescencia clínica** - Guía superada por nueva evidencia.
2. **Fuente retirada** - Licencia revocada o contenido eliminado.
3. **Error médico** - Contenido erróneo o peligroso detectado.
4. **Conflicto legal** - Problema de derechos de autor.
5. **Riesgo de daño** - Potencial para recomendación incorrecta.

## Proceso

```
1. Detectar problema
2. Congelar tomo en staging
3. Investigar causa raíz
4. Generar hotfix o deprecar
5. Notificar stakeholders
6. Actualizar CHANGELOG
7. Marcar chunks como deprecated
8. Excluir de retrieval productivo
```

## Estados de deprecación

| Estado | Acción |
|--------|--------|
| `deprecated_pending` | En investigación |
| `deprecated` | Retirado de production |
| `archived` | Histórico conservado |

## Regla de conservación

Los chunks deprecados:
- No se eliminan físicamente.
- Se marcan `status: deprecated`.
- Se excluyen del retrieval.
- Se documenta razón en auditoría.

## Registro

Tabla `deprecated_chunks` con:
- chunk_id
- reason
- deprecated_at
- archived_at
- replacement_chunk_id