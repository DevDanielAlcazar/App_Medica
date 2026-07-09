# Prompt 09 — Validación estructural automatizada y hardening anti under-triage del Tomo 01

## Rol operativo

Actúa como **desarrollador sr. ejecutor** dentro del proyecto `App_Medica`, siguiendo estrictamente las decisiones del arquitecto senior. Tu responsabilidad en este prompt es **fortalecer la validación técnica, clínica-estructural y de seguridad del Tomo 01 — Red Flags, Triage y Derivación Inmediata**, sin inventar contenido médico nuevo.

No eres responsable de crear diagnóstico clínico ni contenido médico final. Eres responsable de crear herramientas, reglas, reportes y documentación para que el contenido curado existente pueda evaluarse de forma consistente antes de pasar a revisión médica/legal.

## Contexto del proyecto

El proyecto está ubicado en:

```txt
D:\Desarrollos\App_Medica
```

El Tomo 01 ya tiene un release candidate generado en:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/
```

El estado esperado actual es:

```txt
release_candidate_clinical_review
```

El objetivo de este prompt es endurecer el release candidate contra fallas críticas de triage, principalmente:

- under-triage,
- mensajes ambiguos,
- recomendación sintomatológica cuando debe derivar,
- falta de cobertura por población vulnerable,
- chunks sin fuente,
- chunks sin severidad,
- chunks sin `must_not_say`,
- chunks sin `safe_user_message`,
- chunks sin regla de acción clínica,
- fuentes o chunks marcados por error como productivos.

## Principio rector

En salud digital, ante incertidumbre clínica relevante, el sistema debe privilegiar seguridad y derivación. Para este tomo, el error más grave no es ser conservador; el error más grave es minimizar un posible signo de alarma.

## Prohibiciones absolutas

No hagas lo siguiente:

1. No inventes contenido clínico nuevo.
2. No agregues recomendaciones médicas nuevas.
3. No cambies el significado clínico de los chunks existentes.
4. No marques nada como `production_approved: true`.
5. No marques fuentes como legal o médicamente aprobadas.
6. No elimines gates de revisión médica/legal.
7. No descargues fuentes externas.
8. No agregues secretos, API keys, credenciales o datos personales.
9. No edites archivos fuera del alcance sin justificarlo en el reporte.
10. No conviertas placeholders en contenido clínico real.

## Alcance permitido

Puedes crear o modificar únicamente archivos relacionados con:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/
data/medical-rag/tomes/01_red_flags_triage/validation/
data/medical-rag/evaluation/
tools/medical-rag/
docs/reports/
docs/architecture/
```

Si necesitas tocar otro archivo, justifícalo en el reporte.

## Objetivo técnico

Crear un paquete de validación robusto para el Tomo 01 que permita revisar si el release candidate cumple los criterios mínimos de seguridad antes de pasar a revisión humana.

Debe incluir:

1. Validadores automatizados.
2. Matriz anti under-triage.
3. Casos de evaluación estructurados.
4. Reporte de cobertura.
5. Reporte de riesgos.
6. Criterios de bloqueo.
7. Checklist de revisión médica/legal.
8. Evidencia de ejecución.

## Tareas obligatorias

### 1. Leer estado actual

Inspecciona estos archivos si existen:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/tome_manifest.json
data/medical-rag/tomes/01_red_flags_triage/release/source_map.json
data/medical-rag/tomes/01_red_flags_triage/release/chunks.jsonl
data/medical-rag/tomes/01_red_flags_triage/release/RELEASE_CHECKLIST.md
data/medical-rag/tomes/01_red_flags_triage/release/evaluation_plan.md
data/medical-rag/tomes/01_red_flags_triage/authoring/
docs/reports/PROMPT_08_EXECUTION_REPORT.md
```

No asumas estructura; valida lo que realmente existe.

### 2. Crear carpeta de validación del tomo

Crea la carpeta:

```txt
data/medical-rag/tomes/01_red_flags_triage/validation/
```

Dentro de ella genera:

```txt
README.md
anti_under_triage_matrix.json
clinical_safety_rules.json
coverage_requirements.json
evaluation_cases.jsonl
validation_report_template.md
risk_register.md
human_review_packet.md
```

### 3. Crear matriz anti under-triage

Crea `anti_under_triage_matrix.json` con dominios mínimos. Debe incluir, al menos:

```txt
emergency_general
chest_pain
stroke_neurologic_deficit
respiratory_distress
pediatric_emergency
infant_fever
anaphylaxis
poisoning_overdose
self_harm_suicide_risk
pregnancy_postpartum_warning_signs
carbon_monoxide_exposure
sepsis_warning_signs
altered_mental_status
severe_abdominal_pain
head_injury_trauma
severe_dehydration
immunocompromised_fever
new_seizure
severe_headache
vision_loss
```

Cada dominio debe tener este contrato mínimo:

```json
{
  "domain": "string",
  "minimum_chunk_count": 1,
  "required_severity_levels": ["S5", "S6"],
  "must_have_action_types": ["emergency_referral"],
  "vulnerable_population_required": true,
  "must_include_safe_user_message": true,
  "must_include_must_not_say": true,
  "under_triage_failure_is_blocker": true,
  "notes": "string"
}
```

No inventes contenido clínico extenso. La matriz es estructural.

### 4. Crear reglas de seguridad clínica estructural

Crea `clinical_safety_rules.json` con reglas verificables automáticamente, por ejemplo:

- Todo chunk debe tener `chunk_id`.
- Todo chunk debe tener `source_ids` no vacío.
- Todo chunk debe tener `language`.
- Todo chunk debe tener `clinical_domain` o equivalente.
- Todo chunk debe tener `severity_level`.
- Todo chunk S5/S6 debe tener acción de derivación o emergencia.
- Todo chunk debe tener `safe_user_message`.
- Todo chunk debe tener `must_not_say`.
- Todo chunk debe tener `medical_review_status` pendiente o aprobado.
- Todo chunk debe tener `legal_review_status` pendiente o aprobado.
- Si `production_approved` es `true` y revisión médica/legal no está aprobada, debe fallar.
- Si un chunk menciona población vulnerable, debe tener metadata de población.
- Si un chunk es pediátrico, debe estar marcado como pediátrico.
- Si el dominio es autolesión/suicidio, no puede recomendar espera pasiva.
- Si el dominio es intoxicación/sobredosis, debe derivar a emergencia/centro toxicológico según corresponda.

### 5. Crear casos de evaluación

Crea `evaluation_cases.jsonl` con al menos 40 casos sintéticos de evaluación estructural.

Estos casos no deben ser historias clínicas largas ni recomendaciones finales. Deben ser escenarios mínimos para probar que el retrieval y la lógica no hagan under-triage.

Formato sugerido:

```json
{
  "case_id": "T01-EVAL-0001",
  "language": "es",
  "user_input": "Texto breve del escenario",
  "expected_domain": "chest_pain",
  "expected_minimum_severity": "S5",
  "expected_action_type": "emergency_referral",
  "must_retrieve_domain": ["chest_pain"],
  "must_not_answer_with": ["recomendacion_sintomatologica", "esperar_en_casa_sin_alertas"],
  "rationale": "Razón estructural de seguridad, sin explicación clínica extensa"
}
```

Incluye casos en español e inglés.

Debe haber casos para:

- adulto con dolor torácico,
- adulto con signos neurológicos súbitos,
- niño con dificultad respiratoria,
- lactante con fiebre,
- anafilaxia,
- intoxicación,
- ideación suicida/autolesión,
- embarazo/puerperio con signos de alarma,
- exposición a monóxido,
- sepsis potencial,
- alteración del estado mental,
- convulsión nueva,
- trauma craneal,
- deshidratación severa,
- paciente inmunocomprometido con fiebre,
- pérdida súbita de visión,
- cefalea súbita intensa,
- dolor abdominal severo.

### 6. Crear o mejorar scripts de validación

En `tools/medical-rag/`, crea o mejora estos scripts:

```txt
validate_tome_01_safety.mjs
validate_tome_01_coverage.mjs
validate_tome_01_eval_cases.mjs
```

Los scripts deben:

- leer `chunks.jsonl`,
- leer `source_map.json`,
- leer la matriz anti under-triage,
- leer las reglas de seguridad,
- validar campos requeridos,
- detectar dominios sin cobertura,
- detectar chunks S5/S6 sin acción segura,
- detectar chunks sin fuente,
- detectar chunks sin `safe_user_message`,
- detectar chunks sin `must_not_say`,
- bloquear `production_approved: true` si falta revisión,
- imprimir resumen claro,
- devolver exit code distinto de 0 cuando hay bloqueadores.

No uses dependencias externas si no son necesarias. Preferir Node.js estándar.

### 7. Crear reporte de cobertura

Genera o actualiza:

```txt
data/medical-rag/tomes/01_red_flags_triage/validation/coverage_report.md
```

Debe incluir:

- total de chunks,
- total de fuentes,
- dominios cubiertos,
- dominios faltantes,
- chunks por idioma,
- chunks por severidad,
- chunks por tipo de acción clínica,
- dominios con mayor riesgo,
- bloqueadores actuales,
- recomendación de siguiente paso.

### 8. Crear paquete de revisión humana

Genera:

```txt
data/medical-rag/tomes/01_red_flags_triage/validation/human_review_packet.md
```

Debe tener checklist para médico y checklist para legal/compliance.

Checklist médico mínimo:

- ¿El chunk induce atención urgente cuando corresponde?
- ¿Evita tranquilizar falsamente?
- ¿Evita recomendación sintomatológica ante red flags?
- ¿La severidad asignada es correcta?
- ¿El mensaje al usuario es claro y seguro?
- ¿Hay diferencias relevantes entre ES/EN?
- ¿Hay población vulnerable mal clasificada?

Checklist legal/compliance mínimo:

- ¿La fuente permite uso en RAG?
- ¿La fuente permite almacenamiento local?
- ¿La fuente permite transformación/paráfrasis?
- ¿La atribución es suficiente?
- ¿Hay restricciones por jurisdicción?
- ¿La fuente está marcada correctamente en `source_map.json`?
- ¿Debe pedirse autorización explícita?

### 9. Crear reporte final de ejecución

Genera:

```txt
docs/reports/PROMPT_09_EXECUTION_REPORT.md
```

Debe incluir:

- archivos creados,
- archivos modificados,
- validaciones ejecutadas,
- resultado de cada script,
- bloqueadores encontrados,
- recomendaciones,
- estado final del Tomo 01,
- siguiente prompt sugerido.

### 10. Ejecutar validaciones

Ejecuta, si es posible:

```bash
node tools/medical-rag/validate_tome_01_safety.mjs
node tools/medical-rag/validate_tome_01_coverage.mjs
node tools/medical-rag/validate_tome_01_eval_cases.mjs
```

Si algún script falla por bloqueadores reales, no lo maquilles. Documenta el fallo y deja claro que es esperado si falta revisión o cobertura.

## Criterios de aceptación

El prompt se considera exitoso si:

1. Existe carpeta `validation/` para Tomo 01.
2. Existe matriz anti under-triage.
3. Existen reglas de seguridad clínica estructural.
4. Existen al menos 40 casos de evaluación.
5. Existen scripts de validación.
6. Los scripts pueden ejecutarse.
7. El reporte final documenta estado real.
8. No se aprueba producción.
9. No se inventa contenido clínico nuevo.
10. El siguiente paso queda claro.

## Estado final esperado

El estado final esperado debe seguir siendo no productivo, por ejemplo:

```txt
release_candidate_clinical_review
```

O, si se detectan bloqueadores estructurales relevantes:

```txt
blocked_pending_safety_hardening
```

No usar:

```txt
approved_for_production
```

## Siguiente prompt sugerido

Al final del reporte, sugiere:

```txt
Prompt 10 — Expansión curada Tomo 01 v0.2: cobertura faltante, casos críticos ES/EN y preparación para revisión médica humana.
```
