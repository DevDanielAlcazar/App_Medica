# Corpus Branching Policy

## Tipos de corpus

| Tipo | Descripción | Uso |
|------|-------------|-----|
| `base_global` | Corpus base con red flags | Default para todos |
| `mx_release` | Corpus México | Solo MX |
| `us_release` | Corpus EE.UU. | Solo US |
| `latam_release` | Corpus LatAm | Solo LatAm |
| `en_release` | Corpus inglés | Solo EN |
| `pediatrics_safe` | Corpus pediátrico | Casos pediátricos |
| `institutional_custom` | Corpus institucional | Solo partner |
| `partner_authorized` | Corpus partner | Solo partner autorizado |

## Composition

Un corpus se compone de:

- Lista de tomos incluidos.
- Filtros de metadata.
- Restrictions de licencia.
- Jurisdicción/especialidad.

## Branching

### Base → Regional

- Copiar tomos base.
- Aplicar filtros de jurisdicción.
- Agregar tomos regionales.
- Validar licencias por región.

### Base → Institucional

- Crear fork del corpus.
- Agregar tomos propios.
- Aplicar filtros propios.
- Requiere permiso explícito.

## Regla de exclusión

Un tomo canónico restringido NO debe combinarse con corpus sin permiso explícito.

## Actualización

Los corpus derivados:
- Heredan actualizaciones base.
- Pueden tener delays controlados.
- No pueden saltar gates de seguridad.