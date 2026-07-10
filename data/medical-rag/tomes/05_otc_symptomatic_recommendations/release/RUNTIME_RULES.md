# Runtime Rules — 05_otc_symptomatic_recommendations v0.1.0

Created: 2026-07-09

## Dose Engine Hard Gates

A dose may be calculated only if all are known:

1. Patient age.
2. Patient weight in kg for pediatric/weight-based medications.
3. Medication active ingredient.
4. Product concentration/strength.
5. Dosage form and route.
6. Last dose time.
7. Total dose in the last rolling 24 hours.
8. Concurrent medications and duplicate active ingredients.
9. Contraindication screen.
10. Product label region/version.

If any field is missing: **fail closed**.

## Prescription Scheduling

Allowed:
- Convert a valid, current, legible prescription into reminders.
- Explain the schedule in plain language.
- Ask for clarification if incomplete.

Not allowed:
- Change dose/frequency/duration.
- Substitute medication.
- Tell user to stop early.
- Double missed doses unless the prescription/label explicitly says so.

## Ranking Rules

1. `red_flag_override` chunks outrank OTC recommendation chunks.
2. `overdose_or_misuse_gate` chunks outrank all dosing chunks.
3. `contraindication_gate` outranks `safe_user_message`.
4. Pediatric S5/S6 from tomes 03/04 outrank this tome.
5. Multi-symptom product chunks require duplicate-ingredient scan before any dose.

## Calculation QA

- Normalize units.
- Convert lb to kg only with explicit conversion record.
- Use rolling 24-hour totals.
- Use conservative pediatric rounding.
- Never use kitchen spoons.
- Log calculation metadata without unnecessary PHI.
