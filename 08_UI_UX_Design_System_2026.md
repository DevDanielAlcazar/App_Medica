# UI/UX y Design System 2026

## Norte UX

La app no debe sentirse como dashboard médico genérico ni como chatbot frío. Debe sentirse como un **centro de acompañamiento clínico personal**, con tres atributos:

- Claridad.
- Confianza.
- Acción segura.

## Patrones propios

### Conversational Care Canvas

Pantalla principal tipo conversación, pero con acciones clínicas integradas:

- Adjuntar evidencia.
- Crear recordatorio.
- Vincular expediente.
- Generar reporte.
- Agendar cita.
- Compartir resumen.
- Confirmar cambios sensibles.

### Context Rail

Panel lateral en desktop y drawer/bottom sheet en móvil con:

- Caso activo.
- Estado.
- Evidencia faltante.
- Últimas señales.
- Próxima acción.
- Riesgos.
- Reportes.

### Clinical Timeline River

Timeline por caso:

- Síntomas.
- Evidencias.
- Medicamentos.
- Recomendaciones.
- Derivaciones.
- Citas.
- Cambios de estado.

### Safety Ribbon

Indicador discreto:

- Verde: seguimiento general.
- Amarillo: vigilancia.
- Rojo: derivación/urgencia.

No debe ser alarmista, pero sí visible.

### Action Receipts

Después de cada acción:

- Qué se hizo.
- Dónde quedó.
- Qué sigue.
- Cómo revertir si aplica.

## Componentes

- AppShell.
- ThemeToggle.
- LanguageToggle.
- RegionDetectorNotice.
- ConversationComposer.
- EvidenceDropzone.
- MedicalCaseTimeline.
- ContextRail.
- SafetyRibbon.
- RecommendationCard.
- HumanReferralReportButton.
- AppointmentScheduler.
- MeetJoinCard.
- WalletLedger.
- DoctorVerificationPanel.
- AdminAiProviderManager.
- GmailNotificationSettings.
- AuditActionReceipt.

## Tema claro/oscuro

- Botón visible.
- Respeto a preferencia del sistema en primer ingreso.
- Persistencia por usuario.
- Contraste validado.
- Tokens semánticos: background, surface, elevated, text, muted, danger, warning, success, clinical.

## Responsive

- Móvil 360px.
- Tablet 768px.
- Laptop 1024px.
- Desktop 1440px.

Reglas:

- Context Rail se vuelve bottom sheet.
- Timeline se vuelve una columna.
- Acciones frecuentes en barra inferior móvil.
- Dashboards administrativos usan listas densas filtrables, no tablas imposibles.

## Accesibilidad

- WCAG 2.2 AA.
- Foco visible.
- Teclado completo.
- Labels explícitos.
- Roles ARIA donde aplique.
- No depender solo de color.
- Tamaño táctil adecuado.
- Lectura clara para usuarios no técnicos.


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
