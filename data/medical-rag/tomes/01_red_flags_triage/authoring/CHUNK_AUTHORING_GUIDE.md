# Chunk Authoring Guide — Tomo 01

## Estructura de chunk

```markdown
## chunk_id
tome01-D01-F001-[hash]

## tome_id
01_red_flags_triage

## domain_id
D01

## title_es
[PLACEHOLDER: Título en español]

## title_en
[PLACEHOLDER: Title in English]

## clinical_summary_es
[PLACEHOLDER: Resumen clínico sin diagnóstico final]

## clinical_summary_en
[PLACEHOLDER: Clinical summary without diagnosis]

## red_flags
[PLACEHOLDER: Lista de red flags relevantes]

## required_questions
[PLACEHOLDER: Preguntas mínimas antes de orientar]

## minimum_evidence_required
[PLACEHOLDER: Evidencia mínima requerida]

## clinical_action_type
triage | refer_emergency | ask_more | do_not_advise

## severity_level
S0 | S1 | S2 | S3 | S4 | S5 | S6

## population_scope
adult | pediatric | neonatal | pregnant | elderly | all | diabetic | immunocompromised

## jurisdiction_scope
global | mx | us | latam | uk | other

## source_refs
[source_id: página o sección relevante]

## contraindications_or_exclusions
[PLACEHOLDER: Exclusiones clínicas]

## must_not_say
[PLACEHOLDER: Frases prohibidas]

## safe_user_message_es
[PLACEHOLDER: Mensaje seguro para usuario]

## safe_user_message_en
[PLACEHOLDER: Safe message for user]

## internal_reasoning_notes
[PLACEHOLDER: Notas para revisor]

## review_status
draft | medical_review | legal_review | approved

## license_status
pending_review | approved | restricted | rejected
```

## Reglas de autoría

1. **Un chunk = una unidad clínica recuperable.**
2. **Debe ser atómico** - sin mezclar dominios.
3. **Debe evitar contradicciones** - priorizar fuentes oficiales.
4. **Debe separar datos de usuario, acción y fuente.**
5. **Debe incluir `must_not_say`** - frases prohibidas.
6. **Debe incluir `safe_user_message`** - lenguaje seguro.
7. **Debe incluir `red_flags`** - señales de alarma.
8. **Debe incluir `required_questions`** - datos necesarios.
9. **Debe usar placeholders para contenido sin fuente aprobada.**

## Ejemplo de chunk placeholder

```markdown
## chunk_id
tome01-D07-placeholder-001

## title_es
[PLACEHOLDER: Reacción alérgica severa / Anafilaxia]

## title_en
[PLACEHOLDER: Severe allergic reaction / Anaphylaxis]

## red_flags
- Dificultad para respirar
- Hinchazón facial/lengua
- Erupción cutánea extensa
- Mareo o pérdida de conciencia

## required_questions
- ¿Qué le provocó la reacción?
- ¿Cuándo empezó?
- ¿Tiene antecedentes de alergia?

## clinical_action_type
refer_emergency

## severity_level
S5

## population_scope
all

## must_not_say
- "Este remedio lo va a mejorar"
- "No es grave"
- "Puede esperar"

## safe_user_message_es
[PLACEHOLDER: Si tiene dificultad para respirar o hinchazón, busque atención médica inmediata. Este no es un diagnóstico.]

## review_status
draft
```