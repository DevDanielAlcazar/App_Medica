"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTranslation } from "@/lib/i18n/config";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface RecommendationData {
  title: string;
  caseId: string;
  patientName: string;
  date: string;
  status: string;
  symptoms: string[];
  summary: string;
  actionRequired: string;
  otcGuidelines: string[];
  redFlags: string[];
  disclaimer: string;
  severity: string;
}

export function ReferralReport() {
  const { locale } = useLanguage();
  const { t } = useTranslation();
  const [printing, setPrinting] = useState(false);

  const generatePdf = async (caseId: string) => {
    setPrinting(true);
    try {
      const res = await fetch(`/api/patient/cases/${caseId}/recommendation`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const rec: RecommendationData = data.recommendation;

      // Create a temporary div for html2canvas
      const element = document.createElement("div");
      element.innerHTML = `
        <div style="padding: 30px; font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1f2937; line-height: 1.5; font-size: 11pt;">
          <div style="border-bottom: 2px solid #5F69F8; padding-bottom: 15px; margin-bottom: 20px;">
            <div style="font-size: 24pt; font-weight: 800; color: #5F69F8;">Angélica<span style="color:#a855f7">Med</span></div>
            <div style="font-size:10pt; color:#6b7280; margin-top:4px;">Reporte de Derivación Clínica</div>
            <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 9pt; font-weight: 700; text-transform: uppercase; background: ${rec.severity === "HIGH" ? "#fee2e2" : rec.severity === "MEDIUM" ? "#fef3c7" : "#d1fae5"}; color: ${rec.severity === "HIGH" ? "#dc2626" : rec.severity === "MEDIUM" ? "#d97706" : "#059669"};">${rec.severity} Prioridad</span>
          </div>
          <div style="margin-bottom: 20px;">
            <div style="font-weight: 700; text-transform: uppercase; color: #5F69F8; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px;">Datos del Caso</div>
            <p><strong>ID:</strong> ${rec.caseId}</p>
            <p><strong>Paciente:</strong> ${rec.patientName || "Paciente Registrado"}</p>
            <p><strong>Fecha:</strong> ${new Date(rec.date).toLocaleString(locale === "es" ? "es-ES" : "en-US")}</p>
            <p><strong>Versión Policy:</strong> v1.0.0-g1</p>
            <p><strong>Modelo IA:</strong> GPT-4-Turbo</p>
          </div>
          <div style="margin-bottom: 20px;">
            <div style="font-weight: 700; text-transform: uppercase; color: #5F69F8; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px;">Síntomas</div>
            <ul>${rec.symptoms.map((s: string) => `<li>${s}</li>`).join("")}</ul>
          </div>
          <div style="margin-bottom: 20px;">
            <div style="font-weight: 700; text-transform: uppercase; color: #5F69F8; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px;">Resumen Clínico / Differentiales</div>
            <p style="white-space:pre-line;">${rec.summary}</p>
          </div>
          <div style="margin-bottom: 20px;">
            <div style="font-weight: 700; text-transform: uppercase; color: #5F69F8; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px;">Acción Recomendada</div>
            <p><strong>${rec.actionRequired}</strong></p>
          </div>
          <div style="margin-bottom: 20px;">
            <div style="font-weight: 700; text-transform: uppercase; color: #5F69F8; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px;">Medicación OTC Sugerida</div>
            <ul>${rec.otcGuidelines.map((g: string) => `<li>${g}</li>`).join("")}</ul>
          </div>
          <div style="margin-bottom: 20px;">
            <div style="font-weight: 700; text-transform: uppercase; color: #5F69F8; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px;">Contraindicaciones</div>
            <ul>${rec.redFlags?.length ? rec.redFlags.map((f: string) => `<li>${f}</li>`).join("") : "<li>Ninguna identificada</li>"}</ul>
          </div>
          <div style="background: #f3f4f6; border-left: 4px solid #9ca3af; padding: 15px; font-size: 9pt; margin-top: 30px;">
            <strong>Disclaimer Legal:</strong> ${rec.disclaimer}
          </div>
        </div>
      `;
      document.body.appendChild(element);

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter",
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = (canvas as any).width && (canvas as any).height 
        ? { width: canvas.width, height: canvas.height } 
        : { width: 0, height: 0 };
      const imgRatio = imgProps.width / imgProps.height;
      const pdfRatio = pdfWidth / pdfHeight;
      
      let renderWidth = pdfWidth;
      let renderHeight = pdfHeight;
      
      if (imgRatio > pdfRatio) {
        renderHeight = pdfWidth / imgRatio;
      } else {
        renderWidth = pdfHeight * imgRatio;
      }
      
      pdf.addImage(imgData, "PNG", 0, 0, renderWidth, renderHeight);
      pdf.save(`derivacion-${rec.caseId}-${new Date().toISOString().split("T")[0]}.pdf`);
      
      document.body.removeChild(element);
    } catch (err) {
      console.error(err);
      alert(t("admin.error_connection"));
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => generatePdf("")}
        disabled={printing}
        className="gap-2"
        variant="outline"
      >
        {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {t("history.download_report")}
      </Button>
    </div>
  );
}