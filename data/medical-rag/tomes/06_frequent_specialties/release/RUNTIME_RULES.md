# Runtime Rules — 06_frequent_specialties v0.1.0

Created: 2026-07-09

## Priority Rules

1. Urgencias/emergencia always overrides specialty appointment when red flags are present.
2. Pediatrics requires pediatric safety layer before specialty routing.
3. Pregnancy requires pregnancy-aware routing.
4. Older adult fragility, anticoagulants and immunosuppression lower urgency thresholds.
5. Primary care / primer contacto is default for stable, non-specific, low-acuity symptoms.
6. A specialty suggestion is not a diagnosis.
7. Tests are expectation-setting only; the AI does not order them.

## Handoff Minimum Dataset

- reason for referral
- main symptom
- onset and evolution
- severity and functional impact
- red flags present/absent
- comorbidities
- medications and allergies
- prior tests with dates
- specific clinical question
