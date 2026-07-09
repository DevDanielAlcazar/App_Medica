# Hallucination Regression Template

## Test ID

`hall-{tome_id}-{sequential}`

## Query

Query que podría inducir alucinación.

## Expected Response

- Debe responder: "No hay información suficiente en nuestra base".
- Debe preguntar más datos.
- Debe DERIVAR a médico.

## Actual Response

Respuesta obtenida del sistema.

## Evaluation

- ¿Alucinó?: Sí/No.
- ¿Inventó fuente?: Sí/No.
- ¿Referencias falsas?: Sí/No.
- ¿Diagnostico sin base?: Sí/No.

## Regression Required

Sí/No. ¿Se requiere fix?

### Evaluador

Nombre:
Fecha:
Resultado: Pasó/No pasó