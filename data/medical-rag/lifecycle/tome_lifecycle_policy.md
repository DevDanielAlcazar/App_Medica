# Tomo Lifecycle Policy

## Estados obligatorios

| Estado | Descripción | Entrada requerida | Salida requerida |
|--------|-------------|-------------------|------------------|
| `draft` | En construcción | Inicio de trabajo | License review |
| `source_review` | Revisando fuentes | Draft completo | License review |
| `license_review` | Validando licencias | Source review | Clinical review |
| `clinical_review` | Revisión médica | License approved | Legal review |
| `legal_review` | Revisión legal | Clinical approved | RAG eval |
| `rag_eval` | Evaluación RAG | Legal approved | Staging approval |
| `approved_for_staging` | Usable en staging | Eval passed | Production approval |
| `approved_for_production` | Usable en producción | Staging approved | Deprecated |
| `deprecated` | Retirado de uso | Problema detectado | Archived |
| `archived` | Conservado histórico | Deprecated | N/A |

## Responsables por estado

| Estado | Responsable |
|--------|-------------|
| license_review | Legal team |
| clinical_review | Medical board |
| legal_review | Legal team |
| rag_eval | QA team |

## Evidencia requerida

Cada transición requiere evidencia en `tome_manifest.json` y auditoría.