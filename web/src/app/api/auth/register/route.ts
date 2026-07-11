import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, password, role, cedula } = await request.json();

    // 1. Validar campos obligatorios
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios (nombre, correo, contraseña, rol)." },
        { status: 400 }
      );
    }

    if (role !== "paciente" && role !== "medico") {
      return NextResponse.json(
        { error: "Rol no permitido para registro público." },
        { status: 400 }
      );
    }

    // 2. Validar formato de cédula si es médico (ejemplo: 7 u 8 dígitos numéricos)
    if (role === "medico") {
      if (!cedula) {
        return NextResponse.json(
          { error: "La cédula profesional es obligatoria para registrarse como médico." },
          { status: 400 }
        );
      }
      // Validación básica: formato numérico
      const cedulaRegex = /^\d{6,10}$/;
      if (!cedulaRegex.test(cedula)) {
        return NextResponse.json(
          { error: "La cédula profesional debe ser un número de entre 6 y 10 dígitos." },
          { status: 400 }
        );
      }

      // Validar que la cédula no esté duplicada
      const existingCedula = await prisma.doctorProfile.findUnique({
        where: { cedula },
      });
      if (existingCedula) {
        return NextResponse.json(
          { error: "Esta cédula profesional ya se encuentra registrada." },
          { status: 400 }
        );
      }
    }

    // 3. Validar duplicado de email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El correo electrónico ya está registrado." },
        { status: 400 }
      );
    }

    // 4. Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Crear el usuario en una transacción para asegurar consistencia
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });

      if (role === "paciente") {
        // Crear cartera vacía para el paciente
        await tx.wallet.create({
          data: {
            userId: newUser.id,
            balance: 0,
          },
        });
      } else if (role === "medico") {
        // Crear perfil médico en revisión pendiente
        await tx.doctorProfile.create({
          data: {
            userId: newUser.id,
            cedula,
            verificationStatus: "pendiente",
          },
        });
      }

      return newUser;
    });

    return NextResponse.json({
      success: true,
      message: "Registro completado exitosamente.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Error en registro:", error);
    if (error.code === "P1001" || error.message?.includes("Can't reach database")) {
      return NextResponse.json(
        { error: "Base de datos fuera de línea. Por favor verifica que tu túnel SSH (puerto 5433) esté activo." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el registro." },
      { status: 500 }
    );
  }
}
