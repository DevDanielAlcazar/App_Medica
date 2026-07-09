# Contributor Review Workflow

## Estados del contributor

```
submitted
    ↓
identity_review
    ↓
credential_review
    ↓
coi_review
    ↓
accepted_for_source_review
    ↓
accepted_for_clinical_review
    ↓
active
    ↓
suspended (opcional)
    ↓
archived
```

## Transiciones

| De | A | Quién aprueba | Evidencia requerida |
|----|---|---------------|-------------------|
| submitted | identity_review | Admin | Formulario de registro |
| identity_review | credential_review | Admin/Médico | Credencial verificada |
| credential_review | coi_review | Legal | COI formulario |
| coi_review | accepted_for_source_review | Legal | COI aprobado |
| accepted_for_source_review | accepted_for_clinical_review | Médico | Primera contribución revisada |
| accepted_for_clinical_review | active | Admin | Aprobado |
| active | suspended | Admin/Soporte | Incidente/medida |
| suspended | active | Admin | Resuelta causa |
| active | archived | Admin | Retiro voluntario/inactivo |

## Roles y permisos

| Rol | Puede mover estados |
|-----|---------------------|
| Admin | Todas las transiciones |
| Legal | credential_review → coi_review, revoked |
| Médico | accepted_for_source_review → accepted_for_clinical_review |
| Soporte | identity_review, suspended |

## Registro de cambios

Cada transición queda registrada en `contributors_audit` con:
- contributor_id
- estado_anterior
- estado_nuevo
- responsable
- timestamp
- notas