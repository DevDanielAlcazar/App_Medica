"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { MOTIVATIONAL_PHRASES } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Calendar as CalendarIcon, CreditCard } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardData {
  balance: number;
  activeCasesCount: number;
  nextAppointment: {
    id: string;
    doctorName: string;
    dateTime: string;
  } | null;
  recentActivity: Array<{
    id: string;
    action: string;
    updatedAt: string;
  }>;
}

export default function PatientHomePage() {
  const { user } = useUserStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/patient/dashboard")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
        }
      })
      .catch((err) => console.error("Error cargando datos del dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  // Selección de frase motivacional
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const phrase = MOTIVATIONAL_PHRASES[dayOfYear % MOTIVATIONAL_PHRASES.length] || "Tu salud es tu mayor tesoro. Hoy es un buen día para cuidarte.";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 z-10 relative">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-outfit font-bold mb-2">
          Buenos días, {user?.name || "Paciente"}.
        </h1>
        <p className="text-muted-foreground text-lg">{phrase}</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <motion.div variants={item}>
          <Card className="glass-panel border-glass-border h-full hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Casos Activos</CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse h-8 bg-muted rounded w-12" />
              ) : (
                <div className="text-2xl font-bold">{data?.activeCasesCount ?? 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">Casos clínicos en curso</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-panel border-glass-border h-full hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Próxima Cita</CardTitle>
              <CalendarIcon className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-6 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-20" />
                </div>
              ) : data?.nextAppointment ? (
                <>
                  <div className="text-xl font-bold line-clamp-1">Dr. {data.nextAppointment.doctorName}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(data.nextAppointment.dateTime).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-sm font-semibold text-muted-foreground">Sin citas programadas</div>
                  <p className="text-xs text-muted-foreground mt-1">Citas médicas pendientes</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-panel border-glass-border h-full hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Wallet</CardTitle>
              <CreditCard className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse h-8 bg-muted rounded w-24" />
              ) : (
                <div className="text-2xl font-bold">{data?.balance ?? 0} Créditos</div>
              )}
              <Link href="/paciente/wallet" className="text-xs text-primary hover:underline mt-1 block">
                Comprar más
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Link href="/paciente/consulta" className="block w-full">
          <Button size="lg" className="w-full py-8 text-xl rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-lg group">
            Iniciar Nueva Consulta
            <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-outfit font-bold text-xl mt-12 mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse glass-panel p-4 rounded-xl border border-glass-border flex items-center justify-between">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-16" />
              </div>
            ))
          ) : data?.recentActivity && data.recentActivity.length > 0 ? (
            data.recentActivity.map((activity) => (
              <div key={activity.id} className="glass-panel p-4 rounded-xl border border-glass-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">{activity.action}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(activity.updatedAt).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          ) : (
            <div className="glass-panel p-6 rounded-xl border border-glass-border text-center text-sm text-muted-foreground">
              No tienes actividad clínica reciente.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
