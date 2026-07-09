# Pipeline de Ingesta — Medical Knowledge RAG

## Flujo de ingestión

```
Fuente → Descarga → Validación Licencia → Normalización → Chunking → Metadata → Evaluación → Publicación
```

## Paso 1: Identificación de fuentes

- Buscar fuentes en `registry/source_registry.example.json`.
- Agregar nuevas fuentes con `license_status: pending_review`.
- Documentar URL, publisher, license.

## Paso 2: Validación de licencia

- Legal team verifica licencia.
- Si `approved` → continuar.
- Si `restricted` o `rejected` → archivar, no usar.

## Paso 3: Normalización

- Extraer texto plano.
- Eliminar headers/footers no clínicos.
- Preservar estructura semántica.
- Convertir a texto UTF-8.

## Paso 4: Chunking

- Estrategia por sección/párrafo.
- Máximo 500 tokens por chunk.
- Preservar contexto clínico.
- Ver `chunking_strategy.md`.

## Paso 5: Metadata

- Aplicar `metadata_contract.md`.
- Incluir `source_id`, `evidence_level`, `clinical_domain`.
- Calcular `content_hash`.

## Paso 6: Evaluación

- Tests clínicos.
- Tests de seguridad.
- Tests de alucinación.
- Ver `evaluation/rag_eval_plan.md`.

## Paso 7: Publicación

- Solo si pasa todos los gates.
- Actualizar `tome_manifest.json`.
- Estado `approved_for_production`.
- Registrar en auditoría.