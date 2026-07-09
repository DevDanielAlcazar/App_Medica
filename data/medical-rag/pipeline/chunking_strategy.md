# Estrategia de Chunking

## Objetivo

Dividir contenido médico en fragmentos optimizados para retrieval semántico, preservando contexto clínico.

## Estrategia por tipo de contenido

### Texto corrido

- Chunk size: 400-500 tokens.
- Overlap: 50 tokens entre chunks consecutivos.
- Preservar oraciones completas.

### Listas/tablas

- Cada fila/item como chunk separado.
- Metadata: `content_type: list_item`.
- Mantener contexto del encabezado.

### Secciones médicas

- Cada sección como chunk raíz.
- Subsection como chunks hijos con referencia.
- Metadata: `section_path: "cardiology/arrhythmias/common"`.

## Metadata obligatoria por chunk

Ver `metadata_contract.md` para campos completos.

Campos críticos:
- `chunk_id`: Formato `tome-source-section-hash`.
- `content_hash`: SHA256 del contenido.
- `red_flag_relevant`: true/false.
- `evidence_level`: Del source original.

## Chunking prohibido

- No dividir en medio de información médica crítica.
- No separar causa-efecto.
- No cortar listas sin contexto.