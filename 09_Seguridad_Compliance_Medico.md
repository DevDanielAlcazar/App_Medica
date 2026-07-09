# Seguridad y Compliance Médico

## Clasificación de datos

### Datos sensibles

- Síntomas.
- Diagnósticos/orientaciones.
- Evidencias médicas.
- PDFs.
- Fotos.
- Medicamentos.
- Historial clínico.
- Ubicación.
- INE/cédula de médicos.
- Datos bancarios médicos.

## Principios

- Minimización.
- Consentimiento informado.
- Finalidad clara.
- Acceso por mínimo privilegio.
- Cifrado.
- Auditoría.
- Eliminación.
- Transparencia.

## Controles obligatorios

### Cifrado

- Secretos y API keys cifradas.
- Documentos sensibles cifrados.
- Backups cifrados.
- TLS obligatorio.

### RBAC/ABAC

- Paciente solo ve sus datos.
- Médico solo ve expediente autorizado para cita.
- Soporte ve lo mínimo necesario.
- Contabilidad no ve información clínica.
- Admin ve configuración, no necesariamente PHI.
- Superadmin protegido.

### Auditoría

Registrar:

- Login.
- Aceptación de políticas.
- Acceso a expediente.
- Descarga de reporte.
- Cambios de estado.
- Recomendaciones IA.
- Activación médico.
- Cambios de saldo/pagos.
- Configuración IA.

### Retención

- Usuario puede eliminar expediente.
- Advertencia antes de eliminación.
- Curado + 6 meses = eliminación programada.
- Job auditable.
- Backups deben respetar política definida.

## Matriz regional

### México

Bases de referencia:

- LFPDPPP.
- Ley General de Salud.
- NOM-004 expediente clínico.
- NOM-024 sistemas de información en salud.

### Estados Unidos

Bases de referencia:

- HIPAA/FTC/FDA según modelo operativo.
- FDA Clinical Decision Support guidance para funciones CDS.
- Revisión de licenciamiento por estado para médicos.

### LatAm/inglés

- Policy pack por país.
- No activar país sin revisión local.

## Gate de compliance

Antes de release:

- [ ] Política privacidad aprobada.
- [ ] Términos/disclaimer aprobados.
- [ ] Matriz región activa.
- [ ] Consentimiento registrado.
- [ ] Eliminación probada.
- [ ] Accesos auditados.
- [ ] Logs sin PHI.
- [ ] Proveedores IA aprobados para datos de salud o uso de de-identificación.


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
