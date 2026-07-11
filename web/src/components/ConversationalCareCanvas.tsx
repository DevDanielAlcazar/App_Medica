"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useCaseStore } from "@/stores/caseStore";
import { useUserStore } from "@/stores/userStore";
import { motion } from "framer-motion";
import { Send, Paperclip, Calendar, FolderOpen, Stethoscope, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
}

export function ConversationalCareCanvas({ className }: { className?: string }) {
  const { activeCase, setActiveCase } = useCaseStore();
  const { user } = useUserStore();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingCase, setLoadingCase] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // 1. Cargar o crear un caso clínico activo al montar
  useEffect(() => {
    async function initCase() {
      try {
        setLoadingCase(true);
        // Obtener casos existentes
        const res = await fetch("/api/patient/cases");
        const data = await res.json();
        
        if (data.success && data.cases.length > 0) {
          // Buscar el primer caso activo (no curado ni archivado)
          const active = data.cases.find(
            (c: any) => c.status !== "curado" && c.status !== "archivado"
          );
          if (active) {
            setActiveCase(active);
            setLoadingCase(false);
            return;
          }
        }

        // Si no hay caso activo, crear uno nuevo de cortesía
        const todayStr = new Date().toLocaleDateString("es-ES", {
          day: "numeric",
          month: "short",
          year: "numeric"
        });
        const createRes = await fetch("/api/patient/cases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: `Consulta sintomática del ${todayStr}` }),
        });
        const createData = await createRes.json();
        if (createData.success) {
          setActiveCase(createData.case);
        }
      } catch (err) {
        console.error("Error al inicializar caso clínico:", err);
        setError("No se pudo iniciar el caso clínico. Revisa tu conexión.");
      } finally {
        setLoadingCase(false);
      }
    }

    initCase();
  }, [setActiveCase]);

  // 2. Cargar mensajes cuando el caso activo cambie
  useEffect(() => {
    if (!activeCase) return;
    const caseId = activeCase.id;

    async function loadMessages() {
      try {
        const res = await fetch(`/api/patient/cases/${caseId}/messages`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Error al cargar mensajes:", err);
      }
    }

    loadMessages();
  }, [activeCase]);

  // Scroll automático al fondo cuando lleguen mensajes nuevos
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Enviar un nuevo mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sending || !activeCase) return;

    const caseId = activeCase.id;
    const messageToSend = inputText.trim();
    setInputText("");
    setSending(true);
    setError("");

    // Optimistic user message rendering
    const tempUserMessage: Message = {
      id: "temp-user",
      sender: "user",
      content: messageToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const res = await fetch(`/api/patient/cases/${caseId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageToSend }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al procesar el mensaje.");
      }

      // Reemplazar el temporal y agregar la respuesta del asistente
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== "temp-user");
        return [...filtered, ...data.messages];
      });

      // Si el timeline se actualizó, refrescar el caso activo
      if (data.timelineUpdate) {
        // Refrescar el caso para obtener el timeline actualizado de la DB
        const caseRes = await fetch("/api/patient/cases");
        const caseData = await caseRes.json();
        if (caseData.success) {
          const freshCase = caseData.cases.find((c: any) => c.id === caseId);
          if (freshCase) setActiveCase(freshCase);
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al enviar mensaje.");
      // Limpiar el mensaje optimista si falló
      setMessages((prev) => prev.filter((m) => m.id !== "temp-user"));
    } finally {
      setSending(false);
    }
  };

  if (loadingCase) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-muted">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm">Inicializando expediente clínico seguro...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass-panel flex flex-col h-full rounded-3xl overflow-hidden shadow-2xl", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-glass-border bg-background/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Asistente Clínico AI</h1>
            <p className="text-sm text-muted-foreground">{activeCase?.title || "Orientación médica activa"}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="hidden md:flex gap-2">
          <Link href="/paciente/historial">
            <button className="p-2 text-muted-foreground hover:text-primary bg-background/50 rounded-xl hover:bg-primary/10 transition-colors tooltip" title="Ver Expediente Completo">
              <FolderOpen className="w-5 h-5" />
            </button>
          </Link>
          <Link href="/paciente/calendario">
            <button className="p-2 text-muted-foreground hover:text-secondary bg-background/50 rounded-xl hover:bg-secondary/10 transition-colors tooltip" title="Agendar Cita Humana">
              <Calendar className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto gap-4 text-muted-foreground mt-12">
            <Stethoscope className="w-12 h-12 text-primary opacity-65" />
            <p className="text-sm leading-relaxed">
              Hola, soy tu orientador clínico Angélica Med. Por favor describe detalladamente tus síntomas (duración, intensidad, edad del paciente y antecedentes) para poder guiarte clínicamente.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex flex-col gap-2 max-w-[80%]",
              msg.sender === "user" ? "self-end items-end" : "self-start items-start"
            )}
          >
            <span className="text-xs text-muted-foreground ml-2">
              {msg.sender === "user" ? "Tú" : "Asistente Clínico"} •{" "}
              {new Date(msg.createdAt).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <div
              className={cn(
                "p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-line border",
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none border-primary/20"
                  : "bg-elevated text-foreground rounded-tl-none border-glass-border"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex flex-col gap-2 max-w-[80%] self-start items-start">
            <span className="text-xs text-muted-foreground ml-2">Asistente Clínico • Escribiendo...</span>
            <div className="bg-elevated text-foreground p-4 rounded-2xl rounded-tl-none border border-glass-border shadow-sm text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Analizando síntomas contra guías de práctica clínica...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full flex justify-center my-2">
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3 text-xs max-w-sm text-center font-medium">
              {error}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-background/50 border-t border-glass-border backdrop-blur-md">
        <div className="relative flex items-end gap-2 bg-elevated rounded-2xl p-2 border border-glass-border focus-within:border-primary/50 transition-colors">
          <button type="button" className="p-3 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-background/50">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            placeholder="Describe tus síntomas (ej. fiebre, dolor, edad de la persona)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none resize-none outline-none py-3 text-sm text-foreground placeholder:text-muted-foreground/70"
            rows={1}
            disabled={sending}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="p-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 shrink-0"
            disabled={sending || !inputText.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
