"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, Stethoscope, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { useUserStore } from "@/stores/userStore";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"paciente" | "medico" | null>(null);
  
  // Estados para los campos de registro
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cedula, setCedula] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const { setUser } = useUserStore();

  const nextStep = () => setStep((s) => Math.min(s + 1, role === "medico" ? 3 : 2));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, cedula }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Hubo un error al procesar el registro.");
      }

      if (role === "paciente") {
        setSuccess("¡Cuenta de paciente creada! Iniciando sesión...");
        
        // Autologuear al paciente de inmediato
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        
        if (loginRes.ok) {
          setUser(loginData.user, loginData.user.role);
          window.location.href = "/paciente";
        } else {
          window.location.href = "/login";
        }
      } else {
        setSuccess("¡Cuenta de médico registrada con éxito! Tu cédula profesional entrará en revisión humana. Redirigiendo al login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 4000);
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg relative z-10 py-12">
      {/* Botones de Navegación Superiores */}
      <div className="absolute top-0 left-0">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-glass-border shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Inicio
        </Link>
      </div>

      <div className="absolute top-0 right-0 flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl border border-glass-border shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-500" />

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            {step > 1 && !loading && (
              <button onClick={prevStep} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl font-outfit font-bold">Crear Cuenta</h1>
          </div>
          <div className="flex gap-2">
            {[1, 2, role === "medico" ? 3 : null].filter(Boolean).map((s, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  step >= (s as number) ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20 text-center font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-500 text-sm border border-green-500/20 text-center font-medium">
            {success}
          </div>
        )}

        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
                onSubmit={(e) => { e.preventDefault(); nextStep(); }}
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  Continuar <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <p className="text-muted-foreground text-center">Selecciona tu perfil</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setRole("paciente")}
                    className={cn(
                      "p-6 rounded-xl border flex flex-col items-center gap-4 transition-all",
                      role === "paciente"
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    )}
                    disabled={loading}
                  >
                    <Heart className="w-8 h-8" />
                    <span className="font-semibold">Paciente</span>
                  </button>
                  <button
                    onClick={() => setRole("medico")}
                    className={cn(
                      "p-6 rounded-xl border flex flex-col items-center gap-4 transition-all",
                      role === "medico"
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    )}
                    disabled={loading}
                  >
                    <Stethoscope className="w-8 h-8" />
                    <span className="font-semibold">Médico</span>
                  </button>
                </div>
                <Button
                  onClick={role === "medico" ? nextStep : handleRegister}
                  disabled={!role || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : role === "medico" ? (
                    "Continuar"
                  ) : (
                    "Finalizar Registro"
                  )}
                </Button>
              </motion.div>
            )}

            {step === 3 && role === "medico" && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
                onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
              >
                <div className="space-y-2">
                  <Label htmlFor="cedula">Cédula Profesional</Label>
                  <Input 
                    id="cedula" 
                    placeholder="Escribe tu número de cédula"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    required 
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Documento de Identidad (INE/Pasaporte)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-sm text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                    Click o arrastra tu documento aquí
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    Tus documentos se almacenan de forma segura y cifrada.
                  </p>
                </div>
                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando médico...
                    </>
                  ) : (
                    "Finalizar Registro"
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 pt-4 border-t border-glass-border">
          <p className="text-xs text-center text-muted-foreground/80 leading-relaxed">
            Al registrarte, aceptas nuestros <Link href="/privacy-policy" className="underline">Términos</Link> y <Link href="/privacy-policy" className="underline">Política de Privacidad</Link>.
            <br/><br/>
            Angélica Med es un asistente informativo. No sustituye el diagnóstico ni tratamiento de un profesional de la salud.
          </p>
        </div>
      </motion.div>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Inicia Sesión
        </Link>
      </div>
    </div>
  );
}
