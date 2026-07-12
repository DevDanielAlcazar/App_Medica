"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/config";

interface DoctorDashboardData {
  todayAppointments: number;
  pendingPayouts: number;
  verificationStatus: string;
  monthlyEarnings: number;
}

const STATUS_LABELS: Record<string, { color: string }> = {
  activo: { color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  en_revision: { color: "bg-amber-100 text-amber-800 border-amber-200" },
  pendiente: { color: "bg-blue-100 text-blue-800 border-blue-200" },
  rechazado: { color: "bg-destructive/10 text-destructive" },
};

const STATUS_KEYS: Record<string, string> = {
  activo: "doctor.status_verified",
  en_revision: "doctor.status_review",
  pendiente: "doctor.status_pending",
  rechazado: "doctor.status_rejected",
};

export function DoctorDashboard() {
  const { t } = useTranslation();
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
      title: t("doctor.today_appointments"),
      value: data?.todayAppointments ?? 0,
      icon: Calendar,
      color: "text-primary",
    },
    {
      title: t("doctor.pending_payouts"),
      value: data?.pendingPayouts ?? 0,
      icon: CreditCard,
      color: "text-warning",
    },
    {
      title: t("doctor.monthly_earnings"),
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
          {t("doctor.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("doctor.subtitle")}
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
            {t("doctor.verification_status")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                STATUS_LABELS[data?.verificationStatus || "pendiente"]?.color || ""
              )}
            >
              {t(STATUS_KEYS[data?.verificationStatus || "pendiente"] || "doctor.status_pending")}
            </Badge>
          </div>
          {data?.verificationStatus !== "activo" && (
            <p className="text-xs text-muted-foreground mt-2">
              {t("doctor.verification_link")}{" "}
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