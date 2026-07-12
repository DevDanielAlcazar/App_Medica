"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, MessageSquare, Clock, X, Send, Loader2, AlertCircle, ShieldAlert, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  createdAt: string;
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

export default function SupportPage() {
  const { locale } = useLanguage();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de chat de ticket seleccionado
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Estados de modal de alta de ticket
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [priority, setPriority] = useState("low");
  const [submitting, setSubmitting] = useState(false);

  // 1. Cargar lista de tickets de soporte
  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/patient/tickets");
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (err) {
      console.error(err);
      toast.error(locale === "es" ? "Error al cargar los tickets de soporte." : "Failed to load support tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [locale]);

  // 2. Cargar mensajes del chat de soporte para el ticket seleccionado
  const handleSelectTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    try {
      setLoadingChat(true);
      const res = await fetch(`/api/patient/tickets/${ticket.id}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
      toast.error(locale === "es" ? "Error al cargar la conversación." : "Failed to load chat history.");
    } finally {
      setLoadingChat(false);
    }
  };

  // 3. Enviar un nuevo mensaje al ticket
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const res = await fetch(`/api/patient/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
        
        // Si el ticket estaba resuelto/cerrado, reabrir localmente
        if (selectedTicket.status === "resolved" || selectedTicket.status === "closed") {
          setSelectedTicket((prev) => prev ? { ...prev, status: "open" } : null);
          setTickets((prev) =>
            prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: "open" } : t))
          );
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(locale === "es" ? "Error al enviar el mensaje." : "Failed to send message.");
    }
  };

  // 4. Crear un nuevo ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch("/api/patient/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description, category, priority }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTickets((prev) => [data.ticket, ...prev]);
        toast.success(locale === "es" ? "Ticket creado con éxito." : "Support ticket created successfully.");
        setSubject("");
        setDescription("");
        setCreateModalOpen(false);
        // Abrir inmediatamente la charla del ticket creado
        handleSelectTicket(data.ticket);
      }
    } catch (err) {
      console.error(err);
      toast.error(locale === "es" ? "Error al registrar el ticket." : "Failed to create support ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-primary/10 text-primary border-primary/20";
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

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-rose-500 bg-rose-500/10 border-rose-500/25";
      case "high":
        return "text-orange-500 bg-orange-500/10 border-orange-500/25";
      case "medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/25";
      default:
        return "text-muted-foreground bg-muted/10 border-glass-border";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 z-10 relative h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-outfit font-bold">{locale === "es" ? "Soporte Técnico" : "Technical Support"}</h1>
          <p className="text-muted-foreground text-sm">
            {locale === "es" ? "Consúltanos sobre reembolsos, recargas de Wallet, citas virtuales o incidencias con la IA." : "Inquire about refunds, Wallet recharges, virtual appointments, or AI assistant discrepancies."}
          </p>
        </div>
        {!selectedTicket && (
          <Button onClick={() => setCreateModalOpen(true)} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl">
            <Plus className="w-4 h-4" /> {locale === "es" ? "Nuevo Ticket" : "New Ticket"}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>{locale === "es" ? "Sincronizando incidencias..." : "Retrieving support cases..."}</span>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 h-full min-h-[500px]">
          {/* Listado Izquierdo de Tickets */}
          <div className={cn("space-y-3 w-full md:w-[350px] shrink-0", selectedTicket ? "hidden md:block" : "block")}>
            <h2 className="font-semibold text-lg flex items-center gap-2 text-foreground pb-2 border-b border-glass-border">
              <MessageSquare className="w-5 h-5 text-primary" />
              {locale === "es" ? "Tus Solicitudes" : "Your Requests"}
            </h2>

            <div className="space-y-3 overflow-y-auto max-h-[520px] pr-2">
              {tickets.map((t) => (
                <Card
                  key={t.id}
                  onClick={() => handleSelectTicket(t)}
                  className={cn(
                    "glass-panel border-glass-border cursor-pointer bg-background/20 transition-all hover:border-primary/40",
                    selectedTicket?.id === t.id && "border-primary/60 bg-primary/5 ring-1 ring-primary/25"
                  )}
                >
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-sm line-clamp-1 text-foreground">{t.subject}</h3>
                      <Badge variant="outline" className={cn("text-[9px] uppercase font-bold rounded-full", getStatusBadgeColor(t.status))}>
                        {t.status === "open" ? (locale === "es" ? "Abierto" : "Open") : t.status === "in_progress" ? (locale === "es" ? "En Proceso" : "In Progress") : t.status === "resolved" ? (locale === "es" ? "Resuelto" : "Resolved") : (locale === "es" ? "Cerrado" : "Closed")}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{t.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-glass-border/40 pt-2 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className={cn("text-[9px] rounded-md font-mono", getPriorityBadgeColor(t.priority))}>
                        {t.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {tickets.length === 0 && (
                <div className="text-sm text-muted-foreground p-8 text-center border border-dashed border-glass-border rounded-xl bg-background/10">
                  {locale === "es" ? "No tienes tickets de soporte creados." : "You have no active support tickets."}
                </div>
              )}
            </div>
          </div>

          {/* Chat de Soporte Activo */}
          <div className="flex-1 flex flex-col">
            {selectedTicket ? (
              <Card className="glass-panel border-glass-border bg-background/30 backdrop-blur-md flex-1 flex flex-col h-[520px] overflow-hidden">
                {/* Cabecera del chat */}
                <div className="p-4 border-b border-glass-border bg-background/50 flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedTicket(null)} className="md:hidden text-muted-foreground hover:text-foreground mr-1">
                        <X className="w-5 h-5" />
                      </button>
                      <h3 className="font-bold text-foreground text-sm line-clamp-1">{selectedTicket.subject}</h3>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-normal flex items-center gap-2">
                      <span>ID: <strong className="font-mono text-foreground">{selectedTicket.id.slice(0, 8)}</strong></span>
                      <span>•</span>
                      <span>{locale === "es" ? "Categoría" : "Category"}: <strong className="text-primary">{selectedTicket.category}</strong></span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className={cn("text-[9px] font-bold rounded-full hidden sm:inline-flex", getStatusBadgeColor(selectedTicket.status))}>
                      {selectedTicket.status}
                    </Badge>
                    <button onClick={() => setSelectedTicket(null)} className="text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-lg transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black/10">
                  {/* Mensaje Inicial */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-2xl p-3 bg-muted/40 text-foreground border border-glass-border text-xs leading-relaxed space-y-1">
                      <div className="font-bold text-primary flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-primary" />
                        {locale === "es" ? "Descripción inicial del problema" : "Initial problem description"}
                      </div>
                      <p>{selectedTicket.description}</p>
                      <span className="text-[9px] text-muted-foreground block text-right">
                        {new Date(selectedTicket.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {loadingChat ? (
                    <div className="flex items-center justify-center py-10 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin mr-2 text-primary" />
                      <span className="text-xs">Cargando conversación...</span>
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.senderId !== selectedTicket.userId; // Agente es "otro"
                      return (
                        <div key={m.id} className={cn("flex", !isMe ? "justify-start" : "justify-end")}>
                          <div className={cn(
                            "max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 shadow-sm",
                            !isMe 
                              ? "bg-muted/30 text-foreground border border-glass-border" 
                              : "bg-primary text-primary-foreground"
                          )}>
                            <div className="font-bold text-[10px] flex items-center gap-1">
                              {isMe ? <Sparkles className="w-3 h-3 text-cyan-300" /> : null}
                              {isMe ? `Agente (${m.sender.name})` : m.sender.name}
                            </div>
                            <p>{m.content}</p>
                            <span className={cn("text-[9px] block text-right", !isMe ? "text-muted-foreground" : "text-primary-foreground/80")}>
                              {new Date(m.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Formulario de envío */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-glass-border bg-background/50 flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={locale === "es" ? "Escribe tu respuesta a soporte..." : "Type your reply to support..."}
                    disabled={selectedTicket.status === "closed"}
                    className="bg-muted/10 border-glass-border focus:border-primary/50 text-xs rounded-xl"
                  />
                  <Button type="submit" disabled={!newMessage.trim() || selectedTicket.status === "closed"} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 rounded-xl">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </Card>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-glass-border rounded-2xl p-10 text-center text-muted-foreground bg-background/10">
                <MessageSquare className="w-12 h-12 text-primary/40 mb-3" />
                <h3 className="font-bold text-foreground">{locale === "es" ? "Canal de Atención de Soporte" : "Support Chat Center"}</h3>
                <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
                  {locale === "es"
                    ? "Selecciona un ticket de la lista de la izquierda para abrir el chat interactivo, o crea uno nuevo presionando el botón superior."
                    : "Select a ticket from the list on the left to open the interactive chat, or register a new inquiry."}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal / Diálogo de Registro de Nuevo Ticket */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-panel bg-background/95 w-full max-w-md p-6 rounded-2xl border border-glass-border shadow-2xl space-y-6 z-10"
            >
              <div className="flex justify-between items-center pb-3 border-b border-glass-border">
                <h3 className="text-xl font-bold text-foreground">
                  {locale === "es" ? "Crear Ticket de Soporte" : "New Support Request"}
                </h3>
                <button onClick={() => setCreateModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{locale === "es" ? "Asunto del Reporte" : "Subject"}</Label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="Ej. Error al recargar Wallet, Fallo de llamada Meet"
                    className="bg-muted/10 border-glass-border focus:border-primary/50 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>{locale === "es" ? "Categoría" : "Category"}</Label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50"
                    >
                      <option value="wallet">{locale === "es" ? "Pagos / Wallet" : "Payments / Wallet"}</option>
                      <option value="appointment">{locale === "es" ? "Citas Médicas" : "Appointments"}</option>
                      <option value="assistant">{locale === "es" ? "Asistente IA" : "AI Assistant"}</option>
                      <option value="other">{locale === "es" ? "Otro problema" : "Other issue"}</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>{locale === "es" ? "Prioridad" : "Priority"}</Label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50"
                    >
                      <option value="low">{locale === "es" ? "Baja" : "Low"}</option>
                      <option value="medium">{locale === "es" ? "Media" : "Medium"}</option>
                      <option value="high">{locale === "es" ? "Alta" : "High"}</option>
                      <option value="critical">{locale === "es" ? "Crítica" : "Critical"}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>{locale === "es" ? "Descripción Detallada" : "Detailed Description"}</Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder={locale === "es" ? "Describe paso a paso la incidencia para que soporte pueda ayudarte." : "Describe step-by-step what occurred so support agents can help you."}
                    className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-primary/50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !subject.trim() || !description.trim()}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {locale === "es" ? "Enviar Reporte" : "Submit Request"}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
