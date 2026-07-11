import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/doctor/verify
 * Obtiene el estado actual de verificación del médico autenticado.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");

    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!doctorProfile) {
      return NextResponse.json({ error: "Perfil de médico no encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: doctorProfile });
  } catch (error: any) {
    console.error("Error al obtener estatus de verificación:", error);
    return NextResponse.json(
      { error: "Error al consultar estatus de verificación." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/doctor/verify
 * Permite al médico subir sus documentos e iniciar el proceso de revisión.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const userId = token.replace("session-token-", "");
    const { cedula, ineFront, ineBack } = await request.json();

    if (!cedula) {
      return NextResponse.json(
        { error: "El número de cédula profesional es obligatorio." },
        { status: 400 }
      );
    }

    // Buscar perfil existente
    const profile = await prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de médico no encontrado." }, { status: 404 });
    }

    // Actualizar documentos y cambiar estatus a 'en_revision'
    const updatedProfile = await prisma.doctorProfile.update({
      where: { userId },
      data: {
        cedula,
        ineFront: ineFront || profile.ineFront,
        ineBack: ineBack || profile.ineBack,
        verificationStatus: "en_revision",
      },
    });

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        userId,
        action: "DOCTOR_VERIFICATION_SUBMITTED",
        entity: "DoctorProfile",
        details: {
          profileId: updatedProfile.id,
          cedula,
        },
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    console.error("Error al guardar documentos de verificación:", error);
    return NextResponse.json(
      { error: "Error al subir documentos de verificación." },
      { status: 500 }
    );
  }
}
