"use client";

import { useCaseStore } from "@/stores/caseStore";
import { motion } from "framer-motion";
import { Pill, Activity, FileDigit, PlusCircle, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { TimelineEvent } from "@/types/case";

export function ClinicalTimelineRiver({ className }: { className?: string }) {
  const { activeCase } = useCaseStore();

  // Cast a unknown primero para evitar conflictos de compilación de Prisma JSON con el tipo de datos estricto
  const events = (activeCase?.timeline as unknown as TimelineEvent[] || []).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getEventIcon = (type: string, title: string) => {
    const typeLower = (type || "").toLowerCase();
    const titleLower = (title || "").toLowerCase();

    if (typeLower.includes("plus") || titleLower.includes("abierto") || titleLower.includes("creado")) {
      return <PlusCircle className="w-3.5 h-3.5 text-primary" />;
    }
    if (
      typeLower.includes("alert") || 
      typeLower.includes("warning") || 
      titleLower.includes("alarma") || 
      titleLower.includes("guardrail") || 
      titleLower.includes("crítica")
    ) {
      return <AlertTriangle className="w-3.5 h-3.5 text-destructive animate-pulse" />;
    }
    if (typeLower.includes("pill") || titleLower.includes("medicamento") || titleLower.includes("dosis")) {
      return <Pill className="w-3.5 h-3.5 text-secondary" />;
    }
    if (typeLower.includes("file") || titleLower.includes("evidencia") || titleLower.includes("laboratorio")) {
      return <FileDigit className="w-3.5 h-3.5 text-warning" />;
    }
    return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
  };

  const getEventBg = (severity: string, title: string) => {
    const titleLower = (title || "").toLowerCase();
    
    if (severity === "high" || titleLower.includes("alarma") || titleLower.includes("guardrail") || titleLower.includes("crítica")) {
      return "bg-destructive/10 border-destructive/25 text-destructive-foreground";
    }
    if (severity === "medium" || titleLower.includes("medicamento") || titleLower.includes("dosis")) {
      return "bg-secondary/10 border-secondary/25 text-foreground";
    }
    return "bg-background/50 border-glass-border text-foreground";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("glass-panel flex flex-col h-full rounded-2xl p-6 gap-6 overflow-y-auto border border-glass-border", className)}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-foreground">Timeline Clínico</h2>
        <span className="text-xs text-muted-foreground">Flujo activo</span>
      </div>

      <div className="relative border-l-2 border-glass-border ml-3 flex flex-col gap-6">
        {events.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">
            Línea de tiempo clínica vacía. Inicia el diálogo para registrar eventos.
          </div>
        ) : (
          events.map((ev, index) => (
            <div key={ev.id || index} className="relative pl-6">
              {/* Icono del Hito */}
              <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-background border-2 border-glass-border flex items-center justify-center">
                {getEventIcon(ev.type, ev.title)}
              </div>
              
              <p className="text-[10px] text-muted-foreground mb-1">
                {new Date(ev.timestamp).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              
              <div className={cn("p-3 rounded-xl border text-xs leading-relaxed", getEventBg(ev.severity, ev.title))}>
                <span className="font-semibold block mb-0.5">{ev.title}</span>
                <span className="text-muted-foreground">{ev.description}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
