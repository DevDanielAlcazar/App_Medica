"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertCircle, CheckCircle, ShieldAlert, Sparkles, ArrowRight, UserCheck, Inbox } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";

interface Ticket {
  id: string;
  status: string;
  priority: string;
  category: string;
}

export default function SupportDashboard() {
  const { locale } = useLanguage();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        setLoading(true);
        const res = await fetch("/api/support/tickets");
        const data = await res.json();
        if (data.success) {
          setTickets(data.tickets);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  const total = tickets.length;
  const openCount = tickets.filter(t => t.status === "open").length;
  const inProgressCount = tickets.filter(t => t.status === "in_progress").length;
  const resolvedCount = tickets.filter(t => t.status === "resolved" || t.status === "closed").length;
  const criticalCount = tickets.filter(t => t.priority === "critical" && t.status !== "closed" && t.status !== "resolved").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 z-10 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-outfit font-bold">{locale === "es" ? "Centro de Atención de Soporte" : "Support Care Hub"}</h1>
          <p className="text-muted-foreground text-sm">
            {locale === "es" ? "Monitorea la cola de solicitudes, gestiona tickets de usuarios y acredita compensaciones." : "Monitor the request queue, manage user tickets, and credit manual adjustments."}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <span className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <span>{locale === "es" ? "Consultando cola de atención..." : "Consulting queue health..."}</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Métricas Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-panel border-glass-border bg-background/25">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
                  {locale === "es" ? "Cola Total" : "Total Cases"}
                </CardTitle>
                <Inbox className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-outfit">{total}</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {locale === "es" ? "Casos acumulados en el sistema" : "Total issues registered in system"}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel border-glass-border bg-background/25">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
                  {locale === "es" ? "Abiertos" : "Open Queue"}
                </CardTitle>
                <MessageSquare className="w-4 h-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-outfit text-cyan-400">{openCount}</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {locale === "es" ? "Esperando primera respuesta de agente" : "Awaiting agent first reply"}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel border-glass-border bg-background/25">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
                  {locale === "es" ? "Críticos Activos" : "Critical Cases"}
                </CardTitle>
                <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-outfit text-rose-500">{criticalCount}</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {locale === "es" ? "Tickets urgentes sin resolver" : "Urgent unresolved support tickets"}
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel border-glass-border bg-background/25">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">
                  {locale === "es" ? "Resueltos / Cerrados" : "Resolved Queue"}
                </CardTitle>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-outfit text-emerald-500">{resolvedCount}</div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {locale === "es" ? "Incidencias solucionadas" : "Successfully resolved cases"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Caja de Acciones Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-glass-border bg-background/25 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-1.5">
                  <ShieldAlert className="w-5 h-5 text-primary" />
                  {locale === "es" ? "Control de Tickets de Soporte" : "Inquiries Queue Control"}
                </CardTitle>
                <CardDescription>
                  {locale === "es" ? "Ingresa a la bandeja para responder, resolver o escalar incidencias." : "Open the inbox to reply, solve, or escalate support tickets."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/20 border border-glass-border rounded-xl">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase">{locale === "es" ? "Tickets sin atender" : "Unresolved Queue"}</span>
                    <div className="text-xl font-bold text-foreground">
                      {openCount + inProgressCount} {locale === "es" ? "tickets pendientes" : "pending tickets"}
                    </div>
                  </div>
                  <Link href="/soporte/tickets">
                    <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl">
                      {locale === "es" ? "Ir a la Bandeja" : "Open Inbox"} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel border-glass-border bg-background/35 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  {locale === "es" ? "Compensaciones" : "Compensations"}
                </CardTitle>
                <CardDescription>
                  {locale === "es" ? "Reembolso o ajuste de Wallet." : "Refund or manually adjust patient Wallet."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {locale === "es" 
                    ? "Si un paciente reporta cobros erróneos o fallas técnicas en sus videollamadas, puedes acreditarle créditos directamente desde la consola."
                    : "If a patient reports erroneous wallet charges or technical errors, credit them manual points."}
                </p>
                <Link href="/soporte/compensaciones">
                  <Button variant="secondary" className="w-full gap-2 border border-glass-border rounded-xl bg-background/20">
                    <UserCheck className="w-4 h-4 text-primary" />
                    {locale === "es" ? "Consola de Ajustes" : "Ajustment Console"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
