# Control de Cambios en Medical Knowledge RAG

## Versionado semántico

- MAJOR: Cambios que afectan seguridad clínica.
- MINOR: Nuevos chunks o fuentes.
- PATCH: Correcciones menores.

## CHANGELOG por tomo

Cada tomo debe tener CHANGELOG.md con:

```markdown
## [version] - fecha

### Added
- Nuevos chunks/fuentes.

### Changed
- Modificaciones en contenido.

### Deprecated
- Chunks retirados.

### Removed
- Fuentes eliminadas.
```

## Proceso de cambio

1. Crear Change Request ID.
2. Identificar tipo de cambio: chunk / tomo / corpus / metadata.
3. Evaluar impacto clínico.
4. Evaluar impacto legal.
5. Evaluar impacto de retrieval.
6. Ejecutar validaciones requeridas.
7. Revisión médica si es contenido clínico.
8. Revisión legal si cambia fuente/licencia.
9. Merge a main.
10. Actualizar versión en `tome_manifest.json`.
11. Ejecutar rollback si es necesario.

## Aprobadores

- Médico: cambios clínicos.
- Legal: cambios de licencia/fuente.
- QA: cambios de retrieval.
- Admin: deployments.

## Rollback

Cada cambio debe poderse revertir con `git revert` o migración down.

## Auditoría

- Cada cambio queda registrado en tabla `rag_changes`.
- Rastrea quién cambió qué y cuándo.
- Los cambios críticos requieren justificación escrita.