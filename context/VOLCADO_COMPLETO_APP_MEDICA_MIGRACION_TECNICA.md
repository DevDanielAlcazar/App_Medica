# VOLCADO COMPLETO — APP MÉDICA AI / MIGRACIÓN TÉCNICA Y CONTINUIDAD OPERATIVA

**Proyecto:** App Médica AI  
**Repositorio local operativo:** `D:\Desarrollos\App_Medica`  
**Repositorio remoto:** `https://github.com/DevDanielAlcazar/App_Medica`  
**Fecha de corte del volcado:** 2026-07-09  
**Estado general:** Planeación, gobernanza técnica, Medical RAG Tomo 01 y documentación base avanzadas. No existe todavía implementación funcional completa del SaaS web.  
**Línea de producto:** Release productivo, no MVP.  
**Rol operativo definido:** Equipo Glouu/Daniel = Delivery y Gerencia de Operaciones. ChatGPT = Arquitecto de Software Full-Stack Senior, Líder de Producto y curador principal de Medical RAG. OpenCode/AionUI/otros agentes = desarrolladores Jr/integradores controlados.

---

## 0. Lectura ejecutiva de continuidad

Este documento concentra el contexto completo disponible del proyecto para poder continuar aun si cambia el chat, la IA, el entorno o se pierde memoria conversacional. Es el estado maestro de migración técnica y continuidad.

### 0.1 Estado real actual

El proyecto **no está todavía desarrollado como aplicación funcional**. Actualmente se tiene:

- Documentación de producto v2.
- Gobernanza técnica.
- Lineamientos de arquitectura.
- Backlog de release.
- Riesgos y gates.
- Prompts individuales 01 a 12B para OpenCode/dev Jr.
- Estructura inicial de Medical RAG.
- Tomo 01 de Medical RAG sobre **Red Flags / Triage / Derivación inmediata**, con contenido curado v0.2, 54 chunks, 28 fuentes y 80 casos de evaluación según los reportes de OpenCode.
- Paquete de revisión médico/legal para Tomo 01.
- Aprobación verbal/contextual reportada por el usuario: **médico aprueba chunks, abogado aprueba fuentes, ambos aprueban cambiar `production_allowed` a `true` para el Tomo 01 aprobado**.
- Expansión v0.3 planificada pendiente de ejecución/revisión mediante Prompt 12B.

### 0.2 Decisión clave de ejecución

OpenCode **no debe inventar contenido médico**. La responsabilidad de investigación, recopilación, curación clínica y contenido final de los tomos RAG corresponde al arquitecto senior/ChatGPT. OpenCode solamente debe:

- Crear estructura de carpetas.
- Integrar archivos.
- Validar formatos JSON/JSONL.
- Correr scripts.
- Generar reportes.
- Mantener trazabilidad.
- No modificar medicina sin contenido curado aprobado.

### 0.3 Siguiente paso inmediato

Ejecutar en orden:

1. `prompts/12A_aplicar_aprobacion_medico_legal_tomo_01_v0_2_1.md`  
   Objetivo: aplicar aprobación médico/legal al Tomo 01 v0.2, dejar `production_allowed: true` para ese release específico y registrar evidencia de aprobación.

2. `prompts/12B_tomo_01_expansion_candidate_v0_3_cobertura_extendida.md`  
   Objetivo: crear expansión candidata v0.3 sin contaminar el release aprobado, agregando cobertura extendida pendiente de nueva revisión médica/legal.

3. Validar con scripts existentes bajo `tools/medical-rag/`.

4. Confirmar commit y push a GitHub.

---

# 1. Resumen Ejecutivo y Objetivos del SaaS

## 1.1 Visión del producto

Construir una **aplicación médica AI-first** como SaaS web responsivo/PWA para usuarios/pacientes, médicos, soporte, contabilidad y administradores. La app busca ofrecer orientación clínica inteligente, expediente clínico digital, consultas asistidas por IA, videocitas con médicos humanos, pagos reales y administración de proveedores de IA.

La experiencia debe ser confiable, moderna, rápida, intuitiva, elegante, accesible, segura y preparada para dominios altamente sensibles: datos personales de salud, orientación clínica, pediatría, OTC, derivación médica y revisión humana.

## 1.2 Objetivo de negocio

Crear una plataforma escalable para:

- Atender consultas médicas digitales con IA y médicos humanos.
- Construir un expediente clínico digital usable por la IA.
- Permitir diagnóstico/orientación clínica bajo guardrails.
- Derivar a consulta física/humana cuando exista riesgo, evidencia insuficiente o red flags.
- Permitir recomendaciones sintomatológicas no equivalentes a receta médica formal.
- Nunca recetar medicamentos controlados.
- Permitir OTC con controles estrictos de evidencia, edad, contraindicaciones y seguridad.
- Operar en México, Estados Unidos, LatAm y países de habla inglesa mediante configuración regional.
- Usar un AI Gateway multi-proveedor configurable por administradores.
- Operar con pagos reales desde el release productivo.
- Ser desplegable desde GitHub hacia servidor Debian con PM2 y Cloudflare Tunnel.

## 1.3 Principio rector

**No se busca un MVP.** Se busca una primera versión pública como **release productivo**, con gates clínicos, legales, de seguridad, pagos, accesibilidad, rendimiento y operación.

## 1.4 Personas / roles del SaaS

| Rol | Objetivo | Necesidades críticas |
|---|---|---|
| Paciente / Usuario | Resolver dudas, recibir orientación, dar seguimiento, agendar consulta | Chat IA, expediente, evidencias, recomendaciones, citas, pagos, eliminación de datos |
| Médico | Atender citas y cobrar | Validación de cédula/identidad, agenda, Google Meet, expediente autorizado, pagos |
| Soporte | Gestionar operación e incidencias | Validar médicos, revisar casos, soporte al usuario, auditoría, gestión de tickets internos |
| Contabilidad | Gestionar pagos médicos | Cortes, comisiones, ledger, reportes, conciliación |
| Administrador | Configurar plataforma | Proveedores IA, modelos, API keys, Gmail, roles, precios, policy packs, métricas |
| Superadmin | Control máximo de negocio | Permisos máximos, no bloqueable, auditoría, configuración global |

## 1.5 Objetivos funcionales principales

- Registro e inicio de sesión.
- Disclaimer visible en login con enlace a Política de Privacidad.
- Detección inicial de región/idioma.
- Toggle de idioma ES/EN.
- Toggle claro/oscuro.
- Expediente clínico digital.
- Chat/consulta con IA.
- Captura progresiva de evidencia clínica.
- Diagnóstico/orientación clínica con guardrails.
- Red flags y derivación inmediata.
- Recomendación Sintomatológica cuando exista evidencia suficiente.
- Prohibición absoluta de controlados.
- Soporte de OTC con guardrails.
- Pediatría permitida bajo reglas reforzadas.
- Registro de médicos con cédula profesional.
- Adjuntar INE o cédula/foto para validar identidad.
- Estado médico `En revisión` hasta aprobación humana.
- Activación de médico por admin/soporte.
- Citas con médicos activos.
- Google Meet para videoconsulta.
- Pagos reales.
- Dashboard admin para proveedores IA.
- AI Gateway con OpenAI-compatible, Claude-compatible y genérico HTTP.
- Autorouting por disponibilidad/modelo/proveedor.
- Gmail configurable para notificaciones.
- Eliminación manual de expediente por usuario.
- Retención automática: borrar expedientes 6 meses después de estado `curado`.
- Medical RAG por tomos con fuentes auditables.

## 1.6 KPIs de release

| KPI | Target |
|---|---:|
| Casos rojos no derivados | 0 |
| Médicos no validados con citas | 0 |
| Doble saldo/cobro por webhook | 0 |
| Fallas críticas de accesibilidad | 0 |
| Uptime operativo después de hardening | >= 99% |
| Notificaciones críticas entregadas | >= 95% |
| Expedientes eliminables por usuario | 100% funcional |
| Job de retención 6 meses curado | Auditable |
| PHI en logs ordinarios | 0 |
| Secretos expuestos en repositorio | 0 |

---

# 2. Arquitectura de Software y Base de Datos

## 2.1 Arquitectura objetivo originalmente documentada

La arquitectura objetivo generada en la documentación base v2 es:

| Capa | Tecnología objetivo |
|---|---|
| Frontend | Next.js App Router, React, TypeScript estricto, PWA |
| Backend | Node.js modular, Server Actions / Route Handlers |
| Base de datos objetivo original | PostgreSQL |
| Colas | Redis / BullMQ o equivalente |
| Storage | File storage cifrado |
| IA | AI Gateway multi-proveedor OpenAI-compatible, Claude-compatible y genérico HTTP |
| Video | Google Meet API |
| Pagos | Stripe live en producción, sandbox solo QA |
| Deploy | GitHub → Debian → PM2 → Cloudflare Tunnel |
| Observabilidad | Logs estructurados, healthchecks, métricas |

## 2.2 Estado sobre Firebase/Firestore

El requerimiento de este reporte solicita Firebase/Firestore. En el estado documental actual, **la base objetivo original era PostgreSQL**, no Firestore. No obstante, para la migración técnica se puede adoptar Firestore si se decide priorizar rapidez serverless, tiempo de salida, autenticación integrada y escalabilidad operativa.

### Decisión técnica recomendada

Para dominio médico con PHI y auditoría estricta:

- **Opción A recomendada enterprise:** PostgreSQL + Storage cifrado + vector DB dedicada.
- **Opción B rápida migración SaaS:** Firebase Auth + Firestore + Cloud Storage + Cloud Functions/Run.

Como el usuario pidió modelado Firebase/Firestore, este documento deja un modelo Firestore completo. Debe validarse con el abogado/médico y con el equipo técnico antes de implementación productiva, especialmente por residencia de datos, compliance, seguridad de reglas, logs y retención.

## 2.3 Estilo arquitectónico

- Clean Architecture por bounded contexts.
- TypeScript estricto.
- Separación de dominio clínico fuera de UI.
- Action Receipts para acciones sensibles.
- Auditoría append-only.
- Backend como única capa autorizada para decisiones clínicas sensibles.
- UI nunca debe contener lógica clínica de decisión.
- RAG versionado y auditado.
- IA como gateway, no como dependencia directa de UI.
- Seguridad por RBAC + ABAC.
- Multitenancy preparado aunque inicialmente pueda operar single tenant.

## 2.4 Bounded contexts

| Contexto | Responsabilidad |
|---|---|
| Identity & Access | Auth, roles, permisos, sesiones, MFA futuro |
| Patient Profile | Perfil de paciente, consentimientos, idioma, región |
| Clinical Record | Expediente clínico, antecedentes, alergias, síntomas, documentos |
| Clinical AI | Consulta IA, triage, diagnóstico/orientación, recomendaciones, guardrails |
| Medical RAG | Tomos, fuentes, chunks, evaluación, source registry |
| Doctor Ops | Registro médico, validación cédula/identidad, estatus, agenda |
| Appointments | Citas, Google Meet, disponibilidad, confirmaciones |
| Payments | Stripe, ledger, webhooks idempotentes, payouts |
| Admin Console | Configuración de IA, Gmail, policy packs, roles, precios |
| Notifications | Gmail, plantillas, eventos, reintentos |
| Compliance | Privacidad, términos, consentimientos, retención, borrado |
| Audit & Observability | Action Receipts, logs sanitizados, métricas, healthchecks |

---

## 2.5 Modelado Firestore propuesto

### 2.5.1 Convención general

- Usar `tenantId` en todas las colecciones root multi-tenant.
- Usar `createdAt`, `updatedAt`, `createdBy`, `updatedBy`.
- Usar `deletedAt` y `deleteReason` cuando aplique soft delete.
- Para PHI sensible, guardar mínimo necesario en Firestore y documentos pesados en Cloud Storage cifrado.
- No guardar prompts completos con PHI en logs ordinarios.
- Usar Cloud Functions/Run para operaciones privilegiadas.
- Toda acción sensible genera `actionReceipts` append-only.

### 2.5.2 Colecciones principales

#### `/tenants/{tenantId}`

Configuración de organización/operación.

```json
{
  "name": "Glouu Medical AI",
  "status": "active",
  "defaultLocale": "es-MX",
  "enabledRegions": ["MX", "US", "LATAM", "EN"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/users/{userId}`

Identidad base agnóstica al rol.

```json
{
  "tenantId": "default",
  "email": "user@example.com",
  "displayName": "Nombre Usuario",
  "roles": ["patient"],
  "status": "active",
  "preferredLocale": "es-MX",
  "regionDetected": "MX",
  "regionConfirmed": "MX",
  "themePreference": "system|light|dark",
  "createdAt": "timestamp",
  "lastLoginAt": "timestamp"
}
```

#### `/patientProfiles/{patientId}`

Perfil clínico-administrativo del paciente.

```json
{
  "tenantId": "default",
  "userId": "uid",
  "dateOfBirth": "YYYY-MM-DD",
  "sexAtBirth": "female|male|intersex|unknown",
  "genderIdentity": "optional",
  "country": "MX",
  "stateOrRegion": "GTO",
  "emergencyContact": {
    "name": "",
    "phone": ""
  },
  "status": "active",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/doctorProfiles/{doctorId}`

Perfil médico. No puede tomar citas hasta `verificationStatus = active`.

```json
{
  "tenantId": "default",
  "userId": "uid",
  "fullName": "Nombre Médico",
  "professionalLicenseNumber": "CEDULA",
  "specialties": ["medicina_general"],
  "country": "MX",
  "verificationStatus": "in_review|active|rejected|suspended",
  "verifiedAt": null,
  "verifiedBy": null,
  "canTakeAppointments": false,
  "payoutConfigStatus": "pending|ready|blocked",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/doctorVerificationRequests/{requestId}`

Workflow de validación de médico.

```json
{
  "tenantId": "default",
  "doctorId": "doctorId",
  "submittedBy": "userId",
  "professionalLicenseNumber": "CEDULA",
  "identityDocumentFileId": "fileId",
  "licenseDocumentFileId": "fileId",
  "status": "submitted|in_review|approved|rejected|needs_more_info",
  "reviewNotes": [],
  "approvedBy": null,
  "approvedAt": null,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/medicalRecords/{recordId}`

Expediente clínico digital principal.

```json
{
  "tenantId": "default",
  "patientId": "patientId",
  "ownerUserId": "uid",
  "status": "active|curated|deleted|purged_pending",
  "curatedAt": null,
  "scheduledPurgeAt": null,
  "summary": {
    "knownAllergies": [],
    "chronicConditions": [],
    "currentMedications": [],
    "majorSurgeries": [],
    "pregnancyStatus": "not_applicable|unknown|pregnant|postpartum"
  },
  "lastClinicalUpdateAt": "timestamp",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/clinicalEncounters/{encounterId}`

Evento clínico: consulta IA, cita médica, seguimiento.

```json
{
  "tenantId": "default",
  "patientId": "patientId",
  "medicalRecordId": "recordId",
  "type": "ai_consultation|doctor_appointment|follow_up|triage",
  "status": "open|awaiting_evidence|triaged|resolved|referred|closed",
  "riskLevel": "green|yellow|red|unknown",
  "primaryComplaint": "dolor de pecho",
  "startedAt": "timestamp",
  "closedAt": null,
  "createdBy": "uid",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/symptomIntakes/{intakeId}`

Captura estructurada de síntomas.

```json
{
  "tenantId": "default",
  "encounterId": "encounterId",
  "patientId": "patientId",
  "ageAtEncounter": 34,
  "chiefComplaint": "",
  "duration": "",
  "severity": "",
  "associatedSymptoms": [],
  "redFlagAnswers": {},
  "pediatricFields": {},
  "pregnancyFields": {},
  "evidenceCompleteness": "sufficient|insufficient|critical_missing",
  "createdAt": "timestamp"
}
```

#### `/aiSessions/{aiSessionId}`

Sesión con IA.

```json
{
  "tenantId": "default",
  "encounterId": "encounterId",
  "patientId": "patientId",
  "status": "active|closed|escalated|failed",
  "routingPolicyId": "routingPolicyId",
  "selectedProviderId": "providerId",
  "selectedModelId": "modelId",
  "ragTomesUsed": ["01_red_flags_triage@0.2.1"],
  "safetyState": "green|yellow|red",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/aiMessages/{messageId}`

Mensajes de conversación. Deben tener cuidado extremo con PHI.

```json
{
  "tenantId": "default",
  "aiSessionId": "aiSessionId",
  "encounterId": "encounterId",
  "role": "user|assistant|system|tool",
  "contentRef": "storageRef_or_encrypted_blob_ref",
  "sanitizedPreview": "Texto sin PHI para debugging limitado",
  "containsPHI": true,
  "createdAt": "timestamp"
}
```

#### `/clinicalAssessments/{assessmentId}`

Resultado clínico estructurado de IA/guardrails.

```json
{
  "tenantId": "default",
  "encounterId": "encounterId",
  "aiSessionId": "aiSessionId",
  "decisionState": "green|yellow|red",
  "evidenceStatus": "sufficient|insufficient|danger",
  "redFlagsDetected": [],
  "differentialCandidates": [],
  "recommendedAction": "ask_more|self_care|symptomatic_recommendation|doctor_visit|urgent_care|emergency",
  "mustNotSay": [],
  "safeUserMessage": "",
  "sources": [],
  "createdAt": "timestamp"
}
```

#### `/triageEvents/{triageEventId}`

Registro específico de triage.

```json
{
  "tenantId": "default",
  "encounterId": "encounterId",
  "severity": "S0|S1|S2|S3|S4|S5|S6",
  "action": "emergency|urgent_physical_visit|doctor_visit|ask_more|monitor",
  "triggeredByChunkIds": [],
  "rationale": "",
  "underTriageGuardApplied": true,
  "createdAt": "timestamp"
}
```

#### `/symptomaticRecommendations/{recommendationId}`

Documento de recomendación sintomatológica. No llamarlo receta médica formal.

```json
{
  "tenantId": "default",
  "encounterId": "encounterId",
  "patientId": "patientId",
  "title": "Recomendación Sintomatológica",
  "status": "draft|issued|revoked",
  "allowedScope": "non_controlled_symptomatic_guidance",
  "otcSuggestions": [],
  "nonPharmacologicalGuidance": [],
  "redFlagReturnInstructions": [],
  "disclaimerAccepted": true,
  "issuedAt": "timestamp",
  "createdBy": "ai|doctor|hybrid"
}
```

#### `/appointments/{appointmentId}`

Citas humanas.

```json
{
  "tenantId": "default",
  "patientId": "patientId",
  "doctorId": "doctorId",
  "encounterId": "encounterId",
  "status": "pending_payment|scheduled|completed|cancelled|no_show",
  "startAt": "timestamp",
  "endAt": "timestamp",
  "meetSessionId": "meetSessionId",
  "paymentId": "paymentId",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/meetSessions/{meetSessionId}`

Google Meet.

```json
{
  "tenantId": "default",
  "appointmentId": "appointmentId",
  "provider": "google_meet",
  "meetUrl": "https://meet.google.com/...",
  "calendarEventId": "",
  "status": "created|failed|cancelled",
  "createdAt": "timestamp"
}
```

#### `/payments/{paymentId}`

Pago individual.

```json
{
  "tenantId": "default",
  "patientId": "patientId",
  "appointmentId": "appointmentId",
  "provider": "stripe",
  "providerPaymentIntentId": "pi_xxx",
  "amount": 50000,
  "currency": "MXN",
  "status": "requires_payment|succeeded|failed|refunded",
  "idempotencyKey": "unique-key",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/ledgerEntries/{ledgerEntryId}`

Ledger contable append-only.

```json
{
  "tenantId": "default",
  "paymentId": "paymentId",
  "type": "charge|refund|platform_fee|doctor_payout|adjustment",
  "amount": 50000,
  "currency": "MXN",
  "direction": "debit|credit",
  "idempotencyKey": "unique-key",
  "createdAt": "timestamp"
}
```

#### `/aiProviders/{providerId}`

Proveedores IA dinámicos.

```json
{
  "tenantId": "default",
  "name": "Poolside|OpenRouter|Groq|Cerebras|Custom",
  "protocol": "openai_compatible|claude_compatible|generic_http",
  "baseUrl": "https://api.provider.com/v1",
  "status": "active|inactive|degraded",
  "healthCheckPath": "/models",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/aiApiKeys/{apiKeyId}`

Nunca guardar API key en texto plano. Debe ir cifrada/secret manager.

```json
{
  "tenantId": "default",
  "providerId": "providerId",
  "label": "Poolside Prod Key",
  "encryptedSecretRef": "secret-manager-ref",
  "status": "active|inactive|revoked",
  "lastHealthCheckAt": "timestamp",
  "createdAt": "timestamp"
}
```

#### `/aiModels/{modelId}`

Modelos activados por proveedor.

```json
{
  "tenantId": "default",
  "providerId": "providerId",
  "apiKeyId": "apiKeyId",
  "modelName": "laguna-m1|qwen|deepseek|custom",
  "capabilities": ["chat", "tool_use", "vision", "reasoning"],
  "contextWindowTokens": 128000,
  "costTier": "free|low|medium|high",
  "status": "active|inactive|degraded",
  "priority": 10,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/routingPolicies/{routingPolicyId}`

Política de autorouting IA.

```json
{
  "tenantId": "default",
  "name": "clinical-default",
  "allowedModelIds": [],
  "fallbackModelIds": [],
  "rules": {
    "preferAvailable": true,
    "preferLowerLatency": false,
    "requireMedicalRag": true,
    "maxRetries": 2,
    "failClosedForClinicalRisk": true
  },
  "status": "active",
  "createdAt": "timestamp"
}
```

#### `/aiRoutingEvents/{eventId}`

Trazabilidad del autorouting.

```json
{
  "tenantId": "default",
  "aiSessionId": "aiSessionId",
  "selectedProviderId": "providerId",
  "selectedModelId": "modelId",
  "fallbackUsed": false,
  "latencyMs": 1200,
  "errorClass": null,
  "createdAt": "timestamp"
}
```

#### `/ragTomes/{tomeId}`

Registro app-level de tomos disponibles.

```json
{
  "tomeId": "01_red_flags_triage",
  "version": "0.2.1",
  "status": "approved_for_production|candidate|deprecated",
  "productionAllowed": true,
  "chunkCount": 54,
  "sourceCount": 28,
  "evalCaseCount": 80,
  "approvedByMedical": true,
  "approvedByLegal": true,
  "releasePath": "data/medical-rag/tomes/01_red_flags_triage/release/",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

#### `/ragSources/{sourceId}`

Registro de fuentes médicas.

```json
{
  "sourceId": "F001",
  "tomeId": "01_red_flags_triage",
  "publisher": "WHO|CDC|MedlinePlus|NIMH|Poison Control",
  "title": "",
  "url": "",
  "licenseStatus": "approved|pending|restricted|rejected",
  "legalReviewStatus": "approved|pending",
  "medicalReviewStatus": "approved|pending",
  "createdAt": "timestamp"
}
```

#### `/sourcePermissions/{permissionId}`

Permisos firmados por autores/instituciones.

```json
{
  "tenantId": "default",
  "sourceOwner": "Autor / Institución",
  "scope": ["rag_retrieval", "clinical_reference"],
  "notAllowed": ["model_training"],
  "permissionDocumentFileId": "fileId",
  "status": "active|expired|revoked",
  "validFrom": "timestamp",
  "validUntil": null,
  "createdAt": "timestamp"
}
```

#### `/notifications/{notificationId}`

Notificaciones internas/email.

```json
{
  "tenantId": "default",
  "recipientUserId": "uid",
  "channel": "email|in_app",
  "provider": "gmail",
  "templateId": "templateId",
  "status": "queued|sent|failed",
  "payloadRef": "storageRef",
  "createdAt": "timestamp",
  "sentAt": null
}
```

#### `/gmailConfigs/{configId}`

Configuración Gmail por admin.

```json
{
  "tenantId": "default",
  "label": "Notificaciones App Médica",
  "senderEmail": "notificaciones@dominio.com",
  "oauthSecretRef": "secret-ref",
  "status": "active|inactive|error",
  "createdBy": "adminUserId",
  "updatedAt": "timestamp"
}
```

#### `/privacyPolicyVersions/{versionId}`

Políticas de privacidad versionadas.

```json
{
  "version": "2026-07-09-v1",
  "locale": "es-MX",
  "contentMarkdownRef": "storageRef",
  "status": "active|draft|archived",
  "approvedByLegal": true,
  "publishedAt": "timestamp"
}
```

#### `/termsAcceptances/{acceptanceId}`

Aceptación de políticas/términos.

```json
{
  "tenantId": "default",
  "userId": "uid",
  "policyVersionId": "versionId",
  "termsVersionId": "versionId",
  "acceptedAt": "timestamp",
  "ipHash": "",
  "userAgentHash": ""
}
```

#### `/deletionRequests/{requestId}`

Eliminación manual solicitada por usuario.

```json
{
  "tenantId": "default",
  "userId": "uid",
  "medicalRecordId": "recordId",
  "status": "requested|processing|completed|failed",
  "warningAccepted": true,
  "warningTextVersion": "v1",
  "requestedAt": "timestamp",
  "completedAt": null
}
```

#### `/retentionJobs/{jobId}`

Jobs de retención.

```json
{
  "tenantId": "default",
  "jobType": "curated_record_purge",
  "status": "scheduled|running|completed|failed",
  "recordsEvaluated": 0,
  "recordsPurged": 0,
  "startedAt": "timestamp",
  "finishedAt": null
}
```

#### `/files/{fileId}`

Metadatos de archivos adjuntos.

```json
{
  "tenantId": "default",
  "ownerUserId": "uid",
  "context": "identity_verification|clinical_evidence|medical_record|legal_permission",
  "storagePath": "gs://bucket/path",
  "mimeType": "application/pdf",
  "sizeBytes": 12345,
  "encryption": "managed|customer-managed",
  "containsPHI": true,
  "createdAt": "timestamp"
}
```

#### `/actionReceipts/{receiptId}`

Auditoría append-only.

```json
{
  "tenantId": "default",
  "actorUserId": "uid",
  "actorRole": "admin|doctor|patient|system",
  "actionType": "doctor_approved|record_deleted|triage_red|ai_provider_updated|payment_webhook_processed",
  "targetType": "doctorProfile|medicalRecord|aiProvider|payment",
  "targetId": "id",
  "metadata": {},
  "createdAt": "timestamp"
}
```

## 2.6 Relaciones principales

- `users.userId` 1:1 `patientProfiles.userId` cuando usuario es paciente.
- `users.userId` 1:1 `doctorProfiles.userId` cuando usuario es médico.
- `patientProfiles.patientId` 1:N `medicalRecords.patientId` aunque normalmente será 1 activo.
- `medicalRecords.recordId` 1:N `clinicalEncounters.medicalRecordId`.
- `clinicalEncounters.encounterId` 1:N `symptomIntakes.encounterId`.
- `clinicalEncounters.encounterId` 1:N `aiSessions.encounterId`.
- `aiSessions.aiSessionId` 1:N `aiMessages.aiSessionId`.
- `aiSessions.aiSessionId` 1:N `clinicalAssessments.aiSessionId`.
- `clinicalEncounters.encounterId` 1:N `triageEvents.encounterId`.
- `clinicalEncounters.encounterId` 0:N `symptomaticRecommendations.encounterId`.
- `doctorProfiles.doctorId` 1:N `appointments.doctorId`.
- `appointments.appointmentId` 1:1 `meetSessions.appointmentId`.
- `appointments.appointmentId` 1:1/N `payments.appointmentId`.
- `payments.paymentId` 1:N `ledgerEntries.paymentId`.
- `aiProviders.providerId` 1:N `aiApiKeys.providerId`.
- `aiProviders.providerId` 1:N `aiModels.providerId`.
- `aiModels.modelId` N:M `routingPolicies.allowedModelIds`.
- `ragTomes.tomeId` 1:N `ragSources.tomeId`.

## 2.7 Índices Firestore sugeridos

- `clinicalEncounters`: `tenantId + patientId + status + updatedAt desc`.
- `clinicalEncounters`: `tenantId + riskLevel + createdAt desc`.
- `appointments`: `tenantId + doctorId + startAt`.
- `appointments`: `tenantId + patientId + startAt desc`.
- `doctorProfiles`: `tenantId + verificationStatus + updatedAt desc`.
- `doctorVerificationRequests`: `tenantId + status + createdAt desc`.
- `payments`: `tenantId + providerPaymentIntentId` unique lógico.
- `ledgerEntries`: `tenantId + paymentId + createdAt`.
- `aiModels`: `tenantId + providerId + status + priority`.
- `notifications`: `tenantId + recipientUserId + status + createdAt desc`.
- `medicalRecords`: `tenantId + status + scheduledPurgeAt`.
- `actionReceipts`: `tenantId + targetType + targetId + createdAt desc`.

## 2.8 Seguridad Firestore Rules: intención

Las reglas deben ser defensivas:

- Paciente solo lee/escribe su perfil y expediente autorizado.
- Médico solo ve expediente asociado a cita/encounter autorizado.
- Médico no puede cambiar su propio `verificationStatus`.
- Soporte/admin puede validar médico según rol.
- Admin puede gestionar IA/Gmail/configuración.
- Superadmin tiene control global.
- Ningún cliente puede leer `aiApiKeys.encryptedSecretRef` si no es operación backend autorizada.
- Las escrituras clínicas críticas deben pasar por backend/Cloud Functions.
- `actionReceipts` no se modifican ni eliminan desde cliente.
- No se permite hard delete de expediente desde cliente; se crea `deletionRequest`.

## 2.9 Almacenamiento de RAG

El RAG del repositorio se administra en archivos versionados:

```txt
data/medical-rag/
  registry/
  source-discovery/
  contributors/
  permissions/
  lifecycle/
  corpus/
  evaluation/
  governance/
  tomes/
    00_governance/
    01_red_flags_triage/
    02_clinical_history_anamnesis/
    03_general_medicine_adult/
    04_pediatrics_safe/
    05_otc_symptomatic_recommendations/
    06_frequent_specialties/
    07_imaging_orientation/
    08_oncology_red_flags/
    09_multilingual_regionalization/
```

Cada tomo debe tener release:

```txt
data/medical-rag/tomes/<tome_id>/release/
  tome_manifest.json
  source_map.json
  chunks.jsonl
  contracts/
  validation/
  review_status.json
  REVIEW_GATE.md
  RELEASE_CHECKLIST.md
  CHANGELOG.md
```

En producción, estos chunks pueden indexarse en:

- Vector DB local/remota.
- Firestore como metadatos solamente.
- Cloud Storage para JSONL versionados.
- Motor híbrido BM25 + embeddings.

Firestore no debe ser el único vector store si el volumen crece mucho.

---

# 3. Especificación de Módulos Core y Funcionalidades Planificadas

## 3.1 Módulo Auth / Identity

### Funciones

- Registro.
- Login.
- Recuperación de contraseña.
- Roles.
- Sesiones.
- Detección de región/idioma en primer acceso.
- Aceptación de términos y política.
- Disclaimer visible en login.

### Reglas

- El usuario al iniciar sesión acepta políticas vigentes.
- Debe existir enlace visible a Política de Privacidad.
- Debe registrarse aceptación por versión de documento.
- Multi-idioma ES/EN.

## 3.2 Módulo Paciente / Expediente Clínico

### Funciones

- Perfil paciente.
- Antecedentes.
- Alergias.
- Medicamentos actuales.
- Condiciones crónicas.
- Evidencias/documentos.
- Historial de consultas IA.
- Historial de citas.
- Eliminación de expediente por usuario.

### Reglas

- Al eliminar expediente, mostrar advertencia: si se elimina, la IA ya no podrá recuperar esa información.
- Si no se elimina manualmente, expediente en estado `curado` se elimina después de 6 meses.
- La eliminación debe ser auditable.
- Logs no deben contener PHI ordinaria.

## 3.3 Módulo Consulta IA Clínica

### Funciones

- Chat IA.
- Recolección progresiva de síntomas.
- Preguntas de evidencia mínima.
- Triage.
- Diagnóstico/orientación bajo guardrails.
- RAG clínico por tomos.
- Web médica permitida desde release con control.
- Detección de red flags.
- Derivación inmediata.

### Reglas

- Si hay evidencia insuficiente, preguntar más.
- Si no se puede obtener evidencia o hay gravedad, derivar a consulta médica física/humana.
- Si hay red flag, derivar a urgencias/atención inmediata.
- No inventar diagnóstico definitivo sin evidencia.
- No recetar controlados.
- No generar falsa certeza.
- Mantener trazabilidad de fuentes internas del RAG.

## 3.4 Módulo Recomendación Sintomatológica

### Funciones

- Emitir documento/tarjeta titulada **Recomendación Sintomatológica**.
- Incluir medidas generales.
- Incluir OTC cuando aplique.
- Incluir signos de alarma para regresar/consultar.
- Incluir disclaimer.

### Reglas

- No llamarlo receta médica.
- Solo emitir si hay evidencia suficiente.
- No emitir si hay sospecha de gravedad.
- No emitir si falta edad/peso en pediatría cuando sea relevante.
- Nunca incluir controlados.

## 3.5 Módulo Médico

### Funciones

- Registro de médico.
- Captura de cédula profesional.
- Adjuntar INE o cédula/foto.
- Workflow de revisión.
- Activación por admin/soporte.
- Agenda.
- Consulta de expediente autorizado.
- Citas por Meet.
- Cobros/pagos.

### Reglas

- Médico inicia en estado `En revisión`.
- Solo admin/soporte puede pasarlo a `Activo`.
- Solo médicos `Activos` pueden tomar citas.
- Médico no puede autovalidarse.
- Validación debe quedar en auditoría.

## 3.6 Módulo Citas / Google Meet

### Funciones

- Disponibilidad médica.
- Reserva.
- Pago previo o flujo definido.
- Creación Google Meet.
- Confirmación por email.
- Historial.

### Reglas

- Proveedor de videollamada: Google Meet.
- Si Meet falla, reintentos y fallback operativo.
- No exponer datos sensibles en título/descripción del evento.

## 3.7 Módulo Pagos

### Funciones

- Pagos reales en release productivo.
- Sandbox solo QA.
- Stripe como opción objetivo documentada.
- Ledger.
- Webhooks.
- Idempotencia.
- Reportes contables.

### Reglas

- Cada webhook debe ser idempotente.
- Nunca duplicar saldo/cobro.
- Ledger append-only.
- Reembolsos auditables.
- Impuestos/comprobación fiscal no definidos todavía; deben definirse por país antes de release comercial.

## 3.8 Módulo AI Gateway / Autorouting

### Funciones

- Alta de proveedor IA desde dashboard admin.
- Protocolos: OpenAI-compatible, Claude-compatible, genérico HTTP.
- Captura de base URL.
- Captura de API key.
- Consulta dinámica de modelos.
- Activación de modelos.
- Activación de múltiples proveedores/API keys/modelos.
- Healthchecks.
- Autorouting a proveedor/modelo activo y disponible.
- Fallback.
- Trazabilidad.

### Reglas

- API keys cifradas/no visibles.
- No enviar PHI innecesaria.
- Fail-closed para riesgo clínico.
- No depender de un único proveedor.
- Si un modelo falla, intentar fallback seguro.
- Si todos fallan en caso clínico sensible, informar indisponibilidad y recomendar atención humana si aplica.

## 3.9 Módulo Admin

### Funciones

- Dashboard de plataforma.
- Configurar proveedores IA.
- Configurar Gmail.
- Configurar policy packs por país.
- Gestionar médicos.
- Gestionar roles.
- Ver métricas.
- Revisar audit logs.
- Activar/desactivar tomos RAG aprobados.

## 3.10 Módulo Notificaciones Gmail

### Funciones

- Configurar cuenta Gmail por admin.
- Plantillas de correo.
- Notificaciones de cita.
- Notificaciones de validación médico.
- Notificaciones operativas.

### Reglas

- Gmail configurable, editable y establecible por administrador.
- OAuth/secretos no deben guardarse en plano.
- Reintentos y trazabilidad.

## 3.11 Módulo Medical RAG

### Funciones

- Source registry.
- Licensing policy.
- Tomos por dominio.
- Chunks JSONL.
- Evaluación anti-under-triage.
- Revisión médica/legal.
- Contribuciones de especialistas.
- Permisos de autores/instituciones.
- RAG base Glouu independiente de contribuciones futuras.

### Reglas

- OpenCode no autoriza ni inventa medicina.
- Cada fuente debe tener licencia/estatus legal.
- Cada chunk debe tener revisión médica/legal si pasa a producción.
- Cada tomo debe tener manifest, source map, chunks, eval report, changelog.
- Se permite ampliar con autores/libros/páginas solo con autorización explícita.

---

# 4. Estado del Desarrollo

## 4.1 Estado de código real

Al corte de este documento, el proyecto contiene principalmente:

- Documentación Markdown.
- Tracker XLSX.
- Prompts.
- Estructura de Medical RAG.
- Scripts de validación de Medical RAG bajo `tools/medical-rag/`.
- Archivos JSON/JSONL del Tomo 01.

No se detecta todavía como implementado:

- Aplicación Next.js funcional.
- `package.json` raíz con app productiva.
- Componentes React reales.
- Backend productivo.
- Firebase/Firestore real.
- PostgreSQL real.
- Auth real.
- Pagos reales.
- Google Meet real.
- Gmail real.
- AI Gateway funcional.
- UI operativa.

## 4.2 Repositorio remoto observado

Repositorio público: `DevDanielAlcazar/App_Medica`.

Estructura visible en GitHub al corte:

```txt
data/medical-rag/
docs/
prompts/
tools/medical-rag/
00_README.md
01_PRD_App_Medica_Release_v1.md
02_Plan_Desarrollo.md
03_Documento_Desarrollo.md
04_Documento_Entregable.md
05_Fases_Desarrollo_Checklists.md
06_Arquitectura_Tecnica.md
07_Delivery_Checklists.md
08_UI_UX_Design_System_2026.md
09_Seguridad_Compliance_Medico.md
10_AI_Gateway_Autorouting.md
11_Guardrails_Clinicos.md
12_Politica_Privacidad_Borrador.md
13_Terminos_Disclaimer_Borrador.md
14_Backlog_Release.md
15_Matriz_Riesgos.md
16_Decisiones_Cerradas_y_Gates.md
App_Medica_Project_Tracker_v2.xlsx
README.md
```

## 4.3 Estado por prompt ejecutado

### Prompt 01 — Bootstrap gobernanza técnica repo

**Resultado reportado:** completado.

Archivos creados:

- `README.md`
- `.gitignore`
- `.editorconfig`
- `.env.example`
- `docs/_PROJECT_CONTEXT_COMPILED.md`
- `docs/adr/ADR-0001-stack-y-gobernanza.md`
- `docs/delivery/RELEASE_GATES.md`
- `docs/quality/DEFINITION_OF_DONE.md`
- `docs/security/SECURITY_AND_PRIVACY_BASELINE.md`
- `docs/clinical/CLINICAL_GUARDRAILS_INDEX.md`
- `docs/ai/AI_GATEWAY_BASELINE.md`
- `prompts/README.md`

Validaciones:

- No existe `.env` real en repo.
- `.env.example` solo placeholders.
- No se implementó código de negocio.
- Git muestra archivos nuevos sin cambios destructivos.

Notas:

- Preguntó sobre monorepo, storage S3-compatible y Turbo; aún no son decisiones cerradas.

### Prompt 02 — Medical RAG Governance & Source Registry

**Resultado reportado:** completado.

Archivos/estructuras creadas:

- `data/medical-rag/README.md`
- `data/medical-rag/registry/source_registry.schema.json`
- `data/medical-rag/registry/source_registry.example.json`
- `data/medical-rag/registry/source_registry.pending.md`
- `data/medical-rag/registry/licensing_policy.md`
- `data/medical-rag/tomes/README.md`
- `data/medical-rag/pipeline/`
- `data/medical-rag/evaluation/`
- `data/medical-rag/governance/`
- `docs/architecture/MEDICAL_RAG_ARCHITECTURE.md`
- `docs/reports/PROMPT_02_EXECUTION_REPORT.md`

Decisiones:

- JSON Schema para fuentes.
- Estados de tomo: `draft → license_review → medical_review → legal_review → approved_for_production`.
- Metadata: `license_status`, `red_flag_relevant`, `clinical_action_type`.
- Evidence grading `A > B > C > D > X`.
- Retrieval filtrado por jurisdicción, edad y especialidad.

### Prompt 03 — Medical RAG Lifecycle, contribuciones, mantenimiento

**Resultado reportado:** completado.

Archivos creados:

- `data/medical-rag/contributors/` con 9 archivos.
- `data/medical-rag/permissions/` con 4 archivos.
- `data/medical-rag/lifecycle/` con 8 archivos.
- `data/medical-rag/corpus/` con 4 archivos.
- `data/medical-rag/evaluation/` con 3 plantillas adicionales.

Archivos modificados:

- `data/medical-rag/README.md` agregó extensibilidad.
- `data/medical-rag/governance/change_control.md`.
- `data/medical-rag/governance/source_acceptance_criteria.md`.
- `docs/architecture/MEDICAL_RAG_ARCHITECTURE.md`.

Decisiones:

- Workflow de contributor documentado.
- Schema de permiso con scopes.
- Matriz de compatibilidad de licencias.
- Branching de corpus: `base`, `regional`, `institutional`.
- Versionado semántico clínico.

### Prompt 04 — Source Discovery Tomo 01 Red Flags/Triage

**Resultado reportado:** completado.

Creó:

- `data/medical-rag/source-discovery/tome_01_red_flags_triage/`
- 10 archivos: README, sources, matrices, templates.

Fuentes candidatas registradas:

- F001–F014, 14 fuentes médicas oficiales candidatas.
- Tier 1: WHO, CDC, MedlinePlus, NHS.
- Riesgo licencia: low/medium/high según fuente.
- Gaps: stroke, anafilaxia, intoxicación, salud mental, fuentes en español para MX/LatAm.

No creó contenido clínico final.

### Prompt 05 — Authoring Plan Tomo 01

**Resultado reportado:** completado.

Creó:

- `data/medical-rag/tomes/01_red_flags_triage/authoring/` con 12 archivos.

Decisiones:

- Chunk atómico con `must_not_say` y `safe_user_message`.
- Taxonomía de severidad `S0–S6`, prevalece el más alto.
- 30 dominios clínicos identificados.
- 60 casos placeholder para under-triage.
- Workflow con estados, transiciones y firmas.

No creó contenido clínico final.

### Prompt 06 — Release Pack Tomo 01 v0.1

**Resultado reportado:** completado.

Creó:

- `data/medical-rag/tomes/01_red_flags_triage/release/` con 16 archivos.

Validaciones:

- `validate_tome_release.mjs` pasó.
- `tome_manifest.json` válido con status `release_candidate_draft`.
- `source_map.json` válido, ninguna fuente aprobada para producción.
- `chunks.jsonl` válido con 1 línea placeholder `is_example_only: true`.

Estado:

- `release_candidate_draft`.
- Sin contenido clínico curado todavía.

### Prompt 07 — Integración Tomo 01 Curado

**Resultado reportado:** completado.

Creó:

- `data/medical-rag/tomes/01_red_flags_triage/curated_input/` con 6 plantillas.
- `data/medical-rag/tomes/01_red_flags_triage/release/` con 5 archivos nuevos.
- `tools/medical-rag/` con 2 scripts de validación.

Modificó:

- `tome_manifest.json` a `awaiting_curated_input`.
- `CHANGELOG.md` nueva entrada v0.1.0.

Validaciones:

- `validate_tome_01_curated_input.mjs` pasó sin input.
- `validate_tome_01_release.mjs` pasó.

Estado:

- Faltan chunks clínicos curados.
- Faltan fuentes aprobadas.
- Revisión médica/legal necesaria.

### Prompt 08 — Contenido clínico curado Tomo 01 v0.1

**Resultado reportado:** completado.

Creó paquete:

- `data/medical-rag/tomes/01_red_flags_triage/curated_input/senior_seed_v0_1/`

Integración release:

- `chunks.jsonl`: 24 chunks, 12 ES + 12 EN.
- `source_map.json`: 13 fuentes integradas.
- Fuentes: WHO, MedlinePlus, CDC, NIMH, Poison Control.
- `tome_manifest.json`: status `release_candidate_clinical_review`, counts 24/13.
- Validation script: PASSED.

Bloqueos restantes:

- Todos los chunks/sources con `medical_review_status: pending`, `legal_review_status: pending`.
- `production_allowed: false`.

### Prompt 09 — Validación y hardening anti under-triage

**Resultado reportado:** completado.

Creó:

- `validation/anti_under_triage_matrix.json`
- `validation/clinical_safety_rules.json`
- `validation/evaluation_cases.jsonl`
- `validation/coverage_report.md`
- `validation/risk_register.md`
- `validation/human_review_packet.md`
- `validation/README.md`

Resultados:

- 20 dominios en matrix: 12 cubiertos, 8 missing con 0 required.
- 14 reglas estructuradas.
- 40 casos de evaluación.
- Release pack PASSED: 24 chunks, 13 sources.
- Status unchanged: `release_candidate_clinical_review`.
- `production_allowed: false` confirmado.
- No under-triage detectado en chunks actuales: todos S5/S6 tienen acciones de emergencia.

### Prompt 10 — Expansión v0.2 cobertura crítica

**Resultado reportado:** completado con una incidencia no bloqueante.

Incidencia:

- Error: `Cannot find module 'D:\Desarrollos\App_Medica\scripts\update_coverage.js'`.
- Aun así, el reporte final indicó completado y validación passed.

Archivos creados:

- `curated_input/senior_seed_v0_2/sources_delta_v0_2.json`: 15 sources.
- `curated_input/senior_seed_v0_2/chunks_delta_v0_2.jsonl`: 30 chunks.
- `curated_input/senior_seed_v0_2/README.md`.
- `curated_input/senior_seed_v0_2/coverage_delta_v0_2.md`.

Archivos modificados:

- `release/chunks.jsonl`: 24 → 54 chunks.
- `release/source_map.json`: 13 → 28 sources.
- `release/tome_manifest.json`: v0.1.0 → v0.2.0.
- `validation/anti_under_triage_matrix.json`: 20 → 35 domains.
- `validation/evaluation_cases.jsonl`: 40 → 80 cases.
- `release/CHANGELOG.md`: v0.2.0 added.

Validación:

- PASSED.
- `production_allowed: false`.
- status `release_candidate_clinical_review`.

### Prompt 11 — Medical/Legal Review Packet

**Resultado reportado:** completado.

Creó:

- `review_packet_v0_2/` con 12 archivos.
- `README.md`, guides, tables, templates, checklists.

Modificó:

- `release/review_status.json` creado con pending status.
- `release/REVIEW_GATE.md` creado.

Estado:

- Sources: 28.
- Chunks: 54.
- Eval cases: 80.
- `production_allowed: false` confirmado.
- Status: `pending_medical_and_legal_review`.

### Prompt 12A — Aplicar aprobación médico/legal Tomo 01 v0.2.1

**Estado:** generado, pendiente de ejecución al momento de este volcado.

Instrucción del usuario:

- Médico aprobó chunks.
- Abogado aprobó fuentes.
- Ambos aprueban cambiar `production_allowed` a `true`.
- Aprobación aplica al Tomo 01 actual, no a toda la app ni a futuras expansiones.

Debe hacer:

- Actualizar manifest a v0.2.1 o equivalente.
- Cambiar `production_allowed: true` para Tomo 01 aprobado.
- Marcar review statuses approved.
- Crear evidencia auditable.
- Mantener trazabilidad.

### Prompt 12B — Expansión candidata v0.3 cobertura extendida

**Estado:** generado, pendiente de ejecución al momento de este volcado.

Debe hacer:

- Crear expansión candidata v0.3 sin contaminar release aprobado.
- Añadir cobertura extendida.
- Mantener nueva expansión como pendiente de revisión médica/legal.
- No cambiar `production_allowed` del candidato hasta aprobación.

## 4.4 Documentos base generados

Carpeta local previa:

```txt
/mnt/data/app_medica_documentacion_v2/
```

Documentos:

- `00_README.md`
- `01_PRD_App_Medica_Release_v1.md`
- `02_Plan_Desarrollo.md`
- `03_Documento_Desarrollo.md`
- `04_Documento_Entregable.md`
- `05_Fases_Desarrollo_Checklists.md`
- `06_Arquitectura_Tecnica.md`
- `07_Delivery_Checklists.md`
- `08_UI_UX_Design_System_2026.md`
- `09_Seguridad_Compliance_Medico.md`
- `10_AI_Gateway_Autorouting.md`
- `11_Guardrails_Clinicos.md`
- `12_Politica_Privacidad_Borrador.md`
- `13_Terminos_Disclaimer_Borrador.md`
- `14_Backlog_Release.md`
- `15_Matriz_Riesgos.md`
- `16_Decisiones_Cerradas_y_Gates.md`
- `App_Medica_Project_Tracker_v2.xlsx`

## 4.5 Tracker

Archivo tracker generado:

```txt
App_Medica_Project_Tracker_v2.xlsx
```

Incluye:

- Dashboard.
- Seguimiento.
- Requerimientos.
- Backlog release.
- Checklist delivery.
- Riesgos.
- Decisiones.
- Fuentes.
- Notas originales.

---

# 5. Stack Tecnológico, Dependencias Clave y Configuración

## 5.1 Stack objetivo actual

| Área | Stack |
|---|---|
| Lenguaje | TypeScript estricto |
| Frontend | Next.js App Router + React |
| UI | Tailwind CSS + componentes accesibles |
| PWA | Web responsive instalable opcional, no APK |
| Backend | Node.js modular + Route Handlers / Server Actions |
| DB original | PostgreSQL |
| DB alternativa migración | Firebase/Firestore |
| Storage | Cloud Storage / S3-compatible cifrado |
| Jobs/colas | Redis/BullMQ o Cloud Tasks equivalente |
| IA | AI Gateway multi-proveedor |
| RAG | JSONL versionado + vector DB futuro |
| Video | Google Meet |
| Email | Gmail configurable |
| Pagos | Stripe live producción |
| Deploy | GitHub → Debian → PM2 → Cloudflare Tunnel |
| Observabilidad | Logs estructurados, healthchecks, métricas |

## 5.2 Dependencias previstas si se usa Next.js + Firebase

```json
{
  "runtime": "node >= 20 LTS",
  "framework": "next",
  "language": "typescript",
  "ui": ["tailwindcss", "class-variance-authority", "lucide-react"],
  "forms": ["react-hook-form", "zod"],
  "firebase": ["firebase", "firebase-admin"],
  "payments": ["stripe"],
  "queues_optional": ["bullmq", "ioredis"],
  "testing": ["vitest", "playwright", "@testing-library/react"],
  "quality": ["eslint", "prettier"],
  "security_optional": ["helmet"],
  "validation": ["zod"]
}
```

## 5.3 Variables de entorno esperadas

```env
# App
APP_ENV=development
APP_URL=http://localhost:3000
APP_REGION_DEFAULT=MX
APP_LOCALE_DEFAULT=es-MX

# Firebase client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase admin
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Google Meet / Calendar
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_SERVICE_ACCOUNT_JSON=

# Gmail notifier
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
GMAIL_SENDER_EMAIL=

# AI Gateway
AI_GATEWAY_ENCRYPTION_KEY=
AI_PROVIDER_DEFAULT_TIMEOUT_MS=45000
AI_PROVIDER_MAX_RETRIES=2

# RAG
MEDICAL_RAG_ACTIVE_TOMES=01_red_flags_triage@0.2.1
MEDICAL_RAG_FAIL_CLOSED=true

# Security
SESSION_SECRET=
AUDIT_LOG_SALT=
```

## 5.4 Configuración local objetivo

```bash
cd D:\Desarrollos\App_Medica
npm install
npm run dev
npm run lint
npm run test
npm run build
```

Actualmente estos comandos pueden no existir porque no hay app Next.js implementada todavía.

## 5.5 Deploy objetivo Debian + PM2 + Cloudflare Tunnel

Flujo:

```txt
GitHub push
  ↓
Servidor Debian pull/clone
  ↓
npm ci
  ↓
npm run build
  ↓
pm2 start ecosystem.config.js
  ↓
cloudflared tunnel route
  ↓
Internet HTTPS sin abrir puertos directamente
```

PM2 esperado:

```js
module.exports = {
  apps: [
    {
      name: 'app-medica',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
```

## 5.6 Branching recomendado

```txt
main        → release estable / producción
staging     → validación pre-release
dev         → integración diaria
feature/*   → tareas específicas
rag/*       → cambios de RAG/tomos
hotfix/*    → correcciones críticas
```

---

# 6. Reglas de Negocio Críticas

## 6.1 Disclaimer y consentimiento

- Mostrar disclaimer discreto pero visible en login.
- Informar que al iniciar sesión el usuario acepta políticas de privacidad.
- Debe existir enlace a política generada por el equipo.
- Registrar aceptación por versión.

Texto base:

```txt
Al iniciar sesión aceptas nuestra Política de Privacidad y Términos de Uso. Esta plataforma utiliza IA para orientación y apoyo informativo, pero no sustituye una valoración médica presencial cuando existan signos de alarma o falta de información suficiente.
```

## 6.2 Alcance clínico

- La IA puede diagnosticar/orientar bajo guardrails.
- No puede recetar controlados.
- Puede emitir **Recomendación Sintomatológica**.
- Puede sugerir OTC si existe evidencia suficiente.
- Puede tratar niños con guardrails reforzados.
- Si no hay evidencia suficiente, debe preguntar.
- Si no se consigue evidencia o hay riesgo, deriva a médico humano/presencial.

## 6.3 Árbol de decisión médico base

```txt
Inicio consulta
  ↓
Recolectar edad, sexo, región, síntoma principal, duración, severidad, antecedentes, alergias, medicamentos, embarazo/pediatría cuando aplique
  ↓
¿Hay signos de alarma / red flags?
  ├─ Sí → Estado Rojo → Derivar urgencias/consulta física inmediata → No emitir recomendación sintomatológica
  └─ No
      ↓
¿Evidencia mínima suficiente?
  ├─ No → Estado Amarillo → Preguntar datos faltantes
  │       ↓
  │       ¿Usuario no puede responder o datos siguen insuficientes?
  │          ├─ Sí → Recomendar consulta médica humana/física
  │          └─ No → Revaluar
  └─ Sí
      ↓
¿Condición compatible con orientación de bajo riesgo?
  ├─ Sí → Estado Verde → Orientación + posible Recomendación Sintomatológica
  └─ No → Consulta médica humana
```

## 6.4 Estados clínicos

| Estado | Significado | Acción |
|---|---|---|
| Verde | Evidencia suficiente, bajo riesgo | Orientar, seguimiento, posible recomendación sintomatológica |
| Amarillo | Evidencia incompleta o riesgo moderado | Preguntar más o recomendar cita médica |
| Rojo | Red flags o gravedad | Derivar a urgencias/consulta física inmediata |

## 6.5 Severidad Tomo 01

Taxonomía definida por authoring pack:

```txt
S0 = Sin riesgo clínico relevante
S1 = Bajo riesgo
S2 = Riesgo leve que requiere vigilancia
S3 = Riesgo moderado / consulta médica recomendada
S4 = Riesgo alto / atención médica pronta
S5 = Emergencia potencial / urgencias
S6 = Emergencia crítica / atención inmediata
```

Regla: si hay conflicto, prevalece la severidad más alta.

## 6.6 Reglas anti under-triage

- La IA debe sobre-escalar ante incertidumbre crítica.
- No minimizar dolor torácico con red flags.
- No minimizar dificultad respiratoria.
- No minimizar síntomas neurológicos súbitos.
- No minimizar fiebre en lactantes.
- No minimizar anafilaxia.
- No minimizar intoxicación.
- No minimizar crisis suicida/autolesión.
- No minimizar embarazo/posparto con signos de alarma.
- Todo S5/S6 debe tener acción de emergencia.

## 6.7 Red flags iniciales Tomo 01

Cobertura actual v0.2 incluye, entre otros:

- Emergencia general adulto.
- Emergencia pediátrica.
- Dolor torácico.
- Evento cerebrovascular/stroke.
- Dificultad respiratoria.
- Fiebre en lactantes.
- Anafilaxia.
- Intoxicación.
- Crisis de autolesión/suicidio.
- Embarazo/puerperio.
- Monóxido de carbono.
- Sepsis.
- Trauma craneal.
- Abdomen agudo.
- Golpe de calor.
- Hipotermia.
- Diabetes: hipoglucemia/cetoacidosis.
- Convulsiones.
- Embarazo ectópico.
- Embolia pulmonar en embarazo.
- Emergencias pediátricas ampliadas.

## 6.8 Participación médica humana

- Médico registra número de cédula profesional.
- Médico adjunta foto de INE o cédula para validar identidad.
- Estado inicial: `En revisión`.
- Admin/soporte valida autenticidad y pertenencia.
- Solo estado `Activo` permite tomar citas.
- Validación queda auditada.

## 6.9 Video consulta

- Proveedor: Google Meet.
- La cita debe generar link Meet.
- No incluir PHI sensible en el título/descripción visible de evento.
- En caso de falla, reintentos y soporte.

## 6.10 Proveedores IA dinámicos

- Admin puede agregar cualquier proveedor compatible con protocolo OpenAI, Claude o genérico.
- Se captura URL/baseURL y API key.
- La app debe consultar modelos disponibles si el proveedor lo permite.
- Admin puede activar cualquier cantidad de proveedores/API keys/modelos.
- Autorouting usa proveedor activo/disponible.
- Puede usar proveedores gratuitos o de pago.
- Inicialmente se contemplan OpenCode, Poolside, OpenRouter, Groq, Cerebras, Kilo Code u otros.

## 6.11 Retención de datos

- Usuario puede eliminar expediente en cualquier momento.
- Debe aceptar advertencia de pérdida de contexto clínico IA.
- Si no elimina, expediente en estado `curado` se elimina después de 6 meses.
- El borrado debe ahorrar espacio y mantener privacidad.
- Auditoría debe preservar evidencia mínima sin PHI cuando sea legalmente posible.

## 6.12 Notificaciones

- Opción 2 definida: enviar correo vía Gmail.
- Gmail configurable por admin desde dashboard.
- Admin puede editar/configurar correo de envío.

## 6.13 Jurisdicción / idioma

- Operación inicial: México, Estados Unidos, Latinoamérica y países de habla inglesa.
- App bilingüe ES/EN.
- Toggle de idioma.
- Primera vez detecta lugar/región para establecer idioma nativo.
- Deben existir policy packs por país/región antes de activación productiva completa.

## 6.14 Web médica

- Permitida desde release.
- Debe tener control de fuentes.
- Debe evitar sitios no confiables.
- Para respuestas clínicas, priorizar RAG aprobado y fuentes oficiales.

## 6.15 Fiscal / Zammad / e-Billia

No existe requerimiento vigente de integrar Zammad/e-Billia en App Médica. Esos dominios pertenecen a otros proyectos/operaciones de Glouu:

- Zammad: proyecto de sistema de tickets con IA auto-hosteada.
- e-Billia: soporte/proveedores/facturación/CFDI/OC/EM.

Regla de migración:

- No mezclar lógicas fiscales CFDI/e-Billia con App Médica salvo que se cree un módulo explícito futuro.
- Para pagos médicos, la lógica fiscal/tax todavía está pendiente por país.
- Stripe o proveedor de pagos debe manejar cobro; facturación fiscal requiere diseño específico posterior.

---

# 7. Lineamientos UI/UX Deseados

## 7.1 Norte UX

La UI debe sentirse:

- Premium.
- Humana.
- Confiable.
- Moderna.
- Rápida.
- Clínica sin verse fría.
- No genérica.
- No basada en dashboards comunes quemados.
- Accesible WCAG 2.2 AA.
- Mobile-first y 100% responsiva.
- Preparada para modo claro/oscuro.

## 7.2 Patrones propios definidos

### Conversational Care Canvas

Centro de experiencia clínica. No es un chat plano genérico. Debe combinar:

- Conversación IA.
- Captura estructurada progresiva.
- Evidencia faltante.
- Estado de seguridad.
- Siguiente mejor acción.

### Context Rail

Panel lateral/contextual con:

- Resumen del expediente.
- Datos clínicos relevantes.
- Evidencias.
- Riesgos.
- Fuentes usadas.
- Próximos pasos.

### Clinical Timeline River

Historial clínico visual por eventos:

- Síntomas.
- Consultas IA.
- Recomendaciones.
- Citas médicas.
- Documentos.
- Derivaciones.

### Safety Ribbon

Elemento persistente y discreto de seguridad:

- Verde/amarillo/rojo.
- Indica si hay red flags.
- Indica si falta evidencia.
- Indica si se recomienda urgencias.

### Action Receipts

Confirmación visible de acciones sensibles:

- Expediente actualizado.
- Médico validado.
- Recomendación emitida.
- Cita creada.
- Pago recibido.
- Expediente eliminado.

## 7.3 Componentes base

- App shell responsive.
- Sidebar collapsible.
- Topbar con tema/idioma/user menu.
- Cards clínicas.
- Chips de riesgo.
- Timeline.
- Steppers.
- Drawers.
- Modals de confirmación sensible.
- Formularios con validación inline.
- Uploaders seguros.
- Tablas admin.
- Empty states profesionales.
- Skeletons.
- Toasts no invasivos.
- Error boundaries.

## 7.4 Tema claro/oscuro

- Toggle intuitivo dentro de la app.
- Preferencia guardada por usuario.
- Soporte `system`.
- Evitar contrastes pobres.
- No usar colores de riesgo solo por color; acompañar con texto/icono.

## 7.5 Responsive

- Debe funcionar en móvil, tablet y desktop.
- Web-first, no APK.
- PWA opcional.
- Mobile con navegación inferior o top compacta.
- Desktop con Context Rail y Timeline.

## 7.6 Tailwind / design tokens

Tokens sugeridos:

```txt
--background
--foreground
--surface
--surface-elevated
--border
--muted
--primary
--primary-foreground
--success
--warning
--danger
--clinical-red
--clinical-yellow
--clinical-green
```

No hardcodear colores clínicos directamente en componentes.

## 7.7 Accesibilidad

- WCAG 2.2 AA.
- Navegación teclado.
- Focus visible.
- ARIA cuando aplique.
- Labels reales.
- Contraste adecuado.
- Mensajes de error claros.
- No depender solo del color.
- Estados de carga claros.

---

# 8. Backlog Release v1.0

## 8.1 Épicas P0

| Épica | Descripción |
|---|---|
| EP-01 Plataforma base | Next/Firebase o Next/Postgres, auth, layout, configuración |
| EP-02 Expediente clínico | Perfil, antecedentes, alergias, documentos, retención |
| EP-03 IA clínica | AI Gateway, RAG, guardrails, triage, recomendaciones |
| EP-04 Médicos y citas | Registro, validación, agenda, Google Meet |
| EP-05 Pagos | Stripe live, webhooks, ledger |
| EP-06 Operación | Admin, soporte, Gmail, auditoría, métricas |

## 8.2 Historias principales

| ID | Historia | Prioridad | Estado |
|---|---|---:|---|
| US-001 | Consulta IA con texto/imagen/PDF | P0 | No iniciado |
| US-002 | Actualizar expediente desde conversación | P0 | No iniciado |
| US-003 | Descargar reporte de derivación | P0 | No iniciado |
| US-004 | Emitir Recomendación Sintomatológica | P0 | No iniciado |
| US-005 | Eliminar expediente | P0 | No iniciado |
| US-006 | Validar médico | P0 | No iniciado |
| US-007 | Pagar cita y generar Meet | P0 | No iniciado |
| US-008 | Configurar proveedor IA | P0 | No iniciado |
| US-009 | Autorouting IA | P0 | No iniciado |
| US-010 | Gmail notificador | P1 | No iniciado |
| US-011 | Dashboard soporte | P1 | No iniciado |
| US-012 | Dashboard contabilidad | P1 | No iniciado |

---

# 9. Decisiones Cerradas

| ID | Tema | Decisión |
|---|---|---|
| D-001 | Jurisdicción | México, EE.UU., LatAm y países de habla inglesa por configuración |
| D-002 | Disclaimer | Visible en login con enlace a política |
| D-003 | Alcance clínico | IA puede orientar/diagnosticar bajo guardrails |
| D-004 | Recomendación | Usar título `Recomendación Sintomatológica` |
| D-005 | Controlados | Nunca recetar controlados |
| D-006 | Médicos | Cédula + identidad; `En revisión` hasta validación |
| D-007 | Videocita | Google Meet |
| D-008 | IA | Proveedores dinámicos OpenAI/Claude/genérico |
| D-009 | Retención | Usuario elimina cuando quiera; curado + 6 meses |
| D-010 | Notificaciones | Gmail configurable por admin |
| D-011 | Web médica | Permitida desde release con control |
| D-012 | Pagos | Reales en release productivo |
| D-013 | RAG | Por tomos, fuente auditable, revisión médica/legal |
| D-014 | Autoría RAG | ChatGPT/arquitecto senior cura contenido; OpenCode integra/valida |
| D-015 | Prompts | No incluir modelos recomendados dentro de los `.md`; eso queda solo en conversación |

---

# 10. Gates Obligatorios

## 10.1 Gate Legal

- Política de privacidad aprobada.
- Términos aprobados.
- Consentimientos versionados.
- Policy packs por país/región.
- Fuentes RAG aprobadas.
- Permisos para fuentes externas/autores cuando aplique.

## 10.2 Gate Médico

- Red flags aprobados.
- Pediatría aprobada.
- OTC aprobado.
- Guardrails aprobados.
- Evaluaciones anti-under-triage aprobadas.
- Tomos productivos aprobados por versión.

## 10.3 Gate Seguridad

- RBAC/ABAC.
- Cifrado.
- Auditoría.
- Logs sin PHI.
- Secretos fuera del repo.
- Reglas Firestore/DB revisadas.
- Storage con signed URLs.

## 10.4 Gate Pagos

- Stripe live.
- Webhooks idempotentes.
- Ledger.
- Reembolsos.
- Conciliación.
- Pruebas de doble evento.

## 10.5 Gate DevOps

- Build verde.
- Tests verdes.
- Healthchecks.
- PM2 config.
- Cloudflare Tunnel.
- Backup/restore.
- Rollback.

## 10.6 Gate Accesibilidad

- WCAG 2.2 AA.
- Keyboard navigation.
- Contraste.
- Focus.
- Labels.

---

# 11. Matriz de Riesgos

| ID | Riesgo | Severidad | Mitigación |
|---|---|---:|---|
| R-001 | Diagnóstico/recomendación incorrecta | Crítico | Guardrails, red flags, evidencia mínima, pruebas clínicas |
| R-002 | Multi-país sin revisión local | Crítico | Policy pack por país antes de activación |
| R-003 | Exposición de datos sensibles | Crítico | Cifrado, RBAC, auditoría, logs sin PHI |
| R-004 | Doble saldo por Stripe | Alto | Webhooks idempotentes y ledger |
| R-005 | Proveedor IA no disponible | Alto | Autorouting, fallback, healthchecks |
| R-006 | Médico no validado toma cita | Crítico | Constraint backend y estatus Activo |
| R-007 | Pediatría sin datos mínimos | Crítico | Checklist pediátrico obligatorio |
| R-008 | Servidor local saturado | Alto | Offload seguro, colas, caché, límites |
| R-009 | Meet no se genera | Medio | Reintentos y fallback operativo |
| R-010 | UX genérica/desconfianza | Medio | Patrones propios y pruebas de usabilidad |
| R-011 | RAG con fuente no autorizada | Crítico | Source registry y legal review |
| R-012 | OpenCode inventa medicina | Crítico | Prohibición explícita, solo integración/validación |
| R-013 | Expansión RAG contamina release aprobado | Alto | Release candidates separados y versionados |
| R-014 | Falta de revisión médica en expansión | Crítico | Estado candidato hasta aprobación |

---

# 12. Medical RAG — Estrategia Completa

## 12.1 Objetivo del Medical RAG

Construir una base clínica gobernada capaz de soportar orientación médica de alta calidad, iniciando por seguridad y red flags, y expandiéndose por tomos hacia medicina general, pediatría, OTC, especialidades, imagenología, oncología y regionalización.

## 12.2 Filosofía

No se trata de meter cientos de libros sin control. Se trata de crear un **Medical Knowledge RAG Gold Standard** por tomos, con:

- Fuentes auditables.
- Licencias revisadas.
- Chunks atómicos.
- Metadata clínica.
- Revisión médica/legal.
- Evaluaciones.
- Versionado.
- Capacidad de mantenimiento.
- Capacidad de contribuciones externas.

## 12.3 Tomos planeados

| Tomo | Nombre | Estado |
|---:|---|---|
| 00 | Governance | Estructura creada |
| 01 | Red Flags / Triage / Derivación inmediata | v0.2 candidato, aprobación reportada, 12A pendiente |
| 02 | Clinical History / Anamnesis | Carpeta base creada, contenido pendiente |
| 03 | Medicina General Adulto | Carpeta base creada, contenido pendiente |
| 04 | Pediatría segura | Carpeta base creada, contenido pendiente |
| 05 | OTC / Recomendaciones sintomatológicas | Carpeta base creada, contenido pendiente |
| 06 | Especialidades frecuentes | Carpeta base creada, contenido pendiente |
| 07 | Imagenología orientativa | Carpeta base creada, contenido pendiente |
| 08 | Oncología / Red flags | Carpeta base creada, contenido pendiente |
| 09 | Multilingüe / Regionalización | Carpeta base creada, contenido pendiente |

## 12.4 Carpeta para depositar tomos

```txt
D:\Desarrollos\App_Medica\data\medical-rag\tomes\<tome_id>\release\
```

Ejemplo:

```txt
D:\Desarrollos\App_Medica\data\medical-rag\tomes\01_red_flags_triage\release\
```

## 12.5 Archivos estándar por tomo

```txt
tome_manifest.json
source_map.json
chunks.jsonl
clinical_review_report.md
legal_review_report.md
eval_report.md
CHANGELOG.md
RELEASE_CHECKLIST.md
REVIEW_GATE.md
review_status.json
contracts/chunk_contract.schema.json
validation/evaluation_cases.jsonl
validation/anti_under_triage_matrix.json
validation/clinical_safety_rules.json
```

## 12.6 Metadata mínima por chunk

```json
{
  "chunk_id": "T01-ES-0001",
  "tome_id": "01_red_flags_triage",
  "version": "0.2.1",
  "language": "es",
  "specialty": "emergency_medicine",
  "clinical_domain": "chest_pain",
  "population": ["adult"],
  "jurisdiction": ["global", "MX", "US", "LATAM"],
  "severity": "S6",
  "clinical_action_type": "emergency_referral",
  "red_flag_relevant": true,
  "evidence_level": "A",
  "source_ids": ["F001"],
  "safe_user_message": "...",
  "must_not_say": ["..."],
  "medical_review_status": "approved|pending",
  "legal_review_status": "approved|pending",
  "production_allowed": true
}
```

## 12.7 Fuentes permitidas

Prioridad:

1. WHO.
2. CDC.
3. NIH / MedlinePlus.
4. NIMH.
5. Poison Control.
6. NHS cuando licencia lo permita.
7. Guías oficiales país/región.
8. Open access con licencia compatible.
9. Autores/libros/páginas con permiso explícito documentado.

No usar libros comerciales sin permiso expreso.

## 12.8 Mantenimiento y contribuciones

Se soportan escenarios:

- Especialista médico aporta conocimiento.
- Autor de libro autoriza uso.
- Página/institución autoriza uso.
- Se crea RAG institucional o regional adicional.
- Se depreca fuente/chunk por obsolescencia.
- Se parchea emergencia clínica.

Toda contribución debe pasar por:

```txt
submitted → license_review → medical_review → legal_review → approved_for_candidate → approved_for_production
```

## 12.9 Estado Tomo 01

### v0.1

- 24 chunks.
- 13 fuentes.
- 40 eval cases después de prompt 09.
- Status candidate.

### v0.2

- 54 chunks.
- 28 fuentes.
- 80 eval cases.
- 35 dominios anti-under-triage.
- Status pending medical/legal review.
- Usuario reporta aprobación médica/legal.

### v0.2.1 pendiente

- Prompt 12A debe aplicar aprobación.
- Debe cambiar production_allowed a true para el release aprobado.

### v0.3 pendiente

- Prompt 12B debe crear candidato expandido.
- Debe quedar pendiente de revisión nueva.

---

# 13. Prompts generados

## 13.1 Ubicación

```txt
D:\Desarrollos\App_Medica\prompts\
```

## 13.2 Biblioteca

| Prompt | Archivo | Estado | Propósito |
|---:|---|---|---|
| 01 | `01_bootstrap_gobernanza_tecnica_repo.md` | Ejecutado | Bootstrap documental/gobernanza |
| 02 | `02_medical_rag_governance_source_registry.md` | Ejecutado | Source registry y governance RAG |
| 03 | `03_medical_rag_lifecycle_contribuciones_mantenimiento.md` | Ejecutado | Ciclo de vida, contribuciones y permisos |
| 04 | `04_source_discovery_tomo_01_red_flags_triage.md` | Ejecutado | Discovery fuentes Tomo 01 |
| 05 | `05_tomo_01_authoring_plan_red_flags_triage.md` | Ejecutado | Authoring plan Tomo 01 |
| 06 | `06_tomo_01_release_pack_v0_1_red_flags_triage.md` | Ejecutado | Release pack v0.1 |
| 07 | `07_integracion_tomo_01_curado_red_flags_triage.md` | Ejecutado | Preparar input curado |
| 08 | `08_tomo_01_contenido_clinico_curado_v0_1_red_flags_triage.md` | Ejecutado | Integrar seed clínico v0.1 |
| 09 | `09_validacion_hardening_anti_under_triage_tomo_01.md` | Ejecutado | Validación/hardening |
| 10 | `10_tomo_01_expansion_v0_2_cobertura_critica.md` | Ejecutado | Expansión v0.2 |
| 11 | `11_tomo_01_medical_legal_review_packet.md` | Ejecutado | Paquete revisión médica/legal |
| 12A | `12A_aplicar_aprobacion_medico_legal_tomo_01_v0_2_1.md` | Pendiente ejecución | Aplicar aprobación y production true |
| 12B | `12B_tomo_01_expansion_candidate_v0_3_cobertura_extendida.md` | Pendiente ejecución | Expansión candidata v0.3 |

## 13.3 Regla nueva de prompts

No poner recomendaciones de modelos dentro de los `.md`. Las recomendaciones de modelo quedan solo en conversación operativa.

---

# 14. Migración Técnica Recomendada

## 14.1 Objetivo de migración

Pasar de un repositorio documental/RAG a una aplicación SaaS funcional, preservando:

- Documentación.
- Governance.
- RAG.
- Trazabilidad.
- Prompts.
- Estado aprobado del Tomo 01.

## 14.2 Fase M0 — Congelar baseline

Checklist:

- Ejecutar Prompt 12A.
- Ejecutar validación Tomo 01.
- Commit: `rag(tome-01): approve v0.2.1 medical legal release`.
- Tag opcional: `rag-tome-01-v0.2.1-approved`.
- Ejecutar Prompt 12B en branch separada.
- Commit candidato: `rag(tome-01): add v0.3 extended candidate`.

## 14.3 Fase M1 — Bootstrap app

Crear app:

```bash
npx create-next-app@latest . --typescript --eslint --tailwind --app --src-dir
```

Cuidar no borrar:

- `data/`
- `docs/`
- `prompts/`
- `tools/`
- documentos raíz.

Crear estructura:

```txt
src/
  app/
  components/
  modules/
    identity/
    patient/
    clinical/
    ai-gateway/
    doctors/
    appointments/
    payments/
    admin/
    notifications/
    audit/
  lib/
    firebase/
    security/
    rag/
    validators/
  server/
    actions/
    services/
    repositories/
```

## 14.4 Fase M2 — Firebase/Firestore o PostgreSQL

Si Firestore:

- Configurar Firebase project.
- Configurar Auth.
- Crear Firestore rules.
- Crear Storage rules.
- Configurar firebase-admin.
- Crear seed de roles.

Si PostgreSQL:

- Configurar Prisma o Drizzle.
- Crear migrations.
- Diseñar schema relacional.
- Configurar backups.

## 14.5 Fase M3 — Auth/RBAC

Implementar:

- Login/register.
- Roles.
- Guards.
- User profile.
- Accept terms.
- Theme/language toggles.

## 14.6 Fase M4 — RAG loader

Implementar:

- Loader de `tome_manifest.json`.
- Loader de `chunks.jsonl`.
- Validación de `production_allowed`.
- Selección solo de tomos aprobados.
- Endpoint interno para búsqueda.
- No exponer chunks crudos sensibles innecesariamente en frontend.

## 14.7 Fase M5 — Clinical guardrails

Implementar:

- Evidence checklist.
- Red flag detection.
- Decision state green/yellow/red.
- Triage event.
- Safe user message.
- Must not say enforcement.

## 14.8 Fase M6 — AI Gateway

Implementar:

- Admin CRUD provider/model/key.
- Encriptar keys.
- Healthcheck.
- Model discovery.
- Routing policy.
- Routing events.

## 14.9 Fase M7 — Expediente clínico

Implementar:

- Patient profile.
- Medical record.
- Upload evidence.
- Clinical timeline.
- Delete request.
- Retention job.

## 14.10 Fase M8 — Médicos + citas + Meet

Implementar:

- Doctor registration.
- Verification request.
- Admin validation.
- Schedule.
- Appointment.
- Meet generation.

## 14.11 Fase M9 — Pagos

Implementar:

- Stripe checkout/payment intent.
- Webhook idempotent.
- Ledger.
- Payment status.
- Refund path.

## 14.12 Fase M10 — Hardening

- Tests unitarios.
- E2E críticos.
- Security review.
- Load test.
- Accessibility review.
- Legal/medical signoff.

---

# 15. Definition of Done

Una tarea está terminada si:

- Compila.
- Lint verde.
- Tests verdes.
- No rompe build.
- No expone secretos.
- No agrega PHI en logs.
- Documenta decisiones.
- Tiene manejo de errores.
- Tiene validación de entrada.
- Tiene auditoría si acción sensible.
- Tiene UI responsive si aplica.
- Tiene estados loading/error/empty si aplica.
- Pasa revisión senior.

Para RAG:

- Manifest válido.
- Source map válido.
- Chunks JSONL válidos.
- Eval cases actualizados.
- Changelog actualizado.
- Review status claro.
- No se mezcla candidato con aprobado.
- Médico/legal aprueban antes de producción.

---

# 16. Estado de aprobación médica/legal

El usuario reportó:

```txt
El médico aprobó los chunks.
El abogado aprobó las fuentes.
Aprueban cambiar production_allowed a true.
Aprueban aumentar información para el RAG porque falta mucho por cubrir.
```

Interpretación operativa:

- Esta aprobación aplica al Tomo 01 v0.2 actual de 54 chunks / 28 fuentes / 80 eval cases.
- Debe aplicarse mediante Prompt 12A.
- Debe quedar en archivos de revisión y Action Receipt documental.
- No aplica automáticamente a v0.3 o tomos futuros.
- Cada expansión requiere revisión nueva.

---

# 17. Información legal/privacidad borrador

## 17.1 Política de privacidad debe cubrir

- Identidad del responsable.
- Datos tratados.
- Finalidades.
- Uso de IA.
- Proveedores IA.
- Conservación.
- Derechos del usuario.
- Seguridad.
- Menores de edad.
- Cambios.
- Texto corto para login.

## 17.2 Disclaimer IA

Debe decir:

- La IA orienta/apoya.
- No sustituye valoración médica presencial cuando hay signos de alarma.
- Puede recomendar consulta física/humana.
- Emergencias deben atenderse por servicios de urgencia.

## 17.3 Disclaimer Recomendación Sintomatológica

Debe decir:

- No es receta médica de medicamentos controlados.
- Es orientación sintomatológica basada en información disponible.
- Si aparecen signos de alarma, buscar atención médica.

---

# 18. Reglas para nuevos tomos RAG

## 18.1 El arquitecto senior debe entregar

Para cada tomo:

- Fuentes candidatas.
- Validación de licencia preliminar.
- Source map.
- Chunks curados.
- Safe user messages.
- Must not say.
- Evaluación inicial.
- Gaps.
- Recomendación de revisión médica/legal.

## 18.2 OpenCode debe hacer

- Crear estructura.
- Integrar chunks.
- Validar JSON.
- Actualizar manifest.
- Crear changelog.
- Generar review packet.
- No inventar medicina.

## 18.3 Orden recomendado de tomos

Después de Tomo 01:

1. Tomo 02 — Clinical History / Anamnesis.
2. Tomo 04 — Pediatría segura.
3. Tomo 05 — OTC / Recomendaciones sintomatológicas.
4. Tomo 03 — Medicina general adulto.
5. Tomo 08 — Oncología red flags.
6. Tomo 06 — Especialidades frecuentes.
7. Tomo 07 — Imagenología orientativa.
8. Tomo 09 — Multilingüe/regionalización.

---

# 19. Comandos operativos sugeridos

## 19.1 Git

```bash
git status
git add .
git commit -m "docs/rag: update app medical knowledge baseline"
git push origin master
```

## 19.2 Validación RAG

```bash
node tools/medical-rag/validate_tome_01_release.mjs
```

Si existe validador input:

```bash
node tools/medical-rag/validate_tome_01_curated_input.mjs
```

## 19.3 Validación rápida JSONL

```bash
node -e "const fs=require('fs');const lines=fs.readFileSync('data/medical-rag/tomes/01_red_flags_triage/release/chunks.jsonl','utf8').split('\n').filter(Boolean); console.log(lines.length); for (const l of lines) JSON.parse(l); console.log('ok')"
```

---

# 20. Criterios para siguientes prompts

Cada prompt nuevo debe:

- Ser un `.md` individual.
- Ser específico.
- Decir que OpenCode es dev Jr/integrador.
- Prohibir invención clínica.
- Preservar archivos existentes.
- Exigir reporte final.
- Exigir validaciones.
- No incluir recomendaciones de modelos dentro del prompt.
- Mantener candidatos separados de releases aprobados.
- Pedir el máximo razonable sin riesgo.

---

# 21. Próximos prompts recomendados

## 21.1 Prompt 13 — Post-approval validation and GitHub release tag

Objetivo:

- Después de ejecutar 12A, validar Tomo 01 aprobado.
- Crear reporte de aprobación.
- Preparar tag Git.
- Confirmar production allowed true solo para Tomo 01 aprobado.

## 21.2 Prompt 14 — Bootstrap Next.js/Firebase preserving RAG

Objetivo:

- Crear app Next.js con TypeScript/Tailwind.
- No borrar docs/data/prompts/tools.
- Agregar estructura modular.
- Configurar Firebase placeholders.
- Crear layout base UI premium.

## 21.3 Prompt 15 — Firestore schema and security rules baseline

Objetivo:

- Crear schemas Zod.
- Crear repositories.
- Crear Firestore rules iniciales.
- Crear seed roles.
- Crear tests de seguridad.

## 21.4 Prompt 16 — RAG runtime loader

Objetivo:

- Leer `tome_manifest.json`.
- Cargar `chunks.jsonl`.
- Bloquear tomos no aprobados.
- Exponer servicio backend para retrieval.

## 21.5 Prompt 17 — Clinical guardrails service

Objetivo:

- Implementar decision engine green/yellow/red.
- Anti-under-triage.
- Evidence minimum.
- Safe user message.

---

# 22. Información que todavía falta definir

Aunque el avance está aprobado por médico/abogado, falta para implementación real:

- Decisión definitiva PostgreSQL vs Firebase/Firestore.
- Política fiscal por país para pagos/facturación.
- Diseño exacto de precios/comisiones.
- Identidad legal de responsable de datos.
- Documentos legales finales por país.
- Cómo validar cédula por país.
- Flujo OAuth Google Meet/Gmail.
- Proveedor de storage productivo.
- Proveedor vector DB.
- Política de backup/restore.
- Infraestructura exacta Debian/local/cloud.
- Dominio final.
- Configuración Cloudflare final.

---

# 23. Resumen contundente para migración

El proyecto está listo para pasar de **fase documental/RAG gobernado** a **fase de scaffolding técnico del SaaS**. Antes de escribir UI/backend, debe cerrarse la promoción del Tomo 01 aprobado con Prompt 12A y mantener la expansión v0.3 como candidata mediante Prompt 12B.

No hay que rehacer el proyecto. Hay que proteger lo ya creado:

```txt
data/medical-rag/
docs/
prompts/
tools/medical-rag/
```

La implementación debe arrancar encima de esa base sin borrar trazabilidad.

