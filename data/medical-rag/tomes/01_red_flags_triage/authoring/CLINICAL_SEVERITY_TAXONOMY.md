# Clinical Severity Taxonomy — Tomo 01

## Niveles de severidad

| Nivel | Nombre | Descripción | Recomendación sintomatológica | Requiere médico humano | Requiere urgencias | Must block self-care | Disclaimer |
|-------|--------|-------------|------------------------------|----------------------|------------------|---------------------|------------|
| S0 | INFORMATIONAL | Información general sin urgencia | ✅ | ❌ | ❌ | ❌ | Ligero |
| S1 | SELF_CARE_OR_MONITOR | Se puede observar, autogestión | ✅ | ❌ | ❌ | ❌ | Ligero |
| S2 | SCHEDULE_MEDICAL_VISIT | Agendar cita pronto | ✅* | ✅ | ❌ | ❌ | Medio |
| S3 | PROMPT_MEDICAL_VISIT | Consulta médica pronta | ❌ | ✅ | ❌ | ❌ | Medio |
| S4 | URGENT_CARE | Atención médica hoy | ❌ | ✅ | ✅ | ❌ | Alto |
| S5 | EMERGENCY_NOW | Emergencia inmediata | ❌ | ✅ | ✅ | ✅ | Alto |
| S6 | CALL_EMERGENCY_SERVICES | Llamar servicios de emergencia | ❌ | ✅ | ✅ | ✅ | Crítico |

## Regla de conflicto

```
Si existe conflicto entre chunks: prevalece el nivel MÁS ALTO.
```

## Aplicación por dominio

- D01 (dolor torácico): S4-S6 según síntomas.
- D02 (disnea): S4-S6 según severidad.
- D07 (anafilaxia): S5-S6.
- D09 (fiebre pediátrica): S3-S6 según edad.
- D21 (suicidio): S5-S6.

## Mensajes por nivel

| Nivel | Mensaje ejemplo |
|-------|-----------------|
| S0 | "Esta información es educativa..." |
| S2 | "Le recomendamos agendar cita..." |
| S4 | "Este síntoma requiere atención médica hoy." |
| S5 | "Buscar atención médica inmediata." |
| S6 | "Llamar a emergencias ahora." |

## Notas

- S1-S2 permiten recomendación sintomatológica con guardrails.
- S3+ requieren derivación inmediata.
- S5+ bloquean cualquier recomendación de autocuidado.