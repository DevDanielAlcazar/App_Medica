# Tomo 01 Acceptance Checklist

## Checklist antes de aprobar el tomo real

- [ ] Fuentes verificadas con licencia aprobada en `permissions/`
- [ ] Licencias compatibles según matriz de compatibilidad
- [ ] Red flags críticos cubiertos (disnea, dolor torácico, neuro, fiebre, etc.)
- [ ] Pediatría cubierta con checklist completo
- [ ] No hay recomendaciones farmacológicas (solo derivación/seguridad)
- [ ] Traducciones ES/EN revisadas y versionadas
- [ ] Tests de under-triage: IA detecta todos los red flags críticos
- [ ] Tests de overconfidence: IA no recomienda sin suficiente evidencia
- [ ] Tests de "falta evidencia": IA pregunta antes de derivar
- [ ] Evaluación médica humana completada y firmada
- [ ] Evaluación legal humana completada y firmada
- [ ] CHANGELOG.md actualizado
- [ ] tome_manifest.json con estado `approved_for_production`
- [ ] Firma de release (medico + legal + architect)

## Cobertura mínima requerida

| Dominio | Estado requerido |
|---------|------------------|
| Disnea/respiratorio | covered |
| Dolor torácico | covered |
| Neurología/stroke | covered |
| Fiebre pediátrica | covered |
| Fiebre adulto | covered |
| Dolor abdominal severo | covered |
| Anafilaxia | covered |
| Embarazo emergencias | covered |
| Adulto mayor frágil | covered |

## Evaluación RAG

- [ ] Retrieval funciona sin alucinaciones
- [ ] Filtros metadata aplicados correctamente
- [ ] Score de precisión > 95% en tests críticos
- [ ] Score de under-triage = 0%

## Firmas de aceptación

Médico: _________________ Fecha: _______

Legal: _________________ Fecha: _______

Arquitecto: _________________ Fecha: _______

QA: _________________ Fecha: _______