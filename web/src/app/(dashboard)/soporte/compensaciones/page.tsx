"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, Coins, UserCheck, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/providers/LanguageProvider";

interface PatientData {
  id: string;
  name: string;
  email: string;
  role: string;
  wallet: {
    id: string;
    balance: number;
  } | null;
}

export default function SupportCompensationsPage() {
  const { locale } = useLanguage();
  
  // Estados de Búsqueda
  const [searchEmail, setSearchEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [patient, setPatient] = useState<PatientData | null>(null);

  // Estados de Formulario de Abono
  const [credits, setCredits] = useState("200");
  const [reason, setReason] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. Buscar paciente por email
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;

    try {
      setSearching(true);
      setPatient(null);
      const res = await fetch(`/api/support/compensations?email=${encodeURIComponent(searchEmail.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setPatient(data.patient);
      } else {
        throw new Error(data.error || "No se encontró el paciente.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error al buscar el usuario.");
    } finally {
      setSearching(false);
    }
  };

  // 2. Procesar abono de créditos
  const handleAwardCompensation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !credits || parseInt(credits, 10) <= 0) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/support/compensations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          amount: parseInt(credits, 10),
          ticketId: ticketId || null,
          reason
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "Compensación aplicada correctamente.");
        // Actualizar balance localmente
        setPatient((prev) =>
          prev && prev.wallet
            ? {
                ...prev,
                wallet: {
                  ...prev.wallet,
                  balance: data.walletBalance
                }
              }
            : prev
        );
        // Limpiar campos
        setReason("");
        setTicketId("");
      } else {
        throw new Error(data.error || "No se pudo abonar la compensación.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error al aplicar compensación.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 z-10 relative">
      <div>
        <h1 className="text-3xl font-outfit font-bold">{locale === "es" ? "Ajustes y Compensaciones Manuales" : "Manual Wallet Adjustments"}</h1>
        <p className="text-muted-foreground text-sm">
          {locale === "es" ? "Acredita créditos de compensación a pacientes ante incidencias técnicas o reclamos de citas." : "Credit compensation points to patient Wallets due to technical discrepancies."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel de Búsqueda */}
        <div className="space-y-6">
          <Card className="glass-panel border-glass-border bg-background/25">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-muted-foreground uppercase">
                {locale === "es" ? "Buscar Cuenta de Paciente" : "Find Patient Account"}
              </CardTitle>
              <CardDescription>
                {locale === "es" ? "Ingresa el correo electrónico para consultar su billetera." : "Input the email to query their wallet status."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{locale === "es" ? "Correo Electrónico" : "Email Address"}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      required
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      placeholder="paciente@correo.com"
                      className="bg-muted/10 border-glass-border rounded-xl text-xs"
                    />
                    <Button type="submit" disabled={searching} className="rounded-xl px-3 bg-primary text-primary-foreground">
                      {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Información del paciente encontrado */}
          {patient && (
            <Card className="glass-panel border-glass-border bg-background/25">
              <CardHeader>
                <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  {locale === "es" ? "Usuario Cargado" : "User Loaded"}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1">
                  <span className="text-muted-foreground block uppercase text-[9px] font-bold">{locale === "es" ? "Nombre completo" : "Full Name"}</span>
                  <span className="text-foreground font-semibold block">{patient.name}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground block uppercase text-[9px] font-bold">{locale === "es" ? "Rol en sistema" : "System Role"}</span>
                  <span className="text-primary font-semibold block capitalize">{patient.role}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground block uppercase text-[9px] font-bold">{locale === "es" ? "Saldo de Wallet" : "Wallet Balance"}</span>
                  <span className="text-foreground text-sm font-bold block flex items-center gap-1">
                    <Coins className="w-4 h-4 text-emerald-500" />
                    {patient.wallet ? `${patient.wallet.balance} créditos` : "Sin Wallet"}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Formulario de abono de compensación */}
        <div className="md:col-span-2">
          {patient ? (
            <Card className="glass-panel border-glass-border bg-background/25">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-1.5">
                  <Coins className="w-5 h-5 text-emerald-500" />
                  {locale === "es" ? "Formulario de Ajuste de Créditos" : "Credit Ledger Adjustment"}
                </CardTitle>
                <CardDescription>
                  {locale === "es" ? "Abonarás saldo directamente a la billetera de" : "You will manually award points to the wallet of"} <strong>{patient.name}</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAwardCompensation} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>{locale === "es" ? "Créditos a Abonar" : "Credits to Award"}</Label>
                      <Input
                        type="number"
                        min="1"
                        required
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        placeholder="200"
                        className="bg-muted/10 border-glass-border rounded-xl text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{locale === "es" ? "Ticket de Soporte ID (Opcional)" : "Linked Ticket ID (Optional)"}</Label>
                      <Input
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                        placeholder="Ej. d41d8cd9..."
                        className="bg-muted/10 border-glass-border rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>{locale === "es" ? "Motivo del Ajuste" : "Justification / Reason"}</Label>
                    <textarea
                      required
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      placeholder={locale === "es" ? "Detalla con precisión el motivo de la compensación (ej: Cita con médico cancelada de forma tardía, incidencia técnica en el video)" : "Detail clearly the compensation reason (e.g. late doctor cancellation, Meet video error)"}
                      className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting || parseInt(credits, 10) <= 0 || !reason.trim()}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    {locale === "es" ? "Aplicar y Firmar Compensación" : "Approve & Sign Adjustment"}
                  </Button>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-500 rounded-xl leading-relaxed flex gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      {locale === "es"
                        ? "Esta acción es inmutable y quedará auditada bajo tu usuario como agente de soporte. La contabilidad y trazabilidad legal de créditos son obligatorias."
                        : "This action is immutable and will be audited under your support agent account. Credit compliance and legal traceability are mandatory."}
                    </span>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="border border-dashed border-glass-border rounded-2xl p-16 text-center text-muted-foreground bg-background/10 h-full flex flex-col items-center justify-center">
              <Coins className="w-12 h-12 text-primary/40 mb-3" />
              <h3 className="font-bold text-foreground">{locale === "es" ? "Ajustador de Créditos" : "Wallet Adjuster"}</h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
                {locale === "es"
                  ? "Busca un correo electrónico de paciente a la izquierda para cargar su balance e iniciar la consola de abonos."
                  : "Search for a patient email on the left to load their balance and start the credits adjustment panel."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
