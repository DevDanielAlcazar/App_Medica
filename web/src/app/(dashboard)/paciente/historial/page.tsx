"use client";

import { useEffect, useState } from "react";
import { useCaseStore } from "@/stores/caseStore";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Calendar, Clock, Activity, Loader2, FolderHeart } from "lucide-react";

interface ClinicalCase {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  timeline: any[];
}

export default function ClinicalHistoryPage() {
  const { setActiveCase } = useCaseStore();
  const router = useRouter();

  const [cases, setCases] = useState<ClinicalCase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // 1. Obtener casos reales de la API
  useEffect(() => {
    async function loadCases() {
      try {
        setLoading(true);
        const res = await fetch("/api/patient/cases");
        const data = await res.json();
        if (data.success) {
          setCases(data.cases);
        } else {
          setError(data.error || "No se pudo obtener el historial clínico.");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión al obtener el historial clínico.");
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, []);

  // 2. Crear un nuevo caso y redireccionar
  const handleCreateCase = async () => {
    try {
      setCreating(true);
      setError("");
      
      const todayStr = new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const res = await fetch("/api/patient/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `Consulta sintomática del ${todayStr}` }),
      });
      const data = await res.json();

      if (data.success) {
        // Establecer como caso activo en Zustand y redirigir
        setActiveCase(data.case);
        router.push("/paciente/consulta");
      } else {
        setError(data.error || "No se pudo abrir el nuevo caso clínico.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al abrir el nuevo caso.");
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_analisis":
        return <Badge className="bg-primary/20 text-primary border-primary/30">En Análisis</Badge>;
      case "derivado":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Derivado</Badge>;
      case "curado":
        return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Curado</Badge>;
      case "en_tratamiento":
        return <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">En Tratamiento</Badge>;
      default:
        return <Badge variant="outline">{status.replace("_", " ")}</Badge>;
    }
  };

  // Filtrar expedientes según el término de búsqueda
  const filteredCases = cases.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto z-10 relative space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-outfit font-bold">Historial Clínico</h1>
        <Button onClick={handleCreateCase} disabled={creating} className="gap-2">
          {creating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Nuevo Caso
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar expedientes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9" 
          />
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>Cargando expedientes clínicos...</span>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center border border-dashed border-glass-border rounded-2xl bg-background/20 max-w-md mx-auto mt-6">
          <FolderHeart className="w-12 h-12 text-muted-foreground opacity-60" />
          <div>
            <h3 className="font-semibold text-lg">No hay expedientes clínicos</h3>
            <p className="text-sm text-muted-foreground px-4">
              Aún no tienes consultas registradas. Da clic en &quot;Nuevo Caso&quot; para iniciar tu primera orientación médica.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 mt-6">
          {filteredCases.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/paciente/historial/${c.id}`}>
                <div className="glass-panel p-6 rounded-xl border border-glass-border hover:border-primary/50 transition-all cursor-pointer flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{c.title}</h3>
                      {getStatusBadge(c.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />{" "}
                        {new Date(c.createdAt).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-4 h-4" /> {c.timeline.length} eventos
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Ver Detalle</Button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
