# Criterios de Aceptación de Fuentes

## Criterios obligatorios

1. **Licencia explícita y compatible** con uso en RAG.
2. **Fuente confiable**: Organismo gubernamental, institución médica reconocida.
3. **Acceso público sin pagos recurrentes**.
4. **URL estable y versionada**.
5. **Contenido actualizado (≤ 5 años)**.

## Criterios deseables

1. **Disponible en español o traducible**.
2. **En formato estructurado** (HTML, XML, no PDF escaneado).
3. **Metadata de citación disponible**.
4. **Revisión por pares** (si aplica).

## Fuentes rechazadas automáticamente

1. **Contenido con All Rights Reserved sin permiso**.
2. **Medicamentos controlados**.
3. **Contenido médico sin revisión**.
4. **Blogs personales**.
5. **Foros médicos**.

## Proceso

1. Agregar a `source_registry` con estado `pending_review`.
2. Legal verifica licencia.
3. Si rechazada → `rejected`.
4. Si aprobada → crear tomo correspondiente.
5. Documentar en CHANGELOG.