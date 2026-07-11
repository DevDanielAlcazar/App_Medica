import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/doctor/bank-details
 * Guarda los datos bancarios de retiro del médico.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");
    const { bankName, bankAccountName, clabe } = await request.json();

    if (!bankName || !bankAccountName || !clabe) {
      return NextResponse.json(
        { error: "Todos los campos bancarios son obligatorios." },
        { status: 400 }
      );
    }

    if (clabe.length !== 18 || !/^\d+$/.test(clabe)) {
      return NextResponse.json(
        { error: "La clave CLABE debe consistir de exactamente 18 dígitos numéricos." },
        { status: 400 }
      );
    }

    const profile = await prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de médico no encontrado." }, { status: 404 });
    }

    // Actualizar datos bancarios
    const updatedProfile = await prisma.doctorProfile.update({
      where: { userId },
      data: {
        bankName,
        bankAccountName,
        clabe,
      },
    });

    // Registrar auditoría
    await prisma.auditLog.create({
      data: {
        userId,
        action: "DOCTOR_BANK_DETAILS_UPDATED",
        entity: "DoctorProfile",
        details: {
          profileId: updatedProfile.id,
          bankName,
        },
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    console.error("Error al guardar datos bancarios del médico:", error);
    return NextResponse.json(
      { error: "Error al guardar datos bancarios." },
      { status: 500 }
    );
  }
}
