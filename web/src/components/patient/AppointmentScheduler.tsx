"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/providers/LanguageProvider";

interface AppointmentSchedulerProps {
  doctors: Array<{ id: string; name: string }>;
  onSchedule: (data: { doctorId: string; dateTime: string }) => Promise<void>;
  loading?: boolean;
}

export function AppointmentScheduler({ doctors, onSchedule, loading }: AppointmentSchedulerProps) {
  const { locale } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [doctor, setDoctor] = useState<string>("random");
  const [submitting, setSubmitting] = useState(false);

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

  const handleSchedule = async () => {
    if (!date || !time) return;
    setSubmitting(true);
    const dateTime = new Date(date);
    dateTime.setHours(parseInt(time), 0, 0, 0);
    try {
      await onSchedule({ doctorId: doctor, dateTime: dateTime.toISOString() });
    } finally {
      setSubmitting(false);
    }
  };

  const t = (key: string) => {
    const translations: Record<string, string> = {
      schedule: locale === "es" ? "Agendar Cita" : "Schedule Appointment",
      select_date: locale === "es" ? "Selecciona fecha" : "Select date",
      select_time: locale === "es" ? "Selecciona hora" : "Select time",
      select_doctor: locale === "es" ? "Selecciona médico (opcional)" : "Select doctor (optional)",
      any_doctor: locale === "es" ? "Cualquier médico disponible" : "Any available doctor",
      schedule_now: locale === "es" ? "Agendar ahora" : "Schedule now",
    };
    return translations[key] || key;
  };

  const dateStr = date ? format(date, "PPP", { locale: locale === "es" ? es : enUS }) : t("select_date");

  return (
    <div className="glass-panel p-6 rounded-xl border border-glass-border bg-background/25 space-y-4">
      <h3 className="font-semibold flex items-center gap-2">
        <CalendarIcon className="w-4 h-4 text-primary" />
        {t("schedule")}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">{t("select_date")}</p>
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateStr}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={locale === "es" ? es : enUS}
                disabled={(d) => d < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">{t("select_time")}</p>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-elevated/35 border border-glass-border text-foreground text-sm rounded-xl p-2 outline-none"
          >
            <option value="">{t("select_time")}</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">{t("select_doctor")}</p>
        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          className="w-full bg-elevated/35 border border-glass-border text-foreground text-sm rounded-xl p-2 outline-none"
        >
          <option value="random">{t("any_doctor")}</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleSchedule}
        disabled={!date || !time || submitting}
        className="w-full gap-2"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
        {t("schedule_now")}
      </Button>
    </div>
  );
}