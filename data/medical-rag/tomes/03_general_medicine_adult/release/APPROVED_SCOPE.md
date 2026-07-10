# APPROVED_SCOPE — 03_general_medicine_adult v0.1.0

Created: 2026-07-09

## Purpose

Adult general medicine RAG tome focused on:
- Clinical orientation, not diagnosis.
- Adult symptom reasoning.
- Dangerous differential checks.
- Red flags and escalation.
- Safe user communication.
- Handoff summaries for professional review.
- AI boundaries: no prescription, no diagnosis certainty, no delay of emergency care.

## Explicitly Included

- Cardiovascular, respiratory, neurological, gastrointestinal, endocrine, renal/urologic, MSK, dermatology/allergy, ENT/eye/dental, infectious, hematology/general, reproductive/sexual health, mental health, toxicology/trauma/environmental presentations.
- Adult and older-adult risk modifiers.
- Medication safety: anticoagulants, insulin, sedatives, immunosuppression, polypharmacy.
- Privacy/PHI minimization and AI communication boundaries.

## Explicitly Excluded

- Pediatric management details; handled in `03_pediatrics`.
- OTC medication recommendations; handled in `05_otc_symptomatic_recommendations`.
- Imaging interpretation as diagnosis.
- Lab interpretation as final diagnosis.
- Prescription, dosing or medication discontinuation instructions.
- Medical legal determinations or country-specific scope-of-practice claims.

## Production Gate

All chunks are marked `production_allowed=false`.
Must pass:
1. Medical review.
2. Legal/license review.
3. Retrieval ranking validation.
4. Emergency escalation priority test.
5. PHI/logging safety test.
