"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Landmark, CheckCircle2, ShieldCheck, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function DoctorPaymentsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [clabe, setClabe] = useState("");
  const [confirmClabe, setConfirmClabe] = useState("");
  
  const [showClabe, setShowClabe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadDoctorProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/doctor/verify");
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setBankName(data.profile.bankName || "");
        setBankAccountName(data.profile.bankAccountName || "");
        setClabe(data.profile.clabe || "");
        setConfirmClabe(data.profile.clabe || "");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorProfile();
  }, []);

  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!bankName.trim() || !bankAccountName.trim() || !clabe.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (clabe.length !== 18 || !/^\d+$/.test(clabe)) {
      setError("La CLABE debe tener exactamente 18 dígitos numéricos.");
      return;
    }

    if (clabe !== confirmClabe) {
      setError("La confirmación de la CLABE no coincide.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/doctor/bank-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName,
          bankAccountName,
          clabe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudieron guardar los datos bancarios.");
      }

      toast.success("Datos bancarios de retiro guardados exitosamente.");
      setProfile(data.profile);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al actualizar los datos bancarios.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Cargando información de pagos...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-outfit font-bold">Pagos y Datos Bancarios</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel border-glass-border bg-background/25">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">
              Información de Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div>
              <span className="text-muted-foreground block">Cédula Registrada</span>
              <span className="text-foreground font-semibold font-mono block mt-1">
                {profile?.cedula || "Pendiente de validación"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Estatus de Cuenta</span>
              <span className="text-foreground font-semibold block mt-1 capitalize">
                {profile?.verificationStatus === "activo" ? "Verificado (Activo)" : profile?.verificationStatus || "Pendiente"}
              </span>
            </div>
            <div className="p-3 bg-muted/20 border border-glass-border rounded-xl text-[10px] text-muted-foreground leading-relaxed">
              <strong>Retiros Contables:</strong> Los cortes se depositan automáticamente a la cuenta CLABE registrada según tus fechas de pago.
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-glass-border bg-background/25">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Landmark className="w-5 h-5 text-secondary" />
              Datos Bancarios para Retiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            <form onSubmit={handleSaveBankDetails} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase">Nombre del Banco</Label>
                <Input
                  placeholder="Ej. BBVA, Santander, Banorte..."
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                  disabled={submitting}
                  className="rounded-xl border-glass-border bg-elevated/35 p-3"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase">Nombre Completo del Titular</Label>
                <Input
                  placeholder="Nombre tal como aparece en tu estado de cuenta"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  required
                  disabled={submitting}
                  className="rounded-xl border-glass-border bg-elevated/35 p-3"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase">Clave Interbancaria (CLABE)</Label>
                  <div className="relative">
                    <Input
                      type={showClabe ? "text" : "password"}
                      placeholder="18 dígitos numéricos"
                      value={clabe}
                      maxLength={18}
                      onChange={(e) => setClabe(e.target.value.replace(/\D/g, ""))}
                      required
                      disabled={submitting}
                      className="rounded-xl border-glass-border bg-elevated/35 p-3 pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowClabe(!showClabe)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showClabe ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase">Confirmar CLABE</Label>
                  <Input
                    type="password"
                    placeholder="Reescribe los 18 dígitos"
                    value={confirmClabe}
                    maxLength={18}
                    onChange={(e) => setConfirmClabe(e.target.value.replace(/\D/g, ""))}
                    required
                    disabled={submitting}
                    className="rounded-xl border-glass-border bg-elevated/35 p-3 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xl text-[10px] text-muted-foreground leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Seguridad de Datos:</strong> De acuerdo a la normativa local, la CLABE interbancaria se valida dos veces y permanece enmascarada durante la confirmación visual.
                </span>
              </div>

              <div className="flex justify-end pt-3 border-t border-glass-border">
                <Button
                  type="submit"
                  disabled={submitting || clabe.length !== 18 || confirmClabe.length !== 18}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 gap-2 px-6"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Guardar Datos Bancarios
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}