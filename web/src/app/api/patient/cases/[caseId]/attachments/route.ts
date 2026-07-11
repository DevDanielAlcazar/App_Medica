import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

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

    // 1. Validar propiedad del caso clínico
    const clinicalCase = await prisma.clinicalCase.findUnique({
      where: { id: caseId },
    });

    if (!clinicalCase || clinicalCase.userId !== userId) {
      return NextResponse.json({ error: "Caso clínico no encontrado." }, { status: 404 });
    }

    // 2. Procesar FormData
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se subió ningún archivo." }, { status: 400 });
    }

    // 3. Validar tipo MIME
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Solo se permiten imágenes (PNG, JPG) y PDFs." },
        { status: 400 }
      );
    }

    // Limitar tamaño a 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo excede el límite de 5MB." }, { status: 400 });
    }

    // 4. Guardar archivo en disco
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "cases");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Nombre único para evitar colisiones
    const fileExt = path.extname(file.name) || (file.type === "application/pdf" ? ".pdf" : ".jpg");
    const uniqueFilename = `${crypto.randomUUID()}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/cases/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl,
      name: file.name,
      type: file.type,
      size: file.size,
    });
  } catch (error: any) {
    console.error("Error en subida de adjunto:", error);
    return NextResponse.json({ error: "Error al procesar la subida del archivo." }, { status: 500 });
  }
}
