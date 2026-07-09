# Permission Evidence Index

Registro de evidencias de permisos adjuntas al proyecto.

## Estructura

Cada evidencia debe guardarse como archivo en `permissions/evidence/` con nombre:

```
{permission_id}-{evidence_type}.{ext}
```

Tipos de evidencia:

- `license_copy` - Copia de licencia
- `permission_request_email` - Email de solicitud
- `signed_permission` - Permiso firmado
- `institutional_letter` - Carta institucional
- `agreement` - Contrato/acuerdo

## Índice de evidencias

| Permission ID | Tipo | Archivo | Estado |
|---------------|------|---------|--------|
| perm-who-guideline-001 | license_copy | who-001-license_copy.pdf | pending |
| perm-author-book-001 | signed_permission | perm-author-book-001-signed_permission.pdf | pending |

## Regla de conservación

- Evidencias válidas: 5 años después de expiración.
- Evidencias rechazadas: 2 años.
- Sin expiración: indefinido.