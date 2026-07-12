"use client";

import { useEffect, useState, use } from "react";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CycleDetailPage({ params }: { params: Promise<{ cycleId: string }> }) {
  const unwrappedParams = use(params);
  const cycleId = unwrappedParams.cycleId;
  
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayouts = async () => {
    try {
      const res = await fetch(`/api/admin/contabilidad/payouts?cycleId=${cycleId}`);
      const data = await res.json();
      if (res.ok) {
        setPayouts(data.payouts);
      }
    } catch (error) {
      console.error("Error fetching payouts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [cycleId]);

  const approvePayout = async (payoutId: string) => {
    try {
      const res = await fetch("/api/admin/contabilidad/payouts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutId, status: "completed" }),
      });
      if (res.ok) {
        fetchPayouts();
      } else {
        alert("Error aprobando pago");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <a href="/admin/contabilidad" className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </a>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detalle del Ciclo</h1>
          <p className="text-muted-foreground">ID: {cycleId}</p>
        </div>
      </div>

      <div className="border rounded-xl bg-card text-card-foreground shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Pagos Solicitados / Pendientes</h2>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Cargando pagos...</div>
          ) : payouts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No hay pagos registrados para este ciclo.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Médico</th>
                  <th className="px-6 py-3 text-left font-medium">Banco / CLABE</th>
                  <th className="px-6 py-3 text-right font-medium">Monto</th>
                  <th className="px-6 py-3 text-left font-medium">Estado</th>
                  <th className="px-6 py-3 text-right font-medium">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payouts.map((payout: any) => (
                  <tr key={payout.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{payout.doctor.user.name}</div>
                      <div className="text-xs text-muted-foreground">{payout.doctor.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{payout.bankName || "N/A"}</div>
                      <div className="text-xs font-mono text-muted-foreground">{payout.clabe || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium">
                      ${payout.amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        payout.status === "completed" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                        "bg-amber-100 text-amber-800 border-amber-200"
                      )}>
                        {payout.status === "completed" ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {payout.status === "completed" ? "Pagado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payout.status !== "completed" && (
                        <Button size="sm" onClick={() => approvePayout(payout.id)}>
                          Marcar Pagado
                        </Button>
                      )}
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
