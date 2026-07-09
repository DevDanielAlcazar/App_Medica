# Base de Conocimiento para Laguna M.1 (Generador de RAG Médico)

## Objetivo
El objetivo de este documento es servir como matriz de datos para que el modelo Laguna M.1 genere **Chunks de Conocimiento JSONL** de Calidad Gold. 

## Estructura Estricta Obligatoria (Tomo 01 Format)
Cada chunk generado DEBE tener esta estructura exacta. NO omitir ningún campo.

```json
{
  "chunk_id": "T0X-CH-UNIQUEID",
  "tome_id": "02_general_medicine", 
  "version": "0.1.0",
  "language": "es",
  "source_ids": ["F_SRC_001"],
  "clinical_status": "approved",
  "legal_status": "approved",
  "clinical_domain": "ESPECIALIDAD_ENFERMEDAD_FACETA",
  "population": ["adult", "pediatric", "older_adult"],
  "severity_level": "S1 a S6",
  "red_flag_relevant": true/false,
  "clinical_action_type": "emergency_now / conditional_diagnosis_and_treatment / preventive_screening",
  "must_ask": [
    "Pregunta obligatoria 1 para descartar riesgo o confirmar",
    "Pregunta obligatoria 2"
  ],
  "must_not_say": [
    "Cosa peligrosa que la IA no debe asumir ni recetar empíricamente"
  ],
  "safe_user_message": "Respuesta clínica basada en evidencia y guías oficiales. Siempre derivando a diagnóstico médico presencial si no hay estudios de laboratorio.",
  "internal_reasoning_summary": "Por qué este chunk es importante y cómo evita un subtriage o mal diagnóstico.",
  "evidence_summary": "Resumen de la guía (ej. ADA, AHA, AAP, IDSA).",
  "retrieval_keywords": ["keyword1", "keyword2"]
}
```

## Reglas Inquebrantables de Gobernanza Médica
1. **Regla de Diagnóstico Condicionado:** La IA NUNCA diagnosticará basándose en un solo síntoma. Debe exigir estudios o historia clínica completa. Si no los hay, debe decir "La sospecha es X, pero requieres confirmación presencial/laboratorio".
2. **Antibióticos y Medicamentos de Especialidad:** NUNCA recetar empíricamente sin confirmación médica o radiográfica (ej. Amoxicilina, Salbutamol, etc.). Ponerlo en `must_not_say`.
3. **Pediatría (Fiebre):** NUNCA recomendar Aspirina a niños (Síndrome de Reye). Priorizar signos de dificultad respiratoria y deshidratación.

## Matriz de Enfermedades a Desarrollar (Por cada una, crear 10 facetas = 10 chunks)

Las 10 facetas clínicas por enfermedad a generar son:
1. Etiología / Definición
2. Tamizaje / Factores de Riesgo
3. Criterios Diagnósticos (Laboratorio/Imagen)
4. Tratamiento Primera Línea
5. Contraindicaciones
6. Banderas Rojas (Derivación Urgente a Urgencias)
7. Interacciones Medicamentosas graves
8. Pronóstico
9. Población Pediátrica (Variaciones)
10. Población Geriátrica (Variaciones)

### Tomo 02: Medicina General (Lista Top 20 para el primer batch)
1. Diabetes Tipo 2
2. Hipertensión Arterial Esencial
3. Asma Bronquial
4. EPOC
5. Neumonía Adquirida en la Comunidad
6. Reflujo Gastroesofágico (ERGE)
7. Úlcera Péptica
8. Hipotiroidismo
9. Fibrilación Auricular
10. Insuficiencia Cardiaca Congestiva
11. Artritis Reumatoide
12. Osteoartritis
13. Infección del Tracto Urinario
14. Litiasis Renal
15. Depresión Mayor
16. Ansiedad Generalizada
17. Anemia Ferropénica
18. Rinitis Alérgica
19. Lumbalgia Mecánica
20. Dermatitis Atópica

### Tomo 03: Pediatría (Lista Top 20 para el primer batch)
1. Bronquiolitis (VSR)
2. Asma Infantil
3. Otitis Media Aguda
4. Faringoamigdalitis Estreptocócica
5. Gastroenteritis Aguda (Enfoque TRO)
6. Enfermedad Pie-Mano-Boca
7. Varicela
8. Sarampión
9. Crisis Febril Convulsiva
10. Crup (Laringotraqueobronquitis)
11. Infección del Tracto Urinario Infantil
12. Dermatitis del Pañal
13. Cólico del Lactante
14. Anemia en Lactantes
15. Obesidad Infantil
16. TDAH
17. Trastorno del Espectro Autista (Detección temprana)
18. Reflujo Gastroesofágico Fisiológico del Lactante
19. Enfermedad de Kawasaki
20. Rotavirus
