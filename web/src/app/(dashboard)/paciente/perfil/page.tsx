"use client";

import { useUserStore } from "@/stores/userStore";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Trash2, Download } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUserStore();

  return (
    <div className="max-w-3xl mx-auto z-10 relative space-y-8">
      <div>
        <h1 className="text-3xl font-outfit font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información y preferencias</p>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-glass-border flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
          {user?.name?.[0] || "P"}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.name || "Paciente Demo"}</h2>
          <p className="text-muted-foreground">{user?.email || "paciente@demo.com"}</p>
          <div className="mt-2 text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-md inline-block">
            Plan Premium
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-glass-border space-y-4">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Preferencias</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tema de la aplicación</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Idioma preferido</span>
            <LanguageToggle />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-glass-border space-y-4">
          <h3 className="font-semibold text-lg border-b border-border pb-2">Datos Personales</h3>
          <div className="space-y-2">
            <Label>Teléfono</Label>
            <Input defaultValue="+52 55 1234 5678" />
          </div>
          <div className="space-y-2">
            <Label>Fecha de nacimiento</Label>
            <Input type="date" defaultValue="1990-01-01" />
          </div>
          <Button className="w-full">Guardar Cambios</Button>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-destructive/20 bg-destructive/5 space-y-4">
        <h3 className="font-semibold text-lg text-destructive border-b border-destructive/10 pb-2">Zona de Peligro</h3>
        <p className="text-sm text-muted-foreground">Estas acciones son irreversibles y afectarán tu historial médico.</p>
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            <Download className="w-4 h-4" /> Descargar Mis Datos
          </Button>
          <Button variant="destructive" className="gap-2 w-full sm:w-auto ml-auto">
            <Trash2 className="w-4 h-4" /> Eliminar Cuenta
          </Button>
        </div>
      </div>

      <div className="pt-4 border-t border-glass-border">
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-2">
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
