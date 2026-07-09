# Tomo 00 — Gobernanza del Medical Knowledge RAG

## Propósito

Definir la taxonomía clínica, formatos, normas y governance para todos los tomos del RAG.

## Alcance clínico

- Taxonomía clínica base.
- Formatos de metadata estándar.
- Políticas de versioning y CHANGELOG.
- Proceso de aceptación de fuentes.
- Plantillas para todos los tomos.

## Fuentes esperadas

Este tomo es meta-documentación. No tiene fuentes externas.

## Exclusiones

- No contiene contenido clínico específico.
- No es usado en retrieval directo.

## Riesgos principales

- Cambios en taxonomía pueden requerir migrar chunks existentes.
- Versionado inconsistente puede romper trazabilidad.

## Criterios para aprobar staging

- [ ] Taxonomía completa documentada.
- [ ] Formatos de metadata validados.
- [ ] Plantillas listas para todos los tomos.

## Criterios para aprobar producción

- [ ] Taxonomía revista por médico.
- [ ] Taxonomía revista por legal.
- [ ] Versionado documentado y reproducible.

## Carpeta release

La release de este tomo es el conjunto de plantillas y políticas. Ubicación:

`data/medical-rag/tomes/00_governance/release/`