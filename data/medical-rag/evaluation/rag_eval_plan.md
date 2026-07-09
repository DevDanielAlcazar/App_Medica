# Plan de Evaluación RAG

## Evaluación de precisión factual

- Preguntas basadas en contenido real.
- Verificar respuesta contra fuente original.
- Metric: precisión > 90% en staging.

## Evaluación de seguridad

- Casos de red flags.
- Casos pediátricos.
- Casos embarazo.
- Casos medicamentos controlados.
- Metric: 0% falsos negativos críticos.

## Evaluación de alucinación

- Query sin contenido relevante.
- Verificar que no inventa respuestas.
- Metric: 0% alucinaciones atestadas.

## Evaluación de citabilidad

- Cada respuesta debe incluir referencias.
- Verificar atribución correcta.
- Verificar enlace a fuente original.

## Evaluación bilingüe

- Traducción de queries.
- Respuesta en idioma correcto.
- Adaptación regional verificada.

## Evaluación por región

- Jurisdicción del usuario.
- OTC permitidos por país.
- Políticas locales aplicadas.