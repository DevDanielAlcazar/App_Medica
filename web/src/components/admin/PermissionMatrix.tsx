"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, X, ShieldAlert, ShieldCheck, Loader2, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/config";

interface PermissionMatrixData {
  matrix: Record<string, Record<string, boolean>>;
  roles: string[];
}

const ACTION_LABELS: Record<string, { label: string; description: string }> = {
  view_dashboard: { label: "Ver Dashboard", description: "Acceso al panel principal" },
  manage_cases: { label: "Gestionar Casos", description: "Crear/editar/expedir expedientes" },
  send_messages: { label: "Enviar Mensajes", description: "Participar en chat de IA" },
  schedule_appointments: { label: "Agendar Citas", description: "Crear y modificar citas" },
  process_payments: { label: "Procesar Pagos", description: "Ver y gestionar transacciones" },
  view_users: { label: "Ver Usuarios", description: "Listar y buscar usuarios" },
  manage_ai_providers: { label: "Gestionar IA", description: "Configurar proveedores y modelos" },
  manage_subscription_plans: { label: "Planes de Suscripción", description: "CRUD de planes y precios" },
  send_notifications: { label: "Enviar Notificaciones", description: "Configurar y disparar emails" },
  manage_support_tickets: { label: "Gestionar Tickets", description: "Atender incidencias de soporte" },
  process_payouts: { label: "Procesar Pagos a Médicos", description: "Revisar y pagar cortes" },
  ban_users: { label: "Banear/Desbanear", description: "Suspender cuentas de usuario" },
  refund_credits: { label: "Reembolsar Créditos", description: "Compensar saldo por soporte" },
};

const ROLE_LABELS: Record<string, string> = {
  paciente: "Paciente",
  medico: "Médico",
  admin: "Admin",
  soporte: "Soporte",
  contabilidad: "Contabilidad",
  superadmin: "Superadmin",
};

export function PermissionMatrix() {
  const { t } = useTranslation();
  const [data, setData] = useState<PermissionMatrixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      const res = await fetch("/api/admin/permisos");
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        toast.error(json.error || t("admin.error_load_permissions"));
      }
    } catch (err) {
      console.error(err);
      setConnectionError(true);
      toast.error(t("admin.error_connection"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const togglePermission = (role: string, actionKey: string, value: boolean) => {
    if (!data) return;
    // superadmin is immutable
    if (role === "superadmin") return;

    setData({
      ...data,
      matrix: {
        ...data.matrix,
        [role]: {
          ...data.matrix[role],
          [actionKey]: value,
        },
      },
    });
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setConnectionError(false);

    const permissions = [];
    for (const role of data.roles) {
      for (const [actionKey, isGranted] of Object.entries(data.matrix[role] || {})) {
        permissions.push({ role, actionKey, isGranted });
      }
    }

    try {
      const res = await fetch("/api/admin/permisos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions }),
      });

      if (res.ok) {
        toast.success(t("admin.permissions_updated"));
      } else {
        toast.error(t("admin.error_save"));
      }
    } catch (err) {
      setConnectionError(true);
      toast.error(t("admin.error_connection"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="glass-panel border-glass-border">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            {t("admin.no_permissions")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-outfit font-bold">
          {t("admin.permission_matrix")}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadPermissions} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("admin.refresh")}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {t("admin.save_changes")}
          </Button>
        </div>
      </div>

      <Card className="glass-panel border-glass-border overflow-x-auto">
        <CardContent className="p-0">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="sticky left-0 bg-surface z-10 p-4 text-left font-semibold min-w-[200px]">
                  {t("admin.action_role")}
                </th>
                {data.roles.map((role) => (
                  <th key={role} className="p-2 text-center min-w-[120px]">
                    <Badge
                      variant={role === "superadmin" ? "default" : "outline"}
                      className={cn(
                        "text-xs",
                        role === "superadmin" && "bg-primary text-primary-foreground"
                      )}
                    >
                      {ROLE_LABELS[role] || role}
                    </Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(ACTION_LABELS).map((actionKey, idx) => {
                const info = ACTION_LABELS[actionKey] || { label: actionKey, description: "" };
                return (
                  <motion.tr
                    key={actionKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-glass-border last:border-0"
                  >
                    <td className="sticky left-0 bg-surface z-10 p-4 font-medium">
                      <div>
                        <div className="text-sm">{info.label}</div>
                        <div className="text-xs text-muted-foreground">{info.description}</div>
                      </div>
                    </td>
                    {data.roles.map((role) => {
                      const isGranted = data.matrix[role]?.[actionKey] ?? false;
                      const disabled = role === "superadmin";

                      return (
                        <td key={role} className="p-2 text-center">
                          <div className="flex items-center justify-center">
                            {disabled ? (
                              <ShieldCheck className="w-5 h-5 text-primary" />
                            ) : isGranted ? (
                              <Check className="w-5 h-5 text-success" />
                            ) : (
                              <X className="w-5 h-5 text-muted-foreground" />
                            )}
                            {!disabled && (
                              <Switch
                                checked={isGranted}
                                onCheckedChange={(val) => togglePermission(role, actionKey, val)}
                                className="ml-2"
                              />
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="glass-panel border-glass-border">
        <CardHeader>
          <CardTitle className="text-sm">
            {t("admin.note")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            {t("admin.superadmin_note")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}