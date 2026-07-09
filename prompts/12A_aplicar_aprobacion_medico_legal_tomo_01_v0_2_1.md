# Prompt 12A — Aplicar aprobación médico/legal y promoción controlada del Tomo 01 v0.2.1

## Rol operativo

Tu responsabilidad es aplicar de forma trazable el feedback recibido por el equipo ConSafeDev y dejar el Tomo 01 en estado aprobado para indexación/uso RAG controlado, sin modificar contenido clínico.

## Contexto del proyecto

Repositorio local esperado:

```txt
D:\Desarrollos\App_Medica
```

Repositorio remoto informado por el equipo:

```txt
https://github.com/DevDanielAlcazar/App_Medica
```

Tomo activo:

```txt
data/medical-rag/tomes/01_red_flags_triage/
```

Release pack activo:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/
```

Review packet activo:

```txt
data/medical-rag/tomes/01_red_flags_triage/review_packet_v0_2/
```

## Feedback de negocio recibido

El equipo ConSafeDev confirmó lo siguiente:

1. El médico de la empresa aprobó los chunks existentes del Tomo 01.
2. El abogado de la empresa aprobó las fuentes existentes del Tomo 01.
3. Médico y abogado aprueban cambiar `production_allowed` a `true` para el Tomo 01 actualmente revisado.
4. Médico y abogado aprueban ampliar la información del RAG, manteniendo control de revisión para nuevo contenido.

## Objetivo del prompt

Aplicar la aprobación médico/legal al estado actual del Tomo 01 sin alterar el contenido clínico, dejando evidencia auditable dentro del repositorio.

El alcance de esta aprobación es **solo** el Tomo 01 en su versión actual previa a nueva expansión. No significa que toda la aplicación esté lista para producción general.

## Reglas críticas

- No crees nuevos chunks clínicos en este prompt.
- No crees nuevas fuentes clínicas en este prompt.
- No edites texto clínico salvo corrección estructural mínima estrictamente necesaria para JSON/JSONL válido.
- No elimines chunks existentes.
- No elimines fuentes existentes.
- No reescribas conclusiones médicas.
- No inventes nombres de médicos, abogados, cédulas, firmas ni datos personales.
- Registra la aprobación como **approval evidence provided by Equipo ConSafeDev**.
- Si existen campos para nombres/cédulas/firma, déjalos como `Complete` salvo que ya existan datos reales en el repo.
- Mantén separación entre:
  - aprobación del Tomo 01 actual,
  - aprobación de nuevos chunks futuros,
  - aprobación global de la aplicación.
- Nuevas expansiones del Tomo 01 deben volver a revisión médica/legal.
- Si un archivo esperado no existe, crea plantilla mínima y repórtalo.

## Archivos de entrada esperados

Verifica existencia de:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/tome_manifest.json
data/medical-rag/tomes/01_red_flags_triage/release/source_map.json
data/medical-rag/tomes/01_red_flags_triage/release/chunks.jsonl
data/medical-rag/tomes/01_red_flags_triage/release/review_status.json
data/medical-rag/tomes/01_red_flags_triage/release/REVIEW_GATE.md
data/medical-rag/tomes/01_red_flags_triage/release/CHANGELOG.md
data/medical-rag/tomes/01_red_flags_triage/review_packet_v0_2/
```

## Salidas obligatorias

Crea carpeta:

```txt
data/medical-rag/tomes/01_red_flags_triage/review_packet_v0_2/approvals/
```

Dentro crea como mínimo:

```txt
approval_evidence_from_equipo_ConSafeDev.md
medical_approval_record.md
legal_approval_record.md
production_promotion_record.md
approval_scope.md
```

Crea o actualiza:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/review_status.json
data/medical-rag/tomes/01_red_flags_triage/release/tome_manifest.json
data/medical-rag/tomes/01_red_flags_triage/release/REVIEW_GATE.md
data/medical-rag/tomes/01_red_flags_triage/release/CHANGELOG.md
data/medical-rag/tomes/01_red_flags_triage/release/PRODUCTION_APPROVAL.md
data/medical-rag/tomes/01_red_flags_triage/release/APPROVED_SCOPE.md
docs/reports/PROMPT_12A_EXECUTION_REPORT.md
```

## Cambios esperados en `review_status.json`

Actualiza o crea el archivo con una estructura equivalente a esta, preservando campos existentes útiles:

```json
{
  "tome_id": "01_red_flags_triage",
  "version": "0.2.1",
  "status": "approved_for_controlled_rag_ingestion",
  "production_allowed": true,
  "medical_review_status": "approved",
  "legal_review_status": "approved",
  "approved_scope": "Tomo 01 Red Flags/Triage release actual previo a expansion v0.3",
  "approval_evidence_type": "business_confirmation_from_equipo_ConSafeDev",
  "formal_signature_status": "pending_formal_signature_metadata_if_required",
  "new_content_policy": "any future chunks or sources require separate medical/legal review before production inclusion",
  "app_global_release_status": "not_approved_by_this_tome_gate",
  "updated_by": "opencode_integrator_from_prompt_12A",
  "updated_at": "<current ISO timestamp>"
}
```

## Cambios esperados en `tome_manifest.json`

Actualiza preservando los conteos reales del repo:

```json
{
  "version": "0.2.1",
  "status": "approved_for_controlled_rag_ingestion",
  "production_allowed": true,
  "medical_review_status": "approved",
  "legal_review_status": "approved",
  "approval_scope": "current_release_only",
  "next_candidate_version": "0.3.0"
}
```

No sobrescribas campos de trazabilidad, conteos, fechas, source counts o chunk counts si ya existen. Solo complementa.

## Reglas para `source_map.json`

Para las fuentes existentes del release actual:

- Marca `legal_review_status` como `approved`.
- Marca `production_allowed` como `true` si el esquema lo permite.
- Agrega `approved_by_role: legal` o equivalente.
- Agrega `approval_evidence: review_packet_v0_2/approvals/approval_evidence_from_equipo_ConSafeDev.md`.
- No cambies URLs, títulos, publishers ni licencias registradas.
- No agregues fuentes nuevas.

Si el esquema no permite estos campos directamente, crea un overlay:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/legal_approval_overlay.json
```

## Reglas para `chunks.jsonl`

Para los chunks existentes del release actual:

- Marca `medical_review_status` como `approved` si el esquema lo permite.
- Marca `production_allowed` como `true` si el esquema lo permite.
- Agrega `approved_by_role: medical` o equivalente.
- Agrega `approval_evidence: review_packet_v0_2/approvals/approval_evidence_from_equipo_ConSafeDev.md`.
- No modifiques `safe_user_message`, `must_not_say`, `clinical_action_type`, severidad, idioma ni contenido clínico.

Si el esquema no permite estos campos directamente, crea un overlay:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/medical_approval_overlay.json
```

## Contenido mínimo de `PRODUCTION_APPROVAL.md`

Debe incluir:

```md
# Production Approval — Tomo 01 Red Flags/Triage

## Scope

Aprobación limitada al Tomo 01 release actual previo a expansión v0.3.

## Business confirmation

Equipo Glouu confirmó que:

- Médico de la empresa aprobó los chunks existentes.
- Abogado de la empresa aprobó las fuentes existentes.
- Médico y abogado aprobaron `production_allowed: true` para este release del Tomo 01.

## Non-scope

Esta aprobación no autoriza automáticamente:

- Toda la aplicación médica.
- Nuevos chunks agregados posteriormente.
- Nuevas fuentes agregadas posteriormente.
- Recomendaciones OTC.
- Diagnósticos autónomos sin guardrails.
- Uso sin monitoreo, auditoría y trazabilidad.

## Future changes

Toda expansión futura debe pasar por revisión médica/legal antes de sumarse al corpus productivo.
```

## Contenido mínimo de `APPROVED_SCOPE.md`

Debe especificar:

- Versión aprobada.
- Número de chunks aprobados.
- Número de fuentes aprobadas.
- Fecha/hora de aprobación registrada.
- Evidencia usada.
- Estado de firma formal.
- Restricciones.
- Ruta donde se mantiene el release aprobado.
- Ruta recomendada para futuras expansiones candidatas.

## Validaciones obligatorias

Ejecuta, si existe:

```bash
node tools/medical-rag/validate_tome_01_release.mjs
```

Si no existe, repórtalo y ejecuta una validación mínima con Node.js que compruebe:

1. `tome_manifest.json` es JSON válido.
2. `source_map.json` es JSON válido.
3. `chunks.jsonl` tiene JSON válido por línea.
4. `review_status.json` es JSON válido.
5. `production_allowed` quedó `true` para el release aprobado.
6. `medical_review_status` quedó `approved`.
7. `legal_review_status` quedó `approved`.
8. No se redujo el número de chunks.
9. No se redujo el número de fuentes.

## Reporte final obligatorio

Crea:

```txt
docs/reports/PROMPT_12A_EXECUTION_REPORT.md
```

Debe contener:

```md
# Resultado Prompt 12A

## Archivos creados

## Archivos modificados

## Aprobaciones aplicadas

## Conteos finales

- Sources:
- Chunks:
- Eval cases:
- Production allowed:
- Medical review status:
- Legal review status:

## Validaciones ejecutadas

## Riesgos o bloqueadores restantes

## Alcance NO aprobado por este gate

## Siguiente prompt sugerido

Prompt 12B — Expansión curada v0.3 en candidate release sin contaminar el release productivo aprobado.
```

## Resultado esperado visible al finalizar

Al terminar, responde con un resumen breve:

```md
✅ PROMPT_12A COMPLETED

Approval applied:
- medical_review_status: approved
- legal_review_status: approved
- production_allowed: true
- scope: current Tomo 01 release only

Files updated:
- ...

Validation:
- ...

Next:
- Prompt 12B candidate expansion v0.3
```
