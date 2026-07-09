# Tomo 01 Authoring Plan

## Objetivo clínico

Proveer conocimiento estructurado sobre **signos de alarma y criterios de triage** para derivación inmediata.

## Alcance

- Signos de alarma por sistema.
- Criterios de acuidad.
- Preguntas clave para triage.
- Derivación a urgencias/emergencias.
- Evaluación de severidad.

## Fuera de alcance

- Diagnósticos definitivos.
- Tratamientos específicos.
- Medicamentos controlados.

## Entradas requeridas

| Tipo | Fuente | Estado requerido |
|------|--------|------------------|
| Fuentes aprobadas | `source_registry` | `approved` |
| Source registry | `registry/source_registry.example.json` | Completo |
| Permisos/licencias | `permissions/` | Validado |
| Criterios médicos | Médico revisor | Firmado |

## Salidas esperadas

```
tome_manifest.json
chunks.jsonl
source_map.json
clinical_review_report.md
legal_review_report.md
eval_report.md
CHANGELOG.md
```

## Flujo de trabajo

1. Validar fuentes en `source_registry`.
2. Mapear fuentes a dominios.
3. Redactar chunks preliminares.
4. Revisar consistencia clínica.
5. Ejecutar evaluación de under-triage.
6. Revisar legal/licencias.
7. Generar release candidate.
8. Aprobar para producción.

## Criterios de salida por etapa

| Etapa | Criterio |
|-------|----------|
| source_mapped | 90% dominios con fuentes |
| authoring_in_progress | 80% chunks redactados |
| medical_review | 100% chunks revisados médico |
| legal_review | 100% fuentes aprobadas legal |
| release_candidate | Tests de evaluación pasados |
| approved_for_production | Firmas médico + legal |

## Responsables

| Rol | Responsabilidad |
|-----|-----------------|
| Arquitecto senior | Curación y estructura |
| Médico revisor | Seguridad clínica |
| Legal/compliance | Licencias y reglas |
| Delivery/ops | Checklist Go/No-Go |
| Dev Jr/OpenCode | Implementación documental