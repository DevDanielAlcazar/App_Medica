"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, CreditCard, Users, ShieldCheck, Clock } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface DoctorDashboardData {
  todayAppointments: number;
  pendingPayouts: number;
  verificationStatus: string;
  monthlyEarnings: number;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  activo: { label: "Verificado", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  en_revision: { label: "En Revisión", color: "bg-amber-100 text-amber-800 border-amber-200" },
  pendiente: { label: "Pendiente", color: "bg-blue-100 text-blue-800 border-blue-200" },
  rechazado: { label: "Rechazado", color: "bg-destructive/10 text-destructive" },
};

export function DoctorDashboard() {
  const { locale } = useLanguage();
  const [data, setData] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/medico/dashboard")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      title: locale === "es" ? "Citas Hoy" : "Today's Appointments",
      value: data?.todayAppointments ?? 0,
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: locale === "es" ? "Pagos Pendientes" : "Pending Payouts",
      value: data?.pendingPayouts ?? 0,
      icon: CreditCard,
      color: "text-warning",
    },
    {
      title: locale === "es" ? "Ganancias del Mes" : "Monthly Earnings",
      value: `$${data?.monthlyEarnings?.toLocaleString() ?? "0"}`,
      icon: ShieldCheck,
      color: "text-emerald-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-outfit font-bold">
          {locale === "es" ? "Panel del Médico" : "Doctor Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          {locale === "es"
            ? "Resumen de tu actividad y métricas"
            : "Summary of your activity and metrics"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="glass-panel border-glass-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold font-mono mt-2">{stat.value}</p>
                </div>
                <stat.icon className={cn("w-8 h-8", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-panel border-glass-border">
        <CardHeader>
          <CardTitle className="text-sm">
            {locale === "es" ? "Estado de Verificación" : "Verification Status"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                STATUS_LABELS[data?.verificationStatus || "pendiente"]?.color || ""
              )}
            >
              {STATUS_LABELS[data?.verificationStatus || "pendiente"]?.label || "Pendiente"}
            </Badge>
          </div>
          {data?.verificationStatus !== "activo" && (
            <p className="text-xs text-muted-foreground mt-2">
              {locale === "es"
                ? "Completa tu verificación en "
                : "Complete your verification at "}
              <a href="/medico/verificacion" className="text-primary underline">
                /medico/verificacion
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}