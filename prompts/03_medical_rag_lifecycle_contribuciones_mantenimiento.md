# Prompt 03 — Medical RAG Lifecycle, Contribuciones, Mantenimiento y Escalamiento de Tomos

> **Uso recomendado:** pegar este prompt en OpenCode, AionUI, Antigravity, Gemini CLI o herramienta equivalente.  
> **Repositorio objetivo:** `D:\Desarrollos\App_Medica`  
> **Rol esperado del agente:** Dev Jr / Implementador técnico documental.  
> **Arquitecto responsable:** ChatGPT actuando como arquitecto senior del proyecto.  
> **Modo de trabajo:** crear infraestructura documental y contratos de gobernanza. No crear contenido clínico nuevo, no descargar fuentes médicas y no implementar features de producto.

---

## 0. Selección sugerida de modelo para ejecutar este prompt

### Opción A — Principal: Poolside Laguna M.1
Usa **Laguna M.1** si está disponible en OpenCode/Poolside/OpenRouter. Esta tarea requiere razonamiento de arquitectura documental, control de cambios, governance, contratos de contribución y pensamiento sistémico de largo plazo. Es ideal cuando el agente debe modificar varias carpetas manteniendo consistencia.

### Opción B — Alternativa fuerte: Qwen3 Coder / Qwen Coder de mayor contexto disponible
Usa **Qwen3 Coder** o el Qwen Coder de mayor contexto disponible si Laguna M.1 no está disponible. Es una buena opción para tareas de repositorio, estructura documental, contratos JSON/Markdown y trabajo agentic con múltiples archivos.

### Opción C — Alternativa costo/velocidad: DeepSeek V4 Flash / DeepSeek Flash Free
Usa **DeepSeek V4 Flash** si necesitas velocidad, bajo costo o disponibilidad gratuita. Debe limitarse a crear documentación, plantillas y validaciones; no debe tomar decisiones clínicas ni legales.

### Opción D — Revisión secundaria: Nemotron Ultra / GPT-OSS-120B / modelo Claude-compatible alto contexto
Usa alguno de estos como revisor posterior. Su trabajo será detectar huecos, contradicciones, riesgos de mantenimiento, problemas de compliance, rutas ambiguas o dependencia excesiva de especialistas externos.

**Regla operativa:** si el modelo no soporta suficiente contexto, primero lee estos archivos:

```text
README.md
docs/_PROJECT_CONTEXT_COMPILED.md
data/medical-rag/README.md
data/medical-rag/registry/licensing_policy.md
data/medical-rag/pipeline/metadata_contract.md
data/medical-rag/governance/change_control.md
docs/architecture/MEDICAL_RAG_ARCHITECTURE.md
```

---

## 1. Contexto estratégico

El proyecto App Médica requiere construir un **Medical Knowledge RAG Gold Standard** por tomos. La ambición de calidad es alta: la base debe estar a la altura de un médico general excelente y apoyarse en conocimiento de especialidades, sin caer en una biblioteca caótica, insegura o legalmente riesgosa.

El arquitecto senior generará tomos clínicos curados y versionados. Sin embargo, la arquitectura debe permitir que en el futuro:

1. Un médico especialista contribuya conocimiento validado.
2. Un autor de libro o página otorgue permiso de uso.
3. Una institución autorice el uso de material clínico.
4. Se agreguen nuevos tomos o sub-tomos.
5. Se actualicen tomos existentes por evidencia nueva.
6. Se deprequen chunks obsoletos o peligrosos.
7. Se creen RAGs adicionales por especialidad, país, institución o licencia.
8. Se haga mantenimiento sin romper trazabilidad clínica, legal ni técnica.

**Importante:** la posibilidad de contribuciones externas no debe bloquear la construcción base. El sistema debe quedar listo para recibir expertos/autores, pero el RAG inicial debe poder avanzar con fuentes públicas, oficiales, trazables y legalmente utilizables.

---

## 2. Objetivo específico de este prompt

Actualizar la arquitectura documental del RAG para soportar:

- Ciclo de vida completo de tomos.
- Mantenimiento recurrente.
- Contribuciones de especialistas.
- Autorizaciones de autores/fuentes privadas.
- RAGs adicionales por especialidad o institución.
- Versionado semántico clínico.
- Auditoría de cambios.
- Deprecación y reemplazo seguro de conocimiento.
- Evaluación de calidad por cada contribución.
- Evidencia de permisos y licencias.
- Escalamiento hacia múltiples corpus clínicos sin romper el RAG base.

Este prompt no debe crear contenido médico de diagnóstico, tratamiento, dosis ni protocolos clínicos. Solo debe crear la infraestructura documental y contratos para gestionarlo profesionalmente.

---

## 3. Restricciones no negociables

### 3.1 Seguridad clínica

- No inventar conocimiento clínico.
- No redactar guías clínicas finales.
- No crear recomendaciones terapéuticas.
- No crear catálogos de medicamentos ni dosis.
- No afirmar que un tomo/contribución está aprobado sin evidencia de revisión.
- No permitir que una contribución externa salte los gates médico/legal.
- No reemplazar revisión humana en tomos de alto riesgo.

### 3.2 Legal/licencias

- No copiar contenido protegido.
- No preparar scraping masivo.
- No asumir que una autorización verbal es suficiente.
- No tratar “gratis para leer” como “autorizado para RAG”.
- No mezclar contenido de licencias incompatibles en un mismo release sin mapa legal.
- Toda autorización debe quedar documentada y auditable.

### 3.3 Técnica y mantenimiento

- No borrar archivos existentes.
- No romper rutas ya generadas por Prompt 02.
- No crear dependencias pesadas.
- No conectar APIs externas.
- No crear `.env` real.
- No modificar documentación ajena sin conservar compatibilidad.
- No usar nombres ambiguos para estados, versiones o contributors.

---

## 4. Archivos y carpetas objetivo

Actualizar o crear bajo:

```text
D:\Desarrollos\App_Medica\data\medical-rag
```

La estructura esperada a agregar es:

```text
data/medical-rag/
├── contributors/
│   ├── README.md
│   ├── contributor_profile.schema.json
│   ├── contributor_profile.example.json
│   ├── medical_specialist_contribution_template.md
│   ├── author_permission_template.md
│   ├── institution_permission_template.md
│   ├── contribution_intake_checklist.md
│   ├── conflict_of_interest_disclosure.md
│   └── contributor_review_workflow.md
├── permissions/
│   ├── README.md
│   ├── permission_record.schema.json
│   ├── permission_record.example.json
│   ├── permission_evidence_index.md
│   └── license_compatibility_matrix.md
├── lifecycle/
│   ├── README.md
│   ├── tome_lifecycle_policy.md
│   ├── semantic_versioning_policy.md
│   ├── maintenance_calendar.md
│   ├── deprecation_policy.md
│   ├── emergency_patch_policy.md
│   ├── knowledge_diff_policy.md
│   ├── corpus_branching_policy.md
│   └── release_readiness_checklist.md
├── corpus/
│   ├── README.md
│   ├── corpus_registry.schema.json
│   ├── corpus_registry.example.json
│   ├── corpus_composition_policy.md
│   └── multi_rag_routing_policy.md
└── evaluation/
    ├── contribution_eval_template.md
    ├── expert_review_template.md
    └── regression_eval_policy.md
```

Además, actualizar si existen:

```text
data/medical-rag/README.md
data/medical-rag/governance/change_control.md
data/medical-rag/governance/source_acceptance_criteria.md
docs/architecture/MEDICAL_RAG_ARCHITECTURE.md
```

---

## 5. Contenido mínimo por archivo

### 5.1 `contributors/README.md`

Debe explicar:

- Qué es un contributor clínico.
- Qué puede contribuir.
- Qué no puede contribuir.
- Tipos de contributor:
  - `medical_specialist`
  - `general_physician`
  - `clinical_reviewer`
  - `legal_reviewer`
  - `source_author`
  - `institutional_partner`
  - `internal_curator`
- Flujo de contribución:
  1. Registro del contributor.
  2. Declaración de conflicto de interés.
  3. Envío de material/conocimiento.
  4. Validación de identidad/credenciales cuando aplique.
  5. Validación de licencia/autorización.
  6. Revisión clínica.
  7. Revisión legal.
  8. Evaluación RAG.
  9. Release candidate.
  10. Aprobación para staging o producción.

Debe incluir nota clara: ninguna contribución externa entra directo a producción.

---

### 5.2 `contributors/contributor_profile.schema.json`

Crear JSON Schema con campos obligatorios:

```json
{
  "contributor_id": "string",
  "contributor_type": "medical_specialist | general_physician | clinical_reviewer | legal_reviewer | source_author | institutional_partner | internal_curator",
  "full_name": "string",
  "organization": "string",
  "country": "string",
  "languages": ["es", "en"],
  "specialties": ["string"],
  "credential_type": "cedula_profesional | board_certification | institutional_role | author_rights | legal_license | internal_role | other",
  "credential_reference": "string",
  "credential_status": "pending_verification | verified | rejected | expired | not_applicable",
  "identity_verification_status": "pending | verified | rejected | not_applicable",
  "conflict_of_interest_status": "pending | disclosed | none_declared | requires_review",
  "allowed_contribution_types": ["source_review", "clinical_annotation", "original_expert_note", "legal_review", "permission_grant", "tome_review"],
  "review_owner": "string",
  "created_at": "YYYY-MM-DD",
  "last_reviewed_at": "YYYY-MM-DD",
  "notes": "string"
}
```

Debe tener enums estrictos y `additionalProperties: false`.

---

### 5.3 `contributors/contributor_profile.example.json`

Crear ejemplos ficticios, sin datos reales:

- Médico especialista en pediatría con credencial pendiente.
- Autor de libro con autorización pendiente.
- Curador interno.
- Revisor legal.

No usar datos personales reales.

---

### 5.4 `contributors/medical_specialist_contribution_template.md`

Plantilla para que un especialista aporte conocimiento. Debe pedir:

- Identificación del contributor.
- Especialidad.
- Tema clínico.
- Público objetivo: adulto, pediátrico, embarazo, adulto mayor, etc.
- Jurisdicción aplicable.
- Nivel de evidencia.
- Fuentes que respaldan la contribución.
- Qué parte es experiencia clínica propia.
- Red flags relacionados.
- Contraindicaciones o riesgos.
- Condiciones en las que debe derivarse a consulta física/urgencias.
- Limitaciones.
- Fecha de vigencia/revisión sugerida.

Debe prohibir:

- Incluir datos reales de pacientes.
- Copiar capítulos/libros completos.
- Entregar contenido sin autorización.
- Recomendar medicamentos controlados.

---

### 5.5 `contributors/author_permission_template.md`

Crear una plantilla de autorización para autores de libros, artículos, blogs, páginas o cursos.

Debe incluir:

- Identidad del titular de derechos.
- Obra autorizada.
- URL/ISBN/identificador.
- Alcance permitido:
  - `metadata_only`
  - `limited_quotation`
  - `rag_retrieval_internal`
  - `rag_retrieval_product`
  - `commercial_use`
  - `redistribution`
  - `translation`
  - `derivative_summaries`
- Alcance prohibido.
- Duración de autorización.
- Territorios.
- Idiomas.
- Revocación.
- Firma/evidencia.

No debe ser un contrato legal definitivo; debe indicar que requiere validación legal.

---

### 5.6 `contributors/institution_permission_template.md`

Similar al permiso de autor, pero para hospitales, universidades, clínicas, colegios médicos, ONGs o instituciones.

Debe contemplar:

- Representante autorizado.
- Prueba de representación.
- Material autorizado.
- Restricciones de uso.
- Obligación de attribution.
- Contacto para actualizaciones.
- Fechas de vigencia.

---

### 5.7 `contributors/contribution_intake_checklist.md`

Checklist Go/No-Go para aceptar una contribución:

- Identidad verificada.
- Credenciales verificadas si aplica.
- Conflicto de interés revisado.
- Material sin datos personales de pacientes.
- Licencia/autorización registrada.
- Dominio clínico identificado.
- Riesgo clínico clasificado.
- Fuentes trazables.
- Revisión médica asignada.
- Revisión legal asignada.
- Plan de evaluación definido.
- Estado inicial asignado.

Debe tener tabla con columnas:

```md
| Check | Estado | Responsable | Evidencia | Bloqueante |
```

---

### 5.8 `contributors/conflict_of_interest_disclosure.md`

Plantilla simple para declarar conflictos de interés:

- Relación con farmacéuticas.
- Relación con dispositivos médicos.
- Relación con aseguradoras.
- Relación con clínicas/hospitales.
- Incentivos económicos.
- Contenido promocional.
- Conflicto inexistente.
- Firma/fecha.

---

### 5.9 `contributors/contributor_review_workflow.md`

Debe documentar estados:

```text
submitted → identity_review → credential_review → coi_review → accepted_for_source_review → accepted_for_clinical_review → active → suspended → archived
```

Debe indicar quién puede mover estados: admin, soporte, legal, medical board.

---

### 5.10 `permissions/permission_record.schema.json`

Crear JSON Schema con:

```json
{
  "permission_id": "string",
  "source_id": "string",
  "rights_holder_name": "string",
  "rights_holder_type": "individual | institution | publisher | government | unknown",
  "permission_status": "draft | pending_signature | granted | rejected | expired | revoked | legal_review_required",
  "permission_scope": ["metadata_only", "limited_quotation", "rag_retrieval_internal", "rag_retrieval_product", "commercial_use", "redistribution", "translation", "derivative_summaries"],
  "territories": ["global", "mx", "us", "latam", "other"],
  "languages": ["es", "en"],
  "effective_date": "YYYY-MM-DD",
  "expiration_date": "YYYY-MM-DD | null",
  "revocation_terms": "string",
  "evidence_files": ["string"],
  "legal_reviewer": "string",
  "notes": "string"
}
```

Enums estrictos y `additionalProperties: false`.

---

### 5.11 `permissions/license_compatibility_matrix.md`

Matriz para decidir qué contenido puede combinarse.

Incluir columnas:

```md
| Licencia/Fuente | Metadata | Cita limitada | RAG interno | RAG producto | Comercial | Redistribución | Traducción | Derivados | Requiere legal |
```

Agregar ejemplos conceptuales:

- Public domain / gobierno según país.
- CC BY.
- CC BY-SA.
- CC BY-NC.
- CC BY-ND.
- All rights reserved con permiso explícito.
- Licencia institucional privada.

No afirmar reglas absolutas universales; marcar revisión legal cuando haya duda.

---

### 5.12 `lifecycle/tome_lifecycle_policy.md`

Estados obligatorios del tomo:

```text
draft
source_review
license_review
clinical_review
legal_review
rag_eval
approved_for_staging
approved_for_production
deprecated
archived
```

Para cada estado definir:

- Entrada.
- Salida.
- Responsable.
- Evidencia requerida.
- Bloqueantes.

---

### 5.13 `lifecycle/semantic_versioning_policy.md`

Definir versionado clínico:

```text
MAJOR.MINOR.PATCH+rag
```

Reglas:

- `MAJOR`: cambia criterio clínico, red flags, indicaciones de derivación, estructura de chunks o impacto alto.
- `MINOR`: agrega conocimiento no contradictorio, nuevas fuentes, subdominios o idiomas.
- `PATCH`: corrige metadata, typos, referencias, clasificación o errores menores sin impacto clínico.

Agregar ejemplos:

```text
01_red_flags_triage v1.0.0+rag
01_red_flags_triage v1.1.0+rag
01_red_flags_triage v2.0.0+rag
```

---

### 5.14 `lifecycle/maintenance_calendar.md`

Política de revisión:

- Tomos críticos: revisión trimestral.
- Red flags/pediatría/OTC: revisión trimestral o inmediata si hay alerta.
- Medicina general: semestral.
- Especialidades: semestral/anual según riesgo.
- Tomos regionales/legal: revisión cuando cambie normativa.
- Fuentes con fecha de expiración: revisión antes de vencimiento.

Debe incluir tabla de calendario.

---

### 5.15 `lifecycle/deprecation_policy.md`

Cómo retirar conocimiento:

- Obsolescencia clínica.
- Fuente retirada.
- Licencia revocada.
- Error médico detectado.
- Conflicto con nueva guía.
- Riesgo de daño.

Debe indicar que un chunk deprecado no se elimina sin dejar traza; se marca como `deprecated` y se excluye del retrieval productivo.

---

### 5.16 `lifecycle/emergency_patch_policy.md`

Para errores críticos:

- Activar incident ID.
- Congelar release afectado.
- Desactivar chunks riesgosos.
- Generar hotfix.
- Re-evaluar casos clínicos afectados.
- Documentar causa raíz.
- Notificar stakeholders internos.

---

### 5.17 `lifecycle/knowledge_diff_policy.md`

Definir cómo comparar versiones:

- Chunks agregados.
- Chunks removidos.
- Chunks modificados.
- Cambios de evidencia.
- Cambios de red flag.
- Cambios de jurisdicción.
- Cambios de licencia.

Debe sugerir formato `knowledge_diff_report.md` por release.

---

### 5.18 `lifecycle/corpus_branching_policy.md`

Permitir ramas de corpus:

- `base_global`
- `mx_release`
- `us_release`
- `latam_release`
- `en_release`
- `pediatrics_safe`
- `institutional_custom`
- `partner_authorized`

Explicar que no todo chunk aplica a toda región, idioma, edad o escenario clínico.

---

### 5.19 `corpus/corpus_registry.schema.json`

Crear schema para registrar corpus/RAGs adicionales:

```json
{
  "corpus_id": "string",
  "name": "string",
  "description": "string",
  "corpus_type": "base | specialty | regional | institutional | partner_authorized | experimental",
  "status": "draft | staging | production | deprecated | archived",
  "included_tomes": ["string"],
  "excluded_tomes": ["string"],
  "jurisdictions": ["global", "mx", "us", "latam", "other"],
  "languages": ["es", "en"],
  "patient_groups": ["adult", "pediatric", "pregnancy", "older_adult", "general"],
  "owner": "string",
  "version": "string",
  "release_date": "YYYY-MM-DD",
  "notes": "string"
}
```

Enums estrictos.

---

### 5.20 `corpus/corpus_composition_policy.md`

Reglas para armar un corpus:

- El corpus base debe contener seguridad clínica antes que especialidades.
- Tomos regionales no sustituyen red flags globales.
- Tomos con licencia restringida no pueden mezclarse en corpus productivo sin autorización.
- Pediatría requiere policy reforzada.
- OTC requiere interacciones/contraindicaciones y límites explícitos.
- Un corpus experimental nunca se expone a usuarios finales.

---

### 5.21 `corpus/multi_rag_routing_policy.md`

Diseñar cómo la app decidirá qué corpus consultar:

Factores:

- País/región.
- Idioma.
- Edad del paciente.
- Embarazo.
- Síntomas/red flags.
- Especialidad probable.
- Estado de evidencia.
- Configuración admin.

Debe aclarar que el retrieval siempre prioriza:

1. Seguridad/red flags.
2. Jurisdicción aplicable.
3. Edad/grupo de riesgo.
4. Evidencia más fuerte.
5. Recencia.
6. Especialidad.

---

### 5.22 `evaluation/contribution_eval_template.md`

Plantilla para evaluar contribuciones:

- Validez clínica.
- Claridad.
- Trazabilidad.
- Riesgo de daño.
- Compatibilidad con guardrails.
- Calidad de fuentes.
- Licencia.
- Evaluación por casos.
- Hallucination risk.
- Contradicciones.
- Decisión: aceptar, pedir cambios, rechazar.

---

### 5.23 `evaluation/expert_review_template.md`

Plantilla para revisión por experto:

- Revisor.
- Credencial.
- Especialidad.
- Alcance revisado.
- Hallazgos.
- Riesgos.
- Correcciones requeridas.
- Aprobación condicionada/no condicionada.
- Firma/fecha.

---

### 5.24 `evaluation/regression_eval_policy.md`

Cada cambio de tomo debe correr regresión con casos clínicos:

- Casos normales.
- Casos con red flags.
- Pediatría.
- Embarazo.
- Adulto mayor.
- Síntomas ambiguos.
- Insuficiencia de evidencia.
- Riesgo de autodiagnóstico.

Debe exigir que un cambio no baje seguridad aunque mejore cobertura.

---

## 6. Actualizaciones a archivos existentes

### 6.1 Actualizar `data/medical-rag/README.md`

Agregar secciones:

```md
## Extensibilidad futura

El RAG está diseñado para crecer mediante nuevos tomos, corpus especializados, contribuciones de especialistas y permisos explícitos de autores/instituciones.

## Contribuciones externas

Ninguna contribución entra a producción sin validación de identidad/credenciales, licencia, revisión médica, revisión legal y evaluación RAG.

## RAG base vs RAGs adicionales

El RAG base se construye con fuentes públicas/permitidas y curaduría interna. Los RAGs adicionales pueden ser regionales, por especialidad, institucionales o autorizados por autores.

## Carpeta oficial de releases de tomos

`data/medical-rag/tomes/<tome_id>/release/`
```

### 6.2 Actualizar `data/medical-rag/governance/change_control.md`

Agregar:

- Change request ID.
- Tipo de cambio.
- Impacto clínico.
- Impacto legal.
- Impacto de retrieval.
- Validaciones requeridas.
- Rollback.
- Aprobadores.

### 6.3 Actualizar `data/medical-rag/governance/source_acceptance_criteria.md`

Agregar criterios para:

- Fuente pública oficial.
- Fuente open access.
- Fuente privada autorizada.
- Autor individual autorizado.
- Institución autorizada.
- Contribución de especialista sin fuente documental primaria.

Regla: la experiencia clínica individual puede enriquecer anotaciones, pero no debe superar guías oficiales cuando exista contradicción.

### 6.4 Actualizar `docs/architecture/MEDICAL_RAG_ARCHITECTURE.md`

Agregar sección:

```md
## Arquitectura extensible de corpus y contribuciones
```

Debe explicar:

- Separación entre source registry, permission registry, contributor registry, tome releases y corpus releases.
- Cómo se evita vendor lock-in.
- Cómo se agregan RAGs adicionales.
- Cómo se deprecan chunks.
- Cómo se audita cada respuesta clínica.

---

## 7. Validaciones finales obligatorias

Al terminar, generar:

```text
docs/reports/PROMPT_03_EXECUTION_REPORT.md
```

Debe incluir:

```md
# Resultado Prompt 03

## Archivos creados
- ...

## Archivos modificados
- ...

## Decisiones técnicas aplicadas
- ...

## Riesgos o bloqueadores detectados
- ...

## Validaciones realizadas
- [ ] No se creó contenido clínico inventado
- [ ] No se descargaron fuentes externas
- [ ] No se agregaron secretos
- [ ] No se rompieron rutas del Prompt 02
- [ ] La arquitectura soporta contribuciones externas
- [ ] La arquitectura soporta permisos de autores/instituciones
- [ ] La arquitectura soporta mantenimiento/versionado/deprecación
- [ ] La arquitectura permite múltiples corpus/RAGs

## Siguiente prompt sugerido
Prompt 04 — Source Discovery Pack para Tomo 01: Red Flags, Triage y Derivación Inmediata.
```

---

## 8. Definition of Done

Este prompt se considera terminado cuando:

- Todas las carpetas objetivo existen.
- Todos los schemas son JSON válido.
- Todas las plantillas `.md` tienen contenido accionable.
- Las rutas existentes del RAG siguen funcionando.
- `data/medical-rag/README.md` refleja extensibilidad.
- `MEDICAL_RAG_ARCHITECTURE.md` explica contributors, permissions, corpus y lifecycle.
- Existe reporte final en `docs/reports/PROMPT_03_EXECUTION_REPORT.md`.
- No se creó contenido clínico final ni material protegido.

---

## 9. Instrucción de cierre para el agente

Al finalizar, responde con:

1. Lista de archivos creados.
2. Lista de archivos modificados.
3. Decisiones técnicas aplicadas.
4. Riesgos o bloqueadores.
5. Validaciones realizadas.
6. Ruta exacta donde el arquitecto senior deberá depositar tomos clínicos:

```text
data/medical-rag/tomes/<tome_id>/release/
```

No incluyas contenido clínico inventado en la respuesta final.
