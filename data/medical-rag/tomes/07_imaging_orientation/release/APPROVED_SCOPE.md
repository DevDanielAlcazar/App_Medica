# APPROVED_SCOPE — 07_imaging_orientation v0.1.0

Created: 2026-07-09

## Purpose

This tome supports safe imaging orientation:
- what each modality is commonly used for,
- benefits and limitations,
- safety screening,
- contrast and implant gates,
- preparation,
- result expectations,
- report-term explanation,
- handoff to clinician/radiology.

## Included

- 11 imaging modalities.
- 10 body-region orientation groups.
- 10 specific safety modules.
- 10 report-term explanation modules.
- 15 governance modules.
- Emergency-before-imaging logic.

## Excluded

- Definitive image interpretation.
- Ordering studies.
- Treatment decisions.
- Local imaging-center protocols.
- Proprietary appropriateness criteria copied verbatim.
- Automated diagnosis from uploaded images.
- Sedation/contrast instructions not confirmed by local protocol.

## Production Gate

All chunks are marked `production_allowed=false`.

Required before activation:
1. Radiologist review.
2. Clinical review.
3. Legal/licensing review.
4. Local protocol integration.
5. Emergency-over-imaging ranking tests.
6. Contrast/MRI/pregnancy/pediatric safety QA.
