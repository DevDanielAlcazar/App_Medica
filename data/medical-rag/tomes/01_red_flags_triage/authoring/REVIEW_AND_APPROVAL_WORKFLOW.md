# Review and Approval Workflow — Tomo 01

## Estados del workflow

```
draft
    ↓
source_mapped
    ↓
authoring_in_progress
    ↓
medical_review
    ↓
legal_review
    ↓
release_candidate
    ↓
approved_for_production
    ↓
deprecated
```

## Transiciones

| De | A | Quién aprueba | Evidencia requerida |
|----|---|---------------|-------------------|
| draft | source_mapped | Arquitecto | Source map completo |
| source_mapped | authoring_in_progress | Arquitecto | 50% chunks redactados |
| authoring_in_progress | medical_review | Médico | Chunks completos, pending review |
| medical_review | legal_review | Legal | Reporte médico, chunks sin contenido prohibido |
| legal_review | release_candidate | Admin | Reporte legal, licencias validadas |
| release_candidate | approved_for_production | Arquitecto + QA | Tests pasados, firmas |

## Proceso de rechazo

1. Chunk marcado `requires_changes`.
2. Comentario detallado.
3. Reasignación a autor.
4. Nueva ronda de review.

## Cómo solicitar cambio

- Issues en GitHub.
- Comentario en `under_triage_tests`.
- Flag en metadata `requires_medical_review: true`.

## Documentación de excepciones

Toda excepción queda registrada en:

```
exceptions_log.md
```

Con:
- ID de chunk.
- Razonamiento.
- Aprobador.
- Fecha.

## Parche urgente

```
1. Congelar tomo.
2. Generar hotfix.
3. Evaluar impacto.
4. Deploy controlado.
5. Documentar causa raíz.
```

## Versionado

Usar semantic versioning: `MAJOR.MINOR.PATCH+rag`

- MAJOR: cambios de severidad.
- MINOR: nuevos dominios.
- PATCH: correcciones menores.

## Rollback

- Git tags por versión.
- Migraciones documentadas.
- Checksums de chunks.