"use client";

import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SupportPage() {
  const tickets = [
    { id: "TK-102", subject: "Problema con la recarga de wallet", status: "Activo", date: "Hace 2 horas" },
    { id: "TK-084", subject: "Duda sobre resultado de laboratorio", status: "Resuelto", date: "Hace 5 días" },
  ];

  return (
    <div className="max-w-4xl mx-auto z-10 relative space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-outfit font-bold">Soporte</h1>
          <p className="text-muted-foreground">¿En qué podemos ayudarte hoy?</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Ticket
        </Button>
      </div>

      <div className="grid gap-4 mt-6">
        {tickets.map(t => (
          <div key={t.id} className="glass-panel p-5 rounded-xl border border-glass-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-muted rounded-lg shrink-0">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{t.subject}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="font-mono">{t.id}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.date}</span>
                </div>
              </div>
            </div>
            <Badge variant={t.status === "Activo" ? "default" : "secondary"}>
              {t.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
