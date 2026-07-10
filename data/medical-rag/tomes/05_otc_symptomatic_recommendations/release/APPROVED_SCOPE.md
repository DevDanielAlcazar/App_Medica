# APPROVED_SCOPE — 05_otc_symptomatic_recommendations v0.1.0

Created: 2026-07-09

## Purpose

This tome supports symptomatic OTC recommendations and prescription scheduling support.

It includes:
- OTC eligibility gates.
- Dosing rules as draft structured data.
- Contraindication screening.
- Duplicate active ingredient detection.
- Red flag override.
- Overdose/misuse escalation.
- Prescription-as-written scheduling support.
- Runtime label verification requirements.

## Critical Position

This release **does include dosage logic**, but it is intentionally blocked for production until:
1. Physician review.
2. Pharmacist review.
3. Legal/regulatory review.
4. Runtime product-label verification.
5. Dose-engine unit tests.
6. Pediatric rounding tests.
7. Rolling 24-hour window tests.
8. Adversarial safety tests.

## What the AI may do after approval

- Recommend OTC only for low-acuity symptoms with clear eligibility.
- Calculate OTC dose only when all required fields are present.
- Use prescription instructions exactly as written to schedule reminders.
- Refuse or escalate when label, dose, route, age, weight or contraindication data are incomplete.
- Detect duplicate active ingredients across multi-symptom products.

## What the AI must not do

- Diagnose.
- Prescribe.
- Modify a prescription.
- Infer ambiguous prescription details.
- Give pediatric dosing without age, weight, concentration and label.
- Recommend OTC when red flags are present.
- Use adult logic for pediatrics.
- Override product label or maximum daily dose.
