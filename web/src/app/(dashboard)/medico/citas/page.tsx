"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Clock, Video, XCircle, FileHeart, RefreshCw, X, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Appointment {
  id: string;
  dateTime: string;
  meetLink: string | null;
  status: string;
  notes: string | null;
  patient: {
    id: string;
    name: string;
    email: string;
  };
  clinicalCase?: {
    id: string;
    title: string;
  } | null;
}

export default function DoctorCitasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estado del Modal de Cancelación
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // 1. Cargar citas médicas asignadas
  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/doctor/appointments");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        setError(data.error || "No se pudieron obtener tus citas.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al cargar las citas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // 2. Procesar Cancelación de la Cita
  const handleCancelAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointmentId) return;

    try {
      setCancelLoading(true);
      const res = await fetch("/api/doctor/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: selectedAppointmentId,
          reason: cancelReason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo cancelar la cita.");
      }

      toast.success("Cita cancelada y créditos reembolsados al paciente.");
      setCancelModalOpen(false);
      setCancelReason("");
      // Recargar citas
      loadAppointments();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error al cancelar la cita.");
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-primary/20 text-primary border-primary/30";
      case "cancelled":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "completed":
        return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
      default:
        return "bg-muted text-muted-foreground border-glass-border";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "cancelled":
        return "Cancelada";
      case "completed":
        return "Completada";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 z-10 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-outfit font-bold">Citas Programadas</h1>
        <Button variant="outline" onClick={loadAppointments} className="gap-2 rounded-xl">
          <RefreshCw className="w-4 h-4" /> Recargar
        </Button>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>Consultando tu agenda médica...</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-glass-border rounded-2xl max-w-md mx-auto bg-background/25">
          <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto opacity-60 mb-2" />
          <h3 className="font-semibold text-lg">Sin citas programadas</h3>
          <p className="text-sm text-muted-foreground px-4 mt-1">
            Actualmente no tienes citas programadas de pacientes en tu agenda.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((e) => (
            <Card key={e.id} className="glass-panel border-glass-border bg-background/25 hover:border-primary/30 transition-colors">
              <CardHeader className="py-4 px-5">
                <CardTitle className="text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-semibold text-base">{e.patient.name}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStatusColor(e.status)}`}>
                        {getStatusLabel(e.status)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground block">
                      Email del paciente: {e.patient.email}
                    </span>
                    {e.clinicalCase && (
                      <span className="text-[11px] text-primary flex items-center gap-1">
                        <FileHeart className="w-3.5 h-3.5" /> Caso: {e.clinicalCase.title}
                      </span>
                    )}
                    {e.notes && (
                      <span className="text-xs text-muted-foreground/80 block italic">
                        Nota: {e.notes}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-row items-center gap-3 self-end sm:self-center">
                    <div className="flex flex-col text-right mr-2">
                      <span className="text-foreground font-semibold text-xs flex items-center gap-1.5 bg-background/50 border border-glass-border py-1 px-2.5 rounded-lg">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(e.dateTime).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="text-muted-foreground text-[10px] mt-1 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-secondary" />
                        {new Date(e.dateTime).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {e.status === "confirmed" && (
                      <>
                        {e.meetLink && (
                          <a href={e.meetLink} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="gap-1.5 bg-secondary hover:bg-secondary/90 text-white rounded-lg">
                              <Video className="w-4 h-4" /> Entrar al Meet
                            </Button>
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointmentId(e.id);
                            setCancelModalOpen(true);
                          }}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg gap-1"
                        >
                          <XCircle className="w-4 h-4" /> Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Cancelación de Cita */}
      <AnimatePresence>
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-panel bg-background/95 w-full max-w-md p-6 rounded-2xl border border-glass-border shadow-2xl space-y-4 z-10"
            >
              <div className="flex justify-between items-center border-b border-glass-border pb-3">
                <h3 className="text-lg font-bold text-foreground">Cancelar Cita Médica</h3>
                <button onClick={() => setCancelModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                Al cancelar esta cita, el sistema devolverá automáticamente los **200 créditos** al monedero del paciente. Por favor indica el motivo de la cancelación.
              </p>

              <form onSubmit={handleCancelAppointment} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Motivo de Cancelación</label>
                  <textarea
                    placeholder="Ej. Emergencia en consultorio, horario no disponible..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-destructive/50 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5">
                  <Button type="button" variant="ghost" onClick={() => setCancelModalOpen(false)}>
                    Descartar
                  </Button>
                  <Button
                    type="submit"
                    disabled={cancelLoading}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold rounded-xl shadow-lg shadow-destructive/20 gap-1.5"
                  >
                    {cancelLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Confirmar Cancelación
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
