"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadDoctorProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/doctor/verify");
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setName(data.profile.name || "");
        setPhone(data.profile.phone || "");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar los datos del perfil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar perfil");
      toast.success("Perfil actualizado");
      setProfile(data.profile);
    } catch (err: any) {
      setError(err.message || "Error al actualizar");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Cargando perfil profesional...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-outfit font-bold">Perfil Profesional</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel border-glass-border bg-background/25">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">
              Información Personal
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
          </CardContent>
        </Card>

        <Card className="glass-panel border-glass-border bg-background/25">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Editar Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-xl text-xs font-semibold flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Nombre</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={submitting}
                  className="rounded-xl border-glass-border bg-elevated/35 p-3"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Teléfono</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={submitting}
                  placeholder="Opcional"
                  className="rounded-xl border-glass-border bg-elevated/35 p-3"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Email</label>
                <Input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="rounded-xl border-glass-border bg-muted/20 p-3"
                />
              </div>
              <div className="flex justify-end pt-3 border-t border-glass-border">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}