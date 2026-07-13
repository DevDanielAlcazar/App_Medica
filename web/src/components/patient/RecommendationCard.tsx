"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Zap, Calendar } from "lucide-react";
import { Download } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface Recommendation {
  id: string;
  symptoms: string[];
  summary: string;
  actionRequired: string;
  otcGuidelines: string[];
  redFlags: string[];
  disclaimer: string;
  severity: string;
  createdAt: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onDownload?: () => void;
}

export function RecommendationCard({ recommendation, onDownload }: RecommendationCardProps) {
  const { locale } = useLanguage();
  const [downloading, setDownloading] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "medium":
        return "bg-warning/20 text-warning border-warning/30";
      default:
        return "bg-success/20 text-success border-success/30";
    }
  };

  return (
    <Card className="glass-panel border-glass-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Pill className="w-4 h-4 text-primary" />
            {locale === "es" ? "Recomendación Sintomatológica" : "Symptom Recommendation"}
          </CardTitle>
          <Badge className={`text-[10px] ${getSeverityColor(recommendation.severity)}`}>
            {recommendation.severity} Prioridad
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="font-medium text-xs text-muted-foreground mb-1">
            {locale === "es" ? "Síntomas:" : "Symptoms:"}
          </p>
          <ul className="list-disc list-inside text-xs">
            {recommendation.symptoms?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium text-xs text-muted-foreground mb-1">
            {locale === "es" ? "Resumen:" : "Summary:"}
          </p>
          <p className="text-xs">{recommendation.summary}</p>
        </div>

        <div>
          <p className="font-medium text-xs text-muted-foreground mb-1">
            {locale === "es" ? "Acción recomendada:" : "Recommended action:"}
          </p>
          <p className="text-xs font-semibold">{recommendation.actionRequired}</p>
        </div>

        {recommendation.otcGuidelines && recommendation.otcGuidelines.length > 0 && (
          <div>
            <p className="font-medium text-xs text-muted-foreground mb-1">
              {locale === "es" ? "Medicación OTC:" : "OTC Medication:"}
            </p>
            <ul className="list-disc list-inside text-xs">
              {recommendation.otcGuidelines.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendation.redFlags && recommendation.redFlags.length > 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="font-medium text-xs text-destructive mb-1">
              {locale === "es" ? "⚠️ Señales de alarma:" : "⚠️ Red flags:"}
            </p>
            <ul className="list-disc list-inside text-xs text-destructive">
              {recommendation.redFlags.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2 border-t border-glass-border">
          <p className="text-[10px] text-muted-foreground italic">{recommendation.disclaimer}</p>
        </div>

        {onDownload && (
          <Button variant="outline" size="sm" onClick={onDownload} className="w-full gap-2">
            <Download className="w-4 h-4" />
            {locale === "es" ? "Descargar PDF" : "Download PDF"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}