import os
import json

base_dir = r"d:\Desarrollos\App_Medica\data\medical-rag\tomes\02_general_medicine"
candidates_dir = os.path.join(base_dir, "candidates", "v0_1")

os.makedirs(candidates_dir, exist_ok=True)

manifest = {
  "tome_id": "02_general_medicine",
  "title": "Medicina General y Atención Primaria",
  "version": "0.1.0-candidate",
  "status": "candidate_pending_medical_legal_review",
  "clinical_purpose": "Manejo inicial y screening de enfermedades crónicas no transmisibles comunes.",
  "production_allowed": False,
  "requires_medical_review": True,
  "requires_legal_review": True,
  "supported_languages": ["es", "en"],
  "chunk_count": 6,
  "source_count": 3
}

sources = [
  {
    "source_id": "F_GM_001",
    "title": "ADA Standards of Care in Diabetes—2024",
    "publisher": "American Diabetes Association",
    "url": "https://diabetesjournals.org/care/issue/47/Supplement_1",
    "source_type": "clinical_guideline",
    "jurisdiction": ["global", "us"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": False
  },
  {
    "source_id": "F_GM_002",
    "title": "2017 ACC/AHA Guideline for High Blood Pressure in Adults",
    "publisher": "American College of Cardiology / American Heart Association",
    "url": "https://www.acc.org/latest-in-cardiology/ten-points-to-remember/2017/11/09/11/41/2017-guideline-for-high-blood-pressure-in-adults",
    "source_type": "clinical_guideline",
    "jurisdiction": ["global", "us"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": False
  },
  {
    "source_id": "F_GM_003",
    "title": "USPSTF - Colorectal Cancer: Screening",
    "publisher": "US Preventive Services Task Force",
    "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening",
    "source_type": "clinical_guideline",
    "jurisdiction": ["us", "latam_reference"],
    "language": ["en"],
    "license_review_status": "pending",
    "legal_review_status": "pending",
    "medical_review_status": "pending",
    "production_allowed": False
  }
]

chunks = [
    {
        "chunk_id": "T02-V01-ES-0001", "tome_id": "02_general_medicine", "version": "0.1.0-candidate", "language": "es",
        "domain": "diabetes_type_2_screening", "severity": "S1", "clinical_action_type": "preventive_screening", "source_ids": ["F_GM_001"],
        "red_flag_relevant": False, "evidence_level": "gold_standard_guideline", "medical_review_status": "pending", "legal_review_status": "pending",
        "production_allowed": False, "trigger_patterns": ["tamizaje diabetes", "prueba de azucar", "cuando hacerme prueba diabetes", "screening diabetes"],
        "safe_user_message": "Según la ADA (2024), se recomienda el tamizaje de prediabetes y diabetes tipo 2 en adultos asintomáticos a partir de los 35 años. Si los resultados son normales, se debe repetir al menos cada 3 años. Personas con sobrepeso u obesidad y un factor de riesgo adicional deben someterse a pruebas antes de los 35 años.",
        "must_not_say": ["No diagnosticar diabetes basándose en síntomas reportados por chat. Indicar siempre prueba de laboratorio en ayuno o HbA1c."]
    },
    {
        "chunk_id": "T02-V01-EN-0001", "tome_id": "02_general_medicine", "version": "0.1.0-candidate", "language": "en",
        "domain": "diabetes_type_2_screening", "severity": "S1", "clinical_action_type": "preventive_screening", "source_ids": ["F_GM_001"],
        "red_flag_relevant": False, "evidence_level": "gold_standard_guideline", "medical_review_status": "pending", "legal_review_status": "pending",
        "production_allowed": False, "trigger_patterns": ["diabetes screening", "sugar test", "when to test for diabetes"],
        "safe_user_message": "Per ADA (2024) guidelines, screening for prediabetes and type 2 diabetes is recommended in asymptomatic adults starting at age 35. If normal, repeat screening at least every 3 years. Adults with overweight/obesity and one or more additional risk factors should be screened earlier.",
        "must_not_say": ["Do not diagnose diabetes over chat based on reported symptoms. Always advise formal fasting glucose or HbA1c tests."]
    },
    {
        "chunk_id": "T02-V01-ES-0002", "tome_id": "02_general_medicine", "version": "0.1.0-candidate", "language": "es",
        "domain": "hypertension_classification", "severity": "S2", "clinical_action_type": "medical_evaluation", "source_ids": ["F_GM_002"],
        "red_flag_relevant": False, "evidence_level": "gold_standard_guideline", "medical_review_status": "pending", "legal_review_status": "pending",
        "production_allowed": False, "trigger_patterns": ["presion alta", "130/80", "140/90", "hipertension", "presion arterial anormal"],
        "safe_user_message": "Según las guías ACC/AHA, la presión arterial normal es menor a 120/80 mmHg. Una presión sistólica de 130 a 139 mmHg o diastólica de 80 a 89 mmHg se considera Hipertensión Etapa 1. Es necesario acudir al médico para una evaluación clínica integral y confirmación antes de iniciar cualquier tratamiento.",
        "must_not_say": ["No prescribir antihipertensivos. No ajustar dosis de medicamentos existentes. No diagnosticar hipertensión con una sola lectura aislada reportada por el usuario."]
    },
    {
        "chunk_id": "T02-V01-EN-0002", "tome_id": "02_general_medicine", "version": "0.1.0-candidate", "language": "en",
        "domain": "hypertension_classification", "severity": "S2", "clinical_action_type": "medical_evaluation", "source_ids": ["F_GM_002"],
        "red_flag_relevant": False, "evidence_level": "gold_standard_guideline", "medical_review_status": "pending", "legal_review_status": "pending",
        "production_allowed": False, "trigger_patterns": ["high blood pressure", "130/80", "140/90", "hypertension", "abnormal blood pressure"],
        "safe_user_message": "According to ACC/AHA guidelines, normal blood pressure is less than 120/80 mmHg. A systolic pressure of 130-139 mmHg or diastolic of 80-89 mmHg is considered Stage 1 Hypertension. You should visit a doctor for a comprehensive evaluation and confirmation before starting any treatment.",
        "must_not_say": ["Do not prescribe antihypertensives. Do not adjust existing medication doses. Do not diagnose hypertension from a single user-reported reading."]
    },
    {
        "chunk_id": "T02-V01-ES-0003", "tome_id": "02_general_medicine", "version": "0.1.0-candidate", "language": "es",
        "domain": "colorectal_cancer_screening", "severity": "S1", "clinical_action_type": "preventive_screening", "source_ids": ["F_GM_003"],
        "red_flag_relevant": False, "evidence_level": "gold_standard_guideline", "medical_review_status": "pending", "legal_review_status": "pending",
        "production_allowed": False, "trigger_patterns": ["colonoscopia", "cancer de colon", "tamizaje colon", "sangre oculta en heces", "a que edad colonoscopia"],
        "safe_user_message": "La USPSTF recomienda que los adultos comiencen las pruebas de detección de cáncer colorrectal a los 45 años y continúen hasta los 75 años. Esto puede incluir pruebas basadas en heces (como sangre oculta) o exámenes visuales (como colonoscopia). Las personas con antecedentes familiares pueden necesitar empezar antes.",
        "must_not_say": ["No retrasar la recomendación de colonoscopia si el paciente reporta sangrado rectal activo; en ese caso debe escalarse como Red Flag (Tomo 01)."]
    },
    {
        "chunk_id": "T02-V01-EN-0003", "tome_id": "02_general_medicine", "version": "0.1.0-candidate", "language": "en",
        "domain": "colorectal_cancer_screening", "severity": "S1", "clinical_action_type": "preventive_screening", "source_ids": ["F_GM_003"],
        "red_flag_relevant": False, "evidence_level": "gold_standard_guideline", "medical_review_status": "pending", "legal_review_status": "pending",
        "production_allowed": False, "trigger_patterns": ["colonoscopy", "colon cancer", "colon screening", "fecal occult blood", "what age colonoscopy"],
        "safe_user_message": "The USPSTF recommends adults start screening for colorectal cancer at age 45 and continue until age 75. This can include stool-based tests or visual exams (like colonoscopy). Individuals with a family history may need to start earlier.",
        "must_not_say": ["Do not delay colonoscopy recommendation if patient reports active rectal bleeding; this must be escalated as a Red Flag (Tome 01)."]
    }
]

with open(os.path.join(candidates_dir, "tome_manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

with open(os.path.join(candidates_dir, "source_map.json"), "w", encoding="utf-8") as f:
    json.dump(sources, f, indent=2, ensure_ascii=False)

with open(os.path.join(candidates_dir, "chunks.jsonl"), "w", encoding="utf-8") as f:
    for c in chunks:
        f.write(json.dumps(c, ensure_ascii=False) + "\n")

print(f"Tomo 02 generated in {candidates_dir}")
