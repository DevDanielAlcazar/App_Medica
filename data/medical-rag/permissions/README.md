# Permissions — Medical Knowledge RAG

## Uso de esta carpeta

Registra y gestiona permisos explícitos de uso de contenido médico para el RAG.

- `permission_record.schema.json` - Schema validado.
- `permission_record.example.json` - Ejemplos.
- `permission_evidence_index.md` - Índice de evidencias.
- `license_compatibility_matrix.md` - Matriz de compatibilidad.

## Tipos de permiso

| Tipo | Source type |
|------|-------------|
| `metadata_only` | Solo metadatos |
| `limited_quotation` | Citas limitadas |
| `rag_retrieval_internal` | Retrieval interno |
| `rag_retrieval_product` | Retrieval en producto |
| `commercial_use` | Uso comercial |
| `redistribution` | Redistribución |
| `translation` | Traducción |
| `derivative_summaries` | Resúmenes derivados |

## Regla de compatibilidad

Un permiso determina qué scopes pueden combinarse en un corpus sin violar licencias.