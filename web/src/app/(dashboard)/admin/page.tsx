"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ShieldAlert, HeartPulse, CreditCard, Sparkles, Mail, ShieldCheck, Loader2, PlayCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/providers/LanguageProvider";

interface DashboardStats {
  totalUsers: number;
  patientsCount: number;
  doctorsCount: number;
  pendingDoctors: number;
  activeCases: number;
  smtpEnabled: boolean;
  aiProvidersCount: number;
  aiModelsCount: number;
  totalRevenue: number;
  eligiblePurgeCount: number;
}

export default function AdminDashboardPage() {
  const { locale } = useLanguage();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estatus de la purga
  const [purging, setPurging] = useState(false);
  const [purgeLogs, setPurgeLogs] = useState<string[]>([]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/dashboard/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      } else {
        toast.error(locale === "es" ? "Error al obtener estadísticas." : "Failed to load statistics.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de comunicación con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [locale]);

  // Ejecutar el Job de Purga de Privacidad
  const handleExecutePurge = async () => {
    const confirmation = window.confirm(
      locale === "es"
        ? "⚠️ ¿Deseas ejecutar el job de purga? Esto eliminará de forma irreversible y permanente todos los expedientes clínicos curados o archivados con más de 6 meses de inactividad, junto con sus mensajes e historial de citas."
        : "⚠️ Do you want to run the purge job? This will irreversibly and permanently delete all cured or archived clinical files with more than 6 months of inactivity, along with their messages and appointments history."
    );
    if (!confirmation) return;

    try {
      setPurging(true);
      setPurgeLogs([locale === "es" ? "⏳ Iniciando job de purga..." : "⏳ Starting purge job..."]);
      
      const res = await fetch("/api/admin/jobs/purge-cases", { method: "POST" });
      const data = await res.json();

      if (res.ok && data.success) {
        setPurgeLogs((prev) => [
          ...prev,
          locale === "es" 
            ? `✅ Éxito: Se eliminaron permanentemente ${data.purgedCount} expedientes inactivos.`
            : `✅ Success: Permanently deleted ${data.purgedCount} inactive clinical files.`,
          locale === "es" ? "🔒 Bitácora de auditoría actualizada (SYSTEM_PURGE_CASES)." : "🔒 Audit log entry recorded (SYSTEM_PURGE_CASES)."
        ]);
        toast.success(
          locale === "es" 
            ? `Purga completada. ${data.purgedCount} casos eliminados.` 
            : `Purge completed. ${data.purgedCount} cases deleted.`
        );
        // Recargar estadísticas
        await loadStats();
      } else {
        throw new Error(data.message || "Falla en el servidor al ejecutar la purga.");
      }
    } catch (err: any) {
      console.error(err);
      setPurgeLogs((prev) => [...prev, `❌ Error: ${err.message}`]);
      toast.error(locale === "es" ? "Error al ejecutar purga." : "Purge execution failed.");
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 z-10 relative">
      <div>
        <h1 className="text-3xl font-outfit font-bold">{locale === "es" ? "Consola de Control Administrador" : "Admin Control Console"}</h1>
        <p className="text-muted-foreground">
          {locale === "es" ? "Métricas clave, salud del sistema y herramientas de cumplimiento de privacidad." : "Key metrics, system health, and privacy compliance tools."}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>{locale === "es" ? "Cargando métricas de administración..." : "Retrieving administration metrics..."}</span>
        </div>
      ) : (
        stats && (
          <div className="space-y-6">
            {/* Fila de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-panel border-glass-border bg-background/25">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
                    {locale === "es" ? "Usuarios Registrados" : "Registered Users"}
                  </CardTitle>
                  <Users className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-outfit">{stats.totalUsers}</div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {stats.patientsCount} {locale === "es" ? "Pacientes" : "Patients"} | {stats.doctorsCount} {locale === "es" ? "Médicos" : "Doctors"}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-glass-border bg-background/25">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
                    {locale === "es" ? "Casos Clínicos Activos" : "Active Clinical Cases"}
                  </CardTitle>
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-outfit">{stats.activeCases}</div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {locale === "es" ? "Consultas en curso con la IA" : "Consultations currently active with AI"}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-glass-border bg-background/25">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
                    {locale === "es" ? "Pendientes de Validación" : "Pending Verification"}
                  </CardTitle>
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-outfit">{stats.pendingDoctors}</div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {locale === "es" ? "Médicos con cédulas por revisar" : "Doctors with credentials to review"}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-panel border-glass-border bg-background/25">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
                    {locale === "es" ? "Ingresos Estimados" : "Estimated Revenue"}
                  </CardTitle>
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold font-outfit">${stats.totalRevenue} MXN</div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {locale === "es" ? "Acumulado por recargas en Wallet" : "Accumulated from Wallet recharges"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Fila de Herramientas de Control */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Compliance de Privacidad (Purga de Datos 6 Meses) */}
              <Card className="glass-panel border-glass-border bg-background/25 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    {locale === "es" ? "Cumplimiento de Privacidad (GDPR / NOM-024)" : "Privacy Compliance (GDPR / NOM-024)"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "es"
                      ? "Control de eliminación de expedientes clínicos inactivos para garantizar el Derecho al Olvido."
                      : "Control elimination of inactive clinical records to guarantee the Right to be Forgotten."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/20 border border-glass-border rounded-xl gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-muted-foreground uppercase">{locale === "es" ? "Expedientes Candidatos a Purgar" : "Eligible Case Purges"}</span>
                      <div className="text-2xl font-bold text-foreground">
                        {stats.eligiblePurgeCount} {locale === "es" ? "expedientes" : "files"}
                      </div>
                      <p className="text-[10.5px] text-muted-foreground">
                        {locale === "es" 
                          ? "Casos marcados como 'Curado' o 'Archivado' con más de 6 meses sin actividad."
                          : "Cases marked 'Cured' or 'Archived' with over 6 months of inactivity."}
                      </p>
                    </div>

                    <Button
                      onClick={handleExecutePurge}
                      disabled={purging || stats.eligiblePurgeCount === 0}
                      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl w-full sm:w-auto"
                    >
                      {purging ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                      {locale === "es" ? "Ejecutar Purga de Datos" : "Run Data Purge"}
                    </Button>
                  </div>

                  {/* Logs interactivos del job */}
                  {purgeLogs.length > 0 && (
                    <div className="bg-black/40 border border-glass-border p-3 rounded-xl font-mono text-[11px] text-emerald-400 space-y-1">
                      {purgeLogs.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 bg-primary/10 border border-primary/20 text-xs rounded-xl flex gap-2.5 leading-relaxed text-foreground">
                    <Info className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                    <span>
                      {locale === "es"
                        ? "La eliminación de un expediente clínico realiza un borrado en cascada irreversible sobre los mensajes del chat y el historial de citas asociadas para asegurar privacidad total."
                        : "Deleting a clinical file triggers an irreversible cascading deletion over chat messages and associated appointments to guarantee full privacy."}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Estado de Configuración del Servidor */}
              <Card className="glass-panel border-glass-border bg-background/35 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {locale === "es" ? "Salud de Integraciones" : "Integration Health"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "es" ? "Monitoreo del Gateway y Notificaciones." : "Gateway and notification services status."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Correo */}
                  <div className="flex items-center justify-between border-b border-glass-border pb-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-muted-foreground uppercase">{locale === "es" ? "Notificaciones SMTP" : "SMTP Notifications"}</span>
                      <span className="text-xs block text-foreground">
                        {stats.smtpEnabled 
                          ? (locale === "es" ? "Habilitadas y conectadas" : "Enabled & Connected")
                          : (locale === "es" ? "Deshabilitadas" : "Disabled")}
                      </span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${stats.smtpEnabled ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
                  </div>

                  {/* AI Gateway */}
                  <div className="flex items-center justify-between border-b border-glass-border pb-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-muted-foreground uppercase">{locale === "es" ? "Proveedores IA Activos" : "Active AI Providers"}</span>
                      <span className="text-xs block text-foreground">
                        {stats.aiProvidersCount} {locale === "es" ? "activos" : "active"}
                      </span>
                    </div>
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>

                  {/* Modelos */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-muted-foreground uppercase">{locale === "es" ? "Modelos Enrutables" : "Routable Models"}</span>
                      <span className="text-xs block text-foreground">
                        {stats.aiModelsCount} {locale === "es" ? "modelos sincronizados" : "models synced"}
                      </span>
                    </div>
                    <Mail className="w-4 h-4 text-secondary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      )}
    </div>
  );
}
