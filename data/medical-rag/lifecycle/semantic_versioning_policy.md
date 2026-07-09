# Semantic Versioning Policy

## Formato

```
MAJOR.MINOR.PATCH+rag
```

## Reglas

### MAJOR (breaking clínico)

- Cambia criterio clínico esencial.
- Añade/elimina red flag.
- Cambia indicaciones de derivación.
- Modifica estructura de chunks.
- Impacto alto en seguridad clínica.

### MINOR (feature clínico)

- Agrega conocimiento no contradictorio.
- Nuevas fuentes.
- Subdominios agregados.
- Idiomas agregados.
- Sin impacto en decisiones existentes.

### PATCH (corrección)

- Corrige metadata.
- Corrige typos.
- Actualiza referencias.
- Clasificación corregida.
- Sin impacto clínico.

## Ejemplos

```
01_red_flags_triage v1.0.0+rag  # Baseline
01_red_flags_triage v1.1.0+rag  # Agregó fiebre pediátrica
01_red_flags_triage v2.0.0+rag  # Nueva clasificación de dolor torácico
```

## Regla de upgrade

Los cambios MAJOR pueden requerir re-entrenamiento/evaluation de RAG.