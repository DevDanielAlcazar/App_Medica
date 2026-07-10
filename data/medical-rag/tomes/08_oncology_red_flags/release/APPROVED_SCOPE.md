# APPROVED_SCOPE — 08_oncology_red_flags v0.1.0

Created: 2026-07-09

## Purpose

This tome supports oncology red-flag detection and cancer-care safety.

It helps the AI:
- identify persistent/progressive/unexplained symptoms that need medical review,
- distinguish screening from diagnostic evaluation of symptoms,
- escalate oncology emergencies,
- protect patients in active cancer treatment,
- prepare concise handoffs,
- avoid diagnosing or dismissing cancer.

## Included

- 20 general oncology red-flag presentations.
- 10 active-cancer complication modules.
- 6 screening-vs-symptom modules.
- 25 governance rules.
- Emergency gates: fever during treatment, suspected neutropenia, neurologic deficits, cord compression, bleeding, disnea, confusion and severe pain.

## Excluded

- Diagnosis of cancer.
- Cancer treatment recommendations.
- Chemotherapy/radiotherapy/immunotherapy dosing.
- Prognosis prediction.
- Proprietary oncology guidelines copied verbatim.
- Tumor-marker interpretation as standalone diagnosis.
- Genetic counseling conclusions.

## Production Gate

All chunks are marked `production_allowed=false`.

Required before activation:
1. Oncology review.
2. General clinical review.
3. Legal/licensing review.
4. Emergency ranking tests.
5. Active-cancer safety regression tests.
6. Screening-vs-diagnostic workflow validation.
