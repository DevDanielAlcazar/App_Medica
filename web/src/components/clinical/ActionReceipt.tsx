"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, ShieldAlert, Sparkles, Activity } from "lucide-react";
import { toast } from "sonner";

export interface ActionReceiptData {
  id: string;
  type: "symptom" | "allergy" | "medication" | "history";
  title: string;
  value: string;
  severity?: "low" | "medium" | "high";
  suggestedAt: string;
}

interface ActionReceiptProps {
  receipt: ActionReceiptData;
  caseId: string;
  onProcessed?: () => void;
}

export default function ActionReceipt({ receipt, caseId, onProcessed }: ActionReceiptProps) {
  const [status, setStatus] = useState<"pending" | "accepted" | "declined">("pending");
  const [loading, setLoading] = useState(false);

  const handleAction = async (accept: boolean) => {
    setLoading(true);
    try {
      // Registrar la confirmación o descarte del paciente
      const response = await fetch(`/api/patient/cases/${caseId}/recommendation`, {
        method: "POST", // Simulación o actualización en BD de la aceptación del hito
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType: receipt.type,
          value: receipt.value,
          accept,
          receiptId: receipt.id,
          title: receipt.title,
          severity: receipt.severity || "low",
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo procesar la confirmación.");
      }

      setStatus(accept ? "accepted" : "declined");
      toast.success(accept ? "Información agregada a tu expediente clínico." : "Sugerencia descartada.");
      if (onProcessed) onProcessed();
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar el recibo de acción clínica.");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "allergy": return "border-destructive text-destructive bg-destructive/10";
      case "medication": return "border-secondary text-secondary bg-secondary/10";
      case "symptom": return "border-primary text-primary bg-primary/10";
      default: return "border-glass-border text-muted-foreground bg-muted/10";
    }
  };

  const typeLabels: Record<string, string> = {
    allergy: "Alergía detectada",
    medication: "Medicamento mencionado",
    symptom: "Síntoma detectado",
    history: "Antecedente personal",
  };

  return (
    <Card className="border-glass-border bg-background/40 backdrop-blur-md shadow-lg overflow-hidden my-3 max-w-sm rounded-xl">
      <div className="bg-primary/5 py-2 px-3 border-b border-glass-border flex items-center justify-between">
        <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-primary animate-pulse" /> Inteligencia Clínica
        </span>
        <Badge variant="outline" className={`text-[9px] px-1.5 py-0.5 rounded-full ${getBadgeColor(receipt.type)}`}>
          {typeLabels[receipt.type] || receipt.type}
        </Badge>
      </div>
      <CardContent className="p-3.5 space-y-3">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-foreground">{receipt.title}</h4>
          <p className="text-sm font-semibold text-primary">{receipt.value}</p>
        </div>

        {status === "pending" && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              disabled={loading}
              onClick={() => handleAction(true)}
              className="flex-1 bg-primary text-primary-foreground rounded-lg text-xs gap-1 h-8"
            >
              <Check className="w-3.5 h-3.5" /> Aceptar
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={() => handleAction(false)}
              className="flex-1 border-glass-border text-muted-foreground hover:text-foreground rounded-lg text-xs gap-1 h-8"
            >
              <X className="w-3.5 h-3.5" /> Descartar
            </Button>
          </div>
        )}

        {status === "accepted" && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold pt-1">
            <Check className="w-4 h-4 bg-emerald-500/10 p-0.5 rounded-full" />
            Integrado al expediente digital
          </div>
        )}

        {status === "declined" && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold pt-1">
            <X className="w-4 h-4 bg-muted/10 p-0.5 rounded-full" />
            Sugerencia descartada
          </div>
        )}
      </CardContent>
    </Card>
  );
}
