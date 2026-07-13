"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";

interface HumanReferralReportButtonProps {
  caseId: string;
}

export function HumanReferralReportButton({ caseId }: HumanReferralReportButtonProps) {
  const { locale } = useLanguage();
  const [printing, setPrinting] = useState(false);

  const handleGenerateReport = async () => {
    setPrinting(true);
    try {
      const res = await fetch(`/api/patient/cases/${caseId}/recommendation`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const rec = data.recommendation;
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        alert(locale === "es" ? "Permite ventanas emergentes" : "Allow popups");
        return;
      }

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>${rec.title} - Angélica Med</title>
            <style>
              @page { size: portrait; margin: 20mm; }
              body { font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif; color: #1f2937; line-height: 1.5; font-size: 11pt; }
              .header { border-bottom: 2px solid #5F69F8; padding-bottom: 15px; margin-bottom: 20px; }
              .section { margin-bottom: 20px; page-break-inside: avoid; }
              .section-title { font-weight: 700; text-transform: uppercase; color: #5F69F8; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
              .disclaimer { background: #f3f4f6; border-left: 4px solid #9ca3af; padding: 15px; font-size: 9pt; margin-top: 30px; page-break-inside: avoid; }
              @media print {
                body { color: #000; font-size: 10pt; }
                .disclaimer { background: #fff; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div style="font-size:24pt;font-weight:800;color:#5F69F8;">Angélica<span style="color:#a855f7">Med</span></div>
              <div style="font-size:10pt;color:#6b7280;">Reporte de Derivación Clínica</div>
            </div>
            <div class="section">
              <div class="section-title">Datos del Caso</div>
              <p><strong>ID:</strong> ${rec.caseId}</p>
              <p><strong>Paciente:</strong> ${rec.patientName}</p>
              <p><strong>Fecha:</strong> ${new Date(rec.date).toLocaleString(locale === "es" ? "es-ES" : "en-US")}</p>
            </div>
            <div class="section">
              <div class="section-title">Síntomas</div>
              <ul>${rec.symptoms.map((s: string) => `<li>${s}</li>`).join("")}</ul>
            </div>
            <div class="section">
              <div class="section-title">Resumen Clínico</div>
              <p style="white-space:pre-line;">${rec.summary}</p>
            </div>
            <div class="section">
              <div class="section-title">Acción Recomendada</div>
              <p><strong>${rec.actionRequired}</strong></p>
            </div>
            <div class="section">
              <div class="section-title">Medicación OTC Sugerida</div>
              <ul>${rec.otcGuidelines.map((g: string) => `<li>${g}</li>`).join("")}</ul>
            </div>
            <div class="disclaimer">
              <strong>Disclaimer Legal:</strong> ${rec.disclaimer}
            </div>
            <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 1000); }</script>
          </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
    } catch (err) {
      console.error(err);
      alert(locale === "es" ? "Error generando reporte" : "Error generating report");
    } finally {
      setPrinting(false);
    }
  };

  return (
    <Button onClick={handleGenerateReport} disabled={printing} className="gap-2" variant="outline">
      {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      {locale === "es" ? "Generar Reporte PDF" : "Generate PDF Report"}
    </Button>
  );
}