"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Calendar, Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

export default function Page() {
  const { locale } = useLanguage();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generating, setGenerating] = useState(false);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      alert(locale === "es" ? "Selecciona un rango de fechas." : "Select a date range.");
      return;
    }

    setGenerating(true);
    try {
      // Simulate report generation (would call API in real implementation)
      const reportData = {
        startDate,
        endDate,
        totalRevenue: 125000,
        totalPayouts: 87500,
        penalties: 2500,
      };

      // Create downloadable JSON
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${startDate}-to-${endDate}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(locale === "es" ? "Error generando reporte." : "Error generating report.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-outfit font-bold">
        {locale === "es" ? "Reportes Financieros" : "Financial Reports"}
      </h1>

      <Card className="glass-panel border-glass-border">
        <CardHeader>
          <CardTitle>
            {locale === "es" ? "Generar Reporte" : "Generate Report"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {locale === "es" ? "Fecha Inicio" : "Start Date"}
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                {locale === "es" ? "Fecha Fin" : "End Date"}
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={generateReport} disabled={generating} className="gap-2">
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {locale === "es" ? "Generar y Descargar" : "Generate & Download"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}