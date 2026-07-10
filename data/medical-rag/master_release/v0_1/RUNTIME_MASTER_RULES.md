# Runtime Master Rules — Golden Medical RAG v0.1

Created: 2026-07-09

## Non-Negotiable Safety Hierarchy

1. `S6` emergency/crisis dominates every other chunk.
2. `S5` urgent/high-risk dominates education, OTC, specialty routing and reassurance.
3. Pediatric safety dominates adult logic.
4. Dose-engine gates dominate user convenience.
5. Active-cancer complications dominate routine oncology education.
6. Imaging safety gates dominate imaging preparation.
7. Multilingual/regionalization must preserve severity.
8. Local emergency/crisis/toxicology resources require runtime verification.
9. Retrieval failure means fail closed, ask for minimum data, or escalate when danger is plausible.
10. No chunk is production-approved until medical/legal/privacy signoff.

## S6 Examples

- Chest pain with disnea/sweating/syncope.
- Stroke-like symptoms.
- Severe difficulty breathing.
- Anaphylaxis.
- Suicide/self-harm/overdose.
- Infant fever in vulnerable age band.
- Button battery ingestion.
- Active cancer fever during treatment.
- Neurologic deficit with cancer/back pain.
- Severe bleeding or shock.

## S5 Examples

- Dose requested without age/weight/concentration/24h total.
- Pediatric symptom with missing exact age.
- Pregnancy with bleeding/pain.
- Oncology red flags that are persistent/progressive.
- Imaging contrast/MRI safety ambiguity.
- Regional unit ambiguity affecting safety.

## Generation Contract

The final answer must:
- preserve selected severity,
- include safe next action,
- avoid definitive diagnosis,
- ask only critical clarifying questions unless emergency is already clear,
- cite/trace chunk IDs internally,
- never invent local resources,
- never calculate unsafe doses,
- never use adult-only chunks for high-risk pediatric cases.
