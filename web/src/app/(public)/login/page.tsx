"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useUserStore();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Algo salió mal.");
      }

      // Guardar el usuario en el store de Zustand
      setUser(data.user, data.user.role);

      // Redireccionar al dashboard correspondiente. 
      // Usar window.location.href para limpiar cachés de Next y forzar que el middleware lea las cookies frescas.
      const redirectPath = data.user.role === "superadmin" ? "/admin" : `/${data.user.role}`;
      window.location.href = redirectPath;
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 py-12">
      {/* Botones de Navegación Superiores fuera de la Tarjeta */}
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

        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-2xl font-outfit font-bold">Bienvenido a Angélica</h1>
          <p className="text-muted-foreground mt-2">Ingresa a tu cuenta</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20 text-center font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="nombre@ejemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link href="#" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full mt-6" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Crear cuenta
          </Link>
        </div>

        <div className="mt-8 pt-4 border-t border-glass-border">
          <p className="text-xs text-center text-muted-foreground/80 leading-relaxed">
            Angélica Med es un asistente informativo. No sustituye el diagnóstico ni tratamiento de un profesional de la salud.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
