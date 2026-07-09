# Baseline de Seguridad y Privacidad — App Médica

## Principios

1. **Minimización de datos** - Solo recolectar lo estrictamente necesario.
2. **Consentimiento informado** - Aceptación explícita antes de procesar PHI.
3. **Acceso mínimo privilegio** - RBAC estricto por rol.
4. **Cifrado** - En reposo y tránsito.
5. **Auditoría** - Todas las acciones sensibles son auditoables.
6. **Eliminación** - Los datos pueden ser borrados bajo control.
7. **Transparencia** - El usuario sabe qué datos se procesan y por qué.

## Clasificación de datos

| Tipo | Clasificación | Tratamiento |
|------|---------------|-------------|
| Datos de identificación | Sensible | Cifrado en base |
| Datos de salud (síntomas, diagnósticos) | Muy sensible (PHI) | Cifrado, RBAC, auditoría |
| Evidencias médicas (imágenes, PDFs) | Muy sensible (PHI) | Cifrado en storage |
| Ubicación | Sensible | Opcional, cifrado |
| INE/cédula médicos | Muy sensible | Cifrado, acceso limitado |
| Datos bancarios médicos (CLABE) | Muy sensible | Cifrado, segregación |
| Pagos | Sensible | Procesados por Stripe, no almacenados |

## Secretos

- **API keys de IA** - Cifradas en base con rotación periódica.
- **Auth secret** - 32+ caracteres, generado con `crypto.randomBytes`.
- **Encryption key** - Separada por ambiente, rotación documentada.
- **Stripe keys** - Live en producción, sandbox en QA.

## Cifrado

| Tipo | Implementación |
|------|----------------|
| API keys IA | AES-256-GCM con key de aplicación |
| Documentos médicos | AES-256 en storage |
| Backups | Cifrado en reposo |
| TLS | Obligatorio en producción |

## Logs

- **Prohibido:** Registrar PHI, síntomas completos, nombres de medicamentos con contexto clínico.
- **Permitido:** Action ID, timestamps, usuario ID (hashed), acción realizada, resultado.
- **Formato:** JSON estructurado sin datos sensibles.
- **Retención:** Logs operativos 90 días, auditoría 2 años.

## Auditoría

Tabla de auditoría append-only con:

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  summary TEXT,
  reversible BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Acciones auditadas:
- Login/autenticación.
- Aceptación de políticas.
- Acceso a expediente.
- Descarga de reporte.
- Cambios de estado.
- Recomendaciones IA.
- Activación médico.
- Cambios de saldo/pagos.
- Configuración IA.

## RBAC/ABAC

| Rol | Permisos |
|-----|----------|
| Paciente | Solo su expediente, sus citas, su wallet |
| Médico | Solo expedientes de citas asignadas, agenda propia |
| Admin | Configuración plataforma, no PHI directo |
| Soporte | Solo datos necesarios para resolver incidencia |
| Contabilidad | Pagos médicos, no información clínica |
| Superadmin | Permisos máximos, no bloqueable |

## Sesiones

- JWT con expiración corta (15 min) + refresh token.
- HttpOnly, Secure, SameSite=Strict cookies.
- Logout en todos los dispositivos opción disponible.

## Rate limiting

- API pública: 100 requests/min por IP.
- Auth: 5 intentos/15 min.
- IA: 20 requests/min por usuario.
- Upload: 10 files/min por usuario.

## Eliminación de expediente

1. Usuario puede eliminar manualmente desde UI.
2. Advertencia previa con confirmación explícita.
3. Eliminación lógica (soft delete) con marca `deleted_at`.
4. Job de retención elimina físicamente después de 6 meses en "Curado".
5. Auditoría del proceso de eliminación.

## Retención 6 meses en estado "Curado"

- Job programado cada 24 horas revisa expedientes en estado Curado.
- Notificación 7 días antes al usuario.
- Job marca `scheduled_deletion_at` con timestamp.
- Eliminación física ejecutada después de 6 meses desde `curado_at`.
- Auditoría del job en tabla `retention_jobs`.

## Backups

- Backup diario de PostgreSQL con `pg_dump`.
- Backup encriptado del storage.
- Retención 30 días en storage seguro.
- Prueba de restore mensual.
- Backup no incluye datos de auditoría sensibles si es posible.

## Incidentes

1. Detección vía alertas o reporte.
2. Contención inmediata (bloqueo de acceso si es necesario).
3. Investigación con auditoría.
4. Resolución y parche.
5. Comunicación al usuario si aplica.
6. Retroalimentación a políticas.

## No prometemos

Este baseline implementa controles técnicos razonables. **No garantiza cumplimiento legal absoluto**. Cada jurisdicción puede requerir controles adicionales validados por asesor legal.