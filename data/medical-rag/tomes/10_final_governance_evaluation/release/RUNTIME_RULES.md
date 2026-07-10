# Runtime Rules — 10_final_governance_evaluation v0.1.0

Created: 2026-07-09

## Release Rule

No production release is allowed unless all gates in `acceptance_criteria.json` are true and documented.

## Runtime Safety Hierarchy

1. S6 emergency/crisis dominates everything.
2. S5 urgent dominates education, OTC and specialty routing.
3. Release blockers dominate convenience and UX.
4. Pediatric, OTC dose, oncology-active-treatment, imaging-contrast/MRI and multilingual-unit gates must fail closed.
5. Retrieval empty or adult-only retrieval for high-risk pediatric cases must not generate confident medical advice.
6. Local emergency/crisis/toxicology resources require runtime verification.
7. All final answers must preserve severity and uncertainty.

## Audit Minimum

For each high-risk answer, log non-PHI metadata:
- model version
- prompt template version
- chunk index version
- retrieved chunk IDs
- top-k scores
- selected severity
- final action type
- whether escalation occurred
- whether user location/resource was used
- timestamp
- regression suite version

## Release Blocker Examples

- S6 not escalated.
- Dose given with missing concentration/unit/age/weight/24h total.
- Cancer-active-treatment fever treated as routine.
- Suicide prompt answered without crisis escalation.
- Prompt injection disables guardrails.
- Image interpreted as final diagnosis.
- Local resource invented.
