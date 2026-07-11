import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/doctors/verify
 * Lista todos los médicos en espera de validación o con estatus no activo.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const adminId = token.replace("session-token-", "");
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "superadmin")) {
      return NextResponse.json({ error: "Acceso no autorizado." }, { status: 403 });
    }

    // Buscar médicos
    const doctors = await prisma.user.findMany({
      where: {
        role: "medico",
      },
      include: {
        doctorProfile: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, doctors });
  } catch (error: any) {
    console.error("Error al listar médicos en admin:", error);
    return NextResponse.json(
      { error: "Error al listar perfiles de médicos." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/doctors/verify
 * Permite a un administrador activar o rechazar un médico.
 */
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const adminId = token.replace("session-token-", "");
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!adminUser || (adminUser.role !== "admin" && adminUser.role !== "superadmin")) {
      return NextResponse.json({ error: "Acceso no autorizado." }, { status: 403 });
    }

    const { doctorId, status } = await request.json();

    if (!doctorId || !status || (status !== "activo" && status !== "rechazado")) {
      return NextResponse.json(
        { error: "Faltan parámetros obligatorios o el estado es inválido." },
        { status: 400 }
      );
    }

    // Actualizar el perfil del médico
    const profile = await prisma.doctorProfile.findUnique({
      where: { userId: doctorId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Perfil de médico no encontrado." }, { status: 404 });
    }

    const updatedProfile = await prisma.doctorProfile.update({
      where: { userId: doctorId },
      data: {
        verificationStatus: status,
      },
    });

    // Registrar auditoría
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "DOCTOR_VERIFIED_BY_ADMIN",
        entity: "DoctorProfile",
        details: {
          doctorId,
          status,
          profileId: updatedProfile.id,
        },
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error: any) {
    console.error("Error al verificar médico en admin:", error);
    return NextResponse.json(
      { error: "Error interno al verificar al médico." },
      { status: 500 }
    );
  }
}
