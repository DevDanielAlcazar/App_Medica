# Prompt 02 — Medical RAG Governance, Source Registry y Arquitectura de Tomos Clínicos

> **Uso recomendado:** pegar este prompt en OpenCode, AionUI, Antigravity, Gemini CLI o herramienta equivalente.  
> **Repositorio objetivo:** `D:\Desarrollos\App_Medica`  
> **Rol esperado del agente:** Dev Jr / Implementador técnico.  
> **Arquitecto responsable:** ChatGPT actuando como arquitecto senior del proyecto.  
> **Modo de trabajo:** no improvisar criterios clínicos, no descargar contenido médico masivo todavía y no implementar features de producto fuera del alcance de este prompt.

---

## 0. Selección sugerida de modelo para ejecutar este prompt

### Opción A — Principal: Poolside Laguna M.1
Usa **Laguna M.1** si está disponible en Poolside/OpenCode/OpenRouter. Esta tarea requiere razonamiento de arquitectura, lectura documental, creación de contratos de datos, gobernanza técnica, estructura de repositorio y criterios de seguridad. Laguna M.1 es preferible cuando se necesita trabajo agentic de coding/documentación con buena capacidad de seguimiento de instrucciones.

### Opción B — Alternativa fuerte: Qwen3 Coder / Qwen Coder de mayor contexto disponible
Usa **Qwen Coder** si Laguna M.1 no está disponible o se vuelve lento/costoso. Es buena opción para scaffolding, refactors, generación de estructuras, documentación técnica y razonamiento sobre repositorios.

### Opción C — Alternativa costo/velocidad: DeepSeek V4 Flash / DeepSeek Flash Free
Usa **DeepSeek Flash** cuando se busque velocidad y bajo costo. Es suficiente para crear carpetas, contratos, plantillas y documentación estructurada. Si genera demasiadas suposiciones clínicas, reduce el scope y fuerza validaciones.

### Opción D — Revisor: Nemotron Ultra / GPT-OSS-120B / Claude-compatible alto contexto
Usa uno de estos como segundo pase de revisión. Su tarea no es crear archivos, sino detectar contradicciones, riesgos regulatorios, huecos de seguridad, supuestos clínicos no validados y problemas de escalabilidad.

**Regla operativa:** si el modelo no soporta bien contexto largo, primero lee `docs/_PROJECT_CONTEXT_COMPILED.md`, `README.md`, `docs/clinical/CLINICAL_GUARDRAILS_INDEX.md`, `docs/ai/AI_GATEWAY_BASELINE.md` y este prompt. Luego trabaja por entregables.

---

## 1. Contexto ejecutivo del proyecto

Estamos construyendo una **App Médica web-first / PWA responsiva** para México, Estados Unidos, Latinoamérica y países de habla inglesa. Tendrá:

- Diagnóstico/asistencia clínica con IA, con guardrails estrictos.
- Médicos humanos registrados, validados por cédula profesional e identidad.
- Videoconsultas vía Google Meet.
- Pagos reales en release productivo.
- Panel admin para configurar proveedores IA compatibles con OpenAI, Claude o APIs genéricas.
- Autorouting de modelos/proveedores activos.
- Modo claro/oscuro.
- i18n ES/EN y detección inicial de región/idioma.
- Expediente clínico digital con eliminación manual por usuario y eliminación automática tras 6 meses en estado `curado`.

Este prompt **no debe implementar la app todavía**. Debe crear la base de gobernanza para el futuro **Medical Knowledge RAG Gold Standard**, por tomos, con trazabilidad, licenciamiento, seguridad clínica y evaluación.

---

## 2. Objetivo específico de este prompt

Crear en el repositorio una estructura técnica/documental para el RAG médico de alta calidad, incluyendo:

1. Arquitectura de carpetas para tomos clínicos.
2. Registro maestro de fuentes médicas autorizadas.
3. Política de licencias y uso permitido/prohibido.
4. Contratos de metadata por fuente, documento y chunk.
5. Taxonomía clínica inicial.
6. Definición de tomos RAG por prioridad.
7. Pipeline conceptual de ingesta, normalización, chunking, evaluación y publicación.
8. Gates de calidad médica/legal antes de activar cualquier tomo en producción.
9. Checklist para que el arquitecto senior pueda depositar tomos generados posteriormente.
10. Plantillas `.json` / `.md` para que cada tomo sea versionable, auditable y reusable.

---

## 3. Restricciones no negociables

### 3.1 Seguridad clínica
- No crear contenido clínico inventado.
- No generar catálogos de medicamentos con dosis reales en este prompt.
- No generar diagnósticos, recomendaciones terapéuticas ni protocolos clínicos finales.
- No afirmar que una fuente está aprobada si no existe registro de licencia y validación.
- No diseñar el RAG como sustituto de médico humano.
- Todo contenido clínico futuro debe pasar por validación médica y legal.

### 3.2 Legal/licencias
- No ingerir libros comerciales, PDFs de editoriales, guías de pago o contenido protegido sin licencia explícita.
- No preparar scripts de scraping masivo sobre fuentes sin autorización.
- No copiar textos extensos de fuentes protegidas.
- No incluir contenido médico de terceros salvo snippets mínimos en plantillas de ejemplo.
- Todo documento debe tener campos de licencia, fuente, jurisdicción, fecha de revisión y permitido/prohibido.

### 3.3 Técnica
- No instalar dependencias pesadas todavía.
- No crear base vectorial todavía.
- No conectar APIs reales todavía.
- No crear `.env` con secretos reales.
- No modificar archivos de negocio existentes sin razón.
- No borrar documentos ya creados.

---

## 4. Carpetas objetivo a crear

Crear esta estructura bajo el repo:

```text
D:\Desarrollos\App_Medica
├── data/
│   └── medical-rag/
│       ├── README.md
│       ├── registry/
│       │   ├── source_registry.schema.json
│       │   ├── source_registry.example.json
│       │   ├── source_registry.pending.md
│       │   └── licensing_policy.md
│       ├── tomes/
│       │   ├── README.md
│       │   ├── 00_governance/
│       │   │   ├── tome_manifest.example.json
│       │   │   └── README.md
│       │   ├── 01_red_flags_triage/
│       │   │   ├── tome_manifest.example.json
│       │   │   └── README.md
│       │   ├── 02_clinical_history_anamnesis/
│       │   │   ├── tome_manifest.example.json
│       │   │   └── README.md
│       │   ├── 03_general_medicine_adult/
│       │   │   ├── tome_manifest.example.json
│       │   │   └── README.md
│       │   ├── 04_pediatrics_safe/
│       │   │   ├── tome_manifest.example.json
│       │   │   └── README.md
│       │   ├── 05_otc_symptomatic_recommendations/
│       │   │   ├── tome_manifest.example.json
│       │   │   └── README.md
│       │   ├── 06_frequent_specialties/
│       │   │   ├── tome_manifest.example.json
│       │   │   └── README.md
│       │   ├── 07_imaging_orientation/
│       │   │   ├── tome_manifest.example.json
│       │   │   └── README.md
│       │   ├── 08_oncology_red_flags/
│       │   │   ├── tome_manifest.example.json
│       │   │   └── README.md
│       │   └── 09_multilingual_regionalization/
│       │       ├── tome_manifest.example.json
│       │       └── README.md
│       ├── pipeline/
│       │   ├── ingestion_pipeline.md
│       │   ├── chunking_strategy.md
│       │   ├── metadata_contract.md
│       │   ├── evidence_grading.md
│       │   ├── retrieval_policy.md
│       │   └── publication_workflow.md
│       ├── evaluation/
│       │   ├── rag_eval_plan.md
│       │   ├── clinical_case_eval_template.md
│       │   ├── safety_eval_template.md
│       │   └── hallucination_regression_template.md
│       └── governance/
│           ├── medical_review_gate.md
│           ├── legal_review_gate.md
│           ├── source_acceptance_criteria.md
│           ├── prohibited_sources.md
│           └── change_control.md
└── docs/
    └── architecture/
        └── MEDICAL_RAG_ARCHITECTURE.md
```

---

## 5. Contenido mínimo de cada archivo

### 5.1 `data/medical-rag/README.md`
Debe explicar:

- Qué es el Medical Knowledge RAG Gold Standard.
- Qué NO es: no es entrenamiento de modelo, no es sustituto médico, no es scraping libre.
- Cómo se agregan tomos.
- Flujo: fuente → validación licencia → normalización → chunking → metadata → evaluación → publicación.
- Estados de un tomo: `draft`, `license_review`, `medical_review`, `legal_review`, `approved_for_staging`, `approved_for_production`, `deprecated`.
- Carpeta donde el arquitecto senior depositará los tomos finales:

```text
D:\Desarrollos\App_Medica\data\medical-rag\tomes\<numero_nombre_tomo>\release\
```

Crear también una sección explícita:

```md
## Dónde depositar tomos generados por el arquitecto senior

Cada tomo validado deberá depositarse en:

`data/medical-rag/tomes/<tomo>/release/`

Estructura esperada:
- `tome_manifest.json`
- `chunks.jsonl`
- `source_map.json`
- `clinical_review_report.md`
- `legal_review_report.md`
- `eval_report.md`
- `CHANGELOG.md`
```

### 5.2 `source_registry.schema.json`
Crear un JSON Schema claro para registrar fuentes.

Campos obligatorios:

```json
{
  "source_id": "string",
  "title": "string",
  "publisher": "string",
  "source_type": "guideline | textbook | article | ontology | official_site | clinical_tool | dataset | policy | other",
  "url": "string",
  "license_name": "string",
  "license_url": "string",
  "license_status": "approved | pending_review | rejected | restricted",
  "allowed_uses": ["rag_retrieval", "quotation_limited", "metadata_only", "internal_review"],
  "prohibited_uses": ["model_training", "redistribution", "commercial_reuse", "verbatim_bulk_copy"],
  "jurisdictions": ["global", "mx", "us", "latam", "en"],
  "languages": ["es", "en"],
  "clinical_domains": ["string"],
  "specialties": ["string"],
  "evidence_level": "official_guideline | systematic_review | clinical_reference | expert_consensus | educational | unknown",
  "last_accessed_at": "YYYY-MM-DD",
  "last_reviewed_at": "YYYY-MM-DD",
  "review_owner": "string",
  "notes": "string"
}
```

Debe validar que `license_status` solo acepte valores controlados.

### 5.3 `source_registry.example.json`
Incluir ejemplos de fuentes **sin afirmar aprobación final**. Deben quedar como `pending_review`, salvo si el proyecto ya documentó licencia aprobada manualmente.

Ejemplos conceptuales:

- WHO guideline/publication.
- CDC clinical page/guideline.
- NIH/MedlinePlus patient info.
- NCBI Bookshelf item, marcado como `restricted` o `pending_review` según licencia específica.
- PMC Open Access article, marcado como `pending_review` hasta confirmar Creative Commons específica.
- ICD-11, marcado como `restricted` por licencia NoDerivs.
- MeSH, marcado como `pending_review`.
- SNOMED CT, marcado como `restricted` por licencia territorial.

No copiar texto clínico de esas fuentes, solo metadata ejemplo.

### 5.4 `licensing_policy.md`
Debe contener:

- Política de aceptación de fuentes.
- Fuentes permitidas.
- Fuentes condicionadas.
- Fuentes prohibidas.
- Diferencia entre `rag_retrieval`, `model_training`, `redistribution`, `metadata_only`.
- Regla: “free to read” no significa “free to ingest/reuse”.
- Regla: ningún libro comercial entra sin autorización explícita.
- Regla: ninguna fuente `pending_review` puede ir a producción.
- Regla: ninguna fuente `restricted` puede entrar a chunks sin revisión legal.

### 5.5 `metadata_contract.md`
Definir metadata por chunk:

```json
{
  "chunk_id": "tome-source-section-hash",
  "tome_id": "01_red_flags_triage",
  "source_id": "who-example-001",
  "source_title": "string",
  "publisher": "string",
  "source_url": "string",
  "license_status": "approved | pending_review | rejected | restricted",
  "language": "es | en",
  "jurisdiction": ["global", "mx", "us", "latam"],
  "specialty": "string",
  "clinical_domain": "string",
  "age_group": "adult | pediatric | neonatal | pregnancy | older_adult | all",
  "sex_specificity": "female | male | all | pregnancy_related",
  "red_flag_relevant": true,
  "evidence_level": "official_guideline | systematic_review | clinical_reference | expert_consensus | educational | unknown",
  "clinical_action_type": "triage | ask_more | educate | recommend_otc | refer_in_person | refer_emergency | follow_up | contraindication | do_not_advise",
  "created_at": "YYYY-MM-DD",
  "reviewed_at": "YYYY-MM-DD",
  "review_status": "draft | medical_review | legal_review | approved | deprecated",
  "content_hash": "sha256"
}
```

### 5.6 `evidence_grading.md`
Crear niveles internos:

- `A`: guía clínica oficial / organismo sanitario.
- `B`: revisión sistemática / consenso robusto.
- `C`: referencia clínica reconocida con licencia autorizada.
- `D`: educación al paciente, útil pero no suficiente para diagnóstico.
- `X`: no apta para recomendación clínica.

Debe aclarar que la app no debe mezclar niveles como si fueran equivalentes.

### 5.7 `retrieval_policy.md`
Definir reglas de recuperación:

- Primero red flags/triage.
- Luego anamnesis.
- Luego diagnóstico diferencial.
- Luego orientación sintomática/OTC si procede.
- Nunca emitir recomendación sintomatológica si faltan datos mínimos.
- Nunca responder con única fuente cuando el caso sea complejo.
- Usar búsqueda híbrida: lexical + vectorial + filtros metadata.
- Para pediatría, embarazo, adulto mayor, dolor torácico, disnea, neuro, fiebre persistente, suicidio, intoxicación o alergia grave, activar política de seguridad reforzada.

### 5.8 `rag_eval_plan.md`
Crear plan de evaluación:

- Evaluación de precisión factual.
- Evaluación de seguridad.
- Evaluación de no alucinación.
- Evaluación de citabilidad/trazabilidad.
- Evaluación bilingüe ES/EN.
- Evaluación por región.
- Evaluación pediátrica reforzada.
- Evaluación de rechazo seguro cuando falte evidencia.

### 5.9 `clinical_case_eval_template.md`
Plantilla para casos:

```md
# Clinical Case Eval

## Case ID

## Language

## Region

## Patient Context

## Symptoms

## Missing Data

## Expected Safe Behavior

## Expected Questions

## Red Flags Expected

## Must Not Do

## Sources Required

## Pass/Fail Criteria
```

### 5.10 `medical_review_gate.md`
Checklist:

- Fuente aceptada.
- Licencia aceptada.
- Especialidad cubierta.
- Revisión por médico humano.
- Red flags validados.
- Pediatría validada si aplica.
- OTC validado si aplica.
- No hay recomendaciones de controlados.
- No hay indicaciones invasivas.
- No hay dosis clínicas activas sin validación médica.

### 5.11 `legal_review_gate.md`
Checklist:

- Licencia compatible.
- Jurisdicción revisada.
- Derechos de autor revisados.
- Uso comercial revisado.
- Restricciones de NoDerivs revisadas.
- Atribución definida.
- No existe redistribución prohibida.
- No existe entrenamiento no autorizado.

### 5.12 `MEDICAL_RAG_ARCHITECTURE.md`
Documento ejecutivo/técnico con:

- Diagrama textual.
- Componentes.
- Pipeline.
- Estados.
- Roles.
- Donde se depositan tomos.
- Cómo se publican.
- Cómo interactuará con AI Gateway.
- Cómo se impedirá que la IA use contenido no aprobado.
- Decisión arquitectónica: el RAG tendrá `staging` y `production`, y solo tomos `approved_for_production` podrán ser usados en consultas reales.

---

## 6. Tomos iniciales y propósito

Crear README por cada tomo con esta estructura:

```md
# Tomo XX — Nombre

## Propósito

## Alcance clínico

## Fuentes esperadas

## Exclusiones

## Riesgos principales

## Criterios para aprobar staging

## Criterios para aprobar producción

## Carpeta release

Los archivos finales del tomo deberán depositarse en:

`data/medical-rag/tomes/XX_nombre/release/`
```

### Lista de tomos

1. `00_governance`: normas, licencias, taxonomía, formatos, changelog.
2. `01_red_flags_triage`: urgencias, signos de alarma, derivación inmediata.
3. `02_clinical_history_anamnesis`: expediente clínico, preguntas mínimas, semiología.
4. `03_general_medicine_adult`: síntomas frecuentes adulto, diagnóstico diferencial seguro.
5. `04_pediatrics_safe`: pediatría con seguridad reforzada.
6. `05_otc_symptomatic_recommendations`: OTC, contraindicaciones, límites y “no recomendar”.
7. `06_frequent_specialties`: dermatología, gastro, cardio, respiratorio, neuro, endócrino, gine, infecto, trauma, salud mental básica.
8. `07_imaging_orientation`: orientación de imagenología, cuándo pedir evaluación médica, no interpretación definitiva autónoma.
9. `08_oncology_red_flags`: signos de alarma, sospecha, derivación, no diagnóstico definitivo autónomo.
10. `09_multilingual_regionalization`: ES/EN, lenguaje humano, adaptación regional sin alterar seguridad clínica.

---

## 7. Criterios de aceptación del trabajo

Al terminar, reporta en markdown:

```md
# Resultado Prompt 02

## Archivos creados
- ...

## Archivos modificados
- ...

## Decisiones técnicas aplicadas
- ...

## Riesgos o bloqueadores detectados
- ...

## Validaciones realizadas
- [ ] No se agregó contenido clínico inventado
- [ ] No se descargaron fuentes externas
- [ ] No se incluyeron secretos
- [ ] No se usaron fuentes pending/restricted como aprobadas
- [ ] Se creó estructura para tomos
- [ ] Se creó registro de fuentes
- [ ] Se creó política de licencias
- [ ] Se creó arquitectura RAG

## Carpeta donde el arquitecto debe depositar tomos
`data/medical-rag/tomes/<tomo>/release/`

## Siguiente prompt sugerido
Prompt 03 — Source Discovery Pack: fuentes médicas oficiales, abiertas y priorizadas para Tomo 01 Red Flags/Triage.
```

---

## 8. Definition of Done

El trabajo se considera completo si:

- Existe `data/medical-rag/` con toda la estructura indicada.
- Existe `docs/architecture/MEDICAL_RAG_ARCHITECTURE.md`.
- Existe schema JSON del source registry.
- Existen ejemplos sin claims falsos de aprobación.
- Existen políticas de licenciamiento, ingesta, chunking, metadata, retrieval, evaluación y publicación.
- Cada tomo tiene README y manifest de ejemplo.
- Está claro dónde depositar tomos finales generados por el arquitecto senior.
- No se descargó ni copió contenido médico real de terceros.
- No se agregó ninguna dependencia innecesaria.
- No se generaron secretos.
- No se implementaron features fuera del alcance.

---

## 9. Notas finales para el agente

Trabaja con mentalidad de producto clínico de alto riesgo. Tu prioridad no es “avanzar rápido”, sino dejar una base que evite deuda técnica, deuda legal y riesgo clínico. Si algo no está validado, márcalo como pendiente. Si una fuente parece útil pero no hay claridad de licencia, márcala como `pending_review` o `restricted`, nunca como aprobada.

