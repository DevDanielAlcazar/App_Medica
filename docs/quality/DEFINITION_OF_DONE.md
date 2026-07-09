# Definition of Done (DoD) — App Médica

## DoD para feature

Una historia de usuario se considera "Hecha" cuando:

- [ ] Código implementado siguiendo principios de Clean Architecture.
- [ ] Código compila sin errores (`tsc --noEmit`).
- [ ] Tests unitarios cubren >80% de la lógica nueva.
- [ ] Tests de integración si toca base de datos o servicios externos.
- [ ] Lint pasa sin errores (`npm run lint`).
- [ ] Formato correcto (`npm run format:check`).
- [ ] No rompe RBAC (tests de permisos).
- [ ] No expone datos sensibles al frontend.
- [ ] Logs están limpios de PHI.
- [ ] Documentación actualizada (README del módulo si aplica).
- [ ] Feature flags si es funcionalidad experimental.
- [ ] Revisión senior aprobada.

## DoD para API

- [ ] Request/response tipados con TypeScript.
- [ ] Validación de entrada (Zod o similar).
- [ ] Manejo de errores estandarizado.
- [ ] Tests de edge cases.
- [ ] Rate limiting aplicado si es endpoint público.
- [ ] Auditoría de acciones sensibles.
- [ ] No devuelve PHI no autorizado.
- [ ] Idempotency key si el endpoint es idempotente.
- [ ] OpenAPI spec actualizado (si aplica).

## DoD para UI

- [ ] Componente responsive (mobile, tablet, desktop).
- [ ] Accesibilidad WCAG 2.2 AA validada.
- [ ] Foco visible y navegación teclado.
- [ ] Labels ARIA apropiados.
- [ ] No depende solo de color para información.
- [ ] Tamaño táctil mínimo 44x44px.
- [ ] Pruebas visuales si es componente crítico.
- [ ] Dark mode si aplica.
- [ ] i18n keys definidas si textos son visibles.
- [ ] Storybook entry (si aplica).

## DoD para módulo clínico

- [ ] Guardrails aplicados antes de cualquier recomendación.
- [ ] Red flags verificados antes de emitir orientación.
- [ ] Evidencia mínima validada.
- [ ] Audit log generado para decisiones clínicas.
- [ ] Casos pediátricos con checklist completo.
- [ ] Medicamentos controlados bloqueados.
- [ ] RecommendationReceipt emitido con cada orientación.
- [ ] Verificado no hay PHI en prompts a IA no aprobada.
- [ ] Validado por médico si es algoritmo clínico nuevo.

## DoD para IA

- [ ] No envía PHI a proveedor no marcado como `clinicalAllowed`.
- [ ] Request incluye `correlationId` para trazabilidad.
- [ ] Streaming implementado para respuestas largas.
- [ ] Timeout y retry con fallback configurados.
- [ ] Usage log registrado (prompt tokens, completion tokens, costo).
- [ ] Healthcheck del proveedor antes de usar.
- [ ] `stop` si detecta red flags o falta de evidencia.
- [ ] Autorouting respeta política de routing.
- [ ] Tests de fallback funcionando.

## DoD para pagos

- [ ] Stripe live keys en producción, sandbox en QA.
- [ ] Webhook handler idempotente.
- [ ] Wallet ledger no muta sin auditoría previa.
- [ ] No hay doble cobro posible.
- [ ] Reembolso/crédito soporte funcional.
- [ ] Estado de cita verificado antes de generar Meet.
- [ ] Amount exacto sin redondeos problemáticos.
- [ ] Test con tarjetas reales en staging.

## DoD para datos sensibles

- [ ] Encriptado en reposo para PHI.
- [ ] TLS en tránsito obligatorio.
- [ ] RBAC verificado en todos los endpoints.
- [ ] No hay logs con datos personales/salud.
- [ ] Consentimiento registrado antes de procesar.
- [ ] Eliminación disponible (manual + automática).
- [ ] Export de datos funcional.
- [ ] Audit trail activo y verificable.

## DoD para release

- [ ] Todos los gates P0 validados.
- [ ] Tests E2E para flujos críticos pasados.
- [ ] Performance test en staging aprobado.
- [ ] Security scan sin errores críticos.
- [ ] Deploy en staging probado.
- [ ] Rollback disponible y probado.
- [ ] Backup restaurado en staging.
- [ ] Manuales operativos actualizados.
- [ ] Legal/médico firman salida.