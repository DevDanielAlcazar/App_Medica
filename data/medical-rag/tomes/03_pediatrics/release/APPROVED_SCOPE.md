# APPROVED_SCOPE — 03_pediatrics v0.1.0

Created: 2026-07-09

## Purpose

Pediatric RAG tome focused on:
- Clinical orientation for caregivers, not diagnosis.
- Age-stratified pediatric risk.
- Respiratory distress, hydration, fever and appearance as primary safety gates.
- Dangerous differentials and red flags.
- Safe caregiver messaging.
- Handoff summaries for pediatric professional review.
- AI boundaries: no pediatric dosing, no definitive diagnosis, no delay of emergency care.

## Explicitly Included

- Neonate, young infant, infant, toddler, preschool, school-age child and adolescent risk patterns.
- Fever by age band.
- Respiratory distress, RSV/bronchiolitis, asthma/wheeze, croup/stridor.
- Vomiting, diarrhea, dehydration, abdominal pain, appendicitis-like, constipation, GI bleeding.
- Seizures, altered mental status, headache, trauma/concussion.
- UTI, hematuria, testicular pain, adolescent pelvic/reproductive/sexual health risk.
- Rash, petechiae/purpura, allergy/anaphylaxis, ENT/eye/dental.
- Trauma, burns, wounds, bites, drowning, toxic ingestion, environmental exposure.
- Mental health, suicidality, substance intoxication, abuse/safeguarding.
- Complex care, disability, non-verbal child, PHI minimization and caregiver capacity.

## Explicitly Excluded

- Pediatric medication dosing.
- Final diagnosis.
- Country-specific legal reporting workflows.
- Detailed vaccine schedule recommendations.
- Prescription or treatment algorithms.
- Pediatric ICU-level protocols.

## Production Gate

All chunks are marked `production_allowed=false`.

Before production:
1. Pediatrician review.
2. Legal/license review.
3. Emergency escalation retrieval test.
4. Age-band regression tests.
5. PHI/minor privacy audit.
6. Abuse/safeguarding jurisdictional review.
