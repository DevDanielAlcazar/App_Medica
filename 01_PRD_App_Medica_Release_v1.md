# PRD — App Médica Release Público v1.0

## 1. Resumen ejecutivo

La App Médica será una plataforma web/PWA médica, responsiva, bilingüe y operable globalmente por configuración regional. Su experiencia principal será una **consulta virtual conversacional** soportada por IA, con expediente clínico digital, seguimiento por padecimiento, recordatorios, recomendaciones sintomatológicas, búsqueda web médica controlada, citas humanas por Google Meet, pagos reales, wallet, dashboards operativos y administración dinámica de proveedores IA.

La primera salida pública será un **release productivo**, no un MVP. Esto significa que la app no puede salir si faltan controles de privacidad, seguridad, pagos, validación médica, cumplimiento y soporte operativo.

## 2. Objetivo de negocio

Construir una plataforma médica digital capaz de:

- Acompañar al usuario en consultas, seguimiento y cuidado cotidiano.
- Centralizar expedientes por caso/padecimiento.
- Permitir recomendaciones sintomatológicas cuando exista evidencia suficiente.
- Derivar a consulta física/humana cuando haya riesgo, falta de evidencia o necesidad de especialista.
- Conectar pacientes con médicos humanos validados.
- Monetizar mediante pagos reales, wallet, suscripciones y citas virtuales.
- Operar con múltiples proveedores IA configurables desde dashboard admin.

## 3. Alcance de release

### Incluido

- PWA responsiva, clara/oscura y bilingüe ES/EN.
- Detección inicial de idioma/región con override manual.
- Login con disclaimer visible y enlace a política de privacidad.
- Consulta conversacional con IA: texto, imagen, PDF.
- Expediente clínico digital por padecimiento.
- Timeline clínico, evidencias, documentos, reportes descargables.
- Estados: En análisis, Enfermo(a), Derivado a cita física, En tratamiento, Curado(a), Archivado.
- Eliminación manual por usuario.
- Eliminación automática tras 6 meses en estado Curado.
- Recomendación Sintomatológica con guardrails.
- Prohibición absoluta de receta de medicamentos controlados.
- OTC permitido bajo evidencia suficiente y exclusiones clínicas.
- Casos pediátricos permitidos con checklist reforzado.
- Búsqueda web médica controlada desde release.
- Registro y validación humana de médicos: cédula + documento de identidad.
- Citas humanas con Google Meet.
- Pagos reales con Stripe.
- Wallet y ledger de saldo.
- Dashboard admin, soporte, médico y contabilidad.
- Configuración dinámica de proveedores IA OpenAI-compatible, Claude-compatible o genérico.
- Gmail configurable por admin para notificaciones.
- Deploy en Debian con PM2 y Cloudflare Tunnel.

### No incluido / prohibido

- No emitir recetas de medicamentos controlados.
- No permitir médicos no validados tomando citas.
- No activar países sin policy pack y revisión local.
- No liberar sin pruebas clínicas adversariales.
- No registrar PHI en logs ordinarios.
- No hacer recomendaciones si falta evidencia mínima.
- No sustituir urgencias ni retrasar atención física cuando aplique.

## 4. Personas

| Persona | Objetivo | Necesidades críticas |
|---|---|---|
| Paciente | Resolver dudas, dar seguimiento y recibir orientación | Chat, evidencia, expediente, recordatorios, reportes, citas, pagos |
| Médico | Atender citas y cobrar | Validación, agenda, Meet, expediente autorizado, pagos |
| Soporte | Resolver operación | Incidencias, quejas, reasignaciones, créditos, bans |
| Contabilidad | Gestionar pagos médicos | Cortes, CLABE, estatus, penalizaciones, reportes |
| Admin | Configurar plataforma | IA, precios, roles, permisos, Gmail, anuncios, métricas |
| Superadmin | Proteger control de negocio | Permisos máximos, no bloqueable por admins |

## 5. Flujos críticos

### 5.1 Consulta IA

1. Usuario inicia conversación.
2. Adjunta evidencia o describe síntomas.
3. IA identifica si es caso nuevo o caso existente.
4. IA solicita datos faltantes.
5. IA valida red flags.
6. IA decide:
   - Preguntar más.
   - Actualizar expediente con confirmación.
   - Emitir Recomendación Sintomatológica.
   - Derivar a cita humana virtual.
   - Derivar a consulta física/urgencias.
7. Toda acción sensible genera Action Receipt.

### 5.2 Recomendación Sintomatológica

Debe contener:

- Título: **Recomendación Sintomatológica**.
- Datos considerados.
- Nivel de certeza y límites.
- Qué se recomienda y por qué.
- OTC sugeridos si aplica.
- Dosis solo si el catálogo médico aprobado lo permite y no es controlado.
- Contraindicaciones básicas.
- Señales de alarma.
- Cuándo acudir a médico.
- Fecha/hora, modelo IA/proveedor y versión de policy.

### 5.3 Validación médica humana

1. Médico crea cuenta.
2. Captura cédula profesional.
3. Adjunta INE o cédula.
4. Estatus inicial: En revisión.
5. Soporte/admin valida autenticidad y pertenencia.
6. Solo con estatus Activo puede tomar citas.
7. Cada cambio queda auditado.

### 5.4 Cita humana

1. Usuario elige cita.
2. Pago se confirma.
3. Sistema asigna médico activo disponible.
4. Se crea link Google Meet.
5. Se notifica a usuario y médico.
6. Médico atiende.
7. Se registra resultado y, si aplica, pago/corte del médico.

## 6. KPIs de release

| KPI | Target |
|---|---|
| Casos rojos no derivados | 0 |
| Médicos no validados con citas | 0 |
| Doble saldo por webhook | 0 |
| Accesibilidad crítica fallida | 0 |
| Uptime operativo | >= 99% después de hardening |
| Notificaciones críticas entregadas | >= 95% |
| Expedientes eliminables por usuario | 100% funcional |
| Retención 6 meses curado | job auditable |

## 7. Gates de release

- Gate legal.
- Gate médico.
- Gate seguridad.
- Gate pagos.
- Gate privacidad.
- Gate accesibilidad.
- Gate rendimiento.
- Gate soporte/delivery.


## Fuentes y referencias base

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI WCAG Overview: https://www.w3.org/WAI/standards-guidelines/wcag/
- Material Design 3 Dynamic Color: https://m3.material.io/styles/color/dynamic
- shadcn/ui: https://ui.shadcn.com/docs
- Radix Primitives: https://www.radix-ui.com/primitives
- Base UI: https://base-ui.com/
- Google Meet API: https://developers.google.com/workspace/meet/api/guides/overview
- Google Meet spaces: https://developers.google.com/workspace/meet/api/guides/meeting-spaces
- Cloudflare Tunnel Linux service: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/as-a-service/linux/
- Cloudflare Tunnel published apps: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/
- Node.js releases: https://nodejs.org/en/about/previous-releases
- PM2: https://pm2.keymetrics.io/
- PostgreSQL JSON/JSONB: https://www.postgresql.org/docs/current/datatype-json.html
- HHS health apps: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-apps/index.html
- FDA Clinical Decision Support Software guidance: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software
- WHO guidance on LMMs for health: https://www.who.int/publications/i/item/9789240084759
- LFPDPPP México: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
- Ley General de Salud México: https://www.diputados.gob.mx/LeyesBiblio/pdf_mov/Ley_General_de_Salud.pdf
- NOM-004-SSA3-2012: https://dof.gob.mx/nota_detalle_popup.php?codigo=5272787
- NOM-024-SSA3-2012: https://www.dgis.salud.gob.mx/descargas/normatividad/normas/DOF-30NOV12-NOM-024-SSA3-2012.pdf
- OpenAI API models: https://developers.openai.com/api/docs/models
- Anthropic Claude models: https://platform.claude.com/docs/en/about-claude/models/overview
