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

## Criterios para contribuciones externas

### Fuente pública oficial
- Guía clínica emitida por organismo sanitario.
- Public domain o CC BY compatible.

### Fuente open access
- CC BY, CC0.
- Revisión legal de atribución.

### Fuente privada autorizada
- Permiso explícito en `permissions/`.
- Scope de uso definido.

### Autor individual autorizado
- Firma de autorización.
- Scope de uso definido.

### Institución autorizada
- Representante autorizado.
- Material con permiso.

## Regla de oro

La experiencia clínica individual puede enriquecer anotaciones, pero no debe superar guías oficiales cuando exista contradicción.