# Corpus Composition Policy

## Reglas de composición

1. **Base primero** - El corpus base debe tener seguridad clínica antes que especialidades.

2. **Jurisdicción** - Un corpus solo puede contener tomos cuya jurisdicción cubra su alcance.

3. **Licencia compatible** - Los tomos con licencia `restricted` no pueden combinarse sin permiso explícito.

4. **Pediatría reforzada** - La pediatría requiere checklist y policy propia.

5. **OTC limitado** - Los OTC requieren catálogo médico interno y límites explícitos.

6. **Experimental aislado** - Los corpus experimentales no se exponen a usuarios finales.

## Restrictions por tipo

| Corpus | Restrictions |
|--------|-------------|
| base | Solo tomos `approved_for_production` |
| regional | Solo tomos con jurisdicción compatible |
| institutional | Solo con permiso institucional |
| specialty | Solo tomos de especialidad |
| pediatric_safe | Solo tomo 04 + base sin medicamentos |
| partner | Solo tomos autorizados por partner |
| experimental | Sin restriction, pero no exposed |

## Policy de mixing

No mezclar:
- Contenido con licencia incompatible.
- Contenido público con contenido restricted sin permiso.
- Tomos con status `draft` en corpus `production`.