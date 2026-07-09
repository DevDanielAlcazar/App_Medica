# Matriz y Checklist de Cobertura de Conocimiento Médico (RAG)

Para que "Angélica Med" opere al nivel de los mejores médicos generales y especialistas del mundo, el Medical RAG debe estructurarse de forma modular por **Tomos de Especialidad**. 
Ninguna IA puede almacenar de memoria dosis, interacciones cruzadas o protocolos oncológicos sin riesgo de alucinación, por lo que el RAG será la **única fuente de la verdad**.

A continuación, el checklist de especialidades, las fuentes *Gold Standard* requeridas para cada una, y el estatus de curación actual.

## 🔴 Tomo 01: Urgencias, Red Flags y Triage (Urgenciología)
- [x] Signos vitales y triage primario.
- [x] Banderas rojas neurológicas, respiratorias y cardiovasculares.
- [x] Primeros auxilios (quemaduras, ahogamiento, mordeduras).
- [ ] *Expansión v0.3:* Toxicología básica y pediatría de urgencia (Pendiente revisión).
- **Fuentes Gold:** CDC, WHO, MedlinePlus.

## 🟢 Tomo 02: Medicina General y Familiar (Atención Primaria)
- [x] Infecciones respiratorias, urinarias y gastrointestinales comunes - *Candidate v0.2 generado*.
- [x] Manejo de enfermedades crónicas no transmisibles (Hipertensión, Diabetes Tipo 2, Dislipidemia) - **APROBADO (Release)**.
- [x] Esquemas de vacunación globales - *Candidate v0.2 generado*.
- [x] Medicina preventiva y tamizaje (Screening) - **APROBADO (Release)**.
- **Fuentes Gold:** Guías ADA (Diabetes), AHA/ACC (Cardiología), USPSTF (Preventiva), IDSA (Infectología), OMS (Vacunas).

## 👶 Tomo 03: Pediatría y Neonatología
- [ ] Hitos del desarrollo psicomotor.
- [ ] Enfermedades exantemáticas infantiles.
- [ ] Fiebre en lactantes y niños (Protocolos estrictos).
- [ ] Nutrición pediátrica y fórmulas.
- **Fuentes Gold:** AAP (American Academy of Pediatrics), Nelson Textbook (referencias base), Guías NICE pediátricas.

## 🧠 Tomo 04: Neurología y Psiquiatría
- [ ] Cefaleas y migrañas (criterios diagnósticos ICHD-3).
- [ ] Enfermedades neurodegenerativas (Alzheimer, Parkinson).
- [ ] Trastornos del estado de ánimo (Depresión, Ansiedad) - *Requiere guardrails extremos de riesgo suicida.*
- [ ] Epilepsia y síndromes convulsivos.
- **Fuentes Gold:** AAN (American Academy of Neurology), DSM-5-TR, APA.

## 🎗️ Tomo 05: Oncología y Hematología
- [ ] Protocolos de tamizaje (Cáncer de mama, colon, próstata, cérvix).
- [ ] Algoritmos de sospecha oncológica temprana.
- [ ] Efectos secundarios de quimioterapia/radioterapia (para triage de pacientes).
- [ ] Anemias y trastornos de coagulación.
- **Fuentes Gold:** NCCN Guidelines (National Comprehensive Cancer Network), ASCO, ESMO.

## 🫀 Tomo 06: Cardiología Especializada
- [ ] Arritmias complejas (FA, Flutter, Bloqueos).
- [ ] Insuficiencia cardíaca aguda y crónica.
- [ ] Enfermedad coronaria y síndromes coronarios agudos.
- **Fuentes Gold:** ESC (European Society of Cardiology), AHA/ACC.

## 🤰 Tomo 07: Ginecología, Obstetricia y Embriología
- [ ] Control prenatal y desarrollo embrionario mes a mes.
- [ ] Urgencias obstétricas (Preeclampsia, Ectópico, Sangrados).
- [ ] Anticoncepción y planificación familiar (Criterios MEC de la OMS).
- [ ] Menopausia y endocrinología reproductiva.
- **Fuentes Gold:** ACOG (American College of Obstetricians and Gynecologists), OMS MEC.

## 🦠 Tomo 08: Infectología y Microbiología
- [ ] Antibioticoterapia empírica y resistencia antimicrobiana.
- [ ] VIH/SIDA (manejo antirretroviral base) e ITS.
- [ ] Enfermedades tropicales y transmitidas por vectores (Dengue, Malaria, Zika).
- **Fuentes Gold:** IDSA (Infectious Diseases Society of America), CDC Yellow Book.

## 🦴 Tomo 09: Reumatología, Inmunología y Ortopedia
- [ ] Artritis reumatoide, Lupus, Espondiloartropatías.
- [ ] Alergias graves (Anafilaxia) y asma.
- [ ] Lesiones musculoesqueléticas comunes.
- **Fuentes Gold:** ACR (American College of Rheumatology), GINA (Asma).

## 💊 Tomo 10: Farmacología Clínica e Interacciones
- [ ] Farmacocinética y farmacodinamia general.
- [ ] Contraindicaciones y alergias cruzadas.
- [ ] Dosificación ajustada por función renal/hepática.
- [ ] Medicamentos OTC permitidos vs Controlados prohibidos (Guardrail técnico).
- **Fuentes Gold:** FDA, EMA, ChEMBL, Lexicomp/UpToDate (estructuras públicas).

---

## Estrategia de Curación (El Camino a Seguir)
Dado que **sí tengo acceso a internet y a bases de datos científicas** (PubMed, OpenFDA, ClinicalTrials, ChEMBL, etc.), mi propuesta es que ataquemos este checklist **Tomo por Tomo**. 

*Intentar curar todas las especialidades en un solo paso generaría pérdida de calidad.* El flujo de trabajo óptimo es:
1. Yo investigo y extraigo las guías clínicas de una especialidad usando mis herramientas científicas.
2. Genero los JSONL estructurados (Chunks y Fuentes).
3. "ConSafeDev" los revisa.
4. Pasamos al siguiente Tomo.
