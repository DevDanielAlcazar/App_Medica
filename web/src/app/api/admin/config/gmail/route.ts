import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "@/lib/services/email";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// 1. Obtener la configuración actual
export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          startsWith: "gmail_smtp_"
        }
      }
    });

    const config: Record<string, string> = {};
    settings.forEach(s => {
      if (s.key === "gmail_smtp_pass" && s.value) {
        config[s.key] = "••••••••••••••••";
      } else {
        config[s.key] = s.value;
      }
    });

    return NextResponse.json({
      success: true,
      config: {
        host: config.gmail_smtp_host || "smtp.gmail.com",
        port: config.gmail_smtp_port || "587",
        user: config.gmail_smtp_user || "",
        pass: config.gmail_smtp_pass || "",
        senderName: config.gmail_smtp_sender_name || "Angélica Med",
        enabled: config.gmail_smtp_enabled === "true"
      }
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Error al obtener la configuración SMTP." }, { status: 500 });
  }
}

// 2. Guardar configuración o probar SMTP
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { host, port, user, pass, senderName, enabled, testRecipient } = body;

    // A. Si se solicita una prueba de conexión directa
    if (testRecipient) {
      if (!host || !port || !user || !pass) {
        return NextResponse.json({ success: false, error: "Datos incompletos para realizar la prueba." }, { status: 400 });
      }

      // Resolver contraseña si viene enmascarada (leer de DB)
      let actualPass = pass;
      if (pass === "••••••••••••••••") {
        const dbPass = await prisma.systemSetting.findUnique({ where: { key: "gmail_smtp_pass" } });
        actualPass = dbPass?.value || "";
      }

      try {
        const transporter = nodemailer.createTransport({
          host,
          port: parseInt(port, 10),
          secure: parseInt(port, 10) === 465,
          auth: {
            user,
            pass: actualPass,
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        // Verificar conexión
        await transporter.verify();

        // Enviar correo de prueba
        await transporter.sendMail({
          from: `"${senderName || 'Angélica Med Test'}" <${user}>`,
          to: testRecipient,
          subject: "Prueba de Conexión SMTP - Angélica Med",
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #5f69f8;">¡Conexión Exitosa!</h2>
              <p>Este es un correo automático de prueba enviado desde tu panel de administrador de <strong>Angélica Med</strong>.</p>
              <p>Tus credenciales SMTP configuradas funcionan de forma correcta y segura.</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
              <small style="color: #999;">Enviado el: ${new Date().toLocaleString()}</small>
            </div>
          `
        });

        return NextResponse.json({ success: true, message: "Prueba de conexión exitosa y correo enviado." });
      } catch (err: any) {
        console.error("Falla en prueba SMTP:", err);
        return NextResponse.json({ success: false, error: `Falla en autenticación: ${err.message}` }, { status: 400 });
      }
    }

    // B. Guardar en base de datos
    const updates = [
      { key: "gmail_smtp_host", value: host || "smtp.gmail.com" },
      { key: "gmail_smtp_port", value: String(port || "587") },
      { key: "gmail_smtp_user", value: user || "" },
      { key: "gmail_smtp_sender_name", value: senderName || "Angélica Med" },
      { key: "gmail_smtp_enabled", value: enabled ? "true" : "false" }
    ];

    // Solo actualizar pass si cambió y no está enmascarada
    if (pass && pass !== "••••••••••••••••") {
      updates.push({ key: "gmail_smtp_pass", value: pass });
    }

    // Guardar secuencialmente (Upsert)
    for (const update of updates) {
      await prisma.systemSetting.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: { key: update.key, value: update.value }
      });
    }

    return NextResponse.json({ success: true, message: "Configuración SMTP guardada correctamente." });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Error al guardar la configuración SMTP." }, { status: 500 });
  }
}
