# APPROVED_SCOPE — 09_multilingual_regionalization v0.1.0

Created: 2026-07-09

## Purpose

This tome is the multilingual and regionalization layer for the medical RAG.

It helps the AI:
- detect language and regional variants,
- map colloquial symptoms to canonical clinical concepts,
- preserve red flags across translation,
- normalize units and numbers,
- map medication names by active ingredient,
- regionalize specialty and care-setting names,
- avoid inventing local emergency/crisis/toxicology resources,
- preserve privacy and legal boundaries.

## Included

- 7 language/region modules.
- 14 local clinical term maps.
- 8 unit normalization groups.
- 8 medication synonym groups.
- 6 emergency phrase families.
- 25 governance rules.

## Explicitly Excluded

- Real-time emergency numbers or crisis lines without runtime verification.
- Country-specific legal reporting instructions without legal review.
- Medication availability claims without country/label verification.
- Machine-translated clinical rules without review.
- Dosing if units or product labels are ambiguous.
- Regionalization that changes clinical severity.

## Production Gate

All chunks are marked `production_allowed=false`.

Required before activation:
1. Clinical review.
2. Localization review.
3. Legal/privacy review.
4. Runtime resource verification.
5. Unit conversion QA.
6. Medication active-ingredient normalization QA.
7. Retrieval expansion tests by synonym/localism.
8. Red-flag severity preservation tests.
