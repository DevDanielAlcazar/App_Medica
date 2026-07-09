# App Médica — Paquete de documentación v2

**Fecha:** 2026-07-08  
**Estado:** versión de planeación lista para iniciar desarrollo controlado.  
**Enfoque:** release público productivo, no MVP.

## Contenido

1. `01_PRD_App_Medica_Release_v1.md`
2. `02_Plan_Desarrollo.md`
3. `03_Documento_Desarrollo.md`
4. `04_Documento_Entregable.md`
5. `05_Fases_Desarrollo_Checklists.md`
6. `06_Arquitectura_Tecnica.md`
7. `07_Delivery_Checklists.md`
8. `08_UI_UX_Design_System_2026.md`
9. `09_Seguridad_Compliance_Medico.md`
10. `10_AI_Gateway_Autorouting.md`
11. `11_Guardrails_Clinicos.md`
12. `12_Politica_Privacidad_Borrador.md`
13. `13_Terminos_Disclaimer_Borrador.md`
14. `14_Backlog_Release.md`
15. `15_Matriz_Riesgos.md`
16. `16_Decisiones_Cerradas_y_Gates.md`
17. `prompts/` con prompts listos para IA Jr/OpenCode/AionUI.

## Criterio rector

La app puede ser ambiciosa, pero no puede ser irresponsable. El producto se documenta para permitir diagnóstico/orientación clínica y recomendaciones sintomatológicas bajo controles estrictos: evidencia mínima, red flags, restricciones de medicamentos controlados, trazabilidad, privacidad y derivación humana cuando aplique.

## Pendientes no bloqueantes para documentación

No hay dudas críticas para generar entregables. Sí quedan **gates obligatorios antes de salida productiva**:

- Validación legal por país/estado.
- Validación médica del catálogo de red flags, OTC, pediatría y derivaciones.
- Revisión de política de privacidad y términos por asesor legal.
- Pruebas clínicas adversariales y de seguridad.


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
