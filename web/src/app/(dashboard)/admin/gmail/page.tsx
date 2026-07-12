"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail, ShieldCheck, Loader2, Save, Send, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/providers/LanguageProvider";

export default function GmailConfigPage() {
  const { locale } = useLanguage();

  // Estados de configuración
  const [host, setHost] = useState("smtp.gmail.com");
  const [port, setPort] = useState("587");
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [senderName, setSenderName] = useState("Angélica Med");
  const [enabled, setEnabled] = useState(false);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  // 1. Cargar configuración existente al iniciar
  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/config/gmail");
        const data = await res.json();
        if (data.success && data.config) {
          setHost(data.config.host);
          setPort(data.config.port);
          setUser(data.config.user);
          setPass(data.config.pass);
          setSenderName(data.config.senderName);
          setEnabled(data.config.enabled);
        }
      } catch (err) {
        console.error(err);
        toast.error(locale === "es" ? "Error al cargar la configuración SMTP." : "Failed to load SMTP settings.");
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, [locale]);

  // 2. Guardar configuración
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/config/gmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host, port, user, pass, senderName, enabled }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(locale === "es" ? "Configuración SMTP guardada con éxito." : "SMTP settings saved successfully.");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || (locale === "es" ? "Error al guardar configuración." : "Failed to save settings."));
    } finally {
      setSaving(false);
    }
  };

  // 3. Probar envío de correo
  const handleTestConnection = async () => {
    if (!testEmail) {
      toast.error(locale === "es" ? "Escribe un correo destinatario para la prueba." : "Please enter a test recipient email.");
      return;
    }

    try {
      setTesting(true);
      const res = await fetch("/api/admin/config/gmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host,
          port,
          user,
          pass,
          senderName,
          testRecipient: testEmail,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(locale === "es" ? "¡Conexión SMTP exitosa! Correo de prueba enviado." : "SMTP connection successful! Test email sent.");
      } else {
        throw new Error(data.error || "Falla en autenticación SMTP.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || (locale === "es" ? "Error en la prueba de conexión SMTP." : "SMTP connection test failed."));
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 z-10 relative">
      <div>
        <h1 className="text-3xl font-outfit font-bold flex items-center gap-2">
          <Mail className="w-8 h-8 text-primary" />
          {locale === "es" ? "Notificaciones de Correo (Gmail SMTP)" : "Email Notifications (Gmail SMTP)"}
        </h1>
        <p className="text-muted-foreground">
          {locale === "es"
            ? "Configura las credenciales de correo de la aplicación para notificar a pacientes y médicos sobre citas y reportes."
            : "Configure application email credentials to notify patients and doctors about appointments and support tickets."}
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>{locale === "es" ? "Cargando configuraciones de correo..." : "Loading email configurations..."}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulario Principal */}
          <form onSubmit={handleSave} className="md:col-span-2 space-y-6">
            <Card className="glass-panel border-glass-border">
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === "es" ? "Credenciales de Servidor de Salida" : "Outgoing Mail Server Credentials"}
                </CardTitle>
                <CardDescription>
                  {locale === "es"
                    ? "Completa los parámetros SMTP para habilitar los correos transaccionales."
                    : "Fill in the SMTP parameters to enable transactional emails."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Switch de Estado */}
                <div className="flex items-center justify-between p-4 bg-muted/20 border border-glass-border rounded-xl">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold">
                      {locale === "es" ? "Habilitar Notificaciones por Email" : "Enable Email Notifications"}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {locale === "es"
                        ? "Dispara correos de confirmación en agendamientos, cancelaciones y soporte."
                        : "Trigger confirmation emails on bookings, cancellations, and support resolutions."}
                    </p>
                  </div>
                  <Switch checked={enabled} onCheckedChange={setEnabled} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label>{locale === "es" ? "Servidor SMTP" : "SMTP Host"}</Label>
                    <Input value={host} onChange={(e) => setHost(e.target.value)} required placeholder="smtp.gmail.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{locale === "es" ? "Puerto SMTP" : "SMTP Port"}</Label>
                    <Input value={port} onChange={(e) => setPort(e.target.value)} required placeholder="587" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>{locale === "es" ? "Usuario / Correo Emisor" : "User / Sender Email"}</Label>
                  <Input
                    type="email"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                    placeholder="ejemplo@gmail.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>{locale === "es" ? "Contraseña de Aplicación" : "App Password"}</Label>
                  <Input
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                    placeholder="••••••••••••••••"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    {locale === "es"
                      ? "⚠️ Si usas Gmail, debes generar una 'Contraseña de aplicación' en tu cuenta de Google. Tu contraseña normal de inicio de sesión no funcionará debido al 2FA."
                      : "⚠️ If using Gmail, you must generate an 'App password' in your Google Account. Your normal login password will not work due to 2FA."}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label>{locale === "es" ? "Nombre Remitente Mostrar" : "Display Sender Name"}</Label>
                  <Input
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    required
                    placeholder="Angélica Med"
                  />
                </div>

                <Button type="submit" disabled={saving} className="w-full gap-2 rounded-xl">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {locale === "es" ? "Guardar Configuración" : "Save Settings"}
                </Button>
              </CardContent>
            </Card>
          </form>

          {/* Panel Lateral de Pruebas */}
          <div className="space-y-6">
            <Card className="glass-panel border-glass-border h-full bg-background/35 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  {locale === "es" ? "Probar Conexión" : "Test Connection"}
                </CardTitle>
                <CardDescription>
                  {locale === "es"
                    ? "Envía un correo de prueba instantáneo para comprobar la validez de los parámetros."
                    : "Send an instant test email to verify server settings validity."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{locale === "es" ? "Correo Destinatario" : "Recipient Email"}</Label>
                  <Input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="destinatario@correo.com"
                  />
                </div>

                <Button
                  onClick={handleTestConnection}
                  disabled={testing}
                  variant="secondary"
                  className="w-full gap-2 rounded-xl border border-glass-border hover:bg-muted"
                >
                  {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {locale === "es" ? "Enviar Correo Prueba" : "Send Test Email"}
                </Button>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-[10.5px] text-amber-500 rounded-xl leading-relaxed flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    {locale === "es"
                      ? "Nota: Probar los datos cargará los campos del formulario de la izquierda de forma dinámica para el envío sin necesidad de guardarlos primero en la DB."
                      : "Note: Testing will dynamically load the fields from the form on the left for verification without saving them to the DB first."}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
