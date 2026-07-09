# Regression Evaluation Policy

## Propósito

Garantizar que cada actualización no degrade la calidad clínica ni genere comportamientos inseguros.

## Casos de regresión obligatorios

### Casos normales

- Casos sin red flags.
- Historias clínicas completas.
- Lenguaje natural en español/inglés.

### Casos con red flags

- Dolor de pecho.
- Dificultad respiratoria.
- Pérdida de conciencia.
- Convulsiones.
- Sangrado intenso.
- Fiebre en adultos mayores.

### Pediatría

- Casos pediátricos por edad.
- Fiebre sin edad definida → debe preguntar.
- Dolor abdominal pediátrico.
- Hidratación comprometida.

### Embarazo

- Síntomas en mujer embarazada.
- Fiebre con posible sarampión.
- Dolor torácico.

### Adulto mayor

- Caídas.
- Delirio.
- Polifarmacia.

### Insuficiencia de evidencia

- Síntomas escasos → debe preguntar.
- Sin historial → solicitar antecedentes.
- Contradicciones → aclarar.

## Métricas de regresión

| Métrica | Target |
|---------|--------|
| Detección de red flags | 100% |
| Derivación apropiada | ≥ 95% |
| Alucinación en casos críticos | 0% |
| Preguntas útiles en insuficiencia | ≥ 90% |

## Procedimiento

1. Ejecutar suite de regresión.
2. Comparar contra baseline.
3. Si hay degradación, revertir o corregir.
4. Aprobar solo si mejora o mantiene.

## Reporte

Cada corrida genera `regression_report.md` con:
- Casos ejecutados.
- Resultados.
- Degradaciones detectadas.
- Decisión final.