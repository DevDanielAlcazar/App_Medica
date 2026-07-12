import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { evaluateClinicalGuardrails } from "@/lib/ai/guardrails";
import { searchMedicalKnowledge } from "@/lib/ai/rag";
import { routeAiRequest, ChatMessage } from "@/lib/ai/gateway";

/**
 * GET /api/patient/cases/[caseId]/messages
 * Recupera el historial de mensajes de una consulta.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    // Validar propiedad del caso
    const clinicalCase = await prisma.clinicalCase.findUnique({
      where: { id: caseId },
    });

    if (!clinicalCase || clinicalCase.userId !== userId) {
      return NextResponse.json({ error: "Caso no encontrado." }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: { caseId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, messages, case: clinicalCase });
  } catch (error: any) {
    console.error("Error al obtener mensajes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/patient/cases/[caseId]/messages
 * Recibe un mensaje, aplica RAG + Guardrails y enruta por el AI Gateway.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");
    const { content, attachments } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "El contenido del mensaje no puede estar vacío." },
        { status: 400 }
      );
    }

    // 1. Validar propiedad del caso clínico
    const clinicalCase = await prisma.clinicalCase.findUnique({
      where: { id: caseId },
    });

    if (!clinicalCase || clinicalCase.userId !== userId) {
      return NextResponse.json({ error: "Caso clínico no encontrado." }, { status: 404 });
    }

    // 2. Cargar historial de mensajes de este caso
    const messageHistory = await prisma.message.findMany({
      where: { caseId },
      orderBy: { createdAt: "asc" },
    });

    // 3. Extracción heurística de edad y peso desde el historial y el mensaje actual
    const fullTextHistory = [...messageHistory.map((m) => m.content), content].join(" ").toLowerCase();
    
    // Buscar edad (ej. "4 años", "12 meses")
    let detectedAge: number | undefined = undefined;
    const ageMatch = fullTextHistory.match(/\b(\d+)\s*(años|meses|anos)\b/);
    if (ageMatch) {
      const value = parseInt(ageMatch[1], 10);
      detectedAge = ageMatch[2].includes("mes") ? value / 12 : value;
    }

    // Buscar peso (ej. "14 kg", "15.5 kilos")
    let detectedWeight: number | undefined = undefined;
    const weightMatch = fullTextHistory.match(/\b(\d+(?:\.\d+)?)\s*(kg|kilos|kilos)\b/);
    if (weightMatch) {
      detectedWeight = parseFloat(weightMatch[1]);
    }

    // Buscar alergias (ej. "alérgico a la penicilina", "alergia a las sulfas", "alergico al paracetamol")
    const patientAllergies: string[] = [];
    const allergyRegex = /(?:alergico\s+a\s+la|alergico\s+a|alergia\s+a\s+la|alergia\s+a|alergico\s+al|alergia\s+al)\s+([a-zñáéíóú]+)/gi;
    let match;
    while ((match = allergyRegex.exec(fullTextHistory)) !== null) {
      const allergyItem = match[1].toLowerCase().trim();
      if (allergyItem && allergyItem.length > 2 && !patientAllergies.includes(allergyItem)) {
        patientAllergies.push(allergyItem);
      }
    }

    // 4. Evaluar GUARDRAILS CLÍNICOS
    const guardrailResult = evaluateClinicalGuardrails(content, detectedAge, detectedWeight, patientAllergies);

    // Guardar el mensaje del usuario en la base de datos de inmediato
    const userMessage = await prisma.message.create({
      data: {
        caseId,
        sender: "user",
        content,
        attachments: attachments || [],
      },
    });

    let assistantResponseText = "";
    let timelineUpdate: any = null;

    if (!guardrailResult.passed) {
      // Si el guardrail bloqueó la consulta
      assistantResponseText = guardrailResult.autoResponse || "Lo sentimos, no podemos continuar la orientación por motivos de seguridad clínica.";
      
      // Actualizar estatus y timeline del caso si es crítico
      const newStatus = guardrailResult.riskLevel === "danger" ? "derivado" : clinicalCase.status;
      
      const timelineEvent = {
        id: crypto.randomUUID(),
        type: guardrailResult.riskLevel === "danger" ? "alert" : "warning",
        timestamp: new Date().toISOString(),
        title: guardrailResult.riskLevel === "danger" ? "Alarma Crítica Detectada" : "Guardrail Activado",
        description: guardrailResult.blockedReason || "Validación de seguridad clínica activada.",
        severity: guardrailResult.riskLevel === "danger" ? "high" : "medium" as const,
      };

      const updatedTimeline = [...(clinicalCase.timeline as any[]), timelineEvent];

      await prisma.clinicalCase.update({
        where: { id: caseId },
        data: {
          status: newStatus,
          timeline: updatedTimeline,
        },
      });

      timelineUpdate = timelineEvent;
    } else {
      // 5. Determinar si se requiere búsqueda médica en la web (frescura REQ-029)
      const queryLower = content.toLowerCase();
      const needsWebSearch = /\b(actualiz|recient|internet|web|busc|guias|oms|cdc|2026|covid|dengue|vacuna|nuev)/.test(queryLower);
      
      let webContext = "";
      if (needsWebSearch) {
        try {
          const { searchMedicalWeb } = await import("@/lib/services/webSearch");
          webContext = await searchMedicalWeb(content);
        } catch (err) {
          console.error("Error al ejecutar búsqueda web médica:", err);
        }
      }

      // 6. Realizar búsqueda RAG usando el historial completo de la conversación
      const ragContext = await searchMedicalKnowledge(fullTextHistory);

      // 7. Preparar el Prompt del Sistema Clínico (Reglas de Gobernanza Médica)
      const systemPrompt = `Eres Angélica, un asistente clínico de inteligencia artificial diseñado para orientar a pacientes con rigor clínico.
NORMAS INQUEBRANTABLES:
- NUNCA diagnostiques de forma definitiva. Tu sospecha debe plantearse como diferencial o condicional ("La sospecha es X, pero requieres confirmación presencial o estudios").
- NUNCA prescribas medicamentos controlados (psicotrópicos, opioides).
- NUNCA indiques antibióticos ni tratamientos de especialidad sin confirmación física.
- Si el paciente presenta fatiga severa, dolor de pecho u opresión, recomiéndale llamar al 911 de inmediato.
- Sé claro, comprensivo y utiliza un tono profesional pero empático.
- CONTINUIDAD DE LA CHARLA: Analiza detenidamente el historial de la conversación. NO repitas preguntas que el paciente ya respondió anteriormente ni lo trates como un caso nuevo en cada mensaje. Las preguntas sugeridas por la guía (RAG) son solo si no tienes esa información todavía.
- ETIQUETAS DE RECOMENDACIÓN CLÍNICA (OBLIGATORIO):
  Al final de tu respuesta, debes incluir exactamente una de las siguientes etiquetas en una nueva línea si se cumplen las condiciones:
  * Si el paciente tiene una situación de riesgo grave ACTUAL (dolor torácico severo, falta de aire súbita, desmayo, etc.) y recomiendas que vaya de inmediato a urgencias/hospital, agrega: [RECOMENDACION: URGENCIAS]
  * Si consideras que el paciente no está en peligro inmediato pero sus síntomas ameritan ser revisados de forma rutinaria/preventiva por un médico en consulta física presencial, agrega: [RECOMENDACION: CONSULTA_MEDICA]
  * Si no consideras necesaria una derivación o el caso se puede vigilar en casa por el momento, no agregues ninguna etiqueta.
  * NOTA: Los discursos preventivos generales tipo "si empeora vaya a urgencias" NO activan la etiqueta de URGENCIAS. Solo actívala si el cuadro actual del paciente es una urgencia hoy.

${ragContext ? ragContext : "No se encontró contexto clínico específico para este síntoma. Mantén la continuidad de la conversación y orienta al paciente de manera conservadora."}

${webContext ? webContext : ""}
`;

      // 8. Preparar la cadena de mensajes para el AI Gateway
      const apiMessages: ChatMessage[] = [
        { role: "system", content: systemPrompt },
        ...messageHistory.map((m) => ({
          role: m.sender === "assistant" ? "assistant" as const : "user" as const,
          content: m.content,
        })),
        { role: "user", content: content },
      ];

      // 8. Llamar al AI Gateway (Failover y enrutamiento dinámico automático)
      const aiResponse = await routeAiRequest("clinical_triage", apiMessages, userId);

      if (!aiResponse.success) {
        assistantResponseText = "Lo sentimos, el asistente clínico está experimentando dificultades técnicas temporales. Por favor, reintenta en un momento.";
      } else {
        let rawResponse = aiResponse.content;
        let timelineEvent = null;
        let finalStatus = clinicalCase.status;

        // Parsear y remover las etiquetas de recomendación clínica
        if (rawResponse.includes("[RECOMENDACION: URGENCIAS]")) {
          rawResponse = rawResponse.replace("[RECOMENDACION: URGENCIAS]", "").trim();
          timelineEvent = {
            id: crypto.randomUUID(),
            type: "alert",
            timestamp: new Date().toISOString(),
            title: "Derivación Urgente",
            description: "El asistente recomendó atención médica en sala de urgencias de inmediato debido a la gravedad de los síntomas.",
            severity: "high" as const,
          };
          finalStatus = "derivado";
        } else if (rawResponse.includes("[RECOMENDACION: CONSULTA_MEDICA]")) {
          rawResponse = rawResponse.replace("[RECOMENDACION: CONSULTA_MEDICA]", "").trim();
          timelineEvent = {
            id: crypto.randomUUID(),
            type: "check",
            timestamp: new Date().toISOString(),
            title: "Recomendación Médica",
            description: "El asistente recomendó programar una consulta médica presencial no urgente para valoración física.",
            severity: "medium" as const,
          };
          finalStatus = "en_tratamiento"; // Actualizar a estado en tratamiento/revisión
        }

        assistantResponseText = rawResponse;

        if (timelineEvent) {
          const updatedTimeline = [...(clinicalCase.timeline as any[]), timelineEvent];
          await prisma.clinicalCase.update({
            where: { id: caseId },
            data: {
              timeline: updatedTimeline,
              status: finalStatus,
            },
          });
          timelineUpdate = timelineEvent;
        }
      }
    }

    // 10. Guardar la respuesta del asistente en base de datos
    const assistantMessage = await prisma.message.create({
      data: {
        caseId,
        sender: "assistant",
        content: assistantResponseText,
      },
    });

    return NextResponse.json({
      success: true,
      messages: [userMessage, assistantMessage],
      timelineUpdate,
    });
  } catch (error: any) {
    console.error("Error al procesar mensaje clínico:", error);
    return NextResponse.json(
      { error: "Error al enviar el mensaje clínico." },
      { status: 500 }
    );
  }
}
