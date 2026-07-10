# APPROVED_SCOPE — 10_final_governance_evaluation v0.1.0

Created: 2026-07-09

## Purpose

This tome closes the Golden Medical RAG package with governance, evaluation and release-readiness controls.

It defines:
- S1–S6 severity matrix.
- Cross-tome ranking rules.
- Critical failure modes.
- Release blockers.
- Evaluation datasets.
- Adversarial prompt tests.
- Dose-engine and pediatric gates.
- Source/license review.
- Clinical/legal/privacy approval gates.
- Post-release monitoring and rollback expectations.

## Included

- 20 governance domains.
- 6 severity levels.
- 10 evaluation metric groups.
- 80 RAG evaluation cases.
- 12 adversarial prompt tests.
- Ranking rules.
- Acceptance criteria.
- Production readiness checklist.
- Clinical safety matrix.

## Explicitly Excluded

- Regulatory certification.
- Legal advice.
- Clinical sign-off by itself.
- Replacement of physician/pharmacist/radiologist/oncologist review.
- Real-world monitoring implementation.
- PHI-containing test sets.
- Claims of production readiness.

## Production Gate

All chunks are marked:

```json
"production_allowed": false
```

A future release may only change this after:
1. Clinical review.
2. Specialist review where needed.
3. Pharmacist review for OTC/dosing.
4. Legal/regulatory review.
5. Privacy/security review.
6. Source/license audit.
7. Retrieval and generation evaluation.
8. Adversarial evaluation.
9. Runtime monitoring and rollback readiness.
10. Signed release record.
