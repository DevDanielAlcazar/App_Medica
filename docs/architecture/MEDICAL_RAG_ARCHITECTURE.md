# Arquitectura Medical Knowledge RAG

## Diagrama textual

```
┌─────────────────┐
│   Federación    │
│  Source Registry │
│ (licensing ok)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Ingestion      │
│  Pipeline       │
│  (Normalize)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Chunking       │
│  Strategy       │
│  (400-500 toks) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Metadata       │
│  Contract       │
│  (per chunk)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Staging DB     │
│  (Vector + SQL) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Evaluation     │
│  (Clinical/QA)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Production DB  │
│  (Approved only)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Gateway     │
│  Retrieval API  │
└─────────────────┘
```

## Componentes

### Source Registry
- JSON Schema validado.
- Lista de fuentes con licencia.
- Estados: approved, pending_review, restricted.

### Ingestion Pipeline
- Script manual (no scraping automático).
- Transforma fuentes a texto plano.
- Validación de formato.

### Chunking Strategy
- 400-500 tokens máximo.
- Overlap 50 tokens.
- Metadata preservada.

### Metadata Contract
- Per chunk, no opcional.
- Hash de contenido.
- Nivel de evidencia.
- Tipo de acción clínica.

### Vector Storage
- Staging: para pruebas.
- Production: solo tomos aprobados.
- Filtros por metadata.

## Estados de tomo

1. `draft` - En construcción.
2. `license_review` - Validando licencia.
3. `medical_review` - Validación médica.
4. `legal_review` - Validación legal.
5. `approved_for_staging` - QA activo.
6. `approved_for_production` - Uso real.
7. `deprecated` - Retirado.

## Roles

| Rol | Responsabilidad |
|-----|-----------------|
| Admin | Agrega fuentes, ejecuta pipeline. |
| Médico | Revisa contenido clínico. |
| Legal | Revisa licencias. |
| QA | Ejecuta pruebas. |

## Dónde depositar tomos

```
data/medical-rag/tomes/<tome_id>/release/
```

## Interacción con AI Gateway

- Endpoint: `/api/rag/retrieve`.
- Filtros: jurisdiction, age_group, specialty, evidence_level.
- Solo retorna contenido `approved_for_production`.

## Seguridad

- No exponer contenido no aprobado.
- Filtros automáticos por metadata.
- Logs sin PHI.
- Versionado auditable.

## Arquitectura extensible de corpus y contribuciones

### Separación de concerns

```
Source Registry ──► Permission Registry ──► Contributor Registry ──► Tom Releases ──► Corpus Releases
     │                   │                     │                     │            │
     ▼                   ▼                     ▼                     ▼            ▼
Fuentes con                Permisos              Contributors           Tomes         Corpora
licencia                   explícitos           validados              aprobados     productivos
```

### Contribuciones externas

- Source registry: fuentes con licencia.
- Permission registry: permisos explícitos.
- Contributor registry: médicos, autores, instituciones.
- Cada contribución pasa por intake checklist.
- Ninguna contribución externa salta gates.

### Múltiples corpus

- `base_global`: corpus base con seguridad clínica.
- `regional_*`: adaptaciones por país.
- `institutional_*`: corpus privados con permiso.
- `specialty_*`: corpus por especialidad.
- Branching aislado sin romper RAG base.

### Deprecación segura

- Chunks obsoletos se marcan `deprecated`.
- No se eliminan físicamente sin traza.
- RAG filtra chunks `deprecated` automáticamente.
- Auditoría de cada deprecación.