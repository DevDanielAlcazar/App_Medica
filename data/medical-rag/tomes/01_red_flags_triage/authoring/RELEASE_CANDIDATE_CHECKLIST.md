# Release Candidate Checklist — Tomo 01

## Fuentes y licencias

- [ ] Todas las fuentes en source_registry están `approved`.
- [ ] Permisos/licencias verificados en `permissions/`.
- [ ] No hay fuentes `restricted` sin permiso explícito.
- [ ] Attribution correcta en todos los chunks.

## Contenido clínico

- [ ] Red flags críticos cubiertos (D01-D25).
- [ ] Pediatría con checklist completo.
- [ ] Embarazo con reglas específicas.
- [ ] Adulto mayor con precauciones.
- [ ] Salud mental con derivación obligatoria.
- [ ] No hay recomendaciones farmacológicas.

## Test de under-triage

- [ ] Test cases ejecutados sin fallos.
- [ ] Red flags detectados → severidad correcta.
- [ ] Faltan datos → preguntar, no derivar bajo.

## Evaluación RAG

- [ ] Retrieval funciona sin alucinaciones.
- [ ] Filtros metadata aplicados correctamente.
- [ ] Score de precisión > 95%.

## Bilingüe

- [ ] Traducción ES/EN revisada.
- [ ] Equivalencia semántica verificada.
- [ ] Mensajes seguros en ambos idiomas.

## Firmas

Médico: _________________ Fecha: _______

Legal: _________________ Fecha: _______

Arquitecto: _________________ Fecha: _______

QA: _________________ Fecha: _______

## Changelog

- [ ] CHANGELOG.md actualizado.
- [ ] Versión incrementada.
- [ ] Release tag creado.

## Evidencia

- [ ] No hay uso de fuentes pendientes/restricted.
- [ ] Todos los chunks tienen fuente trazable.
- [ ] Reporte de evaluación adjunto.