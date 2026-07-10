# Production Readiness Checklist — Golden Medical RAG v0.1

Created: 2026-07-09

## 1. Scope

- [ ] Intended use is defined.
- [ ] Out-of-scope use is defined.
- [ ] Medical disclaimer is reviewed.
- [ ] User population is defined.
- [ ] Jurisdictions are defined.
- [ ] Human escalation path is defined.

## 2. Clinical Review

- [ ] General medicine reviewed.
- [ ] Pediatrics reviewed.
- [ ] Pediatrics safety reviewed.
- [ ] OTC/dosing reviewed by pharmacist/physician.
- [ ] Imaging reviewed by radiologist/clinician.
- [ ] Oncology red flags reviewed.
- [ ] Specialty routing reviewed.
- [ ] Multilingual terminology reviewed.

## 3. Legal / Regulatory / Privacy

- [ ] Source licenses audited.
- [ ] Copyright restrictions checked.
- [ ] PHI minimization reviewed.
- [ ] Minor privacy handling reviewed.
- [ ] Jurisdiction-specific legal claims removed or reviewed.
- [ ] SaMD/medical-device regulatory position assessed.
- [ ] Data retention and audit logging reviewed.

## 4. Technical Evaluation

- [ ] Retrieval eval passed.
- [ ] Generation eval passed.
- [ ] S5/S6 ranking passed.
- [ ] Pediatric adult-substitution tests passed.
- [ ] Dose-engine unit tests passed.
- [ ] Multilingual/regionalization tests passed.
- [ ] Imaging boundary tests passed.
- [ ] Oncology active-treatment tests passed.
- [ ] Adversarial prompt tests passed.

## 5. Runtime Controls

- [ ] Safety hierarchy implemented.
- [ ] Fail-closed behavior implemented.
- [ ] Local resource verification implemented.
- [ ] Monitoring dashboard implemented.
- [ ] Incident workflow implemented.
- [ ] Rollback plan implemented.
- [ ] Versioning and provenance implemented.

## 6. Final Sign-off

- [ ] Medical owner approved.
- [ ] Product owner approved.
- [ ] Legal/privacy approved.
- [ ] Engineering approved.
- [ ] Release notes complete.
- [ ] Production flag intentionally changed.
