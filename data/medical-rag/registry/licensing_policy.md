# Política de Licenciamiento para Medical Knowledge RAG

## Principio rector

No se ingiere contenido protegido sin licencia explícita y clara. "Libre para leer" no significa "libre para usar en RAG".

## Fuentes permitidas

1. **Contenido público gubernamental** (US Gov, EU, etc.) - Pueden usarse con atribución.
2. **Guías oficiales con licencias abiertas** (CC BY, CC0) - Después de revisión legal.
3. **Contenido con permiso explícito** - Firmado por titular de derechos.

## Fuentes condicionadas

1. **CC BY-NC** - Permite retrieval con atribución, prohibe uso comercial directo de los chunks.
2. **CC BY-ND** - Permite retrieval, prohibe adaptación de chunks.
3. **Licenses con territorio** - Solo para jurisdicciones autorizadas.

## Fuentes prohibidas

1. **Libros comerciales** - Sin permiso explícito del editor.
2. **Contenido con All Rights Reserved** - Sin permiso.
3. **Fuentes "pending_review"** - NUNCA pueden usarse en producción.
4. **Fuentes "restricted"** - Solo metadata_only o internal_review, nunca chunks.

## Uso permitido vs prohibido

| Uso | Descripción |
|-----|-------------|
| `rag_retrieval` | Recuperar fragmentos para contexto en IA |
| `quotation_limited` | Pequeñas citas con atribución |
| `metadata_only` | Solo metadatos, no contenido |
| `internal_review` | Solo para análisis interno |

| Prohibido | Razón |
|-----------|-------|
| `model_training` | Requiere licencia explícita de entrenamiento |
| `redistribution` | Requiere permiso de redistribución |
| `commercial_reuse` | Usos comerciales restringidos |
| `verbatim_bulk_copy` | Copia masiva prohibida por la mayoría de licencias |

## Regla de oro

**Ningún chunk de fuente `pending_review` o `restricted` puede ir a producción.**

## Revisión legal requerida

Antes de marcar fuente como `approved`:
1. Verificar licencia completa.
2. Confirmar jurisdicciones aplicables.
3. Documentar atribución requerida.
4. Firmar off en documentación.

## Rotación y deprecación

- Revisiones de licencia cada 12 meses.
- Fuentes sin revisión actualizada pasan a `deprecated`.
- Cambios de licencia actualizados inmediatamente.