# Flujo de Publicación de Tomos

## Estados

1. `draft` - En construcción.
2. `license_review` - Validando licencia.
3. `medical_review` - Validación médica.
4. `legal_review` - Validación legal.
5. `approved_for_staging` - Usable en staging/QA.
6. `approved_for_production` - Usable en producción.
7. `deprecated` - Retirado.

## Checklist de publicación

### License Review
- [ ] Licencia verificada por legal.
- [ ] Uso permitido confirmado.
- [ ] Atribución documentada.

### Medical Review
- [ ] Contenido médico revisado por médico.
- [ ] Red flags validados.
- [ ] OTC validado si aplica.
- [ ] Pediatría validado si aplica.

### Legal Review
- [ ] Derechos de autor confirmados.
- [ ] No hay redistribución prohibida.
- [ ] Uso comercial revisado.
- [ ] Territorio verificado.

### QA/Testing
- [ ] Tests clínicos pasados.
- [ ] Tests de seguridad pasados.
- [ ] Tests de alucinación pasados.
- [ ] Evaluación bilingüe.

## Publicación

Al pasar todos los gates:

1. Actualizar `tome_manifest.json` estado.
2. Copiar a `release/`.
3. Registrar en auditoría.
4. Notificar a admin.