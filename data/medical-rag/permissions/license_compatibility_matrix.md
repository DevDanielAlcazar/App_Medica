# License Compatibility Matrix

Matriz para decidir qué contenido puede combinarse en un corpus/RAG.

## Licencias comunes

| Licencia/Fuente | Metadata | Cita limitada | RAG interno | RAG producto | Comercial | Redistribución | Traducción | Derivados | Requiere legal |
|-----------------|----------|---------------|-------------|--------------|-----------|----------------|------------|-----------|----------------|
| Public Domain (US Gov) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | No |
| CC BY 4.0 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | No |
| CC BY-SA 4.0 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓* | ✓* | ✓* | No* |
| CC BY-NC 4.0 | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | Parcial | Parcial | Sí |
| CC BY-ND 4.0 | ✓ | ✓ | ✓** | ✗ | ✗ | ✗ | ✗ | ✗ | Sí |
| All Rights Reserved + permiso | Según permiso | Según permiso | Según permiso | Según permiso | Según permiso | Según permiso | Según permiso | Según permiso | Sí |
| SNOMED CT | ✓ | Parcial | Parcial | No | No | No | No | No | Sí |
| ICD-11 | ✓ | Parcial | Parcial | No | No | No | No | No | Sí |
| WHO CC BY-NC | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | Parcial | Parcial | Sí |

## Notas

- ✓* Compartir derivados igual licencia.
- ✓** Solo retrieval, no almacenar como chunks modificados.
- "Parcial" requiere revisión legal específica.

## Regla de combinación

Un corpus solo puede combinar contenido cuyas licencias permitan el scope del corpus sin violar restricciones.