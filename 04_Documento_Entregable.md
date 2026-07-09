# Documento de Entregable — Release Público v1.0

## Entregable final esperado

Una PWA médica lista para operación pública controlada, desplegable en servidor Debian con PM2 y Cloudflare Tunnel, con pagos reales, IA dinámica, expedientes clínicos, citas humanas por Google Meet y dashboards operativos.

## Paquetes de entrega

### Producto

- PWA web responsiva.
- Tema claro/oscuro.
- Español/Inglés.
- Consulta IA.
- Expediente clínico.
- Recomendación Sintomatológica.
- Citas humanas.
- Wallet/pagos.
- Dashboards.

### Técnico

- Repositorio GitHub.
- README de instalación.
- `.env.example`.
- Scripts build/deploy.
- PM2 ecosystem.
- Config Cloudflare Tunnel.
- Migraciones DB.
- Seeds controlados.
- Tests.
- ADRs.

### Operación

- Manual admin.
- Manual soporte.
- Manual médico.
- Manual contabilidad.
- Guía de privacidad.
- Guía de incidentes.
- Checklist Go/No-Go.

### Compliance

- Política de privacidad.
- Términos/disclaimer.
- Matriz de región.
- Evidencia de aceptación de políticas.
- Registro de auditoría.
- Procedimiento de eliminación de datos.

## Criterio de aceptación final

El release solo se acepta cuando:

- Todos los P0 están terminados.
- No hay riesgos críticos sin mitigación.
- QA clínico aprueba.
- QA seguridad aprueba.
- QA pagos aprueba.
- QA accesibilidad aprueba.
- Deploy/rollback probado.
- Soporte capacitado.
- Legal/médico firman salida.
