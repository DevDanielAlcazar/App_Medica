# Prompt 10 — Tomo 01 v0.2: expansión curada de cobertura crítica y hardening anti under-triage

## Rol del agente



El arquitecto senior entrega en este prompt un paquete curado de expansión clínica v0.2 para el **Tomo 01 — Red Flags, Triage y Derivación Inmediata**. Tu trabajo es **integrar, normalizar, validar, reportar y bloquear producción hasta revisión humana**.

No debes inventar contenido médico. No debes completar huecos clínicos por criterio propio. No debes descargar fuentes externas. No debes agregar fuentes que no estén declaradas por el arquitecto senior en este prompt.

## Contexto del proyecto

Repositorio local esperado:

```txt
D:\Desarrollos\App_Medica
```

Tomo objetivo:

```txt
data/medical-rag/tomes/01_red_flags_triage/
```

Release pack objetivo:

```txt
data/medical-rag/tomes/01_red_flags_triage/release/
```

Entrada curada v0.2 a crear:

```txt
data/medical-rag/tomes/01_red_flags_triage/curated_input/senior_seed_v0_2/
```

## Principios obligatorios

1. **Seguridad clínica primero:** ante señales de alarma, la salida debe favorecer emergencia/valoración humana, nunca tranquilizar indebidamente.
2. **Cero under-triage:** si hay conflicto entre severidades, prevalece la más alta.
3. **Cero producción automática:** aunque exista aprobación general del avance por médico/abogado de empresa, cada tomo/chunk queda en revisión hasta firma explícita por release.
4. **Cero prescripción:** este tomo no emite tratamientos ni recetas. Solo red flags, triage y derivación.
5. **Cero contenido inventado:** solo transforma el contenido `SENIOR_CURATED_*` incluido en este prompt.
6. **Bilingüe obligatorio:** preservar ES/EN y marcar idioma por chunk.
7. **Trazabilidad obligatoria:** cada chunk debe referenciar al menos una fuente declarada.
8. **Mantenibilidad:** todo debe quedar versionado, auditable, extensible para futuros tomos, fuentes autorizadas, especialistas y corpus adicionales.

## Objetivo del Prompt 10

Expandir el Tomo 01 desde v0.1 hacia un **release candidate clínico v0.2**, aumentando cobertura en dominios críticos todavía débiles o incompletos, sin eliminar lo ya generado.

Debes:

1. Crear carpeta `curated_input/senior_seed_v0_2/`.
2. Registrar fuentes delta v0.2 en archivos separados.
3. Agregar chunks curados ES/EN para dominios críticos adicionales.
4. Fusionar los nuevos chunks con el `release/chunks.jsonl` existente sin duplicar IDs.
5. Actualizar `source_map.json` preservando fuentes anteriores.
6. Actualizar `tome_manifest.json` con conteos nuevos y estado `release_candidate_clinical_review`.
7. Crear/actualizar matriz de cobertura para dominios v0.2.
8. Crear/actualizar evaluation cases hasta un mínimo de 80 casos totales ES/EN, basados exclusivamente en chunks existentes y nuevos.
9. Ejecutar validaciones estructurales existentes.
10. Crear reporte `docs/reports/PROMPT_10_EXECUTION_REPORT.md`.

## Archivos esperados

Crea o actualiza, sin borrar contenido existente:

```txt
data/medical-rag/tomes/01_red_flags_triage/curated_input/senior_seed_v0_2/README.md
data/medical-rag/tomes/01_red_flags_triage/curated_input/senior_seed_v0_2/sources_delta_v0_2.json
data/medical-rag/tomes/01_red_flags_triage/curated_input/senior_seed_v0_2/chunks_delta_v0_2.jsonl
data/medical-rag/tomes/01_red_flags_triage/curated_input/senior_seed_v0_2/coverage_delta_v0_2.md
data/medical-rag/tomes/01_red_flags_triage/release/source_map.json
data/medical-rag/tomes/01_red_flags_triage/release/chunks.jsonl
data/medical-rag/tomes/01_red_flags_triage/release/tome_manifest.json
data/medical-rag/tomes/01_red_flags_triage/release/validation/anti_under_triage_matrix.json
data/medical-rag/tomes/01_red_flags_triage/release/validation/evaluation_cases.jsonl
data/medical-rag/tomes/01_red_flags_triage/release/validation/coverage_report.md
data/medical-rag/tomes/01_red_flags_triage/release/clinical_review_report.md
data/medical-rag/tomes/01_red_flags_triage/release/legal_review_report.md
data/medical-rag/tomes/01_red_flags_triage/release/CHANGELOG.md
docs/reports/PROMPT_10_EXECUTION_REPORT.md
```

## Estado permitido del tomo

El estado final debe ser:

```json
{
  "status": "release_candidate_clinical_review",
  "production_allowed": false,
  "medical_review_status": "pending",
  "legal_review_status": "pending"
}
```

No cambies `production_allowed` a `true`.

---

# SENIOR_CURATED_SOURCES_DELTA_V0_2

Integra estas fuentes como delta v0.2. Todas quedan con `license_status: pending_legal_review` y `medical_review_status: pending`, aunque sean fuentes oficiales.

```json
[
  {
    "source_id": "T01-V02-S001",
    "title": "CDC — Signs and Symptoms of Stroke",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/stroke/signs-symptoms/index.html",
    "source_type": "official_public_health",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S002",
    "title": "CDC — Management / Recognition of Anaphylaxis",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/vaccines/covid-19/clinical-considerations/managing-anaphylaxis.html",
    "source_type": "official_public_health",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S003",
    "title": "Poison Control — Emergency Poison Help",
    "publisher": "Poison Control / National Capital Poison Center",
    "url": "https://www.poison.org/",
    "source_type": "official_or_accredited_public_resource",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S004",
    "title": "NIMH — Warning Signs of Suicide",
    "publisher": "National Institute of Mental Health",
    "url": "https://www.nimh.nih.gov/health/publications/warning-signs-of-suicide",
    "source_type": "official_public_health",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S005",
    "title": "CDC — Symptoms of Mild TBI and Concussion",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/traumatic-brain-injury/signs-symptoms/index.html",
    "source_type": "official_public_health",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S006",
    "title": "MedlinePlus — Abdominal Pain",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/abdominalpain.html",
    "source_type": "official_patient_education",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en", "es"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S007",
    "title": "CDC/NIOSH — Heat-related Illnesses",
    "publisher": "Centers for Disease Control and Prevention / NIOSH",
    "url": "https://www.cdc.gov/niosh/heat-stress/about/illnesses.html",
    "source_type": "official_public_health",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S008",
    "title": "CDC — Preventing / Recognizing Hypothermia",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/winter-weather/prevention/index.html",
    "source_type": "official_public_health",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S009",
    "title": "CDC — Diabetic Ketoacidosis",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/diabetes/about/diabetic-ketoacidosis.html",
    "source_type": "official_public_health",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S010",
    "title": "CDC — Treatment of Low Blood Sugar",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/diabetes/treatment/treatment-low-blood-sugar-hypoglycemia.html",
    "source_type": "official_public_health",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S011",
    "title": "CDC — First Aid for Seizures",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/epilepsy/first-aid-for-seizures/index.html",
    "source_type": "official_public_health",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S012",
    "title": "CDC — Urgent Maternal Warning Signs",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/hearher/maternal-warning-signs/index.html",
    "source_type": "official_public_health",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S013",
    "title": "CDC — Blood Clots and Pregnancy",
    "publisher": "Centers for Disease Control and Prevention",
    "url": "https://www.cdc.gov/blood-clots/risk-factors/pregnancy.html",
    "source_type": "official_public_health",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S014",
    "title": "MedlinePlus — Ectopic Pregnancy",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ectopicpregnancy.html",
    "source_type": "official_patient_education",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en", "es"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  },
  {
    "source_id": "T01-V02-S015",
    "title": "MedlinePlus — When to use the emergency room: child",
    "publisher": "National Library of Medicine / NIH",
    "url": "https://medlineplus.gov/ency/patientinstructions/000594.htm",
    "source_type": "official_patient_education",
    "evidence_grade": "A",
    "jurisdictions": ["us", "global_reference"],
    "languages": ["en", "es"],
    "license_status": "pending_legal_review",
    "medical_review_status": "pending"
  }
]
```

---

# SENIOR_CURATED_CHUNKS_DELTA_V0_2

Integra estos chunks en `curated_input/senior_seed_v0_2/chunks_delta_v0_2.jsonl` y después fusiona con `release/chunks.jsonl`. Si el schema existente tiene campos adicionales obligatorios, complétalos con valores seguros: `pending`, `false`, `unknown`, `[]` o equivalente. No cambies el sentido clínico.

```jsonl
{"chunk_id":"T01-V02-C001-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"stroke_tia","specialty":"emergency_medicine_neurology","population":["adult","older_adult","pregnant_postpartum","adolescent"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Sospecha de evento vascular cerebral: activación inmediata","clinical_summary":"Déficit neurológico súbito como debilidad o adormecimiento de cara, brazo o pierna, especialmente unilateral, dificultad para hablar o entender, alteración visual súbita, pérdida de equilibrio o coordinación, mareo súbito o dolor de cabeza súbito e intenso sin causa clara debe tratarse como posible evento vascular cerebral hasta descartar lo contrario.","safe_user_message":"Esto puede ser una emergencia neurológica. Llama a emergencias o acude a urgencias ahora. No manejes ni esperes a ver si se quita.","must_not_say":["espera unas horas","toma analgésicos y observa","probablemente es estrés"],"source_ids":["T01-V02-S001"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C002-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"stroke_tia","specialty":"emergency_medicine_neurology","population":["adult","older_adult","pregnant_postpartum","adolescent"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Possible stroke: emergency activation","clinical_summary":"Sudden neurologic deficits such as face, arm, or leg weakness or numbness, especially on one side; trouble speaking or understanding; sudden vision trouble; sudden trouble walking, dizziness, loss of balance or coordination; or sudden severe headache without a clear cause must be treated as possible stroke until proven otherwise.","safe_user_message":"This may be a neurologic emergency. Call emergency services or go to the ER now. Do not drive yourself and do not wait to see if it goes away.","must_not_say":["wait a few hours","take pain medicine and observe","it is probably stress"],"source_ids":["T01-V02-S001"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C003-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"anaphylaxis","specialty":"emergency_medicine_allergy_immunology","population":["adult","child","older_adult","pregnant_postpartum"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Anafilaxia probable: reacción alérgica sistémica","clinical_summary":"Dificultad para respirar, sensación de cierre de garganta, ronquera, sibilancias, hinchazón de labios/lengua/cara, desmayo, mareo intenso, síntomas gastrointestinales con reacción cutánea o afectación de más de un sistema tras exposición a alimento, medicamento, picadura, látex u otro alérgeno debe tratarse como posible anafilaxia.","safe_user_message":"Esto puede ser una reacción alérgica grave. Llama a emergencias ahora. Si la persona tiene autoinyector de epinefrina indicado previamente, debe usarlo según sus instrucciones mientras llega ayuda.","must_not_say":["solo toma antihistamínico","espera a que baje la inflamación","si no hay ronchas no es grave"],"source_ids":["T01-V02-S002"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C004-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"anaphylaxis","specialty":"emergency_medicine_allergy_immunology","population":["adult","child","older_adult","pregnant_postpartum"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Possible anaphylaxis: systemic allergic reaction","clinical_summary":"Trouble breathing, throat-closing sensation, hoarse voice, wheezing, swelling of lips/tongue/face, fainting, severe dizziness, gastrointestinal symptoms with skin findings, or involvement of more than one body system after exposure to food, medication, insect sting, latex, or another allergen should be treated as possible anaphylaxis.","safe_user_message":"This may be a severe allergic reaction. Call emergency services now. If the person has a previously prescribed epinephrine auto-injector, use it as directed while waiting for help.","must_not_say":["just take an antihistamine","wait for the swelling to go down","without hives it cannot be serious"],"source_ids":["T01-V02-S002"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C005-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"poisoning_toxic_exposure","specialty":"emergency_medicine_toxicology","population":["adult","child","older_adult","pregnant_postpartum"],"severity":"S6","clinical_action_type":"emergency_now_or_poison_control","red_flag_relevant":true,"title":"Intoxicación o exposición tóxica: priorizar emergencias o centro toxicológico","clinical_summary":"Colapso, convulsión, dificultad para respirar, imposibilidad de despertar, alteración importante del estado mental o exposición a humo, gases, químicos, medicamentos, drogas, plantas, productos domésticos o venenos requiere atención inmediata. Si no hay compromiso vital inmediato, contactar centro toxicológico/Poison Control según país y conservar envase o sustancia para el equipo clínico.","safe_user_message":"Esto puede ser una intoxicación. Si hay dificultad para respirar, convulsión, desmayo o no despierta, llama a emergencias ahora. Si está estable, contacta de inmediato a un centro toxicológico local y sigue sus instrucciones.","must_not_say":["provoca vómito","dale leche o remedios caseros","espera a ver si mejora"],"source_ids":["T01-V02-S003"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C006-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"poisoning_toxic_exposure","specialty":"emergency_medicine_toxicology","population":["adult","child","older_adult","pregnant_postpartum"],"severity":"S6","clinical_action_type":"emergency_now_or_poison_control","red_flag_relevant":true,"title":"Poisoning or toxic exposure: emergency or poison center escalation","clinical_summary":"Collapse, seizure, trouble breathing, inability to wake, major mental status change, or exposure to smoke, fumes, chemicals, medications, drugs, plants, household products, or poisons requires immediate action. If there is no immediate life threat, contact the local poison center/Poison Control and keep the container or substance for clinicians.","safe_user_message":"This may be poisoning. If there is trouble breathing, seizure, collapse, or the person cannot be awakened, call emergency services now. If stable, contact a local poison center immediately and follow their instructions.","must_not_say":["make them vomit","give milk or home remedies","wait and see if it improves"],"source_ids":["T01-V02-S003"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C007-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"suicide_self_harm_crisis","specialty":"emergency_medicine_psychiatry_crisis","population":["adult","adolescent","older_adult","pregnant_postpartum"],"severity":"S6","clinical_action_type":"crisis_emergency_now","red_flag_relevant":true,"title":"Riesgo suicida o autolesión: intervención inmediata","clinical_summary":"Hablar de querer morir, buscar métodos, hacer un plan, despedirse, regalar pertenencias importantes, aumentar conductas de riesgo, expresar desesperanza extrema, cambios severos de ánimo o aumento reciente de consumo de alcohol/drogas debe tratarse como riesgo de crisis, especialmente si es nuevo, reciente o creciente.","safe_user_message":"Tu seguridad es lo primero. Si hay riesgo inmediato, llama a emergencias ahora o acude a urgencias. No te quedes solo/a; contacta a una persona de confianza y a una línea local de crisis mientras llega ayuda.","must_not_say":["no es para tanto","promete que no harás nada","duerme y mañana vemos"],"source_ids":["T01-V02-S004"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C008-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"suicide_self_harm_crisis","specialty":"emergency_medicine_psychiatry_crisis","population":["adult","adolescent","older_adult","pregnant_postpartum"],"severity":"S6","clinical_action_type":"crisis_emergency_now","red_flag_relevant":true,"title":"Suicide or self-harm risk: immediate intervention","clinical_summary":"Talking about wanting to die, searching for methods, making a plan, saying goodbye, giving away important items, taking dangerous risks, expressing severe hopelessness, extreme mood swings, or recently increased alcohol/drug use should be treated as a crisis risk, especially if new, recent, or escalating.","safe_user_message":"Your safety comes first. If there is immediate danger, call emergency services now or go to the ER. Do not stay alone; contact a trusted person and a local crisis line while help arrives.","must_not_say":["it is not that serious","promise you will not do anything","sleep and we will see tomorrow"],"source_ids":["T01-V02-S004"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C009-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"head_injury_concussion_danger","specialty":"emergency_medicine_neurology_trauma","population":["adult","child","older_adult"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Traumatismo de cabeza con signos de alarma","clinical_summary":"Después de golpe en cabeza, dolor de cabeza que empeora o no cede, vómitos repetidos, convulsiones, debilidad, adormecimiento, mala coordinación, habla arrastrada, comportamiento inusual, confusión, somnolencia marcada, no poder despertar, pérdida de conciencia o una pupila más grande que la otra requiere valoración urgente/emergente.","safe_user_message":"Estos datos pueden indicar lesión cerebral seria. Acude a urgencias o llama a emergencias ahora. No dejes a la persona sola ni le permitas manejar.","must_not_say":["déjalo dormir sin vigilancia","seguro solo es un chipote","espera hasta mañana"],"source_ids":["T01-V02-S005"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C010-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"head_injury_concussion_danger","specialty":"emergency_medicine_neurology_trauma","population":["adult","child","older_adult"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Head injury with danger signs","clinical_summary":"After a head injury, worsening or persistent headache, repeated vomiting, seizures, weakness, numbness, poor coordination, slurred speech, unusual behavior, confusion, marked drowsiness, inability to wake, loss of consciousness, or one pupil larger than the other requires urgent/emergency evaluation.","safe_user_message":"These signs may indicate a serious brain injury. Go to the ER or call emergency services now. Do not leave the person alone and do not let them drive.","must_not_say":["let them sleep without monitoring","it is probably just a bump","wait until tomorrow"],"source_ids":["T01-V02-S005"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C011-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"severe_abdominal_pain","specialty":"emergency_medicine_gastroenterology_surgery","population":["adult","child","older_adult","pregnant_postpartum"],"severity":"S5","clinical_action_type":"urgent_same_day_or_emergency_now","red_flag_relevant":true,"title":"Dolor abdominal con signos de alarma","clinical_summary":"Dolor abdominal súbito e intenso, abdomen duro/rígido y sensible, vómito con sangre, sangre en heces, dolor con pecho/cuello/hombro, dolor severo que empeora, incapacidad para evacuar o pasar gases junto con vómitos, fiebre o sangrado rectal requiere valoración médica urgente o emergente según gravedad.","safe_user_message":"El dolor abdominal con estos datos no debe manejarse en casa. Busca valoración médica hoy; si el dolor es intenso, súbito, hay sangre, desmayo, rigidez abdominal o empeora rápido, ve a urgencias ahora.","must_not_say":["toma laxante sin valoración","probablemente son gases aunque sea intenso","espera varios días"],"source_ids":["T01-V02-S006"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C012-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"severe_abdominal_pain","specialty":"emergency_medicine_gastroenterology_surgery","population":["adult","child","older_adult","pregnant_postpartum"],"severity":"S5","clinical_action_type":"urgent_same_day_or_emergency_now","red_flag_relevant":true,"title":"Abdominal pain with danger signs","clinical_summary":"Sudden severe abdominal pain, rigid/hard and tender abdomen, vomiting blood, blood in stool, pain with chest/neck/shoulder pain, severe worsening pain, inability to pass stool or gas with vomiting, fever, or rectal bleeding requires urgent or emergency medical evaluation depending on severity.","safe_user_message":"Abdominal pain with these signs should not be managed at home. Seek medical care today; if the pain is severe, sudden, bloody, associated with fainting, abdominal rigidity, or rapidly worsening, go to the ER now.","must_not_say":["take a laxative without evaluation","it is probably gas even if severe","wait several days"],"source_ids":["T01-V02-S006"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C013-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"heat_stroke_heat_illness","specialty":"emergency_medicine_environmental","population":["adult","child","older_adult","pregnant_postpartum","outdoor_worker"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Golpe de calor o enfermedad por calor severa","clinical_summary":"Confusión, alteración del estado mental, habla arrastrada, pérdida de conciencia, convulsiones, temperatura corporal muy alta, piel caliente seca o sudoración profusa después de exposición a calor debe considerarse golpe de calor hasta descartar lo contrario.","safe_user_message":"Esto puede ser golpe de calor, una emergencia. Llama a emergencias ahora. Mientras llega ayuda, mueve a la persona a un lugar fresco y comienza enfriamiento seguro si es posible.","must_not_say":["solo dale agua y espera","que siga trabajando","no es grave si está sudando"],"source_ids":["T01-V02-S007"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C014-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"heat_stroke_heat_illness","specialty":"emergency_medicine_environmental","population":["adult","child","older_adult","pregnant_postpartum","outdoor_worker"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Heat stroke or severe heat illness","clinical_summary":"Confusion, altered mental status, slurred speech, loss of consciousness, seizures, very high body temperature, hot dry skin or heavy sweating after heat exposure should be treated as possible heat stroke until proven otherwise.","safe_user_message":"This may be heat stroke, an emergency. Call emergency services now. While help is coming, move the person to a cool place and start safe cooling if possible.","must_not_say":["just give water and wait","keep working","it is not serious if they are sweating"],"source_ids":["T01-V02-S007"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C015-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"hypothermia","specialty":"emergency_medicine_environmental","population":["adult","child","older_adult","infant"],"severity":"S5","clinical_action_type":"urgent_same_day_or_emergency_now","red_flag_relevant":true,"title":"Hipotermia o enfriamiento peligroso","clinical_summary":"Tras frío, lluvia, sudor o agua fría, escalofríos intensos o que desaparecen con empeoramiento, agotamiento, confusión, torpeza de manos, pérdida de memoria, habla arrastrada, somnolencia; en bebés piel roja fría y muy baja energía, requiere atención médica inmediata.","safe_user_message":"Estos datos pueden indicar hipotermia. Busca atención médica inmediata. Lleva a la persona a un lugar cálido, retira ropa mojada si es seguro y evita alcohol o calentamiento brusco.","must_not_say":["dale alcohol para calentarse","usa calor extremo directo","déjalo dormir sin supervisión"],"source_ids":["T01-V02-S008"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C016-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"hypothermia","specialty":"emergency_medicine_environmental","population":["adult","child","older_adult","infant"],"severity":"S5","clinical_action_type":"urgent_same_day_or_emergency_now","red_flag_relevant":true,"title":"Hypothermia or dangerous cold exposure","clinical_summary":"After cold, rain, sweat, or cold-water exposure, severe shivering or shivering that stops with worsening, exhaustion, confusion, fumbling hands, memory loss, slurred speech, drowsiness; in babies, bright red cold skin and very low energy require immediate medical attention.","safe_user_message":"These signs may indicate hypothermia. Seek immediate medical care. Move the person to a warm place, remove wet clothing if safe, and avoid alcohol or extreme direct heat.","must_not_say":["give alcohol to warm up","use extreme direct heat","let them sleep without supervision"],"source_ids":["T01-V02-S008"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C017-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"diabetic_ketoacidosis_hyperglycemic_emergency","specialty":"emergency_medicine_endocrinology","population":["adult","child","adolescent","pregnant_postpartum"],"severity":"S5","clinical_action_type":"urgent_same_day_or_emergency_now","red_flag_relevant":true,"title":"Sospecha de cetoacidosis diabética o emergencia hiperglucémica","clinical_summary":"Sed intensa y orinar mucho con respiración rápida/profunda, boca o piel seca, cara enrojecida, aliento afrutado, cansancio extremo, náusea, vómito, dolor abdominal, dolor de cabeza, confusión o disminución de alerta en persona con diabetes o posible diabetes requiere valoración urgente/emergente.","safe_user_message":"Esto puede ser una emergencia relacionada con azúcar alta/cetonas. Busca atención médica de inmediato; si hay confusión, respiración rápida/profunda, vómitos persistentes o somnolencia, ve a urgencias ahora.","must_not_say":["solo toma agua y espera","omite insulina sin indicación médica","es una infección simple"],"source_ids":["T01-V02-S009"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C018-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"diabetic_ketoacidosis_hyperglycemic_emergency","specialty":"emergency_medicine_endocrinology","population":["adult","child","adolescent","pregnant_postpartum"],"severity":"S5","clinical_action_type":"urgent_same_day_or_emergency_now","red_flag_relevant":true,"title":"Possible diabetic ketoacidosis or hyperglycemic emergency","clinical_summary":"Intense thirst and frequent urination with fast/deep breathing, dry mouth or skin, flushed face, fruity-smelling breath, extreme tiredness, nausea, vomiting, abdominal pain, headache, confusion, or decreased alertness in a person with diabetes or possible diabetes requires urgent/emergency evaluation.","safe_user_message":"This may be a high blood sugar/ketone emergency. Seek medical care immediately; if there is confusion, fast/deep breathing, persistent vomiting, or marked sleepiness, go to the ER now.","must_not_say":["just drink water and wait","skip insulin without medical direction","it is just a simple infection"],"source_ids":["T01-V02-S009"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C019-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"severe_hypoglycemia","specialty":"emergency_medicine_endocrinology","population":["adult","child","adolescent","older_adult","pregnant_postpartum"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Hipoglucemia severa: desmayo, convulsión o no puede tragar","clinical_summary":"Sudoración, temblor, palpitaciones, ansiedad, irritabilidad, confusión, mareo o hambre pueden sugerir glucosa baja. Si la persona se desmaya, convulsiona, no puede tragar con seguridad, no despierta o no mejora tras manejo indicado previamente, es emergencia.","safe_user_message":"Si la persona está inconsciente, convulsiona o no puede tragar, llama a emergencias ahora y no le des comida ni bebida por boca. Si tiene glucagón indicado, úsalo según instrucciones previas mientras llega ayuda.","must_not_say":["dale líquidos por la boca si está inconsciente","espera a que despierte solo","maneja al hospital tú mismo si estás confundido"],"source_ids":["T01-V02-S010"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C020-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"severe_hypoglycemia","specialty":"emergency_medicine_endocrinology","population":["adult","child","adolescent","older_adult","pregnant_postpartum"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Severe hypoglycemia: fainting, seizure, or cannot swallow","clinical_summary":"Sweating, shaking, fast heartbeat, anxiety, irritability, confusion, dizziness, or hunger may suggest low blood sugar. If the person faints, has a seizure, cannot swallow safely, cannot be awakened, or does not improve after previously instructed management, this is an emergency.","safe_user_message":"If the person is unconscious, seizing, or cannot swallow, call emergency services now and do not give food or drink by mouth. If they have prescribed glucagon, use it as previously directed while help arrives.","must_not_say":["give liquids by mouth if unconscious","wait for them to wake up alone","drive yourself to the hospital if confused"],"source_ids":["T01-V02-S010"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C021-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"seizure_emergency","specialty":"emergency_medicine_neurology","population":["adult","child","older_adult","pregnant_postpartum"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Convulsión con criterios de emergencia","clinical_summary":"Una convulsión que dura más de 5 minutos, convulsiones repetidas, dificultad para respirar o despertar después, lesión durante el evento, convulsión en agua, primera convulsión, embarazo, diabetes o evento diferente al habitual requiere ayuda médica urgente o emergencias.","safe_user_message":"Llama a emergencias ahora si la convulsión dura más de 5 minutos, se repite, hay dificultad para respirar/despertar, ocurrió en agua, hubo lesión, es la primera vez, hay embarazo o diabetes.","must_not_say":["mete algo en la boca","sujétalo con fuerza","espera aunque pase de 5 minutos"],"source_ids":["T01-V02-S011"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C022-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"seizure_emergency","specialty":"emergency_medicine_neurology","population":["adult","child","older_adult","pregnant_postpartum"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Seizure with emergency criteria","clinical_summary":"A seizure lasting more than 5 minutes, repeated seizures, trouble breathing or waking afterward, injury during the event, seizure in water, first seizure, pregnancy, diabetes, or an event different from the person’s usual seizures requires urgent/emergency help.","safe_user_message":"Call emergency services now if the seizure lasts more than 5 minutes, repeats, causes trouble breathing/waking, happened in water, caused injury, is a first seizure, or the person is pregnant or has diabetes.","must_not_say":["put something in their mouth","hold them down forcefully","wait even if it lasts more than 5 minutes"],"source_ids":["T01-V02-S011"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C023-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"pregnancy_postpartum_warning_signs","specialty":"emergency_medicine_obstetrics","population":["pregnant_postpartum"],"severity":"S5","clinical_action_type":"urgent_same_day_or_emergency_now","red_flag_relevant":true,"title":"Signos urgentes durante embarazo o hasta un año posparto","clinical_summary":"Dolor de cabeza severo que no cede o empeora, desmayo, mareo persistente, cambios visuales, fiebre, hinchazón extrema de manos/cara, dificultad para respirar, dolor de pecho o latidos rápidos, náusea/vómito severos, dolor abdominal severo persistente, sangrado o salida de líquido, disminución o ausencia de movimientos del bebé, o pensamientos de hacerse daño o dañar al bebé requieren atención inmediata.","safe_user_message":"Durante embarazo o hasta un año después del parto, estos signos requieren atención médica inmediata. Si son intensos, súbitos, hay dificultad para respirar, dolor de pecho, desmayo, sangrado importante o pensamientos de daño, ve a urgencias ahora.","must_not_say":["es normal en el embarazo","espera a tu próxima cita","seguro es ansiedad"],"source_ids":["T01-V02-S012"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C024-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"pregnancy_postpartum_warning_signs","specialty":"emergency_medicine_obstetrics","population":["pregnant_postpartum"],"severity":"S5","clinical_action_type":"urgent_same_day_or_emergency_now","red_flag_relevant":true,"title":"Urgent warning signs during pregnancy or up to one year postpartum","clinical_summary":"Severe headache that does not go away or worsens, fainting, persistent dizziness, vision changes, fever, extreme swelling of hands/face, trouble breathing, chest pain or fast heartbeat, severe nausea/vomiting, severe persistent abdominal pain, vaginal bleeding or fluid leakage, baby’s movement stopping or slowing, or thoughts of harming self or baby require immediate medical attention.","safe_user_message":"During pregnancy or up to one year after birth, these signs need immediate medical care. If severe, sudden, associated with trouble breathing, chest pain, fainting, heavy bleeding, or thoughts of harm, go to the ER now.","must_not_say":["it is normal in pregnancy","wait for your next appointment","it is probably anxiety"],"source_ids":["T01-V02-S012"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C025-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"ectopic_pregnancy","specialty":"emergency_medicine_obstetrics","population":["pregnant_postpartum","reproductive_age"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Posible embarazo ectópico complicado","clinical_summary":"En persona con posibilidad de embarazo, dolor abdominal o pélvico, sangrado vaginal, dolor de hombro, mareo, debilidad, sensación de desmayo o desmayo puede corresponder a embarazo ectópico complicado, especialmente si el dolor es severo, súbito o unilateral.","safe_user_message":"Esto puede ser una emergencia del embarazo. Acude a urgencias ahora o llama a emergencias, especialmente si hay dolor fuerte, sangrado, dolor de hombro, mareo o desmayo.","must_not_say":["espera a confirmar con prueba casera","es cólico normal","toma analgésico y observa"],"source_ids":["T01-V02-S014"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C026-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"ectopic_pregnancy","specialty":"emergency_medicine_obstetrics","population":["pregnant_postpartum","reproductive_age"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Possible complicated ectopic pregnancy","clinical_summary":"In a person who could be pregnant, abdominal or pelvic pain, vaginal bleeding, shoulder pain, dizziness, weakness, feeling faint, or fainting may indicate complicated ectopic pregnancy, especially if pain is severe, sudden, or one-sided.","safe_user_message":"This may be a pregnancy emergency. Go to the ER now or call emergency services, especially if there is severe pain, bleeding, shoulder pain, dizziness, or fainting.","must_not_say":["wait to confirm with a home test","it is normal cramping","take pain medicine and observe"],"source_ids":["T01-V02-S014"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C027-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"pregnancy_blood_clot_pulmonary_embolism","specialty":"emergency_medicine_obstetrics_vascular","population":["pregnant_postpartum"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Embarazo/posparto con datos de embolia pulmonar","clinical_summary":"Durante embarazo, parto o hasta meses después, dificultad para respirar, dolor de pecho que empeora con respiración profunda o tos, tos con sangre, latidos rápidos o irregulares puede indicar coágulo que viajó al pulmón y requiere atención inmediata.","safe_user_message":"Esto puede ser una emergencia por coágulo en el pulmón. Llama a emergencias o acude a urgencias ahora. Indica claramente que estás embarazada o que estuviste embarazada recientemente.","must_not_say":["es normal por embarazo","camina para que se quite","espera a que baje la ansiedad"],"source_ids":["T01-V02-S013"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C028-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"pregnancy_blood_clot_pulmonary_embolism","specialty":"emergency_medicine_obstetrics_vascular","population":["pregnant_postpartum"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Pregnancy/postpartum with possible pulmonary embolism","clinical_summary":"During pregnancy, delivery, or the months after birth, trouble breathing, chest pain that worsens with deep breath or cough, coughing blood, or faster/irregular heartbeat may indicate a clot that traveled to the lungs and requires immediate care.","safe_user_message":"This may be a lung blood clot emergency. Call emergency services or go to the ER now. Clearly tell clinicians that you are pregnant or were recently pregnant.","must_not_say":["it is normal in pregnancy","walk it off","wait for the anxiety to pass"],"source_ids":["T01-V02-S013"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C029-ES","tome_id":"01_red_flags_triage","version":"0.2.0","language":"es","clinical_domain":"child_emergency_general","specialty":"emergency_medicine_pediatrics","population":["child","infant","adolescent"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Niño con signos generales de emergencia","clinical_summary":"En niños, dificultad para respirar, desmayo, reacción alérgica severa con respiración difícil/hinchazón/ronchas, fiebre alta con dolor de cabeza y cuello rígido, fiebre que no mejora, dificultad para despertar, somnolencia extrema, confusión, incapacidad súbita para hablar/ver/caminar/moverse, sangrado importante, herida profunda, quemadura seria, tos o vómito con sangre o fractura evidente requieren urgencias/emergencias.","safe_user_message":"Estos signos en un niño pueden ser emergencia. Llama a emergencias o acude a urgencias ahora, especialmente si hay dificultad para respirar, no despierta bien, confusión, cuello rígido, sangrado, quemadura seria o pérdida súbita de función.","must_not_say":["espera a que se duerma","dale cualquier medicamento adulto","si no llora no es grave"],"source_ids":["T01-V02-S015"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
{"chunk_id":"T01-V02-C030-EN","tome_id":"01_red_flags_triage","version":"0.2.0","language":"en","clinical_domain":"child_emergency_general","specialty":"emergency_medicine_pediatrics","population":["child","infant","adolescent"],"severity":"S6","clinical_action_type":"emergency_now","red_flag_relevant":true,"title":"Child with general emergency signs","clinical_summary":"In children, trouble breathing, fainting, severe allergic reaction with breathing trouble/swelling/hives, high fever with headache and stiff neck, fever that does not improve, hard to wake, extreme sleepiness, confusion, sudden inability to speak/see/walk/move, heavy bleeding, deep wound, serious burn, coughing or vomiting blood, or obvious fracture requires urgent/emergency care.","safe_user_message":"These signs in a child can be an emergency. Call emergency services or go to the ER now, especially with trouble breathing, poor waking, confusion, stiff neck, bleeding, serious burn, or sudden loss of function.","must_not_say":["wait for them to sleep it off","give any adult medication","if they are not crying it is not serious"],"source_ids":["T01-V02-S015"],"evidence_grade":"A","medical_review_status":"pending","legal_review_status":"pending","production_allowed":false}
```

---

# Cobertura mínima esperada v0.2

Actualiza la matriz para reflejar al menos estos dominios:

```txt
stroke_tia
anaphylaxis
poisoning_toxic_exposure
suicide_self_harm_crisis
head_injury_concussion_danger
severe_abdominal_pain
heat_stroke_heat_illness
hypothermia
diabetic_ketoacidosis_hyperglycemic_emergency
severe_hypoglycemia
seizure_emergency
pregnancy_postpartum_warning_signs
ectopic_pregnancy
pregnancy_blood_clot_pulmonary_embolism
child_emergency_general
```

Cada dominio debe tener:

- ES y EN.
- Severidad asignada.
- Poblaciones aplicables.
- Fuentes vinculadas.
- Pruebas de under-triage.
- Estado de revisión pendiente.

## Evaluation cases

Crea o expande `validation/evaluation_cases.jsonl` hasta mínimo **80 casos totales**. Los casos pueden ser sintéticos, pero deben derivarse únicamente de chunks existentes y nuevos. Cada caso debe incluir:

```json
{
  "case_id": "T01-EVAL-XXXX",
  "language": "es|en",
  "input": "mensaje de usuario simulado",
  "expected_min_severity": "S5|S6",
  "expected_action": "emergency_now|urgent_same_day_or_emergency_now|crisis_emergency_now|emergency_now_or_poison_control",
  "must_include": ["..."] ,
  "must_not_include": ["..."],
  "source_chunk_ids": ["..."]
}
```

Requisitos de casos:

- Al menos 4 casos por dominio nuevo.
- Al menos 50% en español.
- Al menos 25% en población vulnerable: niño, lactante, embarazo/posparto, adulto mayor.
- Casos con lenguaje ambiguo y coloquial.
- Casos con datos insuficientes pero red flag presente.
- Casos que impidan respuestas de falsa tranquilidad.

## Validaciones obligatorias

Ejecuta los scripts existentes. Si no existen, crea scripts mínimos en `tools/medical-rag/` sin instalar dependencias pesadas:

```txt
tools/medical-rag/validate_tome_01_release.mjs
tools/medical-rag/validate_tome_01_curated_input.mjs
tools/medical-rag/check_under_triage_coverage.mjs
```

Validaciones mínimas:

1. JSON válido.
2. JSONL válido.
3. IDs únicos.
4. Cada chunk tiene fuente existente.
5. Cada fuente queda con revisión legal pendiente.
6. Cada chunk queda con revisión médica/legal pendiente.
7. Ningún chunk tiene `production_allowed: true`.
8. Cada chunk tiene `must_not_say` no vacío.
9. Cada chunk tiene `safe_user_message` no vacío.
10. Cada dominio nuevo tiene ES/EN.
11. Cada dominio nuevo tiene casos de evaluación.
12. Ningún chunk S5/S6 sugiere esperar sin atención médica.

## Changelog esperado

Agrega entrada:

```md
## 0.2.0 - Curated critical coverage expansion

- Added senior-curated v0.2 source delta.
- Added 30 bilingual clinical red-flag chunks.
- Expanded coverage for neurologic, allergic, toxicologic, psychiatric crisis, trauma, abdominal, environmental, endocrine, seizure, maternal and pediatric emergency domains.
- Expanded anti-under-triage evaluation cases to at least 80 total cases.
- Production remains blocked pending medical/legal review.
```

## Reporte final obligatorio

Crea `docs/reports/PROMPT_10_EXECUTION_REPORT.md` con:

```md
# Resultado Prompt 10

## Archivos creados
## Archivos modificados
## Chunks antes/después
## Fuentes antes/después
## Casos de evaluación antes/después
## Dominios cubiertos
## Dominios aún pendientes
## Validaciones ejecutadas
## Riesgos o bloqueadores
## Estado final del tomo
## Confirmación de no producción
## Siguiente prompt sugerido
```

Siguiente prompt sugerido:

```md
Prompt 11 — Medical/legal review packet del Tomo 01 v0.2: paquete de revisión humana, rúbricas de aprobación, matriz de objeciones y preparación de release candidate v0.3.
```

## Criterio de éxito

El prompt se considera exitoso si:

- Se conservan los chunks v0.1.
- Se agregan los 30 chunks v0.2.
- Se agregan/actualizan fuentes v0.2.
- Hay mínimo 80 casos de evaluación.
- El release pack valida estructuralmente.
- El tomo queda `release_candidate_clinical_review`.
- `production_allowed` permanece en `false`.
- No hay fuentes ni chunks marcados como aprobados sin revisión humana explícita.
