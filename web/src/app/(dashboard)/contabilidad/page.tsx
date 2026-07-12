"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountingCyclesList } from "@/components/accounting/AccountingCyclesList";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

interface DashboardStats {
  totalPaid: number;
  totalPending: number;
  totalPenalties: number;
  cycles: Array<{
    id: string;
    periodName: string;
    startDate: string;
    endDate: string;
    status: string;
    _count?: { payouts: number };
  }>;
}

export default function Page() {
  const { locale } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-outfit font-bold">
        {locale === "es" ? "Dashboard Contabilidad" : "Accounting Dashboard"}
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="glass-panel border-glass-border">
            <CardHeader>
              <CardTitle className="text-sm">
                {locale === "es" ? "Total Pagado" : "Total Paid"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-mono">
                ${stats?.totalPaid?.toLocaleString() || "0"} MXN
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-glass-border">
            <CardHeader>
              <CardTitle className="text-sm">
                {locale === "es" ? "Total Pendiente" : "Total Pending"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-mono">
                ${stats?.totalPending?.toLocaleString() || "0"} MXN
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-glass-border">
            <CardHeader>
              <CardTitle className="text-sm">
                {locale === "es" ? "Penalizaciones" : "Penalties"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-mono text-destructive">
                ${stats?.totalPenalties?.toLocaleString() || "0"} MXN
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {locale === "es" ? "Ciclos de Pago" : "Payment Cycles"}
        </h2>
        <AccountingCyclesList cycles={stats?.cycles || []} />
      </div>
    </div>
  );
}