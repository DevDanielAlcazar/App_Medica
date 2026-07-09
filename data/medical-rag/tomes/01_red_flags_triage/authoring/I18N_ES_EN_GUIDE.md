# I18N Guide — Tomo 01

## Principios de redacción bilingüe

### No traducción literal

- Traducir **significado clínico**, no palabras.
- Adaptar a realidades regionales.
- Usar términos familiares al paciente.

### Equivalencia semántica

- Cada chunk debe tener `title_es` y `title_en`.
- Mensajes seguros deben transmitir misma urgencia.
- Red flags deben mapearse correctamente.

### Tono

- **Humano**: frases cercanas pero profesionales.
- **Claro**: sin tecnicismos innecesarios.
- **Firme**: cuando hay alarma, mensaje directo.
- **No alarmista**: evitar pánico innecesario.

### Regionalismos a evitar

- "UCI" (usar "cuidados intensivos" o "ICU").
- "Guardia" (usar "emergencias").
- "Pastillas" (usar "medicamento" o "tableta").

## Campos obligatorios por chunk

| Campo | Español | Inglés |
|-------|---------|--------|
| title_es | Título en español | N/A |
| title_en | N/A | Title in English |
| clinical_summary_es | Resumen clínico | N/A |
| clinical_summary_en | N/A | Clinical summary |
| safe_user_message_es | Mensaje seguro | N/A |
| safe_user_message_en | N/A | Safe message |
| language_review_status | pending/reviewed | pending/reviewed |

## Notas de traducción

- Todos los textos deben revisarse por médico bilingüe.
- Usar glosario médico para consistencia.
- Mantener formato consistente EN/ES.

## Placeholder example

```markdown
## title_es
[PLACEHOLDER: Dolor torácico]

## title_en
[PLACEHOLDER: Chest pain]

## safe_user_message_es
[PLACEHOLDER: Si tiene dolor en el pecho con dificultad para respirar, busque atención médica inmediata.]

## safe_user_message_en
[PLACEHOLDER: If you have chest pain with difficulty breathing, seek immediate medical attention.]
```