# Prompt 04 — Source Discovery Pack para Tomo 01: Red Flags, Triage y Derivación Inmediata

## Rol que debes asumir

Actúa como **desarrollador Jr. ejecutor bajo supervisión de un arquitecto senior** para el proyecto `App_Medica`.

Tu responsabilidad en este prompt **NO** es construir el tomo clínico todavía, **NO** es diagnosticar, **NO** es generar recomendaciones médicas y **NO** es ingerir contenido clínico completo. Tu responsabilidad es preparar el **Source Discovery Pack** del Tomo 01 para que el arquitecto senior pueda generar posteriormente un RAG clínico de calidad gold con fuentes oficiales, auditables, versionadas y legalmente revisables.

El proyecto está en:

```txt
D:\Desarrollos\App_Medica
```

Trabaja dentro del repositorio actual. Antes de crear archivos, inspecciona la estructura existente, especialmente:

```txt
data/medical-rag/
docs/architecture/
docs/reports/
prompts/
```

Si alguna carpeta ya existe, **no la reemplaces destructivamente**. Extiéndela respetando lo creado por prompts anteriores.

---

## Contexto ejecutivo

Estamos construyendo una app médica web-first, responsiva, multi-idioma, con IA clínica, médicos humanos verificados, videoconsulta por Google Meet, AI Gateway multi-proveedor y expedientes clínicos digitales.

La IA podrá orientar diagnósticamente, pero debe operar con guardrails estrictos:

- Prioridad absoluta: seguridad clínica.
- Ante duda clínica relevante: pedir más evidencia.
- Ante red flag: derivar a consulta médica presencial, urgencias o emergencia local.
- Nunca recetar medicamentos controlados.
- Recomendaciones sintomatológicas solo con evidencia suficiente.
- Pediatría permitida, pero con umbral de seguridad más conservador.
- Toda fuente del RAG debe ser trazable, versionada, con licencia revisada y metadata clínica.

El Tomo 01 es crítico porque gobernará la capa de **red flags, triage, urgencias y derivación inmediata**. Esta capa debe tener prioridad sobre cualquier otro tomo futuro.

---

## Objetivo del Prompt 04

Crear el paquete documental y estructural para descubrir, registrar, priorizar y revisar fuentes médicas del **Tomo 01 — Red Flags, Triage y Derivación Inmediata**.

Este prompt debe dejar listo:

1. Catálogo de fuentes candidatas.
2. Matriz de priorización clínica/legal.
3. Registro preliminar compatible con el `source_registry.schema.json` existente.
4. Queries de búsqueda adicionales para el arquitecto senior.
5. Gap analysis por dominios clínicos.
6. Checklist de revisión médica/legal.
7. Contrato de salida esperado para cuando el arquitecto senior genere el tomo real.

---

## Modelos recomendados para ejecutar este prompt

### Opción 1 — Poolside Laguna M.1

Úsalo si está disponible en OpenCode, Poolside u OpenRouter.

**Por qué:** es una buena primera opción para tareas agentic de repositorio, creación documental estructurada, lectura de contexto amplio y generación de artefactos consistentes. Es ideal para operar como dev Jr. sobre muchos archivos y mantener coherencia de estructura.

**Cuándo NO usarlo:** si el proveedor está inestable, si la sesión no conserva contexto suficiente o si hay límites fuertes de output.

### Opción 2 — Qwen3 Coder 480B A35B

Úsalo como alternativa fuerte.

**Por qué:** es muy competente en agentic coding, tool use, lectura de repositorios y generación de estructuras técnicas con buen apego a instrucciones. Es buena opción si necesitas precisión sobre rutas, JSON Schemas y archivos múltiples.

**Cuándo NO usarlo:** si la instancia disponible tiene límites de contexto menores o si empieza a crear contenido clínico inventado en vez de limitarse a discovery pack.

### Opción 3 — GPT-OSS-120B

Úsalo como revisor o segunda pasada.

**Por qué:** es útil para razonamiento, revisión crítica, consistencia documental y detección de huecos. No lo usaría como único ejecutor si no tiene buen acceso a filesystem, pero sí como auditor del resultado.

**Cuándo NO usarlo:** si solo está disponible en una variante sin herramientas de edición de archivos o con límites bajos.

### Opción 4 — DeepSeek V4 Flash Free / DeepSeek Flash

Úsalo si necesitas velocidad/costo bajo.

**Por qué:** puede generar documentación y JSON razonablemente rápido.

**Riesgo:** para temas médicos/legal/compliance puede ser más propenso a atajos. Si se usa, exige revisión posterior con Laguna M.1, Qwen3 Coder, GPT-OSS-120B o Nemotron Ultra.

### Opción 5 — Nemotron Ultra, Kilo Code, Cerebras o Groq-hosted models

Úsalos como alternativa táctica según disponibilidad.

**Por qué:** pueden servir para revisión, consistencia o generación rápida. Groq es especialmente útil cuando se prioriza baja latencia con APIs OpenAI-compatible.

**Regla:** ningún modelo puede aprobar fuentes médicas por sí solo. La aprobación final requiere revisión humana médica/legal.

---

## Reglas duras de ejecución

### Prohibido

- No inventes fuentes.
- No inventes licencias.
- No marques ninguna fuente como `approved_for_production`.
- No descargues libros comerciales.
- No copies contenido extenso de fuentes médicas.
- No generes chunks clínicos finales.
- No crees diagnósticos, recomendaciones terapéuticas ni recetas.
- No agregues secretos, API keys, tokens o credenciales.
- No elimines archivos existentes.
- No modifiques documentos fuera del alcance salvo que sea para referenciar el nuevo Source Discovery Pack.

### Permitido

- Crear archivos `.md`, `.json`, `.jsonl` y `.csv` de discovery.
- Crear fuente candidata con estado `pending_license_review` o `pending_medical_review`.
- Crear matrices de priorización.
- Crear listas de búsqueda adicionales.
- Crear reportes de huecos.
- Crear contratos de salida para el futuro Tomo 01.

---

## Fuentes candidatas iniciales para Tomo 01

Crea registros candidatos para estas fuentes. No las marques como aprobadas. Clasifícalas por autoridad, licencia, riesgo y cobertura clínica.

> Nota: si tienes internet disponible, puedes verificar título/URL/fecha. Si no tienes internet, registra las fuentes como `pending_url_verification` y conserva las URLs candidatas.

### F001 — WHO / ICRC Basic Emergency Care

```txt
Título: Basic Emergency Care: approach to the acutely ill and injured
Autoridad: WHO + ICRC
URL candidata: https://hlh.who.int/docs/librariesprovider4/hlh-documents/who-icrc-basic-emergency-care.pdf
Uso esperado: marco base de evaluación de paciente agudo, ABCDE, urgencias, triage clínico inicial.
Estado inicial: pending_license_review
Prioridad clínica: critical
```

### F002 — WHO Interagency Integrated Triage Tool

```txt
Título: Interagency Integrated Triage Tool
Autoridad: WHO
URL candidata: https://www.who.int/tools/triage
Uso esperado: clasificación de acuidad red/yellow/green, triage por nivel de urgencia.
Estado inicial: pending_license_review
Prioridad clínica: critical
```

### F003 — MedlinePlus: When to use the emergency room — Adult

```txt
Título: When to use the emergency room - adult
Autoridad: MedlinePlus / NIH / NLM
URL candidata: https://medlineplus.gov/ency/patientinstructions/000593.htm
Uso esperado: señales de emergencia para adultos, orientación de cuándo buscar ER.
Estado inicial: pending_license_review
Prioridad clínica: high
```

### F004 — MedlinePlus: When to use the emergency room — Child

```txt
Título: When to use the emergency room - child
Autoridad: MedlinePlus / NIH / NLM
URL candidata: https://medlineplus.gov/ency/patientinstructions/000594.htm
Uso esperado: señales de emergencia pediátrica.
Estado inicial: pending_license_review
Prioridad clínica: critical
```

### F005 — CDC: Flu emergency warning signs

```txt
Título: Signs and Symptoms of Flu / Emergency warning signs
Autoridad: CDC
URL candidata: https://www.cdc.gov/flu/signs-symptoms/index.html
Uso esperado: red flags respiratorias, fiebre, deshidratación, pediatría y adultos.
Estado inicial: pending_license_review
Prioridad clínica: high
```

### F006 — CDC: COVID-19 emergency warning signs

```txt
Título: Symptoms of COVID-19 / Emergency warning signs
Autoridad: CDC
URL candidata: https://www.cdc.gov/covid/signs-symptoms/index.html
Uso esperado: dificultad respiratoria, dolor/ presión torácica, confusión, incapacidad para despertar.
Estado inicial: pending_license_review
Prioridad clínica: high
```

### F007 — NICE CKS: Chronic pain red flags

```txt
Título: Chronic pain: Red flag signs and symptoms
Autoridad: NICE CKS
URL candidata: https://cks.nice.org.uk/topics/chronic-pain/diagnosis/red-flag-signs-symptoms/
Uso esperado: signos de alarma asociados a cáncer, infección, inflamación, trauma, neurología.
Estado inicial: pending_license_review
Prioridad clínica: medium_high
```

### F008 — NICE CKS: Chest pain differential / other causes

```txt
Título: Chest pain — Diagnosis / Other causes
Autoridad: NICE CKS
URL candidata: https://cks.nice.org.uk/topics/chest-pain/diagnosis/other-causes/
Uso esperado: clasificación inicial de causas de dolor torácico y red flags relacionadas.
Estado inicial: pending_license_review
Prioridad clínica: high
```

### F009 — NHS: Shortness of breath

```txt
Título: Shortness of breath
Autoridad: NHS
URL candidata: https://www.nhs.uk/symptoms/shortness-of-breath/
Uso esperado: red flags de disnea y cuándo ir a emergencias.
Estado inicial: pending_license_review
Prioridad clínica: critical
```

### F010 — NHS: Stomach ache

```txt
Título: Stomach ache
Autoridad: NHS
URL candidata: https://www.nhs.uk/symptoms/stomach-ache/
Uso esperado: dolor abdominal súbito/severo, sangrado digestivo, vómito, imposibilidad de evacuar/orinar, colapso.
Estado inicial: pending_license_review
Prioridad clínica: high
```

### F011 — NHS: Coronary heart disease symptoms

```txt
Título: Coronary heart disease — Symptoms
Autoridad: NHS
URL candidata: https://www.nhs.uk/conditions/coronary-heart-disease/symptoms/
Uso esperado: dolor torácico, disnea y sospecha de infarto.
Estado inicial: pending_license_review
Prioridad clínica: critical
```

### F012 — NHS England: Guidance for emergency departments initial assessment

```txt
Título: Guidance for emergency departments: initial assessment
Autoridad: NHS England
URL candidata: https://www.england.nhs.uk/guidance-for-emergency-departments-initial-assessment/
Uso esperado: acuity scoring y flujo de valoración inicial.
Estado inicial: pending_license_review
Prioridad clínica: medium_high
```

### F013 — NCBI Bookshelf / StatPearls: Emergency Department Triage

```txt
Título: Emergency Department Triage
Autoridad: NCBI Bookshelf / StatPearls
URL candidata: https://www.ncbi.nlm.nih.gov/books/NBK557583/
Uso esperado: conceptos de triage, signos/vitales considerados, escalas.
Estado inicial: restricted_or_unclear_license_review
Prioridad clínica: medium_high
```

### F014 — HealthyChildren/AAP: Urgent Care, ER or Pediatrician? A Parent Guide

```txt
Título: Urgent Care, ER or Pediatrician? A Parent Guide
Autoridad: HealthyChildren.org / American Academy of Pediatrics
URL candidata: https://www.healthychildren.org/English/family-life/health-management/Pages/urgent-care-ER-or-pediatrician-a-parent-guide.aspx
Uso esperado: triage pediátrico orientado a padres.
Estado inicial: restricted_or_unclear_license_review
Prioridad clínica: high
```

---

## Dominios clínicos obligatorios del gap analysis

El Source Discovery Pack debe medir cobertura de fuentes contra estos dominios. No necesitas resolverlos todavía, solo mapear si hay fuentes candidatas suficientes o si falta investigación.

```txt
1. Disnea / dificultad respiratoria
2. Dolor torácico / sospecha cardiovascular
3. Síntomas neurológicos agudos / stroke-like symptoms
4. Alteración del estado mental / confusión / síncope
5. Fiebre en adultos
6. Fiebre pediátrica
7. Lactantes menores de 12 semanas
8. Deshidratación pediátrica
9. Dolor abdominal severo
10. Sangrado digestivo / vómito con sangre / heces negras
11. Reacción alérgica severa / anafilaxia
12. Convulsiones
13. Trauma / fractura / heridas profundas / quemaduras
14. Intoxicación / inhalación de humo / sustancias tóxicas
15. Embarazo y síntomas de alarma
16. Adulto mayor frágil
17. Paciente inmunocomprometido
18. Paciente con diabetes y vómito/deshidratación
19. Dolor severo no explicado
20. Signos de alarma oncológicos generales
21. Riesgo suicida / autolesión / crisis psiquiátrica
22. Pediatría: irritabilidad extrema, letargo, no interacción
23. Pediatría: fiebre con rash
24. Retorno de síntomas que habían mejorado y empeoran
25. Incapacidad para orinar/evacuar/gases con dolor abdominal
```

---

## Estructura de archivos a crear

Crea estos archivos, preservando la estructura existente:

```txt
data/medical-rag/source-discovery/tome_01_red_flags_triage/README.md
data/medical-rag/source-discovery/tome_01_red_flags_triage/source_candidates.tome_01.red_flags_triage.json
data/medical-rag/source-discovery/tome_01_red_flags_triage/prioritized_source_matrix.csv
data/medical-rag/source-discovery/tome_01_red_flags_triage/source_review_queue.md
data/medical-rag/source-discovery/tome_01_red_flags_triage/source_registry_patch.tome_01.draft.json
data/medical-rag/source-discovery/tome_01_red_flags_triage/query_pack.tome_01.md
data/medical-rag/source-discovery/tome_01_red_flags_triage/license_triage_report.md
data/medical-rag/source-discovery/tome_01_red_flags_triage/clinical_scope_gap_analysis.md
data/medical-rag/source-discovery/tome_01_red_flags_triage/tome_01_authoring_contract.md
data/medical-rag/source-discovery/tome_01_red_flags_triage/tome_01_acceptance_checklist.md
docs/reports/PROMPT_04_EXECUTION_REPORT.md
```

Opcionalmente, si existe una carpeta `docs/architecture/`, actualiza o crea una referencia breve en:

```txt
docs/architecture/MEDICAL_RAG_ARCHITECTURE.md
```

No hagas una reescritura total. Solo agrega una sección corta de “Tomo 01 Source Discovery”.

---

## Contrato de metadata para source candidates

Cada fuente candidata en `source_candidates.tome_01.red_flags_triage.json` debe tener esta forma mínima:

```json
{
  "source_id": "F001",
  "tome_id": "01_red_flags_triage",
  "title": "Basic Emergency Care: approach to the acutely ill and injured",
  "publisher": "WHO / ICRC",
  "authority_tier": "tier_1_official_global",
  "candidate_url": "https://...",
  "url_verification_status": "pending_url_verification",
  "license_status": "pending_license_review",
  "reuse_risk": "medium",
  "clinical_priority": "critical",
  "clinical_domains": ["triage", "emergency_care", "acute_illness"],
  "age_groups": ["adult", "pediatric", "all"],
  "jurisdictions": ["global", "mx", "us", "latam", "english_speaking"],
  "languages": ["en"],
  "expected_use": ["source_discovery", "future_rag_reference"],
  "prohibited_use_until_approved": ["production_rag", "clinical_recommendation", "automated_diagnosis"],
  "red_flag_relevant": true,
  "triage_relevant": true,
  "requires_medical_review": true,
  "requires_legal_review": true,
  "notes": "Candidate only. Do not ingest full content until license is validated."
}
```

Puedes agregar campos si el schema existente lo exige, pero no quites estos campos salvo incompatibilidad clara con el schema ya creado.

---

## Contenido mínimo esperado por archivo

### 1. README.md

Debe explicar:

- Qué es el Source Discovery Pack.
- Qué NO es.
- Cómo pasará de discovery a tomo real.
- Quién aprueba: arquitecto senior + revisión médica + revisión legal.
- Ruta futura de depósito del tomo:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/
```

### 2. source_candidates.tome_01.red_flags_triage.json

Debe contener el arreglo de fuentes candidatas F001–F014.

### 3. prioritized_source_matrix.csv

Columnas mínimas:

```csv
source_id,title,publisher,authority_tier,clinical_priority,license_status,reuse_risk,coverage_score,relevance_score,review_order,notes
```

Ordena por prioridad clínica y autoridad.

### 4. source_review_queue.md

Debe listar qué tiene que revisar:

- Legal/licencias.
- Médico/seguridad clínica.
- Técnico/RAG.
- Traducción ES/EN.
- Jurisdicción MX/US/LatAm.

### 5. source_registry_patch.tome_01.draft.json

Debe ser un patch candidato para alimentar `data/medical-rag/registry/source_registry.example.json` o futuro source registry real.

No sobrescribas el registry existente.

### 6. query_pack.tome_01.md

Genera queries de búsqueda para que el arquitecto senior investigue fuentes adicionales. Deben estar en español e inglés.

Incluye queries para:

- Red flags pediátricas.
- Red flags embarazo.
- Red flags neurología/stroke.
- Red flags dolor torácico.
- Red flags dolor abdominal.
- Red flags fiebre.
- Red flags disnea.
- Red flags alergia/anafilaxia.
- Red flags intoxicación.
- Red flags salud mental/crisis suicida.
- Guías oficiales México.
- Guías oficiales Estados Unidos.
- Guías oficiales LatAm.

Ejemplo:

```txt
site:who.int emergency triage red flags children fever guideline
site:cdc.gov emergency warning signs child fever dehydration
site:gob.mx guía práctica clínica signos alarma fiebre pediatría
site:nice.org.uk CKS red flag symptoms chest pain headache abdominal pain
```

### 7. license_triage_report.md

Debe explicar:

- Qué fuentes parecen más seguras para citar/referenciar.
- Qué fuentes requieren revisión legal estricta.
- Qué fuentes no deben ingerirse hasta tener permiso.
- Diferencia entre lectura pública, referencia, extracción, redistribución y uso en RAG productivo.

### 8. clinical_scope_gap_analysis.md

Usa los 25 dominios clínicos obligatorios.

Para cada dominio indica:

```txt
Estado: covered / partially_covered / gap
Fuentes candidatas relacionadas:
Riesgo si se publica sin cubrir:
Acción requerida:
```

### 9. tome_01_authoring_contract.md

Debe definir cómo el arquitecto senior generará después el tomo real.

Incluye contrato de archivos esperados:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/tome_manifest.json
data/medical-rag/tomes/01_red_flags_triage/release/chunks.jsonl
data/medical-rag/tomes/01_red_flags_triage/release/source_map.json
data/medical-rag/tomes/01_red_flags_triage/release/clinical_review_report.md
data/medical-rag/tomes/01_red_flags_triage/release/legal_review_report.md
data/medical-rag/tomes/01_red_flags_triage/release/eval_report.md
data/medical-rag/tomes/01_red_flags_triage/release/CHANGELOG.md
```

Define también los tipos de chunk futuros:

```txt
red_flag_rule
triage_decision_rule
emergency_escalation_rule
question_required_before_recommendation
pediatric_safety_rule
jurisdiction_adaptation_note
source_reference_note
```

### 10. tome_01_acceptance_checklist.md

Checklist antes de aprobar el tomo real:

- Fuentes verificadas.
- Licencias revisadas.
- Red flags críticos cubiertos.
- Pediatría cubierta.
- Traducciones ES/EN revisadas.
- No hay recomendaciones farmacológicas en Tomo 01 salvo derivación/seguridad.
- Tests de under-triage.
- Tests de overconfidence.
- Tests de “falta evidencia”.
- Evaluación médica humana.
- Evaluación legal humana.
- Firma de release.

### 11. PROMPT_04_EXECUTION_REPORT.md

Debe incluir:

- Archivos creados.
- Archivos modificados.
- Decisiones técnicas.
- Fuentes candidatas registradas.
- Riesgos/bloqueadores.
- Validaciones realizadas.
- Próximo prompt sugerido.

---

## Criterios de aceptación

La ejecución se considera correcta si:

1. Existe la carpeta:

```txt
data/medical-rag/source-discovery/tome_01_red_flags_triage/
```

2. Existen todos los archivos requeridos.
3. Las fuentes F001–F014 están registradas como candidatas.
4. Ninguna fuente queda como aprobada para producción.
5. El gap analysis incluye los 25 dominios obligatorios.
6. El authoring contract define la ruta futura del tomo.
7. El reporte final documenta riesgos y próximos pasos.
8. No se creó contenido clínico final ni chunks de producción.
9. No se agregaron secretos.
10. No se eliminaron archivos existentes.

---

## Próximo prompt sugerido si todo sale bien

```txt
Prompt 05 — Tomo 01 Authoring Plan: estructura clínica, reglas de chunking y evaluación inicial de Red Flags/Triage.
```

Ese prompt todavía no debe ingerir contenido completo si las licencias no están claras. Debe preparar la metodología clínica de escritura, tests de seguridad y plantilla de chunks. El arquitecto senior decidirá cuándo depositar el primer tomo real en `data/medical-rag/tomes/01_red_flags_triage/release/`.

---

## Formato de respuesta esperado al terminar

Responde con:

```md
# Resultado Prompt 04

## Archivos creados
- ...

## Archivos modificados
- ...

## Fuentes candidatas registradas
- F001 ...

## Riesgos o bloqueadores detectados
- ...

## Validaciones realizadas
- ...

## Carpeta futura para depósito del Tomo 01 real

data/medical-rag/tomes/01_red_flags_triage/release/

## Siguiente prompt sugerido
Prompt 05 — Tomo 01 Authoring Plan.
```

