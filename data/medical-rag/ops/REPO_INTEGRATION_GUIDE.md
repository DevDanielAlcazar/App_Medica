# Repo Integration Guide — App_Medica Golden Medical RAG v0.1

Created: 2026-07-09

Target repository mentioned by user:

```txt
https://github.com/DevDanielAlcazar/App_Medica
```

## Recommended Drop-in Structure

Copy this bundle into the repo under:

```txt
data/medical-rag/
```

Expected structure:

```txt
data/medical-rag/master_release/v0_1/
data/medical-rag/tomes/
data/medical-rag/governance/
data/medical-rag/evaluation/
data/medical-rag/ingestion/
data/medical-rag/schemas/
data/medical-rag/ops/
```

## Minimum Files to Wire First

```txt
data/medical-rag/master_release/v0_1/global_manifest.json
data/medical-rag/master_release/v0_1/all_available_chunks.consolidated.jsonl
data/medical-rag/master_release/v0_1/ranking_strategy.json
data/medical-rag/schemas/chunk_schema_contract.json
data/medical-rag/ingestion/VECTOR_DB_INGESTION_PLAN.md
data/medical-rag/evaluation/rag_eval_cases.jsonl
data/medical-rag/evaluation/adversarial_prompt_tests.jsonl
```

## Suggested App Runtime Modules

```txt
rag/
  ingest/
    validate_chunks.ts|py
    build_embeddings.ts|py
    load_vector_db.ts|py
  retrieval/
    query_expansion.ts|py
    hybrid_retriever.ts|py
    safety_reranker.ts|py
    population_guard.ts|py
  safety/
    severity_classifier.ts|py
    dose_gate.ts|py
    pediatric_gate.ts|py
    local_resource_verifier.ts|py
    escalation_policy.ts|py
  eval/
    run_rag_eval.ts|py
    run_adversarial_eval.ts|py
    regression_report.ts|py
```

## Environment Flags

Recommended runtime flags:

```txt
MEDICAL_RAG_PRODUCTION_ALLOWED=false
MEDICAL_RAG_REQUIRE_SAFETY_RERANK=true
MEDICAL_RAG_FAIL_CLOSED=true
MEDICAL_RAG_REQUIRE_REVIEWED_CHUNKS=false
MEDICAL_RAG_ENABLE_DOSE_CALCULATION=false
MEDICAL_RAG_ENABLE_LOCAL_RESOURCE_LOOKUP=false
```

Do not enable dose calculation until pharmacist/physician/legal review and unit tests pass.

## CI Checks

Every PR changing RAG content should run:

1. schema validation,
2. duplicate chunk ID check,
3. source/license scan,
4. high-risk retrieval regression,
5. adversarial prompt tests,
6. no `production_allowed=true` unless signed release,
7. consolidated manifest update.

## Release Branch Policy

Recommended branch names:

```txt
rag/golden-medical-v0.1-draft
rag/golden-medical-v0.1-review
rag/golden-medical-v0.1-release-candidate
```

## Warning

This package is draft clinical content and governance metadata. It is not a medical device clearance, medical sign-off, or legal approval.
