# Medical Review Gate

## Checklist de revisión médica

Antes de pasar a producción, cada tomo debe pasar:

### Contenido médico
- [ ] Fuente aceptada y verificada.
- [ ] Evidencia nivel A-B-C adecuada.
- [ ] Red flags validados por médico.
- [ ] Pediatría validada con checklist.
- [ ] OTC validado con catálogo médico.
- [ ] No contiene medicamentos controlados.
- [ ] No contiene diagnósticos definitivos.
- [ ] Derivaciones correctas identificadas.

### Formato
- [ ] `clinical_action_type` correcto por chunk.
- [ ] `age_group` correcto.
- [ ] `sex_specificity` correcto.
- [ ] `red_flag_relevant` marcado correctamente.

### Seguridad
- [ ] Casos adversariales definidos.
- [ ] Tests de seguridad pasados.
- [ ] No hay falsos negativos en red flags.
- [ ] Casos pediátricos seguros.

## Responsable

Médico colegiado con experiencia en el dominio clínico del tomo.

## Evidencia requerida

- Report de revisión médica firmado.
- Lista de casos adversariales.
- Resultados de tests clínicos.