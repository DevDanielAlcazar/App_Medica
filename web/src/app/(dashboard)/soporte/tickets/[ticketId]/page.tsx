"use client";

import { useEffect, useState, use } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Send, CheckCircle2, ShieldAlert, Sparkles, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

interface TicketMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: {
    name: string;
    role: string;
  };
}

export default function SupportTicketDetailPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params);
  const { locale } = useLanguage();

  // Estados de datos
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de envío y actualización
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const loadTicketData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/support/tickets/${ticketId}/messages`);
      const data = await res.json();
      if (data.success) {
        setTicket(data.ticket);
        setMessages(data.messages);
      } else {
        toast.error(locale === "es" ? "Ticket no encontrado." : "Ticket not found.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión al cargar datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicketData();
  }, [ticketId]);

  // Enviar mensaje del agente
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !ticket) return;

    try {
      setSending(true);
      const res = await fetch(`/api/support/tickets/${ticket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: reply }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessages((prev) => [...prev, data.message]);
        setReply("");
        
        // Si el estado estaba "open", pasará automáticamente a "in_progress" en el backend
        if (ticket.status === "open") {
          setTicket((prev) => prev ? { ...prev, status: "in_progress" } : null);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(locale === "es" ? "Error al enviar la respuesta." : "Failed to send reply.");
    } finally {
      setSending(false);
    }
  };

  // Cambiar estado del ticket manualmente (En proceso, Resuelto, Cerrado)
  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setUpdatingStatus(newStatus);
      const res = await fetch("/api/support/tickets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTicket((prev) => prev ? { ...prev, status: newStatus } : null);
        toast.success(locale === "es" ? `Ticket marcado como: ${newStatus}` : `Ticket status updated to: ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(locale === "es" ? "Error al actualizar estado." : "Failed to update status.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      case "in_progress":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "resolved":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "closed":
        return "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 z-10 relative h-full flex flex-col">
      <div className="flex items-center gap-4">
        <Link href="/soporte/tickets">
          <Button variant="outline" className="border-glass-border rounded-xl px-3 py-1.5 text-xs gap-1">
            <ArrowLeft className="w-4 h-4" /> {locale === "es" ? "Bandeja" : "Inbox"}
          </Button>
        </Link>
        <h1 className="text-2xl font-outfit font-bold">{locale === "es" ? "Atención de Incidencia" : "Inquiry Center"}</h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>Cargando detalle del ticket...</span>
        </div>
      ) : (
        ticket && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
            {/* Panel Izquierdo: Información del Caso */}
            <div className="space-y-6">
              <Card className="glass-panel border-glass-border bg-background/25">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase">
                      {locale === "es" ? "Detalle del Reporte" : "Report Details"}
                    </CardTitle>
                    <Badge variant="outline" className={cn("text-[9px] font-bold rounded-full", getStatusBadgeColor(ticket.status))}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg text-foreground mt-2 leading-snug">{ticket.subject}</h3>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  {/* Usuario */}
                  <div className="space-y-1">
                    <span className="text-muted-foreground font-bold uppercase text-[9px] block">
                      {locale === "es" ? "Usuario Reportante" : "Reporting User"}
                    </span>
                    <span className="text-foreground font-semibold block">{ticket.user.name}</span>
                    <span className="text-muted-foreground font-mono block">{ticket.user.email}</span>
                  </div>

                  {/* Detalle */}
                  <div className="space-y-1">
                    <span className="text-muted-foreground font-bold uppercase text-[9px] block">
                      {locale === "es" ? "Categoría & Prioridad" : "Category & Priority"}
                    </span>
                    <p className="text-foreground font-medium block">
                      {ticket.category} | <span className="font-mono text-rose-500">{ticket.priority}</span>
                    </p>
                  </div>

                  {/* Creado */}
                  <div className="space-y-1">
                    <span className="text-muted-foreground font-bold uppercase text-[9px] block">
                      {locale === "es" ? "Registrado el" : "Registered on"}
                    </span>
                    <p className="text-foreground font-medium block">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Acciones de Estatus */}
              <Card className="glass-panel border-glass-border bg-background/25">
                <CardHeader className="py-4">
                  <CardTitle className="text-sm font-bold text-muted-foreground uppercase">
                    {locale === "es" ? "Acciones Rápidas de Estatus" : "Status Control Panel"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button
                    onClick={() => handleUpdateStatus("in_progress")}
                    disabled={updatingStatus !== null || ticket.status === "in_progress"}
                    variant="outline"
                    className="border-glass-border text-xs rounded-xl hover:bg-muted"
                  >
                    {updatingStatus === "in_progress" ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                    {locale === "es" ? "Marcar en Proceso" : "Mark in Progress"}
                  </Button>
                  
                  <Button
                    onClick={() => handleUpdateStatus("resolved")}
                    disabled={updatingStatus !== null || ticket.status === "resolved"}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-xl gap-1 shadow-sm"
                  >
                    {updatingStatus === "resolved" ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    {locale === "es" ? "Marcar como Resuelto" : "Mark as Resolved"}
                  </Button>

                  <Button
                    onClick={() => handleUpdateStatus("closed")}
                    disabled={updatingStatus !== null || ticket.status === "closed"}
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs rounded-xl gap-1"
                  >
                    {updatingStatus === "closed" ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                    {locale === "es" ? "Cerrar e Archivar Caso" : "Close & Archive Case"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Panel Derecho: Chat interactivo */}
            <div className="md:col-span-2 flex flex-col h-[520px]">
              <Card className="glass-panel border-glass-border bg-background/30 backdrop-blur-md flex-1 flex flex-col overflow-hidden">
                {/* Mensajes */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black/10">
                  {/* Mensaje Inicial */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl p-3 bg-muted/40 text-foreground border border-glass-border text-xs leading-relaxed space-y-1">
                      <div className="font-bold text-primary flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-primary" />
                        {locale === "es" ? "Problema original reportado" : "Original problem reported"}
                      </div>
                      <p>{ticket.description}</p>
                      <span className="text-[9px] text-muted-foreground block text-right">
                        {new Date(ticket.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {messages.map((m) => {
                    const isMe = m.senderId === ticketId; // Es del paciente
                    const isAgent = m.sender.role === "soporte" || m.sender.role === "admin";
                    return (
                      <div key={m.id} className={cn("flex", isAgent ? "justify-end" : "justify-start")}>
                        <div className={cn(
                          "max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 shadow-sm",
                          !isAgent 
                            ? "bg-muted/30 text-foreground border border-glass-border" 
                            : "bg-primary text-primary-foreground"
                        )}>
                          <div className="font-bold text-[10px] flex items-center gap-1">
                            {isAgent ? <Sparkles className="w-3 h-3 text-cyan-300" /> : null}
                            {m.sender.name} ({m.sender.role})
                          </div>
                          <p>{m.content}</p>
                          <span className={cn("text-[9px] block text-right", !isAgent ? "text-muted-foreground" : "text-primary-foreground/80")}>
                            {new Date(m.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Formulario de respuesta */}
                <form onSubmit={handleSendReply} className="p-3 border-t border-glass-border bg-background/50 flex gap-2">
                  <Input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={locale === "es" ? "Escribe tu respuesta para el paciente..." : "Type support agent reply to patient..."}
                    disabled={sending || ticket.status === "closed"}
                    className="bg-muted/10 border-glass-border focus:border-primary/50 text-xs rounded-xl"
                  />
                  <Button type="submit" disabled={sending || !reply.trim() || ticket.status === "closed"} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 rounded-xl">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        )
      )}
    </div>
  );
}
