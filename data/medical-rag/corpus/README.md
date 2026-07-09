# Corpus - Medical Knowledge RAG

## Propósito

Gestionar corpus/RAGs adicionales para diferentes propósitos: regionales, institucionales, especializados.

## Tipos de corpus

| Tipo | Uso |
|------|-----|
| `base_global` | Corpus base para todos los usuarios |
| `mx_release` | Adaptado para México |
| `us_release` | Adaptado para Estados Unidos |
| `latam_release` | Adaptado para LatAm |
| `en_release` | Corpus en inglés |
| `pediatrics_safe` | Corpus reforzado pediátrico |
| `institutional_custom` | Corpus para institución |
| `partner_authorized` | Corpus para partner autorizado |

## Reglas

- Un corpus solo puede contener tomos con licencias compatibles.
- El corpus base debe tener seguridad clínica antes que especialidades.
- Los corpus institucionales no pueden mezclar contenido restringido sin permiso.
- Los corpus experimentales no se exponen a usuarios finales.