# Prompt 05 — Tomo 01 Authoring Plan: Red Flags, Triage y Derivación Inmediata

## Rol que debes asumir

Eres un **desarrollador Jr asistido por IA** trabajando dentro del repositorio `App_Medica`, bajo la dirección de un arquitecto senior.  
Tu responsabilidad en este prompt **NO es escribir contenido clínico definitivo**, **NO es inventar recomendaciones médicas**, **NO es descargar libros**, y **NO es crear chunks finales listos para producción**.

Tu tarea es crear el **plan operativo de autoría, curación, chunking, control de calidad y evaluación** para el **Tomo 01 — Red Flags, Triage y Derivación Inmediata**, preparando el repositorio para que el arquitecto senior deposite posteriormente el tomo clínico real en la ruta de release.

---

## Contexto del proyecto

El proyecto es una aplicación médica web/PWA de alto riesgo clínico.  
La app operará inicialmente en México, Estados Unidos, Latinoamérica y países de habla inglesa, con soporte ES/EN.

La IA podrá orientar diagnósticamente y emitir una **Recomendación Sintomatológica**, pero con estas restricciones duras:

1. Nunca debe recetar medicamentos controlados.
2. No debe emitir recomendación sintomatológica si no hay evidencia clínica suficiente.
3. Debe pedir datos faltantes cuando el expediente sea insuficiente.
4. Debe derivar a consulta presencial o urgencias cuando existan signos de alarma.
5. En pediatría, embarazo, inmunocompromiso, adulto mayor, salud mental, intoxicaciones, trauma o síntomas neurológicos, debe operar con umbral conservador.
6. Toda salida clínica futura debe estar trazada a fuentes auditables y tomos versionados.
7. El RAG debe ser mantenible, actualizable, extensible y capaz de recibir contribuciones autorizadas de especialistas, autores, instituciones o fuentes con permiso explícito.

Ya existen estructuras creadas por prompts anteriores:

```text
data/medical-rag/
data/medical-rag/registry/
data/medical-rag/tomes/
data/medical-rag/source-discovery/tome_01_red_flags_triage/
data/medical-rag/contributors/
data/medical-rag/permissions/
data/medical-rag/lifecycle/
data/medical-rag/corpus/
docs/architecture/MEDICAL_RAG_ARCHITECTURE.md
```

La ruta futura donde el arquitecto senior depositará el Tomo 01 real será:

```text
data/medical-rag/tomes/01_red_flags_triage/release/
```

---

## Objetivo del Prompt 05

Crear un **Authoring Plan completo** para el Tomo 01 que permita construir, revisar y liberar un tomo clínico de calidad gold-standard.

El entregable debe responder:

- Qué dominios clínicos cubre el Tomo 01.
- Qué estructura tendrá el tomo.
- Qué fuentes candidatas se mapearán por dominio.
- Cómo se escribirán los chunks clínicos.
- Cómo se clasificará la severidad.
- Cómo se manejarán edad, región, idioma y población vulnerable.
- Cómo se evaluará que la IA no haga under-triage.
- Cómo se controlarán cambios, contribuciones, revisiones médicas y revisiones legales.
- Cómo se decidirá si el tomo puede avanzar a `approved_for_production`.

---

## Principios obligatorios

### 1. No inventar medicina

No crees contenido clínico final.  
Puedes crear **plantillas, estructura, ejemplos ficticios no clínicos y placeholders**, pero no escribas reglas médicas definitivas como si ya estuvieran validadas.

Correcto:

```text
[PLACEHOLDER: criterio clínico será redactado por el arquitecto senior desde fuentes aprobadas]
```

Incorrecto:

```text
Si el paciente tiene X síntoma, entonces hacer Y tratamiento.
```

### 2. No usar fuentes sin revisión legal

Toda fuente debe permanecer como:

```text
pending_license_review
```

salvo que ya exista evidencia explícita dentro del repositorio de que fue aprobada.

### 3. Seguridad sobre cobertura

El Tomo 01 debe estar diseñado para evitar **under-triage**.  
Si hay duda, el sistema debe favorecer la derivación o la recolección de más información.

### 4. Separación estricta entre contenido y motor

No implementes lógica de producto, API, frontend, backend ni AI Gateway.  
Solo documentación, schemas, templates y matrices para autoría del Tomo 01.

### 5. Auditoría completa

Todo chunk futuro debe poder explicar:

- De qué fuente salió.
- Qué versión de fuente se usó.
- Qué dominio clínico cubre.
- Qué población aplica.
- Qué tipo de acción clínica permite.
- Qué nivel de evidencia tiene.
- Quién lo revisó.
- Cuándo se revisó.
- Qué riesgos tiene.

---

## Modelos recomendados para ejecutar este prompt

### Opción 1 — Laguna M.1 / Poolside

Úsalo si está disponible en OpenCode, OpenRouter o Poolside.

**Por qué:**  
Adecuado para tareas agentic coding/documentales de largo horizonte, lectura de repositorio, generación de estructuras coherentes y ejecución multiarchivo.

**Uso recomendado en este prompt:**  
Crear todos los archivos, revisar consistencia entre schemas, matrices, checklists y documentación.

### Opción 2 — Qwen3 Coder 480B A35B

Úsalo si Laguna M.1 no está disponible o si necesitas mejor desempeño en repositorios grandes.

**Por qué:**  
Muy fuerte para agentic coding, tool use, generación estructurada, razonamiento sobre proyectos y modificación multiarchivo.

**Uso recomendado en este prompt:**  
Crear estructura documental y validar que los nombres/rutas sean consistentes.

### Opción 3 — GPT-OSS-120B

Úsalo como revisor o segunda pasada.

**Por qué:**  
Buen razonamiento general, útil para revisar consistencia, detectar contradicciones, reforzar criterios de seguridad y mejorar calidad del documento.

**Uso recomendado en este prompt:**  
Revisión de coherencia, riesgos, gates y lenguaje de seguridad.

### Opción 4 — Nemotron Ultra

Úsalo si está disponible como revisor de razonamiento.

**Por qué:**  
Buen modelo general para revisión, clasificación y control de calidad documental.

**Uso recomendado en este prompt:**  
Auditoría del plan, detección de gaps y robustez de matrices.

### Opción 5 — DeepSeek Flash / modelos flash gratuitos

Úsalos solo si necesitas velocidad o costo bajo.

**Por qué:**  
Pueden servir para generar estructura base, pero no deberían ser la única revisión para un componente médico crítico.

**Uso recomendado en este prompt:**  
Borrador inicial; después revisar con Laguna M.1, Qwen3 Coder, GPT-OSS-120B o Nemotron.

---

## Archivos que debes crear

Crea la siguiente carpeta:

```text
data/medical-rag/tomes/01_red_flags_triage/authoring/
```

Dentro crea estos archivos:

```text
README.md
AUTHORING_PLAN.md
DOMAIN_COVERAGE_MATRIX.md
SOURCE_TO_DOMAIN_MAP.md
CHUNK_AUTHORING_GUIDE.md
CLINICAL_SEVERITY_TAXONOMY.md
POPULATION_RULES.md
I18N_ES_EN_GUIDE.md
EVALUATION_PLAN.md
UNDER_TRIAGE_TEST_MATRIX.md
REVIEW_AND_APPROVAL_WORKFLOW.md
RELEASE_CANDIDATE_CHECKLIST.md
```

Crea también:

```text
docs/reports/PROMPT_05_EXECUTION_REPORT.md
```

No borres ni modifiques archivos existentes salvo que sea necesario agregar referencias no destructivas.

---

## Contenido esperado por archivo

### 1. `README.md`

Debe explicar:

- Qué es el authoring pack del Tomo 01.
- Qué NO contiene todavía.
- Ruta donde se depositará el release real.
- Estados de madurez del tomo:
  - `draft`
  - `source_mapped`
  - `authoring_in_progress`
  - `medical_review`
  - `legal_review`
  - `release_candidate`
  - `approved_for_production`
  - `deprecated`
- Reglas de no invención clínica.

---

### 2. `AUTHORING_PLAN.md`

Debe contener el plan completo para construir el tomo:

- Objetivo clínico del Tomo 01.
- Alcance.
- Fuera de alcance.
- Entradas requeridas:
  - fuentes aprobadas
  - source registry
  - permisos/licencias
  - criterios médicos
  - revisión de especialista
- Salidas esperadas:
  - `tome_manifest.json`
  - `chunks.jsonl`
  - `source_map.json`
  - `clinical_review_report.md`
  - `legal_review_report.md`
  - `eval_report.md`
  - `CHANGELOG.md`
- Flujo de trabajo:
  1. Validar fuentes.
  2. Mapear fuentes a dominios.
  3. Redactar chunks preliminares.
  4. Revisar consistencia clínica.
  5. Ejecutar evaluación de under-triage.
  6. Revisar legal/licencias.
  7. Generar release candidate.
  8. Aprobar para producción.
- Criterios de salida por etapa.
- Responsables:
  - Arquitecto senior.
  - Médico revisor.
  - Legal/compliance.
  - Delivery/operaciones.
  - Dev Jr/OpenCode.

---

### 3. `DOMAIN_COVERAGE_MATRIX.md`

Debe crear una matriz con al menos estos dominios críticos:

1. Dolor torácico.
2. Dificultad respiratoria.
3. Alteración del estado mental.
4. Síncope / pérdida de conciencia.
5. Síntomas neurológicos súbitos.
6. Cefalea severa o súbita.
7. Anafilaxia / reacción alérgica severa.
8. Fiebre en adultos.
9. Fiebre pediátrica.
10. Lactantes y neonatos.
11. Deshidratación.
12. Dolor abdominal severo.
13. Sangrado activo o severo.
14. Trauma.
15. Quemaduras.
16. Intoxicación / exposición a tóxicos.
17. Embarazo y puerperio.
18. Dolor severo no explicado.
19. Inmunocompromiso.
20. Adulto mayor frágil.
21. Salud mental / riesgo suicida.
22. Sepsis sospechada.
23. Convulsiones.
24. Erupciones/rash con signos sistémicos.
25. Signos oncológicos de alarma.
26. Dolor ocular o pérdida visual aguda.
27. Dolor testicular agudo.
28. Dolor pélvico agudo.
29. Hipoglucemia/hiperglucemia sintomática.
30. Complicaciones por medicamentos o interacciones.

Columnas mínimas:

```text
domain_id
domain_name_es
domain_name_en
priority
population_scope
jurisdictions
source_status
authoring_status
medical_review_status
legal_review_status
under_triage_risk
notes
```

No llenes contenido clínico final. Usa placeholders.

---

### 4. `SOURCE_TO_DOMAIN_MAP.md`

Debe mapear fuentes candidatas del Prompt 04 contra dominios.

Incluye, como mínimo, categorías de fuente:

- WHO / ICRC / MSF triage tools.
- MedlinePlus emergency adult.
- MedlinePlus emergency child.
- CDC emergency warning signs por condición.
- NIH/NLM resources.
- NICE CKS si licencia permite.
- NHS si licencia permite.
- Guías nacionales de México si se identifican y licencian.
- Fuentes LatAm/OPS/PAHO si se identifican y licencian.
- Fuentes de salud mental/crisis si se identifican y licencian.
- Fuentes de toxicología si se identifican y licencian.

Cada fuente debe tener estado:

```text
candidate
pending_license_review
pending_medical_review
approved
restricted
rejected
```

No marques ninguna como aprobada sin evidencia interna.

---

### 5. `CHUNK_AUTHORING_GUIDE.md`

Define cómo se deberán escribir los chunks futuros.

Cada chunk deberá tener estructura conceptual:

```text
chunk_id
tome_id
domain_id
title_es
title_en
clinical_summary_es
clinical_summary_en
red_flags
required_questions
minimum_evidence_required
clinical_action_type
severity_level
population_scope
jurisdiction_scope
source_refs
contraindications_or_exclusions
must_not_say
safe_user_message_es
safe_user_message_en
internal_reasoning_notes
review_status
```

Define reglas:

- Un chunk = una unidad clínica recuperable.
- Debe ser atómico.
- Debe evitar contradicciones.
- Debe separar datos de usuario, acción clínica y fuente.
- Debe preferir lenguaje claro y empático.
- Debe incluir `must_not_say`.
- Debe incluir mensajes seguros para usuario.
- Debe incluir señales para derivación.

Incluye ejemplos de formato con contenido placeholder, no clínico real.

---

### 6. `CLINICAL_SEVERITY_TAXONOMY.md`

Define la taxonomía de severidad sin contenido médico final.

Usa niveles:

```text
S0_INFORMATIONAL
S1_SELF_CARE_OR_MONITOR
S2_SCHEDULE_MEDICAL_VISIT
S3_PROMPT_MEDICAL_VISIT
S4_URGENT_CARE
S5_EMERGENCY_NOW
S6_CALL_EMERGENCY_SERVICES
```

Para cada nivel define:

- Descripción operacional.
- Tipo de respuesta permitida.
- Si permite recomendación sintomatológica.
- Si exige médico humano.
- Si exige urgencias.
- Si bloquea consejos de autocuidado.
- Si requiere mostrar disclaimer reforzado.

Regla importante:

```text
Si existe conflicto entre chunks, debe prevalecer el nivel de severidad más alto.
```

---

### 7. `POPULATION_RULES.md`

Define reglas especiales para poblaciones vulnerables:

- Niños.
- Lactantes.
- Neonatos.
- Embarazo.
- Adulto mayor.
- Inmunocomprometidos.
- Pacientes con comorbilidades relevantes.
- Personas con discapacidad.
- Salud mental/crisis.
- Personas con barreras de idioma o accesibilidad.

Para cada población:

- Nivel de cautela.
- Datos mínimos requeridos.
- Reglas de escalamiento.
- Reglas de no recomendación.
- Requisitos de lenguaje.

No inventes criterios clínicos específicos. Usa placeholders y notas de revisión médica.

---

### 8. `I18N_ES_EN_GUIDE.md`

Debe definir cómo redactar los chunks en español e inglés:

- No traducción literal si afecta claridad clínica.
- Mantener equivalencia semántica.
- Evitar regionalismos confusos.
- Permitir adaptación regional posterior.
- Campo obligatorio `language_review_status`.
- Tono: humano, claro, firme, sin alarmismo innecesario.
- Cuando haya red flag, lenguaje directo y seguro.

Incluye ejemplos placeholder.

---

### 9. `EVALUATION_PLAN.md`

Define cómo evaluaremos el Tomo 01.

Debe incluir:

- Evaluación de cobertura.
- Evaluación de contradicciones.
- Evaluación de under-triage.
- Evaluación de over-triage aceptable vs excesivo.
- Evaluación de pediatría.
- Evaluación bilingüe.
- Evaluación de recuperación RAG.
- Evaluación de citas/fuentes.
- Evaluación de mensajes al usuario.
- Evaluación de negativa segura cuando no hay evidencia suficiente.

Define métricas:

```text
coverage_score
under_triage_failures
unsafe_recommendation_count
missing_required_question_count
source_traceability_score
bilingual_equivalence_score
review_completion_score
```

Define criterio:

```text
under_triage_failures = 0
unsafe_recommendation_count = 0
source_traceability_score >= 0.98
review_completion_score = 1.0
```

---

### 10. `UNDER_TRIAGE_TEST_MATRIX.md`

Crea matriz de casos de prueba sin casos médicos detallados definitivos.

Columnas:

```text
case_id
domain_id
population
input_pattern_placeholder
expected_minimum_severity
expected_action
must_ask_questions
must_not_recommend
source_required
review_status
```

Incluye al menos 60 filas placeholder distribuidas entre los 30 dominios.  
No escribas detalles clínicos finales. Usa patrones como:

```text
[PLACEHOLDER: síntoma cardinal + posible signo de alarma]
```

---

### 11. `REVIEW_AND_APPROVAL_WORKFLOW.md`

Define workflow:

```text
draft → source_mapped → authoring_in_progress → medical_review → legal_review → release_candidate → approved_for_production
```

Incluye:

- Quién aprueba cada etapa.
- Qué evidencia se requiere.
- Cómo se rechaza.
- Cómo se solicita cambio.
- Cómo se documenta excepción.
- Cómo se maneja parche urgente.
- Cómo se versiona.
- Cómo se hace rollback.

---

### 12. `RELEASE_CANDIDATE_CHECKLIST.md`

Checklist Go/No-Go para liberar Tomo 01.

Debe incluir:

- Fuentes validadas.
- Licencias revisadas.
- Chunks completos.
- Source map completo.
- Evaluación sin under-triage.
- Revisión médica firmada.
- Revisión legal firmada.
- Prueba bilingüe.
- Prueba pediátrica.
- Prueba de poblaciones vulnerables.
- Changelog.
- Release tag.
- Plan de rollback.
- Evidencia de no uso de fuentes restringidas.

---

### 13. `docs/reports/PROMPT_05_EXECUTION_REPORT.md`

Debe reportar:

- Archivos creados.
- Archivos modificados.
- Decisiones aplicadas.
- Riesgos/bloqueadores.
- Validaciones realizadas.
- Próximo prompt sugerido.
- Carpeta donde el arquitecto senior depositará el tomo real.

---

## Validaciones obligatorias antes de terminar

Antes de entregar, valida:

1. Que no creaste contenido clínico final.
2. Que no marcaste fuentes como aprobadas sin evidencia.
3. Que no descargaste fuentes externas.
4. Que no agregaste secretos.
5. Que no rompiste rutas de prompts anteriores.
6. Que la carpeta `data/medical-rag/tomes/01_red_flags_triage/authoring/` exista.
7. Que exista el reporte en `docs/reports/PROMPT_05_EXECUTION_REPORT.md`.
8. Que el authoring pack soporte contribuciones futuras de especialistas o fuentes autorizadas.
9. Que el plan contemple mantenimiento, actualización, deprecación y rollback.
10. Que el plan priorice no under-triage.

---

## Restricciones duras

No ejecutes instalación de dependencias.  
No crees backend.  
No crees frontend.  
No crees API.  
No crees base de datos.  
No descargues fuentes externas.  
No uses contenido de libros comerciales.  
No generes consejo médico final.  
No simules aprobaciones humanas.  
No uses `.env` real.  
No agregues API keys.  
No borres archivos existentes.

---

## Salida esperada en consola

Entrega un resumen en este formato:

```text
Resultado Prompt 05

Archivos creados
- ...

Archivos modificados
- ...

Decisiones técnicas/documentales aplicadas
1. ...

Riesgos o bloqueadores detectados
- ...

Validaciones realizadas
- ...

Carpeta futura para depósito del Tomo 01 real
data/medical-rag/tomes/01_red_flags_triage/release/

Siguiente prompt sugerido
Prompt 06 — Construcción del Tomo 01 Release Pack v0.1: manifest, source map y chunks iniciales curados por arquitecto senior.
```

---

## Criterio de éxito

Este prompt se considera exitoso si deja al repositorio preparado para que el arquitecto senior pueda comenzar a generar el primer tomo real de Red Flags/Triage con trazabilidad, control de licencias, evaluación clínica y checklist de producción.
