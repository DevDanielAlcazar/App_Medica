"use client";

import { useUserStore } from "@/stores/userStore";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Trash2, Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useLanguage } from "@/providers/LanguageProvider";

export default function ProfilePage() {
  const { user, logout } = useUserStore();
  const router = useRouter();
  const { t, locale } = useLanguage();

  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const handleDownloadData = async () => {
    try {
      setDownloading(true);
      const res = await fetch("/api/patient/profile/export");
      if (!res.ok) throw new Error("No se pudieron exportar los datos.");
      const data = await res.json();
      
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data.data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `expediente_angelica_med_${user?.name?.replace(/\s+/g, "_") || "paciente"}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success(locale === "es" ? "Datos médicos descargados con éxito." : "Medical data downloaded successfully.");
    } catch (err) {
      console.error(err);
      toast.error(locale === "es" ? "Error al descargar tus datos médicos." : "Failed to export medical data.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      locale === "es"
        ? "⚠️ ¿Estás completamente seguro de que deseas eliminar tu cuenta permanentemente? Se borrarán de forma irreversible tu expediente clínico, tus créditos, tus citas y tus recordatorios."
        : "⚠️ Are you completely sure you want to permanently delete your account? Your clinical file, credits, appointments, and reminders will be irreversibly erased."
    );
    if (!confirmation) return;

    try {
      setDeleting(true);
      const res = await fetch("/api/patient/profile/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar la cuenta.");
      
      toast.success(locale === "es" ? "Tu cuenta ha sido eliminada. Redirigiendo..." : "Your account has been deleted. Redirecting...");
      setTimeout(() => {
        logout();
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error(locale === "es" ? "Error al eliminar tu cuenta. Por favor contacta a soporte." : "Failed to delete account. Please contact support.");
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto z-10 relative space-y-8">
      <div>
        <h1 className="text-3xl font-outfit font-bold">{t("profile.title")}</h1>
        <p className="text-muted-foreground">
          {locale === "es" ? "Gestiona tu información y preferencias" : "Manage your information and preferences"}
        </p>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-glass-border flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
          {user?.name?.[0] || "P"}
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.name || "Paciente Demo"}</h2>
          <p className="text-muted-foreground">{user?.email || "paciente@demo.com"}</p>
          <div className="mt-2 text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-md inline-block">
            {locale === "es" ? "Plan Premium" : "Premium Plan"}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-glass-border space-y-4">
          <h3 className="font-semibold text-lg border-b border-border pb-2">{t("profile.preferences")}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {locale === "es" ? "Tema de la aplicación" : "Application Theme"}
            </span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {locale === "es" ? "Idioma preferido" : "Preferred Language"}
            </span>
            <LanguageToggle />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-glass-border space-y-4">
          <h3 className="font-semibold text-lg border-b border-border pb-2">{t("profile.personal_data")}</h3>
          <div className="space-y-2">
            <Label>{locale === "es" ? "Teléfono" : "Phone"}</Label>
            <Input defaultValue="+52 55 1234 5678" />
          </div>
          <div className="space-y-2">
            <Label>{locale === "es" ? "Fecha de nacimiento" : "Date of birth"}</Label>
            <Input type="date" defaultValue="1990-01-01" />
          </div>
          <Button className="w-full">{t("profile.save_btn")}</Button>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-xl border border-destructive/20 bg-destructive/5 space-y-4">
        <h3 className="font-semibold text-lg text-destructive border-b border-destructive/10 pb-2">
          {locale === "es" ? "Zona de Peligro" : "Danger Zone"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {locale === "es" ? "Estas acciones son irreversibles y afectarán tu historial médico." : "These actions are irreversible and will affect your medical history."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <Button variant="outline" className="gap-2 w-full sm:w-auto" onClick={handleDownloadData} disabled={downloading}>
            {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {t("profile.download_data")}
          </Button>
          <Button variant="destructive" className="gap-2 w-full sm:w-auto ml-auto" onClick={handleDeleteAccount} disabled={deleting}>
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {t("profile.delete_account")}
          </Button>
        </div>
      </div>

      <div className="pt-4 border-t border-glass-border">
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-foreground gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" /> {t("nav.logout")}
        </Button>
      </div>
    </div>
  );
}
