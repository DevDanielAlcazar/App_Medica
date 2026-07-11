export interface GuardrailResult {
  passed: boolean;
  riskLevel: "safe" | "warning" | "danger";
  blockedReason?: string;
  autoResponse?: string;
  notes?: string;
}

// Catálogo de Red Flags Clínicas (Señales de alarma de urgencia)
const RED_FLAGS = [
  {
    keywords: ["pecho", "dolor de pecho", "opresion", "infarto", "dolor en el pecho", "brazo izquierdo"],
    reason: "Dolor torácico sospechoso de síndrome coronario agudo.",
    response: "🚨 DETECTADA ALERTA CRÍTICA: Presentas síntomas que podrían indicar un problema cardíaco severo. Por favor, acude de inmediato a la sala de urgencias más cercana o llama al número de emergencias (911). No esperes."
  },
  {
    keywords: ["respirar", "falta de aire", "asfixia", "ahogo", "dificultad respiratoria", "silbido al respirar"],
    reason: "Dificultad respiratoria aguda o broncoespasmo severo.",
    response: "🚨 DETECTADA ALERTA CRÍTICA: La dificultad respiratoria es una urgencia médica. Por favor, busca atención médica de emergencia de inmediato o llama al 911."
  },
  {
    keywords: ["desmayo", "perdi el conocimiento", "convulsion", "desvanecimiento", "desmaye", "convulsiones"],
    reason: "Pérdida de conciencia o actividad convulsiva.",
    response: "🚨 DETECTADA ALERTA CRÍTICA: Pérdida del conocimiento o convulsiones. Requiere evaluación médica presencial inmediata en urgencias."
  },
  {
    keywords: ["sangre", "sangrado abundante", "hemorragia", "vomi sangre", "sangrando mucho"],
    reason: "Hemorragia activa potencialmente severa.",
    response: "🚨 DETECTADA ALERTA CRÍTICA: Reportas un sangrado abundante. Presiona la zona y acude de inmediato a urgencias."
  },
  {
    keywords: ["abdominal severo", "dolor de panza fuerte", "dolor de estomago insoportable", "apendicitis"],
    reason: "Abdomen agudo sospechoso de complicación quirúrgica.",
    response: "🚨 DETECTADA ALERTA DE RIESGO: Un dolor abdominal súbito y muy severo requiere descartan apendicitis u otras urgencias. Te recomendamos acudir a una consulta física prioritaria."
  }
];

// Catálogo de Medicamentos Controlados Bloqueados (REQ-016)
const CONTROLLED_SUBSTANCES = [
  "clonazepam", "rivotril", "diazepam", "valium", "alprazolam", "xanax",
  "metilfenidato", "ritalina", "fentanilo", "morfina", "tramadol", "codeina",
  "lorazepam", "ativan", "fenobarbital", "psicotrópico", "opiáceo", "anfetamina"
];

/**
 * Evalúa las reglas clínicas y de seguridad sobre el mensaje del paciente.
 */
export function evaluateClinicalGuardrails(
  messageContent: string,
  patientAge?: number,
  patientWeight?: number
): GuardrailResult {
  const contentLower = messageContent.toLowerCase();

  // 1. Validar SEÑALES DE ALARMA (Red Flags - Estado Rojo)
  for (const flag of RED_FLAGS) {
    const matches = flag.keywords.some((kw) => contentLower.includes(kw));
    if (matches) {
      return {
        passed: false,
        riskLevel: "danger",
        blockedReason: flag.reason,
        autoResponse: flag.response,
        notes: `Triage automático: Derivación inmediata a urgencias por ${flag.reason}`
      };
    }
  }

  // 2. Validar MEDICAMENTOS CONTROLADOS (Estado Amarillo / Bloqueo de Receta)
  const containsControlled = CONTROLLED_SUBSTANCES.some((substance) =>
    contentLower.includes(substance)
  );
  if (containsControlled) {
    return {
      passed: false,
      riskLevel: "warning",
      blockedReason: "Solicitud o mención de medicamento controlado.",
      autoResponse: "⚠️ AVISO DE SEGURIDAD CLÍNICA: Angélica Med no prescribe ni orienta sobre el uso o dosificación de medicamentos controlados (como benzodiacepinas, opioides o estimulantes). Si requieres estos fármacos, te recordamos que es indispensable una consulta presencial con un médico psiquiatra o especialista certificado. ¿Deseas agendar una cita médica presencial?",
      notes: "Guardrail activado: Intento de consulta de medicamento controlado."
    };
  }

  // 3. Validar REGLAS DE PEDIATRÍA (Evitar dosificaciones ciegas en menores)
  const isPediatricKeywords = ["hijo", "hija", "bebe", "niño", "niña", "pequeño", "meses", "años de edad"].some(
    (kw) => contentLower.includes(kw)
  );
  
  const isUnderage = patientAge !== undefined && patientAge < 12;

  if (isUnderage || isPediatricKeywords) {
    // Si falta el peso o la edad exacta, bloquear cualquier recomendación cuantitativa de dosis
    const hasWeight = patientWeight !== undefined && patientWeight > 0;
    const hasAge = patientAge !== undefined && patientAge > 0;
    
    // Si la persona pregunta explícitamente por "dosis", "cuanto le doy", "cuantos ml", "cuantos mg"
    const isAskingDosage = ["dosis", "cuanto le doy", "ml", "mg", "darle", "tomar", "jarabe"].some((kw) =>
      contentLower.includes(kw)
    );

    if (isAskingDosage && (!hasWeight || !hasAge)) {
      return {
        passed: false,
        riskLevel: "warning",
        blockedReason: "Solicitud de dosificación pediátrica sin peso/edad confirmados.",
        autoResponse: "👶 ATENCIÓN DE SEGURIDAD PEDIÁTRICA: Para poder recomendar la dosificación segura de antipiréticos u otros medicamentos de venta libre para un menor de edad, es clínicamente indispensable contar con su edad exacta y peso actual. Por favor, indícanos estos datos para que nuestro asistente pueda guiarte con precisión, o consulta directamente con su pediatra.",
        notes: "Pediatric Safety: Bloqueo de dosificación por falta de peso o edad."
      };
    }
  }

  // Si pasa todas las validaciones de seguridad
  return {
    passed: true,
    riskLevel: "safe",
  };
}
