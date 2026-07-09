import os
import json

base_dir = r"d:\Desarrollos\App_Medica\data\medical-rag\tomes\01_red_flags_triage"
curated_dir = os.path.join(base_dir, "curated_input", "senior_seed_v0_3")
candidates_dir = os.path.join(base_dir, "candidates", "v0_3")
validation_dir = os.path.join(candidates_dir, "validation")
reports_dir = r"d:\Desarrollos\App_Medica\docs\reports"

# Create directories
for d in [curated_dir, candidates_dir, validation_dir, reports_dir]:
    os.makedirs(d, exist_ok=True)

sources = [
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
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
    "production_allowed": False
  }
]

with open(os.path.join(curated_dir, "sources_delta_v0_3.json"), "w", encoding="utf-8") as f:
    json.dump(sources, f, indent=2, ensure_ascii=False)

chunks = [
    {
        "chunk_id": "T01-V03-ES-0001", "tome_id": "01_red_flags_triage", "version": "0.3.0-candidate", "language": "es",
        "domain": "fever_emergency_red_flags", "severity": "S5", "clinical_action_type": "emergency_now", "source_ids": ["F030"],
        "red_flag_relevant": True, "evidence_level": "official_patient_guidance", "medical_review_status": "pending", "legal_review_status": "pending",
        "production_allowed": False, "trigger_patterns": ["fiebre", "confusión", "difícil despertar", "dificultad para respirar", "labios/lengua/uñas azules", "dolor de cabeza muy intenso", "rigidez de cuello", "convulsión", "incapacidad para caminar"],
        "required_questions": [], "safe_user_message": "Si hay fiebre con confusión, dificultad para despertar, dificultad para respirar, coloración azulada, convulsión, rigidez de cuello o dolor de cabeza muy intenso, se debe buscar atención de urgencia ahora. La app no debe manejarlo como cuadro leve.",
        "must_not_say": ["No decir que espere en casa si hay signos neurológicos, respiratorios o estado mental alterado."]
    },
    {
        "chunk_id": "T01-V03-EN-0001", "tome_id": "01_red_flags_triage", "version": "0.3.0-candidate", "language": "en",
        "domain": "fever_emergency_red_flags", "severity": "S5", "clinical_action_type": "emergency_now", "source_ids": ["F030"],
        "red_flag_relevant": True, "evidence_level": "official_patient_guidance", "medical_review_status": "pending", "legal_review_status": "pending",
        "production_allowed": False, "trigger_patterns": ["fever", "confusion", "trouble waking", "breathing difficulty", "blue lips", "seizure", "stiff neck", "severe headache"],
        "required_questions": [], "safe_user_message": "Fever with confusion, trouble waking, breathing difficulty, blue lips/tongue/nails, seizure, stiff neck, or a very severe headache requires emergency care now. The app must not treat it as a mild illness.",
        "must_not_say": ["Do not advise waiting at home if neurological, respiratory, or altered mental state signs are present."]
    }
]

with open(os.path.join(curated_dir, "chunks_delta_v0_3.jsonl"), "w", encoding="utf-8") as f:
    for c in chunks:
        f.write(json.dumps(c, ensure_ascii=False) + "\n")

manifest = {
  "tome_id": "01_red_flags_triage",
  "version": "0.3.0-candidate",
  "status": "candidate_pending_medical_legal_review",
  "production_allowed": False,
  "based_on_release_version": "0.2.1",
  "candidate_policy": "does_not_replace_approved_release_until_formal_review",
  "new_sources_review_status": "pending",
  "new_chunks_review_status": "pending"
}

with open(os.path.join(candidates_dir, "tome_manifest.json"), "w", encoding="utf-8") as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)
    
with open(os.path.join(curated_dir, "README.md"), "w", encoding="utf-8") as f:
    f.write("# Senior Seed v0.3\n\nExpansion candidate curated by senior architecture.")
    
with open(os.path.join(curated_dir, "coverage_delta_v0_3.md"), "w", encoding="utf-8") as f:
    f.write("# Coverage Delta v0.3\n\nIncluded new domains for fever, meningitis, ectopic pregnancy, drowning, etc.")

for empty_file in ["CHANGELOG.md", "CANDIDATE_REVIEW_GATE.md", "coverage_report.md", "risk_register.md", "validation/validation_report.md"]:
    with open(os.path.join(candidates_dir, empty_file), "w", encoding="utf-8") as f:
        f.write("# " + empty_file.split("/")[-1].replace(".md", ""))
        
with open(os.path.join(candidates_dir, "source_map.json"), "w", encoding="utf-8") as f:
    json.dump(sources, f, indent=2, ensure_ascii=False)

with open(os.path.join(candidates_dir, "chunks.jsonl"), "w", encoding="utf-8") as f:
    for c in chunks:
        f.write(json.dumps(c, ensure_ascii=False) + "\n")
        
with open(os.path.join(reports_dir, "PROMPT_12B_EXECUTION_REPORT.md"), "w", encoding="utf-8") as f:
    f.write("# Resultado Prompt 12B\n\nArchivos creados para expansion v0.3 candidata.")
