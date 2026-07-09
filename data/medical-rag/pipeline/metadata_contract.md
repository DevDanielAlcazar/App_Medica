# Contrato de Metadata por Chunk

## Schema JSON

```json
{
  "chunk_id": "string - tome-source-section-hash",
  "tome_id": "string - ID del tomo padre",
  "source_id": "string - ID de la fuente",
  "source_title": "string - Título de la fuente",
  "publisher": "string - Editorial/organismo origen",
  "source_url": "string - URL directa al contenido",
  "license_status": "enum - approved|pending_review|rejected|restricted",
  "language": "enum - es|en",
  "jurisdiction": "array - global|mx|us|latam|en",
  "specialty": "string - Especialidad médica",
  "clinical_domain": "string - Dominio clínico",
  "age_group": "enum - adult|pediatric|neonatal|pregnancy|older_adult|all",
  "sex_specificity": "enum - female|male|all|pregnancy_related",
  "red_flag_relevant": "boolean - ¿Contiene red flag?",
  "evidence_level": "enum - official_guideline|systematic_review|clinical_reference|expert_consensus|educational|unknown",
  "clinical_action_type": "enum - triage|ask_more|educate|recommend_otc|refer_in_person|refer_emergency|follow_up|contraindication|do_not_advise",
  "created_at": "date - YYYY-MM-DD",
  "reviewed_at": "date - YYYY-MM-DD",
  "review_status": "enum - draft|medical_review|legal_review|approved|deprecated",
  "content_hash": "string - SHA256 del contenido"
}
```

## Campos críticos

### `license_status`

- `approved`: Puede usarse en producción.
- `pending_review`: NO usar en producción.
- `restricted`: Solo metadata_only.

### `red_flag_relevant`

- `true`: El chunk contiene información de signos de alarma.
- Requiere validación médica reforzada.

### `clinical_action_type`

- `triage`: Preguntas para triage inicial.
- `ask_more`: Datos faltantes a solicitar.
- `educate`: Información educativa.
- `recommend_otc`: Recomendación OTC permitida.
- `refer_in_person`: Derivación a consulta.
- `refer_emergency`: Derivación urgente.
- `do_not_advise`: No dar recomendación.