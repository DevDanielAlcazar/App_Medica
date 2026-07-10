# Vector DB Ingestion Plan — Golden Medical RAG v0.1

Created: 2026-07-09

## Recommended Collections

Use separate collections or namespaces:

1. `medical_chunks_core`
2. `medical_chunks_safety_high_risk`
3. `medical_chunks_governance`
4. `medical_eval_cases`
5. `medical_sources`

## Load Order

1. `03_pediatrics`
2. `04_pediatrics_safe`
3. `05_otc_symptomatic_recommendations`
4. `06_frequent_specialties`
5. `07_imaging_orientation`
6. `08_oncology_red_flags`
7. `09_multilingual_regionalization`
8. `10_final_governance_evaluation`
9. `03_general_medicine_adult`

## Pre-ingestion Validation

Before embedding:

```bash
python scripts/validate_chunks.py data/medical-rag/master_release/v0_1/all_available_chunks.consolidated.jsonl
```

Validation must check:
- unique `chunk_id`
- valid severity `S1-S6`
- non-empty `source_ids`
- non-empty `must_ask`
- non-empty `must_not_say`
- `production_allowed=false`
- `S5/S6 -> red_flag_relevant=true`
- population fields valid
- no raw PHI
- no forbidden source/license status

## Recommended Embedding Text

Concatenate:

```txt
clinical_domain
clinical_action_type
severity_level
population
safe_user_message
internal_reasoning_summary
evidence_summary
must_ask
must_not_say
retrieval_keywords
```

Do not embed audit-only fields like reviewer names if they later contain personal data.

## Metadata to Store

```json
["chunk_id", "tome_id", "master_release_tome", "version", "language", "source_ids", "clinical_domain", "population", "severity_level", "red_flag_relevant", "clinical_action_type", "production_allowed", "medical_review_status", "legal_review_status", "created_at"]
```

## Safety Collection

Duplicate all `S5` and `S6` chunks into `medical_chunks_safety_high_risk`.

High-risk retrieval should query:
- main collection
- safety collection
- governance collection

Then merge and rerank.

## Suggested Retrieval Algorithm

1. Detect language/region and expand query.
2. Detect population: adult, pediatric, older adult, pregnancy.
3. Detect candidate severity.
4. Query semantic vector DB.
5. Query keyword/BM25.
6. Query safety namespace if possible S4+.
7. Rerank by `ranking_strategy.json`.
8. Enforce population guard.
9. Enforce dose/OTC/imaging/oncology/regionalization gates.
10. Generate answer with fail-closed policy.

## Do Not

- Do not let semantic score outrank S6.
- Do not use adult-only chunks for high-risk pediatric cases.
- Do not calculate dose from retrieved generic text alone.
- Do not use local emergency numbers unless verified in runtime.
