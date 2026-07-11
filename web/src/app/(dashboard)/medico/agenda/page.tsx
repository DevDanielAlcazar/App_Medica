"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, CalendarDays, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_HOURS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00"
];

export default function DoctorAgendaPage() {
  const [schedule, setSchedule] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 1. Cargar horario existente
  useEffect(() => {
    async function loadSchedule() {
      try {
        setLoading(true);
        const res = await fetch("/api/doctor/schedule");
        const data = await res.json();
        
        if (data.success && data.schedule) {
          // Asumimos que schedule es un array de strings en este v1
          if (Array.isArray(data.schedule)) {
            setSchedule(data.schedule);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar la disponibilidad horaria.");
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, []);

  // Toggle de un bloque de hora
  const toggleHour = (hour: string) => {
    setSchedule((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  // 2. Guardar disponibilidad horaria
  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      setError("");

      const res = await fetch("/api/doctor/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo guardar la disponibilidad.");
      }

      toast.success("Disponibilidad horaria guardada con éxito.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al guardar el horario.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Consultando disponibilidad horaria...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 z-10 relative">
      <h1 className="text-3xl font-outfit font-bold">Mi Agenda de Disponibilidad</h1>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel Izquierdo: Explicación */}
        <Card className="glass-panel border-glass-border bg-background/25 md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Gestión Horaria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground leading-relaxed">
            <p>
              Configura los bloques de horas en los que te encuentras disponible para dar orientaciones virtuales.
            </p>
            <p>
              Al activar un bloque, los pacientes podrán programar citas de forma autónoma con tu perfil dentro de la sección de Calendario.
            </p>
            <div className="p-3 bg-muted/20 border border-glass-border rounded-xl mt-2 text-[10px]">
              <strong>Monitoreo:</strong> Las citas son de 50 minutos y se agendan en bloques exactos de hora.
            </div>
          </CardContent>
        </Card>

        {/* Panel Derecho: Selección de Horarios */}
        <Card className="glass-panel border-glass-border bg-background/25 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              Bloques Horarios Disponibles (Lunes a Viernes)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {DEFAULT_HOURS.map((hour) => {
                const isActive = schedule.includes(hour);
                return (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => toggleHour(hour)}
                    className={`p-3.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary/20 shadow-md shadow-primary/10"
                        : "bg-elevated/35 text-foreground hover:border-primary/40 border-glass-border"
                    }`}
                  >
                    {hour}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-glass-border">
              <Button
                onClick={handleSaveSchedule}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 gap-2 px-6"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Guardar Disponibilidad
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
