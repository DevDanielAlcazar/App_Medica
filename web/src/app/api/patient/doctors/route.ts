import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/patient/doctors
 * Lista los médicos con perfil verificado/activo.
 */
export async function GET() {
  try {
    const verifiedDoctors = await prisma.user.findMany({
      where: {
        role: "medico",
        doctorProfile: {
          verificationStatus: "activo",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        doctorProfile: {
          select: {
            cedula: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, doctors: verifiedDoctors });
  } catch (error: any) {
    console.error("Error al consultar médicos:", error);
    return NextResponse.json(
      { error: "Error al consultar la lista de médicos." },
      { status: 500 }
    );
  }
}
