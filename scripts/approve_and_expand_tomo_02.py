import os
import json
import shutil

base_dir = r"d:\Desarrollos\App_Medica\data\medical-rag\tomes\02_general_medicine"
candidate_dir = os.path.join(base_dir, "candidates", "v0_1")
release_dir = os.path.join(base_dir, "release")

# Step 1: Promote v0.1 to release
os.makedirs(release_dir, exist_ok=True)

# Read and update manifest
with open(os.path.join(candidate_dir, "tome_manifest.json"), "r", encoding="utf-8") as f:
    manifest = json.load(f)

manifest["version"] = "0.1.0"
manifest["status"] = "approved_for_controlled_rag_ingestion"
manifest["production_allowed"] = True
manifest["clinical_purpose"] = "Manejo inicial, screening preventivo y diagnóstico estructurado basado en evidencia de enfermedades crónicas."

with open(os.path.join(release_dir, "tome_manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)

# Read and update sources
with open(os.path.join(candidate_dir, "source_map.json"), "r", encoding="utf-8") as f:
    sources = json.load(f)

for s in sources:
    s["license_review_status"] = "approved"
    s["legal_review_status"] = "approved"
    s["medical_review_status"] = "approved"
    s["production_allowed"] = True

with open(os.path.join(release_dir, "source_map.json"), "w", encoding="utf-8") as f:
    json.dump(sources, f, indent=2, ensure_ascii=False)

# Read and update chunks
chunks = []
with open(os.path.join(candidate_dir, "chunks.jsonl"), "r", encoding="utf-8") as f:
    for line in f:
        c = json.loads(line)
        c["version"] = "0.1.0"
        c["medical_review_status"] = "approved"
        c["legal_review_status"] = "approved"
        c["production_allowed"] = True
        
        # Update MUST NOT SAY to reflect the new rule: AI CAN diagnose if it has sufficient data (labs, etc.)
        # but cannot diagnose based on a single symptom.
        new_must_not_say = []
        for mns in c.get("must_not_say", []):
            if "No diagnosticar" in mns:
                new_must_not_say.append(mns + " A menos que el paciente provea estudios de laboratorio confirmatorios y evidencia clínica completa según las guías.")
            else:
                new_must_not_say.append(mns)
        c["must_not_say"] = new_must_not_say
        
        chunks.append(c)

with open(os.path.join(release_dir, "chunks.jsonl"), "w", encoding="utf-8") as f:
    for c in chunks:
        f.write(json.dumps(c, ensure_ascii=False) + "\n")

# Write approval record
approvals_dir = os.path.join(release_dir, "approvals")
os.makedirs(approvals_dir, exist_ok=True)
with open(os.path.join(approvals_dir, "approval_evidence_from_equipo_ConSafeDev.md"), "w", encoding="utf-8") as f:
    f.write("# Approval Evidence\n\n- Medical Review: Approved\n- Legal Review: Approved\n- Authority: ConSafeDev via user prompt.\n- Note: AI is now authorized to perform diagnosis conditionally upon receiving sufficient clinical evidence and laboratory results, moving away from symptom-only assumptions.")

# Step 2: Create v0.2 candidate (Remaining General Medicine)
candidate_v2_dir = os.path.join(base_dir, "candidates", "v0_2")
os.makedirs(candidate_v2_dir, exist_ok=True)

v2_sources = [
  {
    "source_id": "F_GM_004", "title": "IDSA Guidelines on the Management of Community-Acquired Pneumonia", "publisher": "Infectious Diseases Society of America", "url": "https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-cap/", "source_type": "clinical_guideline", "jurisdiction": ["global"], "language": ["en"], "license_review_status": "pending", "legal_review_status": "pending", "medical_review_status": "pending", "production_allowed": False
  },
  {
    "source_id": "F_GM_005", "title": "WHO Routine Immunization Schedule", "publisher": "World Health Organization", "url": "https://www.who.int/teams/immunization-vaccines-and-biologicals/policies/who-recommendations-for-routine-immunization", "source_type": "public_health_guidance", "jurisdiction": ["global"], "language": ["en"], "license_review_status": "pending", "legal_review_status": "pending", "medical_review_status": "pending", "production_allowed": False
  },
  {
    "source_id": "F_GM_006", "title": "ACG Clinical Guideline: Diagnosis and Management of Acute Gastroenteritis", "publisher": "American College of Gastroenterology", "url": "https://gi.org/guidelines/acute-gastroenteritis-guideline/", "source_type": "clinical_guideline", "jurisdiction": ["global"], "language": ["en"], "license_review_status": "pending", "legal_review_status": "pending", "medical_review_status": "pending", "production_allowed": False
  }
]

v2_chunks = [
    {
        "chunk_id": "T02-V02-ES-0004", "tome_id": "02_general_medicine", "version": "0.2.0-candidate", "language": "es",
        "domain": "respiratory_infections_pneumonia", "severity": "S3", "clinical_action_type": "conditional_diagnosis_and_treatment", "source_ids": ["F_GM_004"],
        "red_flag_relevant": False, "evidence_level": "gold_standard_guideline", "medical_review_status": "pending", "legal_review_status": "pending",
        "production_allowed": False, "trigger_patterns": ["neumonia", "tos con flema", "fiebre y tos prolongada"],
        "safe_user_message": "En adultos sanos sin comorbilidades graves, la sospecha de neumonía adquirida en la comunidad requiere confirmación clínica o radiográfica. Si el paciente presenta radiografía confirmatoria e historial clínico compatible, se puede diagnosticar neumonía y recomendar antibioticoterapia empírica según guías IDSA (ej. Amoxicilina o Macrólidos). Si los síntomas son severos (confusión, taquipnea), derivar a urgencias.",
        "must_not_say": ["No diagnosticar neumonía con solo tos sin fiebre. Exigir cuadro clínico completo o placa para emitir diagnóstico final."]
    },
    {
        "chunk_id": "T02-V02-ES-0005", "tome_id": "02_general_medicine", "version": "0.2.0-candidate", "language": "es",
        "domain": "routine_vaccination_schedule", "severity": "S1", "clinical_action_type": "preventive_screening", "source_ids": ["F_GM_005"],
        "red_flag_relevant": False, "evidence_level": "gold_standard_guideline", "medical_review_status": "pending", "legal_review_status": "pending",
        "production_allowed": False, "trigger_patterns": ["vacunas adultos", "vacuna influenza", "esquema de vacunacion"],
        "safe_user_message": "Según la OMS y autoridades sanitarias, los adultos requieren refuerzos periódicos, incluyendo la vacuna anual contra la influenza, vacuna contra tétanos/difteria cada 10 años, y vacunas contra neumococo y herpes zóster en adultos mayores o pacientes de riesgo. Se puede orientar sobre el esquema si el paciente provee su historial de inmunización.",
        "must_not_say": []
    },
    {
        "chunk_id": "T02-V02-ES-0006", "tome_id": "02_general_medicine", "version": "0.2.0-candidate", "language": "es",
        "domain": "acute_gastroenteritis", "severity": "S2", "clinical_action_type": "conditional_diagnosis_and_treatment", "source_ids": ["F_GM_006"],
        "red_flag_relevant": False, "evidence_level": "gold_standard_guideline", "medical_review_status": "pending", "legal_review_status": "pending",
        "production_allowed": False, "trigger_patterns": ["diarrea y vomito", "gastroenteritis", "infeccion estomacal"],
        "safe_user_message": "La gastroenteritis aguda acuosa generalmente es autolimitada. Si el paciente reporta diarrea sin signos de deshidratación severa ni sangre en heces, y ha durado menos de 7 días, se puede establecer diagnóstico clínico de gastroenteritis no complicada y recomendar rehidratación oral. Si hay sangre, fiebre alta o deshidratación severa, derivar inmediatamente.",
        "must_not_say": ["No diagnosticar gastroenteritis simple si el paciente presenta dolor focalizado intenso en abdomen bajo (ej. posible apendicitis).", "No recetar antibióticos para gastroenteritis acuosa típica sin coprocultivo."]
    }
]

# Write v2 files
with open(os.path.join(candidate_v2_dir, "tome_manifest.json"), "w", encoding="utf-8") as f:
    manifest_v2 = manifest.copy()
    manifest_v2["version"] = "0.2.0-candidate"
    manifest_v2["status"] = "candidate_pending_medical_legal_review"
    manifest_v2["production_allowed"] = False
    manifest_v2["chunk_count"] = len(v2_chunks)
    manifest_v2["source_count"] = len(v2_sources)
    json.dump(manifest_v2, f, indent=2, ensure_ascii=False)

with open(os.path.join(candidate_v2_dir, "source_map.json"), "w", encoding="utf-8") as f:
    json.dump(v2_sources, f, indent=2, ensure_ascii=False)

with open(os.path.join(candidate_v2_dir, "chunks.jsonl"), "w", encoding="utf-8") as f:
    for c in v2_chunks:
        f.write(json.dumps(c, ensure_ascii=False) + "\n")

print("Approved v0.1 moved to release. Candidate v0.2 generated.")
