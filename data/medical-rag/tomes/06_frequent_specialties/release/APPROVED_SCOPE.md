# APPROVED_SCOPE — 06_frequent_specialties v0.1.0

Created: 2026-07-09

## Purpose

This tome supports specialty routing and referral preparation:
- identify likely specialty candidates,
- avoid wrong-specialty routing,
- prepare a useful handoff,
- explain what a specialist commonly evaluates,
- identify when primer contacto is appropriate,
- identify when urgent/emergency care must happen before referral.

## Included

- 33 frequent specialties.
- 57 symptom-to-specialty routing patterns.
- Red flag overrides before referral.
- Visit preparation.
- Common test expectations without ordering tests.
- AI boundaries.
- Handoff summaries.
- Routing governance.

## Excluded

- Definitive diagnosis.
- Treatment plans.
- Prescription or procedure recommendations.
- Country-specific referral authorization.
- Insurance/network routing.
- Specialty society guidelines copied verbatim.

## Production Gate

All chunks are marked `production_allowed=false`.
Required: clinical review, legal review, regional terminology review, ranking tests and handoff QA.
