"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck, AlertCircle, Award, Eye, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function DoctorVerificationPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Formulario de envío
  const [cedula, setCedula] = useState("");
  const [ineFront, setIneFront] = useState("");
  const [ineBack, setIneBack] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadVerificationStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/doctor/verify");
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        setCedula(data.profile.cedula || "");
        setIneFront(data.profile.ineFront || "");
        setIneBack(data.profile.ineBack || "");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar la información de verificación.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cedula.trim()) {
      setError("La cédula profesional es requerida.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const res = await fetch("/api/doctor/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cedula,
          // Simular urls de archivos si no hay subidas físicas
          ineFront: ineFront || "https://angelicamed.com/uploads/mock-ine-front.jpg",
          ineBack: ineBack || "https://angelicamed.com/uploads/mock-ine-back.jpg",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo procesar la verificación.");
      }

      toast.success("Documentos enviados. Tu perfil está en revisión.");
      setProfile(data.profile);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al enviar los documentos.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Consultando credenciales de validación...</span>
      </div>
    );
  }

  const status = profile?.verificationStatus || "pendiente";

  return (
    <div className="max-w-4xl mx-auto space-y-6 z-10 relative">
      <h1 className="text-3xl font-outfit font-bold">Verificación Profesional</h1>

      <AnimatePresence mode="wait">
        {/* ESTADO: ACTIVO (Verificado) */}
        {status === "activo" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-emerald-500/10 border-2 border-emerald-500/40 rounded-2xl flex flex-col md:flex-row items-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
                Perfil Verificado Exitosamente <Award className="w-5 h-5 text-emerald-500" />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ¡Felicidades! Tus credenciales médicas (Cédula: <strong>{profile.cedula}</strong>) han sido validadas por el comité clínico de Angélica Med. Tu perfil se encuentra activo para dar consultas y recibir agendamientos.
              </p>
            </div>
          </motion.div>
        )}

        {/* ESTADO: EN REVISIÓN */}
        {status === "en_revision" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-primary/10 border border-primary/30 rounded-2xl flex flex-col md:flex-row items-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0 animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground">Documentos en Revisión</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hemos recibido tu cédula profesional (<strong>{profile.cedula}</strong>) e identificaciones. Tu cuenta se encuentra en revisión médica y legal. Este proceso suele tomar de 12 a 24 horas. Te notificaremos al activar tu cuenta.
              </p>
            </div>
          </motion.div>
        )}

        {/* ESTADO: RECHAZADO */}
        {status === "rechazado" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-destructive/10 border border-destructive/30 rounded-2xl flex flex-col md:flex-row items-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-bold text-destructive">Verificación Rechazada</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Lamentablemente, el proceso de validación falló porque los documentos cargados no coinciden con los registros nacionales de cédulas profesionales. Por favor verifica tus datos e inténtalo de nuevo.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario (Solo si está Pendiente o Rechazado) */}
      {(status === "pendiente" || status === "rechazado") && (
        <Card className="glass-panel border-glass-border bg-background/25">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Subir Documentación Profesional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitVerification} className="space-y-5">
              {/* Cédula */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase">Cédula Profesional</label>
                <Input
                  placeholder="Ej. 12345678"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  required
                  disabled={submitting}
                  className="rounded-xl border-glass-border bg-elevated/50 p-3"
                />
                <span className="text-[10px] text-muted-foreground block">
                  El número de cédula será validado contra el registro nacional de profesiones de tu país configurado.
                </span>
              </div>

              {/* Subidas de INE (Simuladas en la UI v1) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* INE Frente */}
                <div className="border border-dashed border-glass-border rounded-xl p-6 text-center space-y-3 bg-elevated/20 hover:bg-elevated/40 transition-colors">
                  <span className="text-xs font-bold text-muted-foreground uppercase block">Identificación Oficial (Frente)</span>
                  <div className="flex flex-col items-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="rounded-lg gap-1.5">
                      <Plus className="w-4 h-4" /> Seleccionar Archivo
                    </Button>
                    <span className="text-[10px] text-muted-foreground block">Soporta JPG, PNG, PDF (Máx 5MB)</span>
                  </div>
                </div>

                {/* INE Reverso */}
                <div className="border border-dashed border-glass-border rounded-xl p-6 text-center space-y-3 bg-elevated/20 hover:bg-elevated/40 transition-colors">
                  <span className="text-xs font-bold text-muted-foreground uppercase block">Identificación Oficial (Reverso)</span>
                  <div className="flex flex-col items-center gap-2">
                    <Button type="button" variant="outline" size="sm" className="rounded-lg gap-1.5">
                      <Plus className="w-4 h-4" /> Seleccionar Archivo
                    </Button>
                    <span className="text-[10px] text-muted-foreground block">Soporta JPG, PNG, PDF (Máx 5MB)</span>
                  </div>
                </div>
              </div>

              {/* Botón Guardar */}
              <Button
                type="submit"
                disabled={submitting || !cedula.trim()}
                className="w-full md:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 gap-2 shrink-0"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Enviar a Revisión Médica
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// React lazy wrapper or fake presence wrapper just to make Framer Motion happy
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
