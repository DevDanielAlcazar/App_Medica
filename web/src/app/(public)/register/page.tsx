"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, Stethoscope, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"paciente" | "medico" | null>(null);

  const nextStep = () => setStep((s) => Math.min(s + 1, role === "medico" ? 3 : 2));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="w-full max-w-lg relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-2xl border border-glass-border shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-500" />

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            {step > 1 && (
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
                  <Input id="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full mt-4">
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
                  >
                    <Stethoscope className="w-8 h-8" />
                    <span className="font-semibold">Médico</span>
                  </button>
                </div>
                <Button
                  onClick={role === "medico" ? nextStep : undefined}
                  disabled={!role}
                  className="w-full"
                >
                  {role === "medico" ? "Continuar" : "Finalizar Registro"}
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
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="space-y-2">
                  <Label htmlFor="cedula">Cédula Profesional</Label>
                  <Input id="cedula" required />
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
                <Button type="submit" className="w-full mt-4">
                  Finalizar Registro
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 pt-4 border-t border-glass-border">
          <p className="text-xs text-center text-muted-foreground/80 leading-relaxed">
            Al registrarte, aceptas nuestros <Link href="/terms" className="underline">Términos</Link> y <Link href="/privacy-policy" className="underline">Política de Privacidad</Link>.
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
