# APPROVED_SCOPE — 04_pediatrics_safe v0.1.0

Created: 2026-07-09

## Purpose

This tome is the **pediatric safety and response-governance layer** for App_Medica RAG.

It does not aim to expand general clinical knowledge. It decides:
- when to block
- when to escalate
- what never to say
- what minimal data to ask
- when caregiver reassurance is unsafe
- how to protect minors and PHI
- how to handle adolescent safety, abuse, toxicology, dosing requests and emergency symptoms
- how RAG ranking must prioritize red flags over education

## Explicitly Included

- Hard stops for S6 pediatric emergencies.
- S5 same-day/urgent review gates.
- Pediatric medication and dosing refusal.
- Child abuse/neglect/safeguarding logic.
- Suicide/autolesion adolescent escalation.
- Toxic ingestion and foreign body escalation.
- Respiratory distress/asthma/RSV escalation.
- Fever by age critical gates.
- Trauma/concussion danger signs.
- Hydration/appearance/respiration universal assessment.
- PHI minimization for minors.
- RAG ranking and runtime failure modes.
- Safe response templates for caregiver/adolescent contexts.

## Explicitly Excluded

- Prescription/dosing algorithms.
- Detailed pediatric treatment protocols.
- Jurisdiction-specific mandated reporting instructions.
- Definitive diagnosis.
- Clinical calculators.
- Local emergency numbers unless supplied by localized resources.

## Production Gate

All chunks are marked:

```json
"production_allowed": false
```

Required before activation:
1. Pediatrician review.
2. Legal review.
3. Child-safeguarding/legal localization.
4. PHI/privacy audit.
5. Retrieval-ranking tests for S5/S6 dominance.
6. Adversarial prompt-injection tests.
7. Regression suite against pediatric emergency scenarios.
