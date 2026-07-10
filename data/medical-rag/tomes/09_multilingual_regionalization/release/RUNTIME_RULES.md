# Runtime Rules — 09_multilingual_regionalization v0.1.0

Created: 2026-07-09

## Non-negotiable Rules

1. Clinical severity is invariant across language and region.
2. Red flags must not be softened during translation.
3. Medication routing uses active ingredient first, brand second.
4. Units must be explicit. If ambiguous, fail closed.
5. Emergency, crisis, toxicology and abuse resources must be verified at runtime.
6. Country-specific legal instructions require jurisdictional review.
7. If region is unknown, provide universal clinical safety guidance and ask for country only when necessary.
8. Do not invent local availability, OTC status or emergency pathways.
9. Preserve uncertainty when data are incomplete.
10. Audit language, region, unit conversions, medication mapping and any resource localization.

## Minimum Regionalization Dataset

- user language
- probable/confirmed country or region if clinically necessary
- original user wording
- canonical clinical concept
- local synonyms used for retrieval
- units and conversion record
- medication active ingredient and brand if provided
- local resource source/timestamp if used
- severity before and after localization
