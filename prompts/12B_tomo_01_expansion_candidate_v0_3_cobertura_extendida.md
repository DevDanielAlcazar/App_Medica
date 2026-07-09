# Prompt 12B — Tomo 01 expansión curada candidate v0.3 con cobertura extendida

## Rol operativo

El contenido clínico de este prompt fue preparado por el arquitecto senior para crear una expansión candidata. Tu trabajo es integrarlo, validarlo y reportarlo sin inventar contenido adicional.

## Contexto del proyecto

Repositorio local esperado:

```txt
D:\Desarrollos\App_Medica
```

Tomo activo:

```txt
data/medical-rag/tomes/01_red_flags_triage/
```

Release productivo aprobado, si Prompt 12A ya fue aplicado:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/
```

## Objetivo del prompt

Crear una **expansión candidata v0.3** del Tomo 01 sin contaminar el release productivo aprobado v0.2.1.

Esta expansión incrementa cobertura clínica de red flags/triage con dominios adicionales, pero debe quedar en revisión médica/legal antes de incorporarse al corpus productivo.

## Decisión arquitectónica obligatoria

No reemplaces ni degradres el release aprobado en:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/
```

Crea la expansión en una rama/carpeta candidata:

```txt
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/
```

Y conserva el input curado en:

```txt
data/medical-rag/tomes/01_red_flags_triage/curated_input/senior_seed_v0_3/
```

Solo después de revisión médica/legal futura se podrá promover v0.3 al release productivo.

## Reglas críticas

- No inventes fuentes.
- No inventes chunks.
- No descargues contenido externo.
- No cambies `production_allowed` del release aprobado actual.
- No marques la expansión v0.3 como productiva.
- No elimines ni reduzcas chunks/fuentes existentes.
- No mezcles contenido candidato con contenido productivo aprobado si no existe aprobación explícita posterior.
- Todo chunk nuevo debe quedar con:
  - `medical_review_status: pending`
  - `legal_review_status: pending`
  - `production_allowed: false`
- Toda fuente nueva debe quedar con:
  - `license_review_status: pending`
  - `legal_review_status: pending`
  - `production_allowed: false`
- Si alguna fuente ya existe, no la dupliques; referencia el ID existente o registra alias.
- Si existe conflicto entre severidades, conserva la severidad más alta.
- Si un síntoma puede ser red flag en población vulnerable, trátalo como escalación más conservadora.
- El objetivo principal es minimizar under-triage.

## Salidas obligatorias

Crea:

```txt
data/medical-rag/tomes/01_red_flags_triage/curated_input/senior_seed_v0_3/README.md
data/medical-rag/tomes/01_red_flags_triage/curated_input/senior_seed_v0_3/sources_delta_v0_3.json
data/medical-rag/tomes/01_red_flags_triage/curated_input/senior_seed_v0_3/chunks_delta_v0_3.jsonl
data/medical-rag/tomes/01_red_flags_triage/curated_input/senior_seed_v0_3/coverage_delta_v0_3.md
```

Crea candidate release:

```txt
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/tome_manifest.json
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/source_map.json
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/chunks.jsonl
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/CHANGELOG.md
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/CANDIDATE_REVIEW_GATE.md
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/coverage_report.md
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/risk_register.md
```

Crea o actualiza validación candidata:

```txt
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/validation/evaluation_cases_v0_3.jsonl
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/validation/anti_under_triage_matrix_v0_3.json
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/validation/validation_report.md
```

Crea reporte:

```txt
docs/reports/PROMPT_12B_EXECUTION_REPORT.md
```

## Source delta curado por arquitectura senior

Integra estas fuentes como candidatas. No las marques como aprobadas todavía.

```json
[
  {
    "source_id": "F029",
    "title": "MedlinePlus Medical Encyclopedia — Recognizing medical emergencies",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/article/001927.htm",
    "source_type": "patient_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F030",
    "title": "MedlinePlus Medical Encyclopedia — Fever",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/article/003090.htm",
    "source_type": "patient_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F031",
    "title": "MedlinePlus Patient Instructions — When your baby or infant has a fever",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/patientinstructions/000319.htm",
    "source_type": "patient_instruction",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F032",
    "title": "CDC — Meningococcal Disease Symptoms and Complications",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/meningococcal/symptoms/index.html",
    "source_type": "public_health_guidance",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F033",
    "title": "MedlinePlus — Dehydration",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/dehydration.html",
    "source_type": "patient_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F034",
    "title": "CDC — Low Blood Sugar (Hypoglycemia)",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/diabetes/about/low-blood-sugar-hypoglycemia.html",
    "source_type": "public_health_guidance",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F035",
    "title": "CDC — Diabetic Ketoacidosis",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/diabetes/about/diabetic-ketoacidosis.html",
    "source_type": "public_health_guidance",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F036",
    "title": "MedlinePlus Medical Encyclopedia — Eye emergencies",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/article/000054.htm",
    "source_type": "patient_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F037",
    "title": "MedlinePlus — Eye Injuries",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/eyeinjuries.html",
    "source_type": "patient_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F038",
    "title": "MedlinePlus Medical Encyclopedia — Burns",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/article/000030.htm",
    "source_type": "first_aid_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F039",
    "title": "MedlinePlus Medical Encyclopedia — Electrical injury",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/article/000053.htm",
    "source_type": "first_aid_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F040",
    "title": "MedlinePlus Medical Encyclopedia — Non-fatal drowning",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/article/000046.htm",
    "source_type": "first_aid_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F041",
    "title": "WHO — Animal bites fact sheet",
    "publisher": "World Health Organization",
    "url": "https://www.who.int/news-room/fact-sheets/detail/animal-bites",
    "source_type": "public_health_guidance",
    "jurisdiction": ["global"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F042",
    "title": "CDC Yellow Book — Rabies",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/yellow-book/hcp/travel-associated-infections-diseases/rabies.html",
    "source_type": "public_health_guidance",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F043",
    "title": "MedlinePlus Medical Encyclopedia — Testicular torsion",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/article/000517.htm",
    "source_type": "patient_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F044",
    "title": "MedlinePlus Medical Encyclopedia — Ovarian cysts",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/article/001504.htm",
    "source_type": "patient_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F045",
    "title": "MedlinePlus — Ectopic Pregnancy",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ectopicpregnancy.html",
    "source_type": "patient_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F046",
    "title": "MedlinePlus Medical Encyclopedia — Bleeding",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/article/000045.htm",
    "source_type": "first_aid_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F047",
    "title": "MedlinePlus Medical Encyclopedia — Choking adult or child over 1 year",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/article/000049.htm",
    "source_type": "first_aid_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  },
  {
    "source_id": "F048",
    "title": "American Heart Association — When to call 911 for high blood pressure",
    "publisher": "American Heart Association",
    "url": "https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings/when-to-call-911-for-high-blood-pressure",
    "source_type": "patient_reference",
    "jurisdiction": ["global", "us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": false
  }
]
```

## Chunk delta curado por arquitectura senior

Crea 40 chunks nuevos: 20 en español y 20 equivalentes en inglés. Usa el esquema existente del proyecto. Si el esquema actual exige nombres distintos, mapea semánticamente sin perder campos clínicos.

Cada chunk debe tener como mínimo:

```json
{
  "chunk_id": "T01-V03-ES-0001",
  "tome_id": "01_red_flags_triage",
  "version": "0.3.0-candidate",
  "language": "es",
  "domain": "...",
  "severity": "S5",
  "clinical_action_type": "emergency_now",
  "source_ids": ["F030"],
  "red_flag_relevant": true,
  "evidence_level": "official_patient_guidance",
  "medical_review_status": "pending",
  "legal_review_status": "pending",
  "production_allowed": false,
  "trigger_patterns": [],
  "required_questions": [],
  "safe_user_message": "...",
  "must_not_say": []
}
```

### Clinical chunk specs

#### 1. Fever with neurologic/respiratory red flags

ES:
- `chunk_id`: `T01-V03-ES-0001`
- `domain`: `fever_emergency_red_flags`
- `severity`: `S5`
- `clinical_action_type`: `emergency_now`
- `source_ids`: [`F030`]
- `trigger_patterns`: fiebre + confusión, difícil despertar, dificultad para respirar, labios/lengua/uñas azules, dolor de cabeza muy intenso, rigidez de cuello, convulsión, incapacidad para caminar.
- `safe_user_message`: Si hay fiebre con confusión, dificultad para despertar, dificultad para respirar, coloración azulada, convulsión, rigidez de cuello o dolor de cabeza muy intenso, se debe buscar atención de urgencia ahora. La app no debe manejarlo como cuadro leve.
- `must_not_say`: No decir que espere en casa si hay signos neurológicos, respiratorios o estado mental alterado.

EN:
- `chunk_id`: `T01-V03-EN-0001`
- same domain/severity/source/action.
- `safe_user_message`: Fever with confusion, trouble waking, breathing difficulty, blue lips/tongue/nails, seizure, stiff neck, or a very severe headache requires emergency care now. The app must not treat it as a mild illness.

#### 2. Infant fever under 3 months

ES:
- `chunk_id`: `T01-V03-ES-0002`
- `domain`: `infant_fever_under_3_months`
- `severity`: `S5`
- `clinical_action_type`: `urgent_same_day_or_emergency_by_age`
- `source_ids`: [`F031`]
- `trigger_patterns`: bebé menor de 3 meses + temperatura rectal 38 °C / 100.4 °F o más.
- `safe_user_message`: En un bebé menor de 3 meses, fiebre de 38 °C / 100.4 °F o más requiere valoración médica inmediata. No se debe recomendar manejo casero como única acción.
- `must_not_say`: No recomendar antipiréticos o espera sin indicación médica en menores de 3 meses.

EN:
- `chunk_id`: `T01-V03-EN-0002`
- `safe_user_message`: A baby younger than 3 months with a rectal temperature of 100.4°F / 38°C or higher needs immediate medical evaluation. Do not provide home-only management.

#### 3. Suspected meningitis

ES:
- `chunk_id`: `T01-V03-ES-0003`
- `domain`: `suspected_meningitis`
- `severity`: `S6`
- `clinical_action_type`: `emergency_now`
- `source_ids`: [`F032`, `F030`]
- `trigger_patterns`: fiebre + rigidez de cuello + cefalea, fotofobia, confusión, vómito, somnolencia marcada o rash compatible.
- `safe_user_message`: La combinación de fiebre, dolor de cabeza intenso, rigidez de cuello, sensibilidad a la luz, confusión o vómito puede representar meningitis u otra infección grave. Debe derivarse a urgencias ahora.
- `must_not_say`: No sugerir observación prolongada, antibióticos no supervisados ni diagnóstico definitivo por chat.

EN:
- `chunk_id`: `T01-V03-EN-0003`
- `safe_user_message`: Fever with severe headache, stiff neck, light sensitivity, confusion, vomiting, marked drowsiness, or concerning rash can indicate meningitis or another serious infection. Escalate to emergency care now.

#### 4. Severe dehydration in infants/children

ES:
- `chunk_id`: `T01-V03-ES-0004`
- `domain`: `severe_dehydration_child`
- `severity`: `S5`
- `clinical_action_type`: `urgent_same_day_or_emergency_by_severity`
- `source_ids`: [`F033`]
- `trigger_patterns`: niño con boca/lengua seca, llanto sin lágrimas, sin pañales mojados por 3 horas o más, somnolencia inusual, irritabilidad marcada, ojos hundidos, fiebre alta, vómito/diarrea persistente.
- `safe_user_message`: Signos de deshidratación en lactantes o niños, especialmente ausencia de orina, somnolencia inusual, ojos hundidos o incapacidad para retener líquidos, requieren valoración urgente.
- `must_not_say`: No minimizar deshidratación en niños pequeños ni recomendar solo bebidas si hay letargo, no orina o vómito persistente.

EN:
- `chunk_id`: `T01-V03-EN-0004`
- `safe_user_message`: Infants or children with no wet diapers for 3+ hours, unusual sleepiness, sunken eyes, inability to keep fluids down, or persistent vomiting/diarrhea need urgent evaluation.

#### 5. Severe hypoglycemia

ES:
- `chunk_id`: `T01-V03-ES-0005`
- `domain`: `severe_hypoglycemia`
- `severity`: `S6`
- `clinical_action_type`: `emergency_now`
- `source_ids`: [`F034`]
- `trigger_patterns`: glucosa muy baja, confusión, conducta extraña, dificultad para caminar o ver, convulsión, pérdida de conciencia, no puede comer/beber con seguridad.
- `safe_user_message`: La hipoglucemia con confusión, convulsión, pérdida de conciencia o imposibilidad de ingerir azúcar de forma segura es una emergencia. Se debe activar ayuda urgente y no dar comida o bebida si no está alerta.
- `must_not_say`: No recomendar vía oral si hay alteración de conciencia o riesgo de aspiración.

EN:
- `chunk_id`: `T01-V03-EN-0005`
- `safe_user_message`: Low blood sugar with confusion, seizure, loss of consciousness, or inability to safely swallow is an emergency. Get urgent help and do not give food or drink if the person is not alert.

#### 6. Diabetic ketoacidosis / severe hyperglycemia

ES:
- `chunk_id`: `T01-V03-ES-0006`
- `domain`: `diabetic_ketoacidosis_red_flags`
- `severity`: `S6`
- `clinical_action_type`: `emergency_now`
- `source_ids`: [`F035`]
- `trigger_patterns`: diabetes o sospecha + sed intensa, orina frecuente, respiración rápida/profunda, boca seca, aliento afrutado, vómito, dolor abdominal, cansancio extremo, confusión.
- `safe_user_message`: Síntomas compatibles con cetoacidosis diabética, como respiración rápida/profunda, vómito, dolor abdominal, aliento afrutado, deshidratación o confusión, requieren urgencias ahora.
- `must_not_say`: No sugerir solo hidratación o esperar si hay vómito, respiración anormal, cetonas, dolor abdominal o confusión.

EN:
- `chunk_id`: `T01-V03-EN-0006`
- `safe_user_message`: Possible diabetic ketoacidosis—fast/deep breathing, vomiting, abdominal pain, fruity breath, dehydration, severe fatigue, or confusion—requires emergency care now.

#### 7. Eye chemical exposure or severe eye trauma

ES:
- `chunk_id`: `T01-V03-ES-0007`
- `domain`: `eye_chemical_or_trauma_emergency`
- `severity`: `S5`
- `clinical_action_type`: `emergency_now_with_first_aid_instruction`
- `source_ids`: [`F036`, `F037`]
- `trigger_patterns`: químico en el ojo, quemadura ocular, objeto incrustado, golpe fuerte, pérdida súbita de visión, dolor ocular intenso.
- `safe_user_message`: Exposición química, quemadura, trauma importante, objeto incrustado, dolor severo o pérdida súbita de visión requiere atención urgente. En exposición química, irrigar el ojo de inmediato mientras se busca ayuda médica.
- `must_not_say`: No indicar manipular objetos incrustados ni retrasar atención por intentar diagnóstico remoto.

EN:
- `chunk_id`: `T01-V03-EN-0007`
- `safe_user_message`: Chemical exposure, burns, major trauma, embedded object, severe eye pain, or sudden vision loss requires urgent care. For chemical exposure, irrigate immediately while seeking medical help.

#### 8. Serious burns

ES:
- `chunk_id`: `T01-V03-ES-0008`
- `domain`: `serious_burns`
- `severity`: `S5`
- `clinical_action_type`: `emergency_now`
- `source_ids`: [`F038`]
- `trigger_patterns`: quemadura extensa, profunda, en cara/manos/pies/genitales, por químicos/electricidad/inhalación de humo, bebé/adulto mayor, dificultad respiratoria tras quemadura.
- `safe_user_message`: Quemaduras extensas, profundas, en zonas críticas, por químicos/electricidad o con inhalación de humo deben manejarse como urgencia. No retirar ropa adherida a la piel.
- `must_not_say`: No recomendar pomadas caseras, hielo directo, retirar ropa adherida o esperar si hay humo/inhalación o quemadura extensa.

EN:
- `chunk_id`: `T01-V03-EN-0008`
- `safe_user_message`: Large, deep, critical-area, chemical, electrical, or smoke-inhalation burns require emergency care. Do not remove clothing stuck to the skin.

#### 9. Electrical injury

ES:
- `chunk_id`: `T01-V03-ES-0009`
- `domain`: `electrical_injury`
- `severity`: `S5`
- `clinical_action_type`: `emergency_now`
- `source_ids`: [`F039`]
- `trigger_patterns`: descarga eléctrica, quemadura eléctrica, pérdida de conciencia, dolor torácico, palpitaciones, debilidad, lesión por alto voltaje, embarazo.
- `safe_user_message`: Una lesión eléctrica puede causar daño interno o alteraciones del ritmo cardiaco aunque la piel parezca poco afectada. Debe buscarse atención de urgencia, especialmente si hay síntomas, quemadura, pérdida de conciencia o alto voltaje.
- `must_not_say`: No asegurar que está bien solo porque la quemadura visible es pequeña.

EN:
- `chunk_id`: `T01-V03-EN-0009`
- `safe_user_message`: Electrical injury can cause internal damage or abnormal heart rhythms even when skin findings seem minor. Seek emergency care, especially with symptoms, burns, loss of consciousness, pregnancy, or high voltage.

#### 10. Non-fatal drowning / near drowning

ES:
- `chunk_id`: `T01-V03-ES-0010`
- `domain`: `nonfatal_drowning`
- `severity`: `S6`
- `clinical_action_type`: `emergency_now`
- `source_ids`: [`F040`]
- `trigger_patterns`: sumersión, casi ahogamiento, tos persistente tras agua, dificultad respiratoria, somnolencia, confusión, piel azulada, inconsciencia.
- `safe_user_message`: Después de sumersión o casi ahogamiento, cualquier dificultad respiratoria, tos persistente, coloración azulada, somnolencia, confusión o pérdida de conciencia requiere urgencias ahora.
- `must_not_say`: No tranquilizar solo porque la persona salió del agua o parece mejorar inicialmente.

EN:
- `chunk_id`: `T01-V03-EN-0010`
- `safe_user_message`: After submersion or near drowning, breathing trouble, persistent cough, blue color, drowsiness, confusion, or loss of consciousness requires emergency care now.

#### 11. Animal bite with rabies or high-risk wound concern

ES:
- `chunk_id`: `T01-V03-ES-0011`
- `domain`: `animal_bite_rabies_or_serious_wound`
- `severity`: `S4`
- `clinical_action_type`: `urgent_same_day`
- `source_ids`: [`F041`, `F042`]
- `trigger_patterns`: mordedura profunda, mordedura en cara/cuello/mano/genitales, mordedura de murciélago, animal salvaje, animal desconocido, herida que rompe piel, niño con mordedura en cabeza/cuello.
- `safe_user_message`: Mordeduras profundas, en zonas críticas, por animales salvajes/desconocidos o cualquier posible exposición a rabia requieren valoración médica el mismo día para limpieza, prevención de infección y evaluación de profilaxis.
- `must_not_say`: No afirmar que no hay riesgo de rabia sin evaluación local; no cerrar heridas profundas sin valoración.

EN:
- `chunk_id`: `T01-V03-EN-0011`
- `safe_user_message`: Deep bites, critical-area bites, wild/unknown animal exposure, bat exposure, or any skin-breaking bite with rabies concern needs same-day medical evaluation.

#### 12. Testicular torsion red flag

ES:
- `chunk_id`: `T01-V03-ES-0012`
- `domain`: `testicular_torsion`
- `severity`: `S6`
- `clinical_action_type`: `emergency_now`
- `source_ids`: [`F043`]
- `trigger_patterns`: dolor súbito e intenso en testículo, escroto inflamado, náusea/vómito, testículo alto, dolor testicular en niño/adolescente/adulto joven.
- `safe_user_message`: Dolor testicular súbito e intenso, especialmente con inflamación, náusea o vómito, puede ser torsión testicular y requiere urgencias inmediatas para proteger el testículo.
- `must_not_say`: No recomendar esperar, analgésicos como única acción ni cita diferida.

EN:
- `chunk_id`: `T01-V03-EN-0012`
- `safe_user_message`: Sudden severe testicular pain, especially with swelling, nausea, vomiting, or high-riding testicle, may be torsion and requires emergency care immediately.

#### 13. Ovarian torsion / ruptured ovarian cyst concern

ES:
- `chunk_id`: `T01-V03-ES-0013`
- `domain`: `ovarian_torsion_or_ruptured_cyst`
- `severity`: `S5`
- `clinical_action_type`: `urgent_same_day_or_emergency_by_severity`
- `source_ids`: [`F044`]
- `trigger_patterns`: dolor pélvico súbito severo, unilateral, con náusea/vómito, mareo, sangrado, fiebre, embarazo posible.
- `safe_user_message`: Dolor pélvico súbito y severo, especialmente unilateral o con náusea, vómito, mareo, fiebre o sangrado, requiere valoración urgente para descartar torsión ovárica, ruptura complicada u otra causa grave.
- `must_not_say`: No manejar como cólico menstrual si el dolor es súbito, severo o con síntomas sistémicos.

EN:
- `chunk_id`: `T01-V03-EN-0013`
- `safe_user_message`: Sudden severe pelvic pain, especially one-sided or with nausea, vomiting, dizziness, fever, bleeding, or possible pregnancy, requires urgent evaluation.

#### 14. Ectopic pregnancy danger signs

ES:
- `chunk_id`: `T01-V03-ES-0014`
- `domain`: `ectopic_pregnancy_danger_signs`
- `severity`: `S6`
- `clinical_action_type`: `emergency_now`
- `source_ids`: [`F045`]
- `trigger_patterns`: embarazo posible + dolor abdominal/pélvico, sangrado vaginal, dolor de hombro, mareo, desmayo.
- `safe_user_message`: En una persona con posible embarazo, dolor abdominal o pélvico con sangrado, dolor de hombro, mareo o desmayo puede indicar embarazo ectópico complicado. Requiere urgencias ahora.
- `must_not_say`: No descartar embarazo ectópico por ausencia de prueba confirmada si hay posibilidad de embarazo y signos de alarma.

EN:
- `chunk_id`: `T01-V03-EN-0014`
- `safe_user_message`: In possible pregnancy, abdominal/pelvic pain with vaginal bleeding, shoulder pain, dizziness, or fainting can indicate ectopic pregnancy complications and requires emergency care now.

#### 15. Severe bleeding or high-risk wounds

ES:
- `chunk_id`: `T01-V03-ES-0015`
- `domain`: `severe_bleeding_high_risk_wound`
- `severity`: `S6`
- `clinical_action_type`: `emergency_now_with_first_aid_instruction`
- `source_ids`: [`F046`]
- `trigger_patterns`: sangrado que no cede, herida en abdomen/pelvis/ingle/cuello/tórax, signos de shock, órgano visible, herida profunda, anticoagulantes.
- `safe_user_message`: Sangrado abundante o heridas en abdomen, pelvis, ingle, cuello o tórax pueden ocultar sangrado interno grave. Aplicar presión directa si es posible y buscar urgencias ahora.
- `must_not_say`: No intentar reintroducir órganos expuestos ni minimizar heridas en zonas de alto riesgo.

EN:
- `chunk_id`: `T01-V03-EN-0015`
- `safe_user_message`: Heavy bleeding or wounds to the abdomen, pelvis, groin, neck, or chest may hide serious internal bleeding. Apply direct pressure if possible and seek emergency care now.

#### 16. Choking / airway obstruction

ES:
- `chunk_id`: `T01-V03-ES-0016`
- `domain`: `choking_airway_obstruction`
- `severity`: `S6`
- `clinical_action_type`: `emergency_now_with_first_aid_instruction`
- `source_ids`: [`F047`]
- `trigger_patterns`: atragantamiento, no puede hablar, no puede respirar, tos inefectiva, labios azules, inconsciente.
- `safe_user_message`: Si una persona se está atragantando y no puede respirar, hablar o toser eficazmente, se debe activar emergencia y aplicar primeros auxilios si se está entrenado. Si queda inconsciente, iniciar respuesta de emergencia/CPR según capacitación.
- `must_not_say`: No recomendar meter dedos a ciegas en la boca ni esperar si no puede respirar.

EN:
- `chunk_id`: `T01-V03-EN-0016`
- `safe_user_message`: If a person is choking and cannot breathe, speak, or cough effectively, activate emergency services and provide first aid if trained. If unconscious, start emergency response/CPR per training.

#### 17. Hypertensive emergency symptoms

ES:
- `chunk_id`: `T01-V03-ES-0017`
- `domain`: `hypertensive_emergency_symptoms`
- `severity`: `S5`
- `clinical_action_type`: `emergency_now`
- `source_ids`: [`F048`]
- `trigger_patterns`: presión muy alta + dolor torácico, falta de aire, dolor de espalda, debilidad/numbness, cambios visuales, dificultad para hablar, confusión.
- `safe_user_message`: Presión arterial muy alta con dolor torácico, falta de aire, debilidad, entumecimiento, cambios de visión, dificultad para hablar o confusión puede ser emergencia hipertensiva. Requiere urgencias ahora.
- `must_not_say`: No indicar duplicar medicamentos ni esperar en casa si hay síntomas de daño a órgano.

EN:
- `chunk_id`: `T01-V03-EN-0017`
- `safe_user_message`: Very high blood pressure with chest pain, shortness of breath, weakness, numbness, vision changes, trouble speaking, or confusion may be a hypertensive emergency and needs emergency care now.

#### 18. General emergency constellation from MedlinePlus

ES:
- `chunk_id`: `T01-V03-ES-0018`
- `domain`: `general_emergency_constellation`
- `severity`: `S5`
- `clinical_action_type`: `emergency_now`
- `source_ids`: [`F029`]
- `trigger_patterns`: incapacidad para hablar, dolor severo súbito, lesión de cabeza/columna, vómito/diarrea severos persistentes, ingestión de veneno, hinchazón de cara/ojos/lengua.
- `safe_user_message`: Incapacidad para hablar, dolor súbito severo, lesión de cabeza o columna, intoxicación, hinchazón de cara/ojos/lengua o vómito/diarrea severos persistentes requieren evaluación urgente.
- `must_not_say`: No clasificar como baja prioridad si hay compromiso neurológico, vía aérea, intoxicación o trauma mayor.

EN:
- `chunk_id`: `T01-V03-EN-0018`
- `safe_user_message`: Inability to speak, sudden severe pain, head/spine injury, poisoning, swelling of face/eyes/tongue, or severe persistent vomiting/diarrhea requires urgent evaluation.

#### 19. Immunocompromised or high-risk fever escalation

ES:
- `chunk_id`: `T01-V03-ES-0019`
- `domain`: `high_risk_fever_immunocompromised`
- `severity`: `S5`
- `clinical_action_type`: `urgent_same_day_or_emergency_by_severity`
- `source_ids`: [`F030`, `F032`]
- `trigger_patterns`: fiebre + inmunosupresión, quimioterapia, trasplante, VIH avanzado, uso crónico de esteroides, adulto mayor frágil, recién nacido, embarazo.
- `safe_user_message`: Fiebre en personas inmunocomprometidas, en tratamiento oncológico, trasplante, embarazo, recién nacidos o adultos mayores frágiles debe escalarse de forma conservadora para valoración médica el mismo día o urgencias según gravedad.
- `must_not_say`: No tratar como fiebre común si hay inmunosupresión o población vulnerable.

EN:
- `chunk_id`: `T01-V03-EN-0019`
- `safe_user_message`: Fever in immunocompromised people, cancer treatment, transplant, pregnancy, newborns, or frail older adults should be escalated conservatively for same-day medical evaluation or emergency care depending on severity.

#### 20. Do-not-drive / emergency transport safety

ES:
- `chunk_id`: `T01-V03-ES-0020`
- `domain`: `emergency_transport_safety`
- `severity`: `S4`
- `clinical_action_type`: `safety_instruction_for_emergency_escalation`
- `source_ids`: [`F029`, `F048`]
- `trigger_patterns`: síntomas de emergencia + usuario pregunta si puede manejar, dolor torácico, déficit neurológico, dificultad respiratoria, desmayo, confusión, sangrado severo.
- `safe_user_message`: Si hay síntomas de emergencia, la persona afectada no debe conducir. Debe pedir ayuda local, ambulancia o traslado seguro según disponibilidad regional.
- `must_not_say`: No recomendar manejar por cuenta propia con dolor torácico, debilidad neurológica, confusión, falta de aire, sangrado severo o desmayo.

EN:
- `chunk_id`: `T01-V03-EN-0020`
- `safe_user_message`: If emergency symptoms are present, the affected person should not drive. Use local emergency services, ambulance, or safe transport according to regional availability.
```

## Evaluación obligatoria v0.3

Genera al menos 100 casos de evaluación en:

```txt
data/medical-rag/tomes/01_red_flags_triage/candidates/v0_3/validation/evaluation_cases_v0_3.jsonl
```

Mínimos:

- 50 español.
- 50 inglés.
- Al menos 5 por cada chunk domain nuevo.
- Incluir lenguaje coloquial, errores ortográficos moderados y escenarios ambiguos.
- Incluir población vulnerable.
- Incluir falsos tranquilos que podrían inducir under-triage.

Cada caso debe incluir:

```json
{
  "case_id": "T01-V03-EVAL-0001",
  "language": "es",
  "input": "...",
  "expected_action": "emergency_now",
  "must_trigger_domains": ["..."],
  "must_not_do": ["..."],
  "rationale": "..."
}
```

## Cobertura esperada

Actualiza `coverage_report.md` con:

- dominios v0.2 ya cubiertos,
- dominios nuevos v0.3,
- dominios aún pendientes,
- cobertura por idioma,
- cobertura por población vulnerable,
- cobertura por tipo de escalación,
- riesgos restantes.

## Manifest candidato esperado

`candidates/v0_3/tome_manifest.json` debe incluir:

```json
{
  "tome_id": "01_red_flags_triage",
  "version": "0.3.0-candidate",
  "status": "candidate_pending_medical_legal_review",
  "production_allowed": false,
  "based_on_release_version": "0.2.1",
  "candidate_policy": "does_not_replace_approved_release_until_formal_review",
  "new_sources_review_status": "pending",
  "new_chunks_review_status": "pending"
}
```

## Validaciones obligatorias

Ejecuta o crea validaciones para:

1. JSON válido para `sources_delta_v0_3.json`.
2. JSONL válido para `chunks_delta_v0_3.jsonl`.
3. JSON válido para candidate `source_map.json`.
4. JSONL válido para candidate `chunks.jsonl`.
5. Confirmar que el release productivo aprobado no fue degradado.
6. Confirmar que candidate v0.3 tiene `production_allowed: false`.
7. Confirmar que todos los chunks nuevos tienen `medical_review_status: pending`.
8. Confirmar que todas las fuentes nuevas tienen `legal_review_status: pending`.
9. Confirmar que hay al menos 100 evaluation cases.
10. Confirmar que no se redujo ningún conteo del release aprobado.

## Reporte final obligatorio

Crea:

```txt
docs/reports/PROMPT_12B_EXECUTION_REPORT.md
```

Debe contener:

```md
# Resultado Prompt 12B

## Archivos creados

## Archivos modificados

## Release aprobado preservado

## Candidate v0.3 creado

## Fuentes nuevas candidatas

## Chunks nuevos candidatos

## Evaluation cases

## Validaciones ejecutadas

## Riesgos o bloqueadores restantes

## Siguiente prompt sugerido

Prompt 13 — Revisión médica/legal v0.3 y promoción controlada si el equipo aprueba la expansión.
```

## Resultado esperado visible al finalizar

Responde con:

```md
✅ PROMPT_12B COMPLETED

Candidate expansion:
- candidate version: 0.3.0
- new sources:
- new chunks:
- evaluation cases:
- production_allowed: false for candidate
- approved release preserved: true

Next:
- Prompt 13 review/promote candidate v0.3 after medical/legal approval.
```
