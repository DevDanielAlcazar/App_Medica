"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarIcon, Clock, Plus, Loader2, Video, FileHeart, Coins, CheckCircle2, X, Pill, ShieldAlert, CalendarClock, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/providers/LanguageProvider";

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

interface MedicationReminder {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
}

export default function CalendarPage() {
  const { t, locale } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Estados de datos
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  
  // Estados de carga e interfaz
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  
  // Formulario de Reserva de Cita
  const [selectedDoctorId, setSelectedDoctorId] = useState("random");
  const [appointmentTime, setAppointmentTime] = useState("09:00");
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Formulario de Recordatorio de Medicamento
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("cada 8 horas");
  const [startDateStr, setStartDateStr] = useState(new Date().toISOString().split("T")[0]);
  const [endDateStr, setEndDateStr] = useState("");
  const [reminderLoading, setReminderLoading] = useState(false);
  const [reminderError, setReminderError] = useState("");

  // 1. Cargar citas, médicos, casos, recordatorios y balance de Wallet
  const loadData = async () => {
    try {
      setLoading(true);
      // Cargar citas
      const appRes = await fetch("/api/patient/appointments");
      const appData = await appRes.json();
      if (appData.success) setAppointments(appData.appointments);

      // Cargar recordatorios de medicamentos
      const remRes = await fetch("/api/patient/reminders");
      const remData = await remRes.json();
      if (remData.success) setReminders(remData.reminders);

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

      // Cargar balance de billetera y preferencias
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
  };

  useEffect(() => {
    loadData();

    // Cargar conexión de google de localstorage para persistencia mock
    const gConnected = localStorage.getItem("gcal_connected") === "true";
    setGoogleConnected(gConnected);
  }, []);

  // 2. Procesar Agendamiento de Cita
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedDate || !appointmentTime) return;

    const [hours, minutes] = appointmentTime.split(":");
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(parseInt(hours, 10));
    bookingDate.setMinutes(parseInt(minutes, 10));
    bookingDate.setSeconds(0);

    try {
      setBookingLoading(true);
      setBookingError("");

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

      toast.success(locale === "es" ? "Cita agendada y pagada con éxito." : "Appointment booked and paid successfully.");
      setBookingModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setBookingError(err.message || "Error al procesar el agendamiento.");
    } finally {
      setBookingLoading(false);
    }
  };

  // 3. Procesar Alta de Recordatorio de Medicamento
  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medication || !dosage || !frequency || !startDateStr) return;

    try {
      setReminderLoading(true);
      setReminderError("");

      const res = await fetch("/api/patient/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medication,
          dosage,
          frequency,
          startDate: new Date(startDateStr + "T00:00:00").toISOString(),
          endDate: endDateStr ? new Date(endDateStr + "T23:59:59").toISOString() : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo guardar el recordatorio.");
      }

      setReminders((prev) => [...prev, data.reminder]);
      toast.success(locale === "es" ? "Recordatorio de medicamento guardado con éxito." : "Medication reminder saved successfully.");
      
      // Limpiar formulario
      setMedication("");
      setDosage("");
      setFrequency("cada 8 horas");
      setReminderModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setReminderError(err.message || "Error al guardar el recordatorio.");
    } finally {
      setReminderLoading(false);
    }
  };

  // 4. Conectar / Desconectar Google Calendar (OAuth Simulado)
  const handleGoogleConnect = () => {
    setGoogleModalOpen(true);
  };

  const confirmGoogleConnect = () => {
    setTimeout(() => {
      setGoogleConnected(true);
      localStorage.setItem("gcal_connected", "true");
      setGoogleModalOpen(false);
      toast.success(locale === "es" ? "Google Calendar sincronizado correctamente." : "Google Calendar synced successfully.");
    }, 1200);
  };

  const handleGoogleDisconnect = () => {
    setGoogleConnected(false);
    localStorage.removeItem("gcal_connected");
    toast.success(locale === "es" ? "Google Calendar desconectado." : "Google Calendar disconnected.");
  };

  // 5. Exportar iCalendar (.ics)
  const exportIcsCalendar = () => {
    try {
      let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AngelicaMed//ClinicalCalendar//ES\nCALSCALE:GREGORIAN\n";
      
      // Añadir Citas Médicas
      appointments.forEach(app => {
        const date = new Date(app.dateTime);
        const dateString = date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        const dateEnd = new Date(date.getTime() + 30 * 60 * 1000); // 30 min
        const dateEndString = dateEnd.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${app.id}@angelicamed.com\n`;
        icsContent += `DTSTAMP:${dateString}\n`;
        icsContent += `DTSTART:${dateString}\n`;
        icsContent += `DTEND:${dateEndString}\n`;
        icsContent += `SUMMARY:Consulta Médica - Dr. ${app.doctor?.name || "Asignado"}\n`;
        icsContent += `DESCRIPTION:Consulta médica virtual a través de Angélica Med. Enlace Meet: ${app.meetLink || 'por asignar'}\n`;
        icsContent += "END:VEVENT\n";
      });

      // Añadir Medicamentos
      reminders.forEach(rem => {
        const date = new Date(rem.startDate);
        const dateString = date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        icsContent += "BEGIN:VEVENT\n";
        icsContent += `UID:${rem.id}@angelicamed.com\n`;
        icsContent += `DTSTAMP:${dateString}\n`;
        icsContent += `DTSTART:${dateString}\n`;
        icsContent += `SUMMARY:Tomar ${rem.medication} (${rem.dosage})\n`;
        icsContent += `DESCRIPTION:Recordatorio de Toma de Medicamentos. Frecuencia: ${rem.frequency}\n`;
        icsContent += "END:VEVENT\n";
      });

      icsContent += "END:VCALENDAR";

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `calendario_angelica_med.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(locale === "es" ? "Archivo iCalendar (.ics) exportado correctamente." : "iCalendar (.ics) file exported successfully.");
    } catch (err) {
      console.error(err);
      toast.error(locale === "es" ? "Error al exportar iCalendar." : "Failed to export iCalendar.");
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

  // Filtrar recordatorios del día seleccionado
  const remindersOfTheDay = reminders.filter((rem) => {
    if (!selectedDate) return false;
    const start = new Date(rem.startDate);
    start.setHours(0, 0, 0, 0);
    const target = new Date(selectedDate);
    target.setHours(0, 0, 0, 0);

    if (rem.endDate) {
      const end = new Date(rem.endDate);
      end.setHours(23, 59, 59, 999);
      return target >= start && target <= end;
    }
    return target >= start;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 z-10 relative h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold">
            {locale === "es" ? "Calendario Clínico" : "Clinical Calendar"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {locale === "es" ? "Sincroniza tus consultas médicas y tus esquemas de dosificación de medicamentos." : "Sync your medical consultations and medication dosage schemes."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {googleConnected ? (
            <Button variant="outline" onClick={handleGoogleDisconnect} className="gap-1.5 border-primary/20 text-primary rounded-xl text-xs">
              <CalendarClock className="w-4 h-4" /> {locale === "es" ? "Desconectar Google" : "Disconnect Google"}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleGoogleConnect} className="gap-1.5 border-glass-border rounded-xl text-xs">
              <CalendarClock className="w-4 h-4 text-muted-foreground" /> {locale === "es" ? "Sincronizar Google" : "Sync Google"}
            </Button>
          )}

          <Button variant="outline" onClick={exportIcsCalendar} className="gap-1.5 border-glass-border rounded-xl text-xs">
            <Download className="w-4 h-4" /> {locale === "es" ? "Exportar .ics" : "Export .ics"}
          </Button>

          <Button onClick={() => setBookingModalOpen(true)} className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl text-xs">
            <Plus className="w-4 h-4" /> {locale === "es" ? "Agendar Cita" : "Book Appointment"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>{locale === "es" ? "Sincronizando agenda y consultas..." : "Retrieving calendar and schedule..."}</span>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px]">
          {/* Panel Lateral: Calendario e Interfaces de Control */}
          <div className="space-y-4 w-full md:w-auto self-start">
            <div className="glass-panel p-4 rounded-2xl border border-glass-border bg-background/30 backdrop-blur-md">
              <CalendarUI
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md"
              />
            </div>
            
            <Button onClick={() => setReminderModalOpen(true)} variant="secondary" className="w-full gap-2 border border-glass-border rounded-xl bg-background/20">
              <Pill className="w-4 h-4 text-primary" />
              {locale === "es" ? "Añadir Medicamento" : "Add Medication"}
            </Button>
          </div>

          {/* Agenda Detallada */}
          <div className="flex-1 space-y-4">
            <h2 className="font-semibold text-lg flex items-center gap-2 text-foreground border-b border-glass-border pb-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {locale === "es" ? "Agenda del" : "Schedule for"} {selectedDate?.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
                day: "numeric",
                month: "long",
                year: "numeric"
              }) || "día seleccionado"}
            </h2>

            {/* Listado de Eventos (Citas y Medicamentos) */}
            <div className="space-y-3">
              {/* Citas Médicas */}
              {appointmentsOfTheDay.map((e) => (
                <Card key={e.id} className="glass-panel border-glass-border bg-background/25 hover:border-primary/45 transition-colors overflow-hidden">
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="flex items-center gap-2 text-foreground font-semibold">
                          <div className={`w-2.5 h-2.5 rounded-full ${e.status === 'confirmed' ? 'bg-primary' : 'bg-destructive'}`} />
                          {e.doctor ? `Dr. ${e.doctor.name}` : (locale === "es" ? "Médico por asignar" : "Doctor to be assigned")}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          {locale === "es" ? "Estatus" : "Status"}: {e.status === "confirmed" ? (locale === "es" ? "Confirmada y Pagada" : "Confirmed & Paid") : e.status}
                        </span>
                        {e.clinicalCase && (
                          <span className="text-[11px] text-primary flex items-center gap-1">
                            <FileHeart className="w-3.5 h-3.5" /> {locale === "es" ? "Caso" : "Case"}: {e.clinicalCase.title}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-row items-center gap-4 self-end sm:self-center">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-xs bg-background/50 py-1 px-2.5 rounded-lg border border-glass-border">
                          <Clock className="w-3.5 h-3.5 text-secondary" />{" "}
                          {new Date(e.dateTime).toLocaleTimeString(locale === "es" ? "es-ES" : "en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        
                        {e.meetLink && e.status === "confirmed" && (
                          <a href={e.meetLink} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="gap-1.5 bg-secondary hover:bg-secondary/90 text-white rounded-lg shadow-sm shadow-secondary/15">
                              <Video className="w-4 h-4" /> {locale === "es" ? "Ingresar" : "Join"}
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}

              {/* Recordatorios de Medicamentos */}
              {remindersOfTheDay.map((r) => (
                <Card key={r.id} className="glass-panel border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 transition-colors overflow-hidden">
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg shrink-0">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-bold text-foreground block text-sm">
                            {locale === "es" ? "Tomar" : "Take"} {r.medication}
                          </span>
                          <span className="text-xs text-muted-foreground block">
                            {locale === "es" ? "Dosis sugerida" : "Suggested dosage"}: <strong className="text-foreground">{r.dosage}</strong>
                          </span>
                          <span className="text-[11px] text-emerald-600 block font-medium">
                            🔄 {r.frequency}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-row items-center gap-4 self-end sm:self-center">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-xs bg-background/50 py-1 px-2.5 rounded-lg border border-glass-border">
                          <Clock className="w-3.5 h-3.5 text-emerald-500" />
                          {locale === "es" ? "Esquema Diario" : "Daily Scheme"}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}

              {appointmentsOfTheDay.length === 0 && remindersOfTheDay.length === 0 && (
                <div className="text-sm text-muted-foreground p-8 text-center border border-dashed border-glass-border rounded-xl bg-background/10">
                  {locale === "es" ? "No hay actividades clínicas programadas para este día." : "No clinical activities scheduled for this day."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal / Diálogo de Agendamiento de Cita */}
      <AnimatePresence>
        {bookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-panel bg-background/95 w-full max-w-md p-6 rounded-2xl border border-glass-border shadow-2xl space-y-6 z-10"
            >
              <div className="flex justify-between items-center pb-3 border-b border-glass-border">
                <h3 className="text-xl font-bold text-foreground">{locale === "es" ? "Programar Cita Virtual" : "Schedule Virtual Appointment"}</h3>
                <button onClick={() => setBookingModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {bookingError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-xs font-semibold">
                  {bookingError}
                </div>
              )}

              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">{locale === "es" ? "Médico Especialista" : "Specialist Doctor"}</label>
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50"
                  >
                    <option value="random">⚡ {locale === "es" ? "Asignación aleatoria (Médico disponible)" : "Random assignment (Available doctor)"}</option>
                    <option value="sin_medico">👤 {locale === "es" ? "Sin médico (Queda libre para auto-asignación)" : "No doctor assigned (Available for self-claim)"}</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">{locale === "es" ? "Hora de la cita" : "Appointment Time"}</label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase">{locale === "es" ? "Vincular a caso clínico" : "Link to clinical case"}</label>
                  <select
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50"
                  >
                    <option value="">-- {locale === "es" ? "No vincular a un caso" : "Do not link to a case"} --</option>
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="flex items-center gap-1.5 text-primary">
                      <Coins className="w-4 h-4" /> {locale === "es" ? "Costo de consulta" : "Consultation Cost"}
                    </span>
                    <span className="text-foreground">200 {locale === "es" ? "créditos" : "credits"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground border-t border-glass-border pt-2">
                    <span>{locale === "es" ? "Tu saldo de Wallet" : "Your Wallet balance"}</span>
                    <span className={cn(walletBalance !== null && walletBalance < 200 ? "text-destructive font-bold" : "text-foreground")}>
                      {walletBalance ?? 0} {locale === "es" ? "créditos" : "credits"}
                    </span>
                  </div>
                </div>

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
                  {locale === "es" ? "Confirmar y Pagar" : "Confirm and Pay"}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal / Diálogo de Nuevo Medicamento */}
      <AnimatePresence>
        {reminderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReminderModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-panel bg-background/95 w-full max-w-md p-6 rounded-2xl border border-glass-border shadow-2xl space-y-6 z-10"
            >
              <div className="flex justify-between items-center pb-3 border-b border-glass-border">
                <h3 className="text-xl font-bold text-foreground">
                  {locale === "es" ? "Agregar Recordatorio de Medicamento" : "Add Medication Reminder"}
                </h3>
                <button onClick={() => setReminderModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reminderError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-xs font-semibold">
                  {reminderError}
                </div>
              )}

              <form onSubmit={handleAddReminder} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{locale === "es" ? "Nombre del Medicamento" : "Medication Name"}</Label>
                  <Input
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                    required
                    placeholder="Ej. Paracetamol, Ibuprofeno"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>{locale === "es" ? "Dosis (ej: 500mg, 1 tableta)" : "Dosage (e.g. 500mg, 1 tablet)"}</Label>
                  <Input
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    required
                    placeholder="Ej. 1 tableta, 5ml"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>{locale === "es" ? "Frecuencia de Toma" : "Frequency"}</Label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50"
                  >
                    <option value="cada 4 horas">{locale === "es" ? "Cada 4 horas" : "Every 4 hours"}</option>
                    <option value="cada 6 horas">{locale === "es" ? "Cada 6 horas" : "Every 6 hours"}</option>
                    <option value="cada 8 horas">{locale === "es" ? "Cada 8 horas" : "Every 8 hours"}</option>
                    <option value="cada 12 horas">{locale === "es" ? "Cada 12 horas" : "Every 12 hours"}</option>
                    <option value="cada 24 horas">{locale === "es" ? "Cada 24 horas" : "Every 24 hours"}</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{locale === "es" ? "Fecha Inicio" : "Start Date"}</Label>
                    <input
                      type="date"
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
                      required
                      className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{locale === "es" ? "Fecha Fin (Opcional)" : "End Date (Optional)"}</Label>
                    <input
                      type="date"
                      value={endDateStr}
                      onChange={(e) => setEndDateStr(e.target.value)}
                      className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={reminderLoading}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 gap-2"
                >
                  {reminderLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {locale === "es" ? "Guardar Recordatorio" : "Save Reminder"}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Sincronización Google Calendar */}
      <AnimatePresence>
        {googleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGoogleModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-panel bg-background/95 w-full max-w-sm p-6 rounded-2xl border border-glass-border shadow-2xl text-center space-y-6 z-10"
            >
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <CalendarClock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  {locale === "es" ? "Autorizar Acceso a Google Calendar" : "Authorize Google Calendar"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {locale === "es"
                    ? "Angélica Med requiere permisos mínimos de lectura/escritura para añadir tus consultas virtuales a tu cuenta de Google Calendar de forma segura."
                    : "Angélica Med requires minimum read/write permissions to add virtual consultations to your Google Calendar account securely."}
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="w-full rounded-xl" onClick={() => setGoogleModalOpen(false)}>
                  {locale === "es" ? "Cancelar" : "Cancel"}
                </Button>
                <Button className="w-full rounded-xl" onClick={confirmGoogleConnect}>
                  {locale === "es" ? "Sincronizar" : "Sync"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
