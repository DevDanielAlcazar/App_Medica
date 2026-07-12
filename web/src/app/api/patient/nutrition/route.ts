import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { routeAiRequest, ChatMessage } from "@/lib/ai/gateway";

async function getPatientUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  const userId = token.replace("session-token-", "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.role !== "paciente") return null;
  return user;
}

export async function GET() {
  try {
    const user = await getPatientUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Buscar casos clínicos activos del paciente
    const cases = await prisma.clinicalCase.findMany({
      where: {
        userId: user.id,
        status: { notIn: ["curado", "archivado"] },
      },
      select: {
        title: true,
        status: true,
        timeline: true,
      },
    });

    // Construir prompt para IA
    const hasActiveCases = cases.length > 0;

    const systemPrompt = hasActiveCases
      ? `Eres un nutricionista clínico especializado. Genera un plan nutricional de 7 días adaptado a las condiciones del paciente basado en sus casos activos. Considera restricciones médicas, alergias e historial. Usa español. Formato de respuesta: JSON con estructura { days: [{ day: "lunes", meals: { desayuno: "...", comida: "...", cena: "..." } }, ... ] }. Sé específico con alimentos y porciones.`
      : `Eres un nutricionista clínico. Genera un plan nutricional general de 7 días enfocado en salud preventiva, bienestar y nutrición balanceada. No incluyas medicamentos ni recomendaciones médicas específicas. Usa español. Formato de respuesta: JSON con estructura { days: [{ day: "lunes", meals: { desayuno: "...", comida: "...", cena: "..." } }, ... ] }. Sé específico con alimentos y porciones.`;

    const caseContext = hasActiveCases
      ? `Casos activos del paciente: ${cases.map((c) => c.title).join(", ")}`
      : "Paciente sin casos activos - generar plan general de salud preventiva.";

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: caseContext },
    ];

    const response = await routeAiRequest("nutrition", messages, user.id);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || "Error generando plan nutricional" },
        { status: 500 }
      );
    }

    // Parsear JSON de la respuesta
    let plan;
    try {
      plan = JSON.parse(response.content);
    } catch (parseError) {
      // Si no es JSON válido, generar fallback simple
      plan = {
        days: [...Array(7)].map((_, i) => ({
          day: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][i],
          meals: {
            desayuno: "Avena integral con frutas tropicales",
            comida: "Pollo a la plancha con ensalada verde",
            cena: "Salmón al horno con vegetales",
          },
        })),
      };
    }

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    console.error("Error generando plan nutricional:", error);
    return NextResponse.json(
      { error: "Error interno generando plan nutricional" },
      { status: 500 }
    );
  }
}