import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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

    // 1. Obtener caso y su historial de mensajes
    const clinicalCase = await prisma.clinicalCase.findUnique({
      where: { id: caseId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!clinicalCase || clinicalCase.userId !== userId) {
      return NextResponse.json({ error: "Caso clínico no encontrado." }, { status: 404 });
    }

    // 2. Extraer información clínica relevante a partir de los mensajes
    const userMessages = clinicalCase.messages.filter((m) => m.sender === "user");
    const assistantMessages = clinicalCase.messages.filter((m) => m.sender === "assistant");

    const lastAssistantResponse = assistantMessages[assistantMessages.length - 1]?.content || "";

    // 3. Estructuración inteligente básica del reporte basada en el caso
    const symptoms: string[] = [];
    
    // Buscar palabras comunes de síntomas en el historial
    const textToAnalyze = userMessages.map(m => m.content).join(" ").toLowerCase();
    if (textToAnalyze.includes("fiebre") || textToAnalyze.includes("calentura")) symptoms.push("Fiebre");
    if (textToAnalyze.includes("tos") || textToAnalyze.includes("garganta")) symptoms.push("Tos / Dolor de garganta");
    if (textToAnalyze.includes("cabeza") || textToAnalyze.includes("migraña")) symptoms.push("Cefalea (Dolor de cabeza)");
    if (textToAnalyze.includes("estomago") || textToAnalyze.includes("diarrea") || textToAnalyze.includes("vomito")) symptoms.push("Malestar gastrointestinal");
    if (textToAnalyze.includes("pecho") || textToAnalyze.includes("respirar")) symptoms.push("Dificultad respiratoria / Opresión torácica");
    
    if (symptoms.length === 0) symptoms.push("Sintomatología general bajo análisis");

    // Clasificar riesgo según estatus del caso
    let severity = "Baja";
    let actionRequired = "Orientación general y automonitoreo en casa.";
    
    if (clinicalCase.status === "derivado") {
      severity = "Alta";
      actionRequired = "Derivación urgente a sala de emergencias o consulta médica física inmediata.";
    } else if (clinicalCase.status === "enfermo") {
      severity = "Media";
      actionRequired = "Consulta presencial sugerida con médico general para confirmación diagnóstica.";
    }

    // Estructurar el reporte de recomendación sintomatológica
    const recommendationReport = {
      caseId: clinicalCase.id,
      title: clinicalCase.title,
      date: clinicalCase.createdAt,
      patientName: "Paciente Registrado", // Se podría consultar la tabla User si se requiere el nombre exacto
      symptoms: symptoms,
      severity: severity,
      actionRequired: actionRequired,
      summary: lastAssistantResponse || "No se ha generado orientación sintomática aún.",
      disclaimer: "Este documento es una guía informativa autogenerada por inteligencia artificial basada en síntomas declarados y guías clínicas vigentes. No constituye una receta médica, diagnóstico definitivo ni reemplaza la valoración de un profesional de la salud certificado en una consulta física.",
      otcGuidelines: severity === "Alta" 
        ? ["NUNCA automedicarse ante señales de alarma crítica.", "Acudir a urgencias."]
        : ["Uso de antipiréticos/analgésicos comunes bajo dosificación de empaque si no hay contraindicaciones.", "Abundantes líquidos y reposo."],
      redFlags: [
        "Dificultad para respirar u opresión de pecho.",
        "Fiebre persistente que no cede con analgésicos comunes (> 38.5 °C).",
        "Pérdida del estado de alerta o confusión.",
        "Dolor intenso o incapacitante."
      ]
    };

    return NextResponse.json({ success: true, recommendation: recommendationReport });
  } catch (error: any) {
    console.error("Error al estructurar recomendación sintomática:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

/**
 * POST /api/patient/cases/[caseId]/recommendation
 * Procesa la aceptación o descarte de un ActionReceipt clínico.
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
    const { actionType, value, accept, receiptId, title, severity } = await request.json();

    // 1. Validar caso clínico
    const clinicalCase = await prisma.clinicalCase.findUnique({
      where: { id: caseId },
    });

    if (!clinicalCase || clinicalCase.userId !== userId) {
      return NextResponse.json({ error: "Caso clínico no encontrado." }, { status: 404 });
    }

    // 2. Si es aceptado, agregar el evento al Timeline del expediente
    if (accept) {
      const timelineEvent = {
        id: receiptId || crypto.randomUUID(),
        type: "plus",
        timestamp: new Date().toISOString(),
        title: `Evolución: ${title}`,
        description: `El paciente integró a su expediente: ${value}`,
        severity: severity || "low",
      };

      const updatedTimeline = [...(clinicalCase.timeline as any[]), timelineEvent];

      await prisma.clinicalCase.update({
        where: { id: caseId },
        data: {
          timeline: updatedTimeline,
        },
      });

      // 3. Registrar auditoría append-only
      await prisma.auditLog.create({
        data: {
          userId,
          action: "CLINICAL_RECEIPT_INTEGRATED",
          entity: "ClinicalCase",
          details: { caseId, actionType, value },
        },
      });
    } else {
      // Registrar descarte en la auditoría
      await prisma.auditLog.create({
        data: {
          userId,
          action: "CLINICAL_RECEIPT_DECLINED",
          entity: "ClinicalCase",
          details: { caseId, actionType, value },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error al procesar ActionReceipt:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}

