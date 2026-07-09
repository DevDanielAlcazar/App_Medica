# Release Checklist — Tomo 01

## Fuentes y licencias

- [ ] Todas las fuentes validadas en source_registry
- [ ] Perfiles de permiso creados para fuentes restricted
- [ ] Attribution correcta en todos los chunks

## Chunking

- [ ] Chunks redactados según CHUNK_AUTHORING_GUIDE
- [ ] Cada chunk tiene must_ask y must_not_say
- [ ] Severidad asignada correctamente
- [ ] Safe user messages incluidos

## Traducción ES/EN

- [ ] Traducción revisada por médico bilingüe
- [ ] Equivalencia semántica verificada
- [ ] Regionalismos evitados

## Revisión médica

- [ ] Clinical review report completado
- [ ] Red flags críticos validados
- [ ] Poblaciones vulnerables protegidas

## Revisión legal

- [ ] Legal review report completado
- [ ] Licenses compatibles
- [ ] No hay contenido protegido sin permiso

## Evaluación anti under-triage

- [ ] Test cases ejecutados
- [ ] No hay under-triage detectado
- [ ] Severidad mínima alcanzada

## QA técnico

- [ ] Script validate_tome_release pasa
- [ ] JSON válido en todos los archivos
- [ ] Source map sincronizado

## Seguridad

- [ ] No hay chunks con production_allowed=true sin aprobación
- [ ] No hay content sin license_status

## Aprobación final

- [ ] Clinical reviewer firma
- [ ] Legal reviewer firma
- [ ] Arquitecto senior autoriza

---

## Estado actual del release pack

**release_candidate_draft** — No listo para producción.

Faltan: revisión médica, revisión legal, evaluación completa.