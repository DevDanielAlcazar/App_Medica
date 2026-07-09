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

1. Crear rama `tome-XX-cambio-descripcion`.
2. Actualizar chunks/conenido.
3. Ejecutar tests de evaluación.
4. Revisión médica si es contenido clínico.
5. Revisión legal si cambia fuente.
6. Merge a main.
7. Actualizar versión en `tome_manifest.json`.

## Auditoría

- Cada cambio queda registrado en tabla `rag_changes`.
- Rastrea quién cambió qué y cuándo.
- Los cambios críticos requieren justificación escrita.