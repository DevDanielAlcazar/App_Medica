# Runtime Rules — 07_imaging_orientation v0.1.0

Created: 2026-07-09

## Priority Rules

1. Red flags override imaging orientation.
2. The AI must not interpret images as final diagnosis.
3. Official radiology report + clinical context is required for meaningful explanation.
4. Local imaging-center protocol overrides generic preparation notes.
5. MRI requires implant/metal screening.
6. CT/X-ray/fluoroscopy/nuclear medicine involve radiation considerations.
7. Contrast requires renal/allergy/pregnancy/lactation review.
8. Pediatrics and pregnancy require a lower threshold for professional confirmation.

## Minimum Handoff Dataset

- symptom and chronology
- clinical question
- modality requested/considered
- red flags present/absent
- pregnancy status if relevant
- renal function/contrast allergy if relevant
- implants/metals if MRI
- prior comparable studies
- medications/anticoagulants if procedure
- official report if available
