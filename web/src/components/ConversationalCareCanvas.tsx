import { motion } from "framer-motion";
import { Send, Paperclip, Calendar, FolderOpen, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationalCareCanvasProps {
  className?: string;
}

export function ConversationalCareCanvas({ className }: ConversationalCareCanvasProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass-panel flex flex-col h-full rounded-3xl overflow-hidden shadow-2xl", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-glass-border bg-background/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Asistente Clínico AI</h1>
            <p className="text-sm text-muted">Acompañamiento médico activo</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="hidden md:flex gap-2">
          <button className="p-2 text-muted hover:text-primary bg-background/50 rounded-xl hover:bg-primary/10 transition-colors tooltip" title="Vincular Expediente">
            <FolderOpen className="w-5 h-5" />
          </button>
          <button className="p-2 text-muted hover:text-secondary bg-background/50 rounded-xl hover:bg-secondary/10 transition-colors tooltip" title="Agendar Cita">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Area (Mock) */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2 max-w-[80%]">
          <span className="text-xs text-muted ml-2">Asistente Clínico • 10:42 AM</span>
          <div className="bg-elevated p-4 rounded-2xl rounded-tl-sm border border-glass-border shadow-sm text-foreground text-sm leading-relaxed">
            Hola Juan. He revisado tus síntomas iniciales. Para darte una orientación más precisa, ¿podrías indicarme si la fiebre de 38.5°C cede con paracetamol o se mantiene constante?
          </div>
        </div>

        <div className="flex flex-col gap-2 max-w-[80%] self-end">
          <span className="text-xs text-muted mr-2 self-end">Tú • 10:45 AM</span>
          <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-sm shadow-md text-sm leading-relaxed">
            Baja un poco, a 37.8°C, pero vuelve a subir a las 4 horas.
          </div>
        </div>

        {/* Action Receipt Example */}
        <div className="w-full flex justify-center my-4">
          <div className="bg-background/40 border border-glass-border rounded-xl p-3 flex items-center gap-3 text-xs text-muted max-w-sm">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span>Nota clínica añadida al expediente: Fiebre persistente refractaria a antipiréticos.</span>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background/50 border-t border-glass-border backdrop-blur-md">
        <div className="relative flex items-end gap-2 bg-elevated rounded-2xl p-2 border border-glass-border focus-within:border-primary/50 transition-colors">
          <button className="p-3 text-muted hover:text-foreground transition-colors rounded-xl hover:bg-background/50">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            placeholder="Describe tus síntomas o adjunta evidencia..."
            className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none resize-none outline-none py-3 text-sm text-foreground placeholder:text-muted/70"
            rows={1}
          />
          <button className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

    </motion.div>
  );
}
