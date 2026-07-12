import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  senderName: string;
  enabled: boolean;
}

// 1. Obtener la configuración SMTP dinámica desde SystemSetting
export async function getSmtpConfig(): Promise<SmtpConfig> {
  try {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: ["gmail_smtp_host", "gmail_smtp_port", "gmail_smtp_user", "gmail_smtp_pass", "gmail_smtp_sender_name", "gmail_smtp_enabled"]
        }
      }
    });

    const configMap = new Map(settings.map(s => [s.key, s.value]));

    return {
      host: configMap.get("gmail_smtp_host") || "smtp.gmail.com",
      port: parseInt(configMap.get("gmail_smtp_port") || "587", 10),
      user: configMap.get("gmail_smtp_user") || "",
      pass: configMap.get("gmail_smtp_pass") || "",
      senderName: configMap.get("gmail_smtp_sender_name") || "Angélica Med",
      enabled: configMap.get("gmail_smtp_enabled") === "true"
    };
  } catch (error) {
    console.error("Error al obtener config SMTP:", error);
    return {
      host: "smtp.gmail.com",
      port: 587,
      user: "",
      pass: "",
      senderName: "Angélica Med",
      enabled: false
    };
  }
}

// 2. Crear transporter de nodemailer
async function createTransporter(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true para 465, false para otros
    auth: {
      user: config.user,
      pass: config.pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

// Plantilla HTML Base Premium
function getBaseHtmlTemplate(title: string, bodyContent: string): string {
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1f2937;
            background-color: #f3f4f6;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
          }
          .email-card {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
          }
          .email-header {
            background: linear-gradient(135deg, #5f69f8, #a855f7);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
          }
          .email-logo {
            font-size: 24px;
            font-weight: 800;
            margin: 0 0 10px 0;
            letter-spacing: -0.025em;
          }
          .email-logo span {
            color: #38bdf8;
          }
          .email-title {
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0;
            opacity: 0.9;
          }
          .email-body {
            padding: 30px 25px;
          }
          .highlight-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          .highlight-item {
            margin-bottom: 12px;
            font-size: 14px;
          }
          .highlight-item:last-child {
            margin-bottom: 0;
          }
          .highlight-label {
            color: #6b7280;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 11px;
            display: block;
            margin-bottom: 2px;
          }
          .highlight-value {
            font-weight: 600;
            color: #374151;
          }
          .btn {
            display: inline-block;
            background-color: #5f69f8;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            font-weight: 700;
            border-radius: 8px;
            margin: 20px 0 10px 0;
            text-align: center;
          }
          .email-footer {
            background-color: #f9fafb;
            padding: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
          }
          .disclaimer {
            margin-top: 15px;
            font-size: 10px;
            color: #9ca3af;
            line-height: 1.4;
            text-align: justify;
          }
        </style>
      </head>
      <body>
        <div class="email-card">
          <div class="email-header">
            <div class="email-logo">Angélica<span>Med</span></div>
            <h1 class="email-title">${title}</h1>
          </div>
          <div class="email-body">
            ${bodyContent}
          </div>
          <div class="email-footer">
            Generado automáticamente por Angélica Med AI Assistant • NOM-024-SSA3-2012
            <div class="disclaimer">
              <strong>Nota de Responsabilidad Médica:</strong> La información proporcionada es meramente de orientación y no sustituye la valoración médica formal. Si presenta síntomas de urgencia, acuda al servicio médico hospitalario inmediatamente.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

// 3. Enviar correo genérico
export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
  const config = await getSmtpConfig();
  if (!config.enabled) {
    console.log(`[Email Service] Notificaciones deshabilitadas. Saltando envío a: ${to} (Subject: ${subject})`);
    return false;
  }

  if (!config.user || !config.pass) {
    console.warn("[Email Service] No se pueden enviar correos. Falta configurar usuario o contraseña de SMTP.");
    return false;
  }

  try {
    const transporter = await createTransporter(config);
    const info = await transporter.sendMail({
      from: `"${config.senderName}" <${config.user}>`,
      to,
      subject,
      text,
      html
    });
    console.log(`[Email Service] Correo enviado con éxito a: ${to}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email Service] Error al enviar correo a: ${to}`, error);
    return false;
  }
}

// 4. Enviar correo de confirmación de cita
export async function sendAppointmentConfirmationEmail({
  to,
  patientName,
  doctorName,
  dateTime,
  meetLink,
  caseTitle
}: {
  to: string;
  patientName: string;
  doctorName: string;
  dateTime: string;
  meetLink: string | null;
  caseTitle: string | null;
}) {
  const dateFormatted = new Date(dateTime).toLocaleString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const bodyContent = `
    <p>Hola, <strong>${patientName}</strong>,</p>
    <p>Tu cita médica virtual ha sido confirmada y programada con éxito. A continuación encontrarás el detalle de tu consulta:</p>
    
    <div class="highlight-box">
      <div class="highlight-item">
        <span class="highlight-label">Médico Especialista</span>
        <span class="highlight-value">Dr(a). ${doctorName}</span>
      </div>
      <div class="highlight-item">
        <span class="highlight-label">Fecha y Hora</span>
        <span class="highlight-value">${dateFormatted}</span>
      </div>
      ${caseTitle ? `
      <div class="highlight-item">
        <span class="highlight-label">Expediente Clínico</span>
        <span class="highlight-value">${caseTitle}</span>
      </div>` : ""}
    </div>

    ${meetLink ? `
    <p>Para ingresar a la videollamada de tu consulta, haz clic en el siguiente enlace al momento de iniciar:</p>
    <center>
      <a href="${meetLink}" target="_blank" class="btn">Ingresar a la Consulta (Google Meet)</a>
    </center>
    <p style="font-size: 12px; color: #6b7280; text-align: center;">Enlace alternativo: <a href="${meetLink}">${meetLink}</a></p>
    ` : `
    <p>Un médico será asignado a tu cita a la brevedad. Recibirás tu enlace de Google Meet por esta vía en cuanto esté listo.</p>
    `}

    <p>Gracias por confiar tu salud en nosotros.</p>
  `;

  const html = getBaseHtmlTemplate("Cita Programada y Confirmada", bodyContent);
  return sendEmail({
    to,
    subject: `Confirmación de Cita Médica - Dr. ${doctorName}`,
    html,
    text: `Tu cita médica con el Dr. ${doctorName} está confirmada para el ${dateFormatted}. Link de Meet: ${meetLink || 'por asignar'}`
  });
}

// 5. Enviar correo de cancelación de cita
export async function sendAppointmentCancellationEmail({
  to,
  patientName,
  doctorName,
  dateTime,
  refundAmount
}: {
  to: string;
  patientName: string;
  doctorName: string;
  dateTime: string;
  refundAmount: number;
}) {
  const dateFormatted = new Date(dateTime).toLocaleString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const bodyContent = `
    <p>Hola, <strong>${patientName}</strong>,</p>
    <p>Lamentamos informarte que tu cita médica virtual ha sido cancelada.</p>
    
    <div class="highlight-box">
      <div class="highlight-item">
        <span class="highlight-label">Médico</span>
        <span class="highlight-value">Dr(a). ${doctorName}</span>
      </div>
      <div class="highlight-item">
        <span class="highlight-label">Fecha Programada Original</span>
        <span class="highlight-value">${dateFormatted}</span>
      </div>
      <div class="highlight-item">
        <span class="highlight-label">Reembolso de Créditos</span>
        <span class="highlight-value" style="color: #10b981;">+${refundAmount} créditos aplicados a tu Wallet</span>
      </div>
    </div>

    <p>Los créditos correspondientes al costo de la cita han sido reembolsados íntegramente a tu billetera virtual y ya puedes utilizarlos para programar otra consulta.</p>
    
    <p>Si consideras que esto fue un error o necesitas ayuda, puedes levantar un reporte en nuestro canal de soporte.</p>
  `;

  const html = getBaseHtmlTemplate("Cita Cancelada y Reembolsada", bodyContent);
  return sendEmail({
    to,
    subject: "Cita Médica Cancelada - Reembolso Aplicado",
    html,
    text: `Tu cita médica del ${dateFormatted} con el Dr. ${doctorName} fue cancelada. Se han reembolsado ${refundAmount} créditos a tu Wallet.`
  });
}

// 6. Enviar correo al médico para avisar de nueva cita asignada
export async function sendDoctorAssignmentEmail({
  to,
  doctorName,
  patientName,
  dateTime,
  meetLink
}: {
  to: string;
  doctorName: string;
  patientName: string;
  dateTime: string;
  meetLink: string | null;
}) {
  const dateFormatted = new Date(dateTime).toLocaleString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const bodyContent = `
    <p>Estimado(a) <strong>Dr(a). ${doctorName}</strong>,</p>
    <p>Se le ha asignado una nueva consulta médica virtual en el sistema. A continuación los detalles:</p>
    
    <div class="highlight-box">
      <div class="highlight-item">
        <span class="highlight-label">Paciente</span>
        <span class="highlight-value">${patientName}</span>
      </div>
      <div class="highlight-item">
        <span class="highlight-label">Fecha y Hora</span>
        <span class="highlight-value">${dateFormatted}</span>
      </div>
    </div>

    ${meetLink ? `
    <p>Por favor, conéctese a tiempo a la sesión usando el siguiente enlace:</p>
    <center>
      <a href="${meetLink}" target="_blank" class="btn">Iniciar Videollamada (Google Meet)</a>
    </center>
    ` : ""}

    <p>Recuerde reportar cualquier incidencia o retraso con el equipo de soporte de forma inmediata.</p>
  `;

  const html = getBaseHtmlTemplate("Nueva Cita Médica Asignada", bodyContent);
  return sendEmail({
    to,
    subject: `Nueva Consulta Asignada - Paciente: ${patientName}`,
    html,
    text: `Tiene una nueva consulta asignada con el paciente ${patientName} para el ${dateFormatted}. Link de Meet: ${meetLink || 'no disponible'}`
  });
}
