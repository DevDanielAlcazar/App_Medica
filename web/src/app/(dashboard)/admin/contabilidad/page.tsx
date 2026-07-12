"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Search, RefreshCcw, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContabilidadDashboard() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCycles = async () => {
    try {
      const res = await fetch("/api/admin/contabilidad/ciclos");
      const data = await res.json();
      if (res.ok) {
        setCycles(data.cycles);
      }
    } catch (error) {
      console.error("Error fetching cycles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  const createCycle = async () => {
    const periodName = prompt("Nombre del periodo (ej. Semana 24, 2026):");
    if (!periodName) return;

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // Default 1 week

      const res = await fetch("/api/admin/contabilidad/ciclos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodName, startDate, endDate }),
      });

      if (res.ok) {
        fetchCycles();
      } else {
        alert("Error creando ciclo");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contabilidad</h1>
          <p className="text-muted-foreground">
            Gestión de ciclos de pago y liquidaciones a médicos.
          </p>
        </div>
        <Button onClick={createCycle} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nuevo Corte
        </Button>
      </div>

      <div className="border rounded-xl bg-card text-card-foreground shadow overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Ciclos de Pago</h2>
          <Button variant="outline" size="sm" onClick={fetchCycles} className="gap-2">
            <RefreshCcw className="h-4 w-4" /> Refrescar
          </Button>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Cargando...</div>
          ) : cycles.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No hay ciclos registrados.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Periodo</th>
                  <th className="px-6 py-3 text-left font-medium">Fecha Inicio</th>
                  <th className="px-6 py-3 text-left font-medium">Fecha Fin</th>
                  <th className="px-6 py-3 text-left font-medium">Estado</th>
                  <th className="px-6 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cycles.map((cycle: any) => (
                  <tr key={cycle.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium">{cycle.periodName}</td>
                    <td className="px-6 py-4">{new Date(cycle.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(cycle.endDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        cycle.status === "open" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                        "bg-gray-100 text-gray-800 border-gray-200"
                      )}>
                        {cycle.status === "open" ? "Abierto" : "Cerrado"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a 
                        href={`/admin/contabilidad/ciclos/${cycle.id}`}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-muted h-8 px-3"
                      >
                        Ver Detalle
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
