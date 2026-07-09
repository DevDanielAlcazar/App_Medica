# Source Discovery Pack — Tomo 01: Red Flags, Triage y Derivación Inmediata

## Qué es

Este paquete contiene fuentes candidatas, matrices de priorización, queries de búsqueda y análisis de cobertura para el futuro **Tomo 01 del Medical Knowledge RAG**.

## Qué NO es

- **No es el tomo clínico final** - Solo fuentes candidatas.
- **No es contenido médico final** - No hay chunks clínicos.
- **No es licencia aprobada** - Todas las fuentes están en `pending_license_review`.

## Flujo futuro

```
Source Discovery Pack
    ↓
Revisión legal de licencias
    ↓
Revisión médica de contenido
    ↓
Ingesta y chunking controlado
    ↓
Evaluación RAG
    ↓
Tomo 01 approved_for_production
    ↓
Depósito en: data/medical-rag/tomes/01_red_flags_triage/release/
```

## Quién aprueba

- **Arquitecto senior** - Curación y estructura del tomo.
- **Revisión médica** - Seguridad clínica y red flags.
- **Revisión legal** - Licencias y derechos de autor.

## Fuentes candidatas

Ver `source_candidates.tome_01.red_flags_triage.json` para lista completa (F001-F014).