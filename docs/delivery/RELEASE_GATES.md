# Gates de Release Go/No-Go — App Médica v1.0

## Legal/Compliance

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| LG-01 | Política de privacidad aprobada por legal | Legal | Versión firmada y fecha | Pendiente |
| LG-02 | Términos y disclaimer aprobados | Legal | Versión firmada y fecha | Pendiente |
| LG-03 | Policy packs por región activados | Legal/Regional | Policy pack documentado y versiónada | Pendiente |
| LG-04 | Consentimiento registrado en base | Soporte | Tabla de consentimientos con timestamps | Pendiente |
| LG-05 | Eliminación y retención probadas | QA | Casos de prueba de eliminación automática | Pendiente |

## Seguridad

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| SG-01 | Variables `.env` fuera de repositorio | DevOps | Verificación en `.gitignore` | Pendiente |
| SG-02 | API keys cifradas en base | Backend | Implementación de cifrado en repositorio | Pendiente |
| SG-03 | Logs sin PHI | Backend | Regex check + pruebas de logging | Pendiente |
| SG-04 | TLS obligatorio en producción | DevOps | Configuración Cloudflare Tunnel/redirects | Pendiente |
| SG-05 | Auditoría append-only funcionando | Backend | Tabla de auditoría con pruebas | Pendiente |
| SG-06 | Secret rotation implementado | DevOps | Script de rotación + documentación | Pendiente |

## Privacidad

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| PV-01 | Minimización de datos implementada | Backend | Reglas de no recolección de datos extra | Pendiente |
| PV-02 | Export de datos implementado | Backend | Endpoint `/api/user/export` funcional | Pendiente |
| PV-03 | Eliminación manual funcional | Backend | Botón en UI + API + pruebas | Pendiente |
| PV-04 | Eliminación automática 6 meses Curado | Backend | Job de retención + auditoría | Pendiente |

## Clínica/Guardrails

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| CL-01 | Red flags catálogo definitivo | Médico | Lista validada por colegiatura | Pendiente |
| CL-02 | Pediatría con checklist | Médico | Test cases con escenarios infantiles | Pendiente |
| CL-03 | OTC catálogo aprobado | Médico | Lista de medicamentos permitidos | Pendiente |
| CL-04 | Controlados bloqueados | Médico | Test cases negativos + restricciones | Pendiente |
| CL-05 | Escalación humana probada | QA | Pruebas de derivación Meet | Pendiente |

## Médicos humanos

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| MD-01 | Registro médico con cédula + documento | Backend | Validación de documentos + OCR | Pendiente |
| MD-02 | Estatus "En revisión" funcional | Backend | Constraint DB + pruebas | Pendiente |
| MD-03 | Validación humana funcional | Admin/Soporte | Flujo de aprobación + auditoría | Pendiente |
| MD-04 | Médico inactivo NO toma citas | Backend | Constraint DB verificado | Pendiente |

## Pagos

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| PM-01 | Stripe live configurado en prod | DevOps | Claves de producción | Pendiente |
| PM-02 | Webhooks idempotentes | Backend | Tabla de idempotency + pruebas | Pendiente |
| PM-03 | Wallet ledger implementado | Backend | Ledger con acción + montos + timestamps | Pendiente |
| PM-04 | Cortes médicos funcionales | Contabilidad | Report de cortes + CLABE | Pendiente |
| PM-05 | Reembolsos/créditos soporte | Soporte | Flujo de crédito manual | Pendiente |

## Google Meet

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| MT-01 | Integración Meet funcional | Backend | Test de creación de espacio Meet | Pendiente |
| MT-02 | Link generado después de pago | Backend | Trigger post-pago | Pendiente |
| MT-03 | Notificaciones Meet funcionales | Notif | Email + in-app notification | Pendiente |

## AI Gateway

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| AI-01 | Healthchecks automáticos | Backend | Endpoint `/api/ai/health` | Pendiente |
| AI-02 | Fallback funcional | Backend | Test de caída proveedor primario | Pendiente |
| AI-03 | Restricción PHI en proveedores no aprobados | Backend | Test de desidentificación | Pendiente |
| AI-04 | Presupuesto mensual configurado | Admin | Configuración en dashboard admin | Pendiente |
| AI-05 | Autorouting funcional | Backend | Tests de política de routing | Pendiente |

## Observabilidad

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| OB-01 | Healthcheck endpoint funcional | Backend | `/api/health` responde 200 | Pendiente |
| OB-02 | Logs estructurados | Backend | Formato JSON logs + búsqueda | Pendiente |
| OB-03 | Error tracking (Sentry) configurado | DevOps | DSN funcional + alertas | Pendiente |
| OB-04 | Métricas básicas | DevOps | Endpoint `/api/metrics` Prometheus | Pendiente |

## Rendimiento

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| PF-01 | Load test pasado (>100 concurrentes) | QA | Report de k6/Lighthouse | Pendiente |
| PF-02 | Tiempo respuesta IA < 5s (streaming) | Backend | Medición en staging | Pendiente |
| PF-03 | Cache estratégico funcionando | Backend | Redis hit ratio > 80% | Pendiente |

## Accesibilidad

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| AX-01 | WCAG 2.2 AA validado | QA | Report Lighthouse AX | Pendiente |
| AX-02 | Navegación teclado completa | QA | Tab order test manual | Pendiente |
| AX-03 | Lectura clara para usuarios no técnicos | UX | Test con usuarios no técnicos | Pendiente |

## UX

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| UX-01 | ThemeToggle intuitivo | UX | Botón visible en header | Pendiente |
| UX-02 | LanguageToggle funcional | UX | Detector región + override | Pendiente |
| UX-03 | Safety Ribbon visible | UX | Ribbon con estado clínico | Pendiente |
| UX-04 | Action Receipts después de acciones | UX | Receipt modal/popup | Pendiente |

## Retención/Eliminación

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| RT-01 | Job de retención configurado | Backend | Cron/queue programada | Pendiente |
| RT-02 | Job auditable | Backend | Logs de ejecución + tabla | Pendiente |
| RT-03 | Notificación previa a eliminación | Backend | Email 7 días antes | Pendiente |

## Backups

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| BK-01 | Backup base de datos diario | DevOps | Script + verificación restore | Pendiente |
| BK-02 | Backup storage cifrado | DevOps | Script + verificación restore | Pendiente |
| BK-03 | Retention de backups 30 días | DevOps | Política documentada | Pendiente |

## Rollback

| ID | Gate | Responsable sugerido | Evidencia requerida | Estado |
|----|------|---------------------|---------------------|--------|
| RB-01 | Rollback en 5 minutos documentado | DevOps | Script de rollback + prueba | Pendiente |
| RB-02 | Migraciones reversibles | Backend | Migration down scripts | Pendiente |
| RB-03 | Versión anterior funcional | DevOps | Test de rollback OK | Pendiente |