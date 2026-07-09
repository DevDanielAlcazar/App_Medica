# Política de Recuperación RAG

## Flujo de retrieval

1. Recibir query clínica.
2. Identificar dominio/specialty.
3. Filtrar por metadata:
   - Jurisdicción del usuario.
   - Edad (pediatría requiere tomo 04).
   - Sexo/femenino/embarazo.
   - Evidence level requerido.
4. Priorizar tomos:
   - Primero `01_red_flags_triage`.
   - Luego `02_clinical_history_anamnesis`.
   - Luego dominio específico.
5. Retrieval híbrido:
   - Lexical (palabras clave).
   - Vectorial (semántica).
   - Filtros metadata.
6. Verificar evidence_level del chunk.
7. Generar respuesta con referencias.

## Políticas reforzadas

### Pediatría
- Solo tomo 04.
- Checklist edad/peso obligatorio.
- Sin recomendación OTC sin validación.

### Embarazo
- Solo contenido `pregnancy_related`.
- Red flags mujer embarazada.
- Derivación obligatoria si complejidad.

### Oncología
- Solo tomo 08.
- Sin diagnóstico definitivo.
- Derivación si sospecha.

### Medicamentos controlados
- Prohibido retrieval de contenido sobre controlados.
- Manejo explícito en guardrails.

## Fallback

Si no hay contenido aprobado:
- Respuesta: "No hay información suficiente en nuestra base".
- Preguntar más datos.
- Derivar a médico humano.