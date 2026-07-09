# Red Flag Rules — Tomo 01

## Estado actual: awaiting_curated_input

### Regla general

Cualquier chunk con `red_flag_relevant=true` debe:

1. Tener severidad mínima S3.
2. Tener `safe_user_message` orientado a derivación.
3. Tener `must_not_say` con frases prohibidas.
4. Tener `must_ask` con preguntas clave.

### Red flags críticos (sin input curado todavía)

| Síntoma | Severidad mínima | Acción |
|---------|------------------|--------|
| Dolor torácico + disnea | S5 | Urgencias |
| Disnea severa + uso de músculos accesorios | S5 | Urgencias |
| Fiebre + confusión + hipotensión | S5 | Emergencias |
| Anafilaxia con compromiso respiratorio | S6 | Llamar emergencias |
| Convulsión + fiebre pediátrica | S5 | Urgencias |

**NOTA:** Estas reglas serán completadas cuando el arquitecto senior entregue el input curado.