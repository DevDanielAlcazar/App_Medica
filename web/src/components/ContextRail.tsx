"use client";

import { useCaseStore } from "@/stores/caseStore";
import { useUserStore } from "@/stores/userStore";
import { motion } from "framer-motion";
import { FileText, Activity, ChevronRight, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

export function ContextRail({ className }: { className?: string }) {
  const { activeCase } = useCaseStore();
  const { user } = useUserStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "en_analisis":
        return "bg-primary/20 text-primary border-primary/30";
      case "derivado":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "curado":
        return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
      default:
        return "bg-warning/20 text-warning border-warning/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "en_analisis":
        return "En Análisis";
      case "derivado":
        return "Derivado a Físico";
      case "curado":
        return "Curado";
      case "en_tratamiento":
        return "En Tratamiento";
      default:
        return "Pendiente";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("glass-panel flex flex-col h-full rounded-2xl p-4 gap-6 overflow-y-auto border border-glass-border", className)}
    >
      {/* Case Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Caso Activo</h2>
        <div className="flex flex-col gap-1.5">
          <span className="text-base font-bold text-foreground line-clamp-2">
            {activeCase?.title || "Consulta general"}
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">Paciente: {user?.name || "Paciente"}</span>
            <span className={cn("px-2 py-0.5 text-[10px] font-bold rounded-full uppercase border", getStatusColor(activeCase?.status || "en_analisis"))}>
              {getStatusLabel(activeCase?.status || "en_analisis")}
            </span>
          </div>
        </div>
      </div>

      {/* Missing Evidence (Requisitos clínicos) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
          <FileText className="w-4 h-4 text-warning" />
          Monitoreo Requerido
        </h3>
        <ul className="flex flex-col gap-2">
          {activeCase?.status === "derivado" ? (
            <li className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-lg border border-destructive/20 leading-relaxed">
              <strong>Atención:</strong> Se detectaron banderas de riesgo. Se requiere valoración médica presencial.
            </li>
          ) : (
            <>
              <li className="text-xs text-muted-foreground bg-background/50 p-2 rounded-lg border border-glass-border flex items-center justify-between">
                <span>Registrar peso y edad exacta</span>
                <ChevronRight className="w-4 h-4" />
              </li>
              <li className="text-xs text-muted-foreground bg-background/50 p-2 rounded-lg border border-glass-border flex items-center justify-between">
                <span>Vigilar temperatura corporal</span>
                <ChevronRight className="w-4 h-4" />
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Latest Signals */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
          <Activity className="w-4 h-4 text-primary" />
          Seguimiento de Síntomas
        </h3>
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          <div className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            {activeCase?.status === "derivado" 
              ? "Recomendación de derivación prioritaria activada" 
              : "Asistente AI monitoreando señales de alarma"}
          </div>
          <div className="flex gap-2">
            <span className="text-primary font-bold">•</span>
            Evidencia integrada a la línea de tiempo clínica
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="mt-auto flex flex-col gap-3">
        <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
          <ClipboardList className="w-4 h-4 text-secondary" />
          Acción Sugerida
        </h3>
        {activeCase?.status === "derivado" ? (
          <a href="tel:911" className="w-full">
            <button className="w-full bg-destructive text-white text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/20 text-center">
              Llamar a Emergencias (911)
            </button>
          </a>
        ) : (
          <button 
            onClick={() => window.location.href = "/paciente/calendario"}
            className="w-full bg-secondary text-white text-xs font-semibold py-2.5 px-4 rounded-xl hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20"
          >
            Agendar Cita Médica Humana
          </button>
        )}
      </div>
    </motion.div>
  );
}
