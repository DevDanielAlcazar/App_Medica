"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Calendar, Clock, Activity } from "lucide-react";

export default function ClinicalHistoryPage() {
  const cases = [
    { id: "1", title: "Migraña Crónica", status: "en_tratamiento", date: "2026-07-01", events: 12 },
    { id: "2", title: "Chequeo General", status: "curado", date: "2026-06-15", events: 5 },
    { id: "3", title: "Dolor Lumbar", status: "en_analisis", date: "2026-07-10", events: 3 },
  ];

  return (
    <div className="max-w-6xl mx-auto z-10 relative space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-outfit font-bold">Historial Clínico</h1>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo Caso
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Buscar expedientes..." className="pl-9" />
        </div>
      </div>

      <div className="grid gap-4 mt-6">
        {cases.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={`/paciente/historial/${c.id}`}>
              <div className="glass-panel p-6 rounded-xl border border-glass-border hover:border-primary/50 transition-all cursor-pointer flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{c.title}</h3>
                    <Badge variant={c.status === "en_tratamiento" ? "default" : c.status === "curado" ? "secondary" : "outline"}>
                      {c.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {c.date}</span>
                    <span className="flex items-center gap-1"><Activity className="w-4 h-4" /> {c.events} eventos</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Ver Detalle</Button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
