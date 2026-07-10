import { motion } from "framer-motion";
import { Pill, Activity, FileDigit } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClinicalTimelineRiverProps {
  className?: string;
}

export function ClinicalTimelineRiver({ className }: ClinicalTimelineRiverProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("glass-panel flex flex-col h-full rounded-2xl p-6 gap-6 overflow-y-auto", className)}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-foreground">Timeline Clínico</h2>
        <span className="text-xs text-muted">Últimos 3 días</span>
      </div>

      <div className="relative border-l-2 border-glass-border ml-3 flex flex-col gap-8">

        {/* State Change */}
        <div className="relative pl-6">
          <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <p className="text-xs text-muted mb-1">Hoy, 10:45 AM</p>
          <div className="bg-elevated p-3 rounded-xl border border-glass-border text-sm text-foreground">
            <span className="font-medium text-primary block mb-1">Cambio de Estado</span>
            Caso actualizado a &quot;En Evaluación&quot;. Requiere monitoreo continuo de temperatura.
          </div>
        </div>

        {/* Medication */}
        <div className="relative pl-6">
          <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-background border-2 border-secondary flex items-center justify-center">
            <Pill className="w-3 h-3 text-secondary" />
          </div>
          <p className="text-xs text-muted mb-1">Hoy, 08:00 AM</p>
          <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/20 text-sm text-foreground">
            <span className="font-medium text-secondary block mb-1">Medicación</span>
            Paracetamol 500mg (Dosis reportada por paciente).
          </div>
        </div>

        {/* Evidence */}
        <div className="relative pl-6">
          <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-background border-2 border-warning flex items-center justify-center">
            <FileDigit className="w-3 h-3 text-warning" />
          </div>
          <p className="text-xs text-muted mb-1">Ayer, 18:30 PM</p>
          <div className="bg-warning/10 p-3 rounded-xl border border-warning/20 text-sm text-foreground">
            <span className="font-medium text-warning block mb-1">Evidencia Adjunta</span>
            Fotografía de termómetro marcando 38.8°C.
          </div>
        </div>

        {/* Initial Symptom */}
        <div className="relative pl-6">
          <div className="absolute -left-[13px] top-1 w-6 h-6 rounded-full bg-background border-2 border-muted flex items-center justify-center">
            <Activity className="w-3 h-3 text-muted" />
          </div>
          <p className="text-xs text-muted mb-1">Ayer, 12:00 PM</p>
          <div className="bg-background/50 p-3 rounded-xl border border-glass-border text-sm text-foreground">
            <span className="font-medium text-muted block mb-1">Inicio de Síntomas</span>
            Reporte inicial de malestar general y fiebre leve.
          </div>
        </div>

      </div>
    </motion.div>
  );
}
