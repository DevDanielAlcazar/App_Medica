# Documento de Delivery

## Rol Delivery / Operaciones

Responsabilidades:

- Priorizar alcance.
- Validar que no se inventen decisiones críticas.
- Coordinar legal/médico/soporte/contabilidad.
- Asegurar checklist por fase.
- Controlar cambios.
- Autorizar Go/No-Go.

## Ceremonias

- Daily técnica de 15 min.
- Review semanal de avance.
- Riesgos y blockers dos veces por semana.
- Demo por fase.
- Gate review al cerrar cada fase P0.

## Artefactos vivos

- Tracker Excel/Google Sheet.
- PRD.
- ADRs.
- Backlog.
- Risk register.
- Prompt library.
- Checklist release.
- Manuales operativos.

## Checklist diario para IA Jr

- [ ] ¿La tarea está acotada?
- [ ] ¿El prompt indica archivos permitidos?
- [ ] ¿Incluye tests?
- [ ] ¿No toca seguridad/IA clínica sin permiso?
- [ ] ¿No expone PHI?
- [ ] ¿Documentó cambios?
- [ ] ¿Build/lint/test pasan?

## Checklist semanal

- [ ] % avance actualizado.
- [ ] Riesgos nuevos agregados.
- [ ] Bloqueadores escalados.
- [ ] Decisiones nuevas documentadas.
- [ ] Tests verdes.
- [ ] Seguridad revisada.
- [ ] UX revisada en móvil.
- [ ] Docs actualizadas.

## Go/No-Go

No sale a producción si:

- Hay P0 abierto.
- Hay riesgo crítico sin mitigación.
- Fallan pruebas de red flags.
- Fallan pruebas de pagos reales.
- Fallan permisos RBAC.
- Fallan eliminación/retención.
- Fallan accesibilidad crítica.
- Falta política de privacidad/términos aprobados.
