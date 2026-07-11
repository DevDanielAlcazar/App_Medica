"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, Plus, Loader2, Video, FileHeart, Coins, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  dateTime: string;
  meetLink: string | null;
  status: string;
  notes: string | null;
  doctor?: {
    name: string;
    email: string;
  } | null;
  clinicalCase?: {
    id: string;
    title: string;
  } | null;
}

interface Doctor {
  id: string;
  name: string;
  email: string;
}

interface ClinicalCase {
  id: string;
  title: string;
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Estados de datos
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  
  // Estados de carga e interfaz
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  
  // Formulario de Reserva
  const [selectedDoctorId, setSelectedDoctorId] = useState("random");
  const [appointmentTime, setAppointmentTime] = useState("09:00");
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Cargar citas, médicos, casos y balance de Wallet
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Cargar citas
        const appRes = await fetch("/api/patient/appointments");
        const appData = await appRes.json();
        if (appData.success) setAppointments(appData.appointments);

        // Cargar médicos verificado
        const docRes = await fetch("/api/patient/doctors");
        const docData = await docRes.json();
        if (docData.success) {
          setDoctors(docData.doctors);
        }

        // Cargar casos activos
        const caseRes = await fetch("/api/patient/cases");
        const caseData = await caseRes.json();
        if (caseData.success) {
          const activeCases = caseData.cases.filter((c: any) => c.status !== "curado" && c.status !== "archivado");
          setCases(activeCases);
          if (activeCases.length > 0) {
            setSelectedCaseId(activeCases[0].id);
          }
        }

        // Cargar balance de billetera
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (meData.success) {
          setWalletBalance(meData.user.wallet?.balance ?? 0);
        }
      } catch (err) {
        console.error("Error al cargar datos del calendario:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // 2. Procesar Agendamiento
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedDate || !appointmentTime) return;

    // Crear la fecha/hora completa
    const [hours, minutes] = appointmentTime.split(":");
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(parseInt(hours, 10));
    bookingDate.setMinutes(parseInt(minutes, 10));
    bookingDate.setSeconds(0);

    try {
      setBookingLoading(true);
      setError("");

      const res = await fetch("/api/patient/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          dateTime: bookingDate.toISOString(),
          caseId: selectedCaseId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo agendar la cita.");
      }

      // Agregar la nueva cita y actualizar saldo
      setAppointments((prev) => [...prev, data.appointment]);
      if (data.walletBalance !== undefined) {
        setWalletBalance(data.walletBalance);
      }

      toast.success("Cita agendada y pagada con éxito.");
      setBookingModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al procesar el agendamiento.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Filtrar citas del día seleccionado
  const appointmentsOfTheDay = appointments.filter((app) => {
    if (!selectedDate) return false;
    const appDate = new Date(app.dateTime);
    return (
      appDate.getDate() === selectedDate.getDate() &&
      appDate.getMonth() === selectedDate.getMonth() &&
      appDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="max-w-5xl mx-auto z-10 relative space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-outfit font-bold">Calendario de Citas</h1>
        <Button onClick={() => setBookingModalOpen(true)} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl">
          <Plus className="w-4 h-4" /> Agendar Cita
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>Sincronizando agenda y consultas...</span>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px]">
          {/* Calendario Físico */}
          <div className="glass-panel p-4 rounded-2xl border border-glass-border w-full md:w-auto self-start bg-background/30 backdrop-blur-md">
            <CalendarUI
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
            />
          </div>

          {/* Agenda Detallada */}
          <div className="flex-1 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2 text-foreground">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Agenda del {selectedDate?.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric"
              }) || "día seleccionado"}
            </h2>

            <div className="space-y-3">
              {appointmentsOfTheDay.map((e) => (
                <Card key={e.id} className="glass-panel border-glass-border bg-background/25 hover:border-primary/45 transition-colors overflow-hidden">
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="flex items-center gap-2 text-foreground font-semibold">
                          <div className={`w-2 h-2 rounded-full ${e.status === 'confirmed' ? 'bg-primary' : 'bg-destructive'}`} />
                          {e.doctor ? `Dr. ${e.doctor.name}` : "Médico por asignar"}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          Estatus: {e.status === "confirmed" ? "Confirmada y Pagada" : e.status}
                        </span>
                        {e.clinicalCase && (
                          <span className="text-[11px] text-primary flex items-center gap-1">
                            <FileHeart className="w-3.5 h-3.5" /> Caso: {e.clinicalCase.title}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-row items-center gap-4 self-end sm:self-center">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-xs bg-background/50 py-1 px-2.5 rounded-lg border border-glass-border">
                          <Clock className="w-3.5 h-3.5 text-secondary" />{" "}
                          {new Date(e.dateTime).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        
                        {e.meetLink && e.status === "confirmed" && (
                          <a href={e.meetLink} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="gap-1.5 bg-secondary hover:bg-secondary/90 text-white rounded-lg shadow-sm shadow-secondary/15">
                              <Video className="w-4 h-4" /> Ingresar
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}

              {appointmentsOfTheDay.length === 0 && (
                <div className="text-sm text-muted-foreground p-8 text-center border border-dashed border-glass-border rounded-xl bg-background/10">
                  No hay citas virtuales programadas para este día.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal / Diálogo de Agendamiento */}
      <AnimatePresence>
        {bookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-panel bg-background/95 w-full max-w-md p-6 rounded-2xl border border-glass-border shadow-2xl space-y-6 z-10"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-foreground">Programar Cita Virtual</h3>
                <button onClick={() => setBookingModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-xs font-semibold">
                  {error}
                </div>
              )}

              <form onSubmit={handleBookAppointment} className="space-y-4">
                {/* Selección de Médico */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Médico Especialista</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50"
                  >
                    <option value="random">⚡ Asignación aleatoria (Médico disponible)</option>
                    <option value="sin_medico">👤 Sin médico (Queda libre para auto-asignación)</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selección de Hora */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Hora de la cita</label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50"
                  />
                </div>

                {/* Selección de Caso Clínico */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Vincular a caso clínico</label>
                  <select
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50"
                  >
                    <option value="">-- No vincular a un caso --</option>
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Resumen del Costo */}
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="flex items-center gap-1.5 text-primary">
                      <Coins className="w-4 h-4" /> Costo de consulta
                    </span>
                    <span className="text-foreground">200 créditos</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-glass-border pt-2">
                    <span>Tu saldo de Wallet</span>
                    <span className={cn(walletBalance !== null && walletBalance < 200 ? "text-destructive font-bold" : "text-foreground")}>
                      {walletBalance ?? 0} créditos
                    </span>
                  </div>
                </div>

                {/* Botón de Confirmación */}
                <Button
                  type="submit"
                  disabled={bookingLoading || (walletBalance !== null && walletBalance < 200)}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 gap-2"
                >
                  {bookingLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Confirmar y Pagar
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
