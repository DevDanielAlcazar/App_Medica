import { motion } from "framer-motion";
import { FileText, Activity, ChevronRight, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextRailProps {
  className?: string;
}

export function ContextRail({ className }: ContextRailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("glass-panel flex flex-col h-full rounded-2xl p-4 gap-6 overflow-y-auto", className)}
    >
      {/* Case Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Caso Activo</h2>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">Juan P. - #AM-204</span>
          <span className="px-2 py-1 text-[10px] font-bold bg-primary/20 text-primary rounded-full uppercase">
            En Evaluación
          </span>
        </div>
      </div>

      {/* Missing Evidence */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
          <FileText className="w-4 h-4 text-warning" />
          Evidencia Faltante
        </h3>
        <ul className="flex flex-col gap-2">
          <li className="text-sm text-muted bg-warning/10 p-2 rounded-lg border border-warning/20 flex items-center justify-between">
            <span>Resultados de laboratorio</span>
            <ChevronRight className="w-4 h-4" />
          </li>
          <li className="text-sm text-muted bg-background/50 p-2 rounded-lg border border-glass-border flex items-center justify-between">
            <span>Historial de alergias</span>
            <ChevronRight className="w-4 h-4" />
          </li>
        </ul>
      </div>

      {/* Latest Signals */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
          <Activity className="w-4 h-4 text-primary" />
          Últimas Señales
        </h3>
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted flex gap-2">
            <span className="text-primary font-bold">•</span>
            Fiebre persistente {'>'} 38.5°C
          </div>
          <div className="text-sm text-muted flex gap-2">
            <span className="text-primary font-bold">•</span>
            Dolor abdominal bajo
          </div>
        </div>
      </div>

      {/* Next Actions */}
      <div className="mt-auto flex flex-col gap-3">
        <h3 className="text-sm font-medium flex items-center gap-2 text-foreground">
          <ClipboardList className="w-4 h-4 text-secondary" />
          Próxima Acción
        </h3>
        <button className="w-full bg-secondary text-white text-sm font-medium py-2 px-4 rounded-xl hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20">
          Solicitar Biometría Hemática
        </button>
      </div>

    </motion.div>
  );
}
