# Clinical Safety Matrix — Tomo 01

## Estado actual: awaiting_curated_input

| Severidad | Acción esperada | Bloqueado si falta info | Ejemplo de mensaje seguro |
|-----------|-----------------|------------------------|------------------------|
| S6 | Llamar emergencias | Siempre | "Llame a emergencias inmediatamente." |
| S5 | Urgencias ahora | Siempre | "Acuda a urgencias sin demora." |
| S4 | Mismo día | Si faltan datos | "Requiere valoración médica el mismo día." |
| S3 | Consulta médica | Si faltan datos | "Programe cita médica pronto." |
| S2 | Más datos | Sí | "Necesito más información para orientarle." |
| S1 | Autocuidado posible | Si faltan datos | "Puede observar, pero consulte si empeora." |
| S0 | Información | No aplicable | "Esta es información educativa." |

## Regla de conflicto

Si hay conflicto entre severidades, prevalece la más alta.

## Gaps identificados

- Sin chunks curados aún.
- La matriz se actualizará tras input del arquitecto.