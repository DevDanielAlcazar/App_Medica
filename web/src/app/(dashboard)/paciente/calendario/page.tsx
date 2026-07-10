"use client";

import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, Plus } from "lucide-react";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const events = [
    { id: 1, title: "Cita Dr. Ramírez", type: "cita", time: "10:00 AM" },
    { id: 2, title: "Tomar Paracetamol", type: "medicamento", time: "14:00 PM" },
  ];

  return (
    <div className="max-w-5xl mx-auto z-10 relative space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-outfit font-bold">Calendario</h1>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Agendar Cita</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px]">
        <div className="glass-panel p-4 rounded-xl border border-glass-border w-full md:w-auto self-start">
          <CalendarUI
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Agenda del {date?.toLocaleDateString() || "día"}
          </h2>

          <div className="space-y-3">
            {events.map(e => (
              <Card key={e.id} className="glass-panel border-glass-border">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${e.type === 'cita' ? 'bg-primary' : 'bg-green-500'}`} />
                      {e.title}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="w-3 h-3" /> {e.time}
                    </span>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground p-4 text-center">No hay eventos para este día.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
