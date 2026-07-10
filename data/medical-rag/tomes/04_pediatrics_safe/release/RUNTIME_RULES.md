# Runtime Rules — 04_pediatrics_safe v0.1.0

Created: 2026-07-09

## Ranking Rules

1. Any `S6` chunk must dominate the final answer.
2. Any `S5` chunk must dominate education/autocuidado chunks.
3. If a pediatric case retrieves only adult chunks, the assistant must reject adult-only grounding and ask pediatric safety data or escalate.
4. If age exacta is missing and the topic is fever, medication, respiratory, toxicology, hydration, trauma or pain, do not continue to detailed medical guidance.
5. If retrieval fails, use conservative fallback: identify red flags, request minimum safety data, and recommend professional evaluation when uncertainty is material.
6. No dosing/prescription pediatric outputs from this tome.
7. No definitive diagnosis.
8. No local/legal child-protection workflow unless a reviewed regionalization module supplies it.

## Universal Pediatric Safety Gate

Before low-acuity education, verify:
- age exacta
- estado de alerta/interacción
- respiración
- hidratación/orina/pañales
- fiebre and method of measurement
- comorbidities/prematurity/technology
- caregiver capacity and access to care

## Blocked Response Patterns

- “Seguro no es grave.”
- “Solo obsérvalo” when red flags exist or data are missing.
- Any pediatric dose.
- Antibiotic recommendation.
- Controlled-substance guidance.
- Advice to hide injury, abuse, intoxication, pregnancy or self-harm.
- Adult-only logic for a pediatric case.
