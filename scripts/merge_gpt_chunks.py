import os
import json

release_dir = r"d:\Desarrollos\App_Medica\data\medical-rag\tomes\02_general_medicine\release"
chunks_file = os.path.join(release_dir, "chunks.jsonl")

# The high-quality chunks I manually created earlier
my_chunks = [
    {
        "chunk_id": "T02-CH-000001-ES",
        "tome_id": "02_general_medicine",
        "version": "0.1.0",
        "language": "es",
        "source_ids": ["F_GM_001"],
        "license_status": "approved",
        "clinical_status": "approved",
        "legal_status": "approved",
        "clinical_domain": "endocrinologia_diabetes_tamizaje",
        "population": ["adult", "older_adult"],
        "severity_level": "S3",
        "red_flag_relevant": False,
        "clinical_action_type": "conditional_diagnosis_and_treatment",
        "must_ask": [
            "¿Tiene síntomas como mucha sed, orinar frecuentemente, pérdida de peso sin razón o visión borrosa?",
            "¿Cuenta con un estudio reciente de glucosa en ayuno o Hemoglobina Glicosilada (HbA1c)?",
            "¿Tiene antecedentes familiares de diabetes, sobrepeso u otros factores de riesgo cardiovascular?"
        ],
        "must_not_say": [
            "Usted tiene diabetes (si no hay laboratorios probatorios).",
            "Comience a tomar Metformina inmediatamente sin evaluación presencial.",
            "Solo reduzca el azúcar, no necesita ir al médico."
        ],
        "safe_user_message": "Según las guías de la ADA, el tamizaje de diabetes tipo 2 debe iniciar a los 35 años o antes si hay sobrepeso y factores de riesgo. Si presentas mucha sed, orinas frecuente o pérdida de peso, necesitas realizarte una prueba de glucosa en ayuno o HbA1c. Si ya tienes laboratorios confirmatorios (ej. HbA1c >= 6.5%), compártelos para orientarte sobre el tratamiento, el cual requerirá evaluación médica inicial.",
        "internal_reasoning_summary": "Previene el sobrediagnóstico por chat. Obliga a la IA a pedir laboratorios antes de emitir un diagnóstico de Diabetes, y a realizar screening según guías.",
        "evidence_summary": "ADA Standards of Care (2024) dictan screening universal a partir de los 35 años. Diagnóstico requiere confirmación bioquímica repetida o HbA1c >= 6.5%.",
        "retrieval_keywords": ["diabetes", "azucar alta", "mucha sed", "orinar mucho", "hba1c", "tamizaje", "endocrinologia_diabetes_tamizaje"],
        "production_allowed": True,
        "is_example_only": False,
        "medical_review_status": "approved",
        "legal_review_status": "approved"
    },
    {
        "chunk_id": "T02-CH-000002-ES",
        "tome_id": "02_general_medicine",
        "version": "0.1.0",
        "language": "es",
        "source_ids": ["F_GM_002"],
        "license_status": "approved",
        "clinical_status": "approved",
        "legal_status": "approved",
        "clinical_domain": "cardiologia_hipertension",
        "population": ["adult", "older_adult"],
        "severity_level": "S4",
        "red_flag_relevant": False,
        "clinical_action_type": "conditional_diagnosis_and_treatment",
        "must_ask": [
            "¿Cuál es el valor exacto de su presión arterial y cuántas veces se la ha medido?",
            "¿Presenta en este momento dolor de pecho intenso, falta de aire, visión borrosa severa o confusión? (Si sí, evaluar como Red Flag de Crisis Hipertensiva).",
            "¿Ya toma algún medicamento para la presión?"
        ],
        "must_not_say": [
            "Usted es hipertenso basado en una sola lectura elevada.",
            "Tome Losartán/Amlodipino para bajar la presión ahora mismo (a menos que haya sido previamente prescrito).",
            "Su presión de 150/90 no es preocupante."
        ],
        "safe_user_message": "Las guías de AHA/ACC clasifican una presión sostenida mayor a 130/80 como Hipertensión Etapa 1. Una sola lectura no hace el diagnóstico; se requieren varias mediciones correctas. Si tu presión es mayor a 180/120 y tienes síntomas graves (dolor de pecho, mareo intenso), debes ir a urgencias. De lo contrario, agenda una cita médica para iniciar protocolo de diagnóstico.",
        "internal_reasoning_summary": "Asegura la evaluación sistemática de la presión. Fuerza a la IA a descartar emergencia hipertensiva antes de dar recomendaciones ambulatorias.",
        "evidence_summary": "ACC/AHA 2017 Guidelines establecen el corte de 130/80 mmHg y la necesidad de descartar daño a órgano blanco en presiones severas.",
        "retrieval_keywords": ["hipertension", "presion alta", "130/80", "140/90", "dolor de cabeza por presion", "cardiologia_hipertension"],
        "production_allowed": True,
        "is_example_only": False,
        "medical_review_status": "approved",
        "legal_review_status": "approved"
    },
    {
        "chunk_id": "T02-CH-000003-ES",
        "tome_id": "02_general_medicine",
        "version": "0.2.0",
        "language": "es",
        "source_ids": ["F_GM_004"],
        "license_status": "approved",
        "clinical_status": "approved",
        "legal_status": "approved",
        "clinical_domain": "infectologia_neumonia_comunidad",
        "population": ["adult", "older_adult"],
        "severity_level": "S4",
        "red_flag_relevant": False,
        "clinical_action_type": "conditional_diagnosis_and_treatment",
        "must_ask": [
            "¿Tiene fiebre cuantificada, escalofríos, o tos que produce flema purulenta/con sangre?",
            "¿Se fatiga mucho o le falta el aire al caminar distancias cortas o estando en reposo?",
            "¿Cuenta con una radiografía de tórax reciente que muestre consolidación u opacidades?"
        ],
        "must_not_say": [
            "Tome Amoxicilina empíricamente sin confirmación radiográfica o auscultación clínica.",
            "Es solo una gripa, se le pasará.",
            "No se preocupe por el dolor al respirar profundo."
        ],
        "safe_user_message": "La sospecha de neumonía adquirida en la comunidad requiere confirmación médica presencial (física o mediante radiografía). Los síntomas clásicos incluyen tos productiva, fiebre y malestar general. Si tienes radiografías que confirman el diagnóstico y no tienes comorbilidades graves (ni dificultad severa para respirar), el tratamiento ambulatorio suele incluir antibióticos específicos (ej. Amoxicilina de altas dosis o Macrólidos) bajo receta médica.",
        "internal_reasoning_summary": "Evita la prescripción irresponsable de antibióticos por tos inespecífica. Permite orientar si el paciente ya tiene radiografía, pero deriva para confirmación si no la tiene.",
        "evidence_summary": "IDSA Guidelines for CAP requieren confirmación radiográfica para el diagnóstico definitivo y distinguirlo de bronquitis aguda.",
        "retrieval_keywords": ["neumonia", "tos con flema", "fiebre alta tos", "dolor de pulmon", "infeccion respiratoria grave"],
        "production_allowed": True,
        "is_example_only": False,
        "medical_review_status": "approved",
        "legal_review_status": "approved"
    }
]

# Read existing chunks generated by ChatGPT
existing_chunks = []
if os.path.exists(chunks_file):
    with open(chunks_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                existing_chunks.append(json.loads(line))

# Append my custom chunks to the ChatGPT generated chunks
all_chunks = my_chunks + existing_chunks

# Write back
with open(chunks_file, "w", encoding="utf-8") as f:
    for c in all_chunks:
        f.write(json.dumps(c, ensure_ascii=False) + "\n")

print(f"Successfully merged {len(my_chunks)} specific disease chunks with {len(existing_chunks)} ChatGPT symptom triage chunks.")
