# Library de Prompts — App Médica

Esta carpeta contiene los prompts estructurados para la ejecución por IA Jr (OpenCode/AionUI/otros).

## Reglas de uso

1. Cada prompt es una tarea acotada.
2. La IA Jr **no decide arquitectura**.
3. La IA Jr **no modifica seguridad/IA clínica** sin permiso.
4. Todo cambio **debe incluir tests**.
5. Todo módulo **debe tener README interno**.
6. No se aceptan PRs sin build, lint y tests verdes.

## Estructura de prompts

```
prompts/
  README.md                    # Esta guía
  01_bootstrap_gobernanza_*.md # Prompt 01 - Baseline técnico
  XX_descripcion_tarea.md      # Futuros prompts numerados
```

## Checklist previa a prompt

- [ ] ¿La tarea está acotada?
- [ ] ¿El prompt indica archivos permitidos?
- [ ] ¿Incluye tests?
- [ ] ¿No toca seguridad/IA clínica sin permiso?
- [ ] ¿No expone PHI?

## Archivos creados por este prompt

| Archivo | Propósito |
|---------|-----------|
| `README.md` | Guía de uso de prompts |
| `01_bootstrap_gobernanza_tecnica_repo.md` | Prompt de bootstrap (este archivo) |

## Siguiente prompt sugerido

**Prompt 02 — Scaffolding técnico Next.js/TypeScript y estructura modular inicial**

Tareas previstas:
- Inicializar monorepo con Next.js App Router.
- Configurar TypeScript strict.
- Crear estructura de bounded contexts en `packages/`.
- Setup ESLint/Prettier.
- Definir scripts de build, lint, test.