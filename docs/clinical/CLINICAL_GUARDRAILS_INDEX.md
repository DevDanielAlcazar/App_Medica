# Índice de Guardrails Clínicos — App Médica

## Qué puede hacer la IA

1. **Orientación general** - Explicar síntomas, enfermedades, procedimientos.
2. **Recomendación Sintomatológica** - Solo cuando exista evidencia mínima suficiente.
3. **Resumen de expediente** - Generar resúmenes sin PHI completo.
4. **Traducción médica** - Traducir contenido clínico.
5. **Búsqueda web médica controlada** - Sintetizar resultados de fuentes aprobadas.
6. **Soporte administrativo** - Responder dudas de uso de la plataforma.

## Qué NO puede hacer la IA

1. **Recetar medicamentos controlados** - Absolutamente prohibido.
2. **Dar dosis sin catálogo médico aprobado** - Solo OTC validado.
3. **Recomendar sin evidencia mínima** - Debe solicitar datos faltantes.
4. **Diagnosticar en casos pediátricos sin checklist** - Requiere edad, peso, y datos completos.
5. **Ignorar red flags** - Debe derivar a consulta presencial.
6. **Almacenar PHI en logs** - Prohibido por diseño.

## Prohibición de medicamentos controlados

- **Prohibido mencionar:** Cómo obtener, dónde comprar, sustitutos.
- **Acción requerida:** Explicar que requiere médico, generar reporte de derivación.
- **Obligatorio:** Ofrecer cita humana en Meet inmediatamente.

## Condiciones para emitir Recomendación Sintomatológica

La IA solo emite Recomendación Sintomatológica cuando:

1. Evidencia mínima completa (tabla en `11_Guardrails_Clinicos.md`).
2. No hay red flags activos.
3. El caso no es pediátrico o pasa el checklist pediátrico.
4. El modelo usado está marcado como `clinicalAllowed = true`.
5. El usuario ha aceptado términos y políticas actualizadas.

**Formato obligatorio de la Recomendación Sintomatológica:**

> Este documento es una Recomendación Sintomatológica generada con base en la información disponible en tu expediente y conversación. No sustituye atención médica presencial cuando existen señales de alarma o incertidumbre clínica.

Incluye:
- Evidencia usada.
- Recomendación.
- Qué vigilar.
- Cuándo acudir a médico.
- Cuándo buscar urgencias.
- Seguimiento sugerido.
- Fecha y versión de policy.

## Manejo de pediatría

Checklist obligatorio antes de cualquier recomendación en menores:

- Edad exacta.
- Peso.
- Tutor responsable y verificado.
- Temperatura.
- Hidratación.
- Duración de síntomas.
- Síntomas respiratorios/digestivos/neurológicos.
- Medicamentos previos.
- Alergias.
- Signos de alarma.

**Regla:** Si falta edad o peso, no recomendar dosificación. Derivar a médico humano.

## Red flags (señales de alarma)

Catálogo inicial de red flags (ver `11_Guardrails_Clinicos.md` para lista completa):

- Dolor de pecho.
- Dificultad respiratoria.
- Pérdida de conciencia.
- Convulsiones.
- Signos neurológicos focales.
- Sangrado intenso.
- Fiebre persistente/alta en grupos vulnerables.
- Deshidratación.
- Dolor abdominal severo.
- Embarazo con síntomas relevantes.
- Menores con letargo, dificultad respiratoria o mala hidratación.

## Cuándo pedir más evidencia

La IA debe solicitar más datos cuando:

1. Falta información en el checklist de evidencia mínima.
2. Los datos son contradictorios.
3. La confianza es baja (< 50%).
4. El caso es delicado sin más contexto.

La respuesta debe guiar al usuario con preguntas específicas.

## Cuándo derivar a consulta médica presencial

La IA debe generar reporte de derivación cuando:

1. Hay uno o más red flags.
2. La evidencia es insuficiente y no puede completarse.
3. Se requiere medicamento controlado.
4. El caso pediátrico no pasa el checklist.
5. El usuario solicita atención humana.
6. El modelo detecta incertidumbre alta.

**Formato del reporte de derivación:**
- Caso ID.
- Síntomas reportados.
- Red flags detectados.
- Razón de la derivación.
- Link para agendar cita en Meet.

## Participación de médico humano

1. Médico debe estar en estatus `Activo` para tomar citas.
2. Estatus `En revisión` impide toma de citas.
3. Admin/Soporte valida documentos (cédula + INE).
4. Cada cambio de estatus queda auditado.
5. Médico ve solo expedientes de citas asignadas.

## Auditoría de decisiones clínicas

- Toda interacción IA → usuario es registrada.
- Recomendaciones tienen código de versión de policy.
- Guardrails aplicados se registran en `audit_log`.
- Derivaciones generan `ActionReceipt`.
- Médico puede ver historial de interacción IA.

## Disclaimer operativo

> Si la evidencia clínica es insuficiente, contradictoria o existen red flags, la IA debe detener recomendación sintomatológica y derivar a evaluación humana/presencial según riesgo.

Esta regla es **inviolable**. Cualquier recomendación sin cumplir estos requisitos es un bug crítico.