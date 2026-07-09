# Emergency Patch Policy

## Activación

Un parche de emergencia se activa cuando:

- Error clínico crítico detectado.
- Contenido contradice guía oficial.
- Riesgo de daño reportado.
- Licencia revocada de fuente activa.

## Proceso

```
1. Abrir incident (ticket)
2. Congelar tomo afectado
3. Desactivar chunks riesgosos
4. Generar fix urgente
5. Re-evaluar con casos clínicos
6. Aprobar hotfix
7. Deploy a staging
8. Monitor 24h
9. Deploy a production si ready
10. Documentar causa raíz
```

## SLA

| Acción | Tiempo máximo |
|--------|---------------|
| Detectar problema | 2h |
| Congelar tomo | 1h |
| Fix generado | 24h |
| Staging listo | 48h |
| Production listo | 72h |

## Comunicación

- Equipo médico notificado inmediatamente.
- Admin team en copia.
- Legal team si hay riesgo de copyright.
- Notificar en changelog.

## Auditoría

Cada parche:
- Nuevo incident ID.
- RA (root cause analysis).
- Registro de quién cambió qué.
- Aprobación firmada.