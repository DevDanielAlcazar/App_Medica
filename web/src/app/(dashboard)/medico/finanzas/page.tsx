"use client";

import { useEffect, useState } from "react";
import { Wallet, ArrowDownToLine, History, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FinanzasMedicoPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinances = async () => {
    try {
      const res = await fetch("/api/medico/finanzas");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Error fetching finances", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinances();
  }, []);

  const requestPayout = async () => {
    const amountStr = prompt(`Saldo disponible: $${data.balance}. ¿Cuánto deseas retirar?`);
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount) || amount <= 0 || amount > data.balance) {
      alert("Monto inválido");
      return;
    }

    try {
      const res = await fetch("/api/medico/finanzas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      if (res.ok) {
        alert("Retiro solicitado con éxito");
        fetchFinances();
      } else {
        const err = await res.json();
        alert(err.error || "Error al solicitar retiro");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-8">Cargando información financiera...</div>;
  }

  if (!data) {
    return <div className="p-8">Error al cargar finanzas.</div>;
  }

  const isBankSetup = data.bankName && data.clabe;

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mis Finanzas</h1>
        <p className="text-muted-foreground">
          Revisa tus ganancias por consultas y solicita retiros a tu cuenta bancaria.
        </p>
      </div>

      {!isBankSetup && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <h3 className="font-semibold">Información bancaria incompleta</h3>
            <p className="text-sm">Debes configurar tu Banco y CLABE en tu perfil antes de poder solicitar retiros.</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-xl bg-card text-card-foreground shadow p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Wallet className="w-5 h-5" />
            <h3 className="font-medium">Saldo Disponible</h3>
          </div>
          <div className="text-4xl font-bold font-mono">
            ${data.balance?.toLocaleString("es-MX", { minimumFractionDigits: 2 })} <span className="text-xl text-muted-foreground font-sans">MXN</span>
          </div>
          <Button 
            className="mt-6 w-full gap-2" 
            size="lg" 
            onClick={requestPayout}
            disabled={!isBankSetup || data.balance <= 0}
          >
            <ArrowDownToLine className="w-4 h-4" />
            Solicitar Retiro
          </Button>
        </div>

        <div className="border rounded-xl bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold mb-4 border-b pb-2">Información de Depósito</h3>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Banco</dt>
              <dd className="font-medium">{data.bankName || "No configurado"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Cuenta CLABE</dt>
              <dd className="font-mono font-medium">{data.clabe || "No configurado"}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <Button variant="outline" size="sm" asChild>
              <a href="/medico/perfil">Editar Datos Bancarios</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Retiros Solicitados */}
        <div className="border rounded-xl bg-card text-card-foreground shadow overflow-hidden">
          <div className="p-4 border-b bg-muted/20 flex items-center gap-2">
            <History className="w-4 h-4" />
            <h3 className="font-semibold">Historial de Retiros</h3>
          </div>
          <div className="p-0">
            {data.payouts?.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No hay retiros recientes.</div>
            ) : (
              <ul className="divide-y text-sm">
                {data.payouts?.map((p: any) => (
                  <li key={p.id} className="p-4 flex justify-between items-center hover:bg-muted/30">
                    <div>
                      <div className="font-medium font-mono">${p.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium border",
                      p.status === "completed" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                      p.status === "pending" ? "bg-amber-100 text-amber-800 border-amber-200" :
                      "bg-gray-100 text-gray-800 border-gray-200"
                    )}>
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Transacciones */}
        <div className="border rounded-xl bg-card text-card-foreground shadow overflow-hidden">
          <div className="p-4 border-b bg-muted/20 flex items-center gap-2">
            <History className="w-4 h-4" />
            <h3 className="font-semibold">Últimos Movimientos</h3>
          </div>
          <div className="p-0">
            {data.transactions?.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No hay movimientos recientes.</div>
            ) : (
              <ul className="divide-y text-sm">
                {data.transactions?.map((t: any) => (
                  <li key={t.id} className="p-4 flex justify-between items-center hover:bg-muted/30">
                    <div>
                      <div className="font-medium">{t.description}</div>
                      <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className={cn(
                      "font-mono font-medium",
                      t.type === "earning" ? "text-emerald-600" : "text-red-600"
                    )}>
                      {t.type === "earning" ? "+" : "-"}${t.amount.toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
