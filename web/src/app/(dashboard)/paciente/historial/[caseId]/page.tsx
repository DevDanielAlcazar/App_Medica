"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useCaseStore } from "@/stores/caseStore";
import { ClinicalTimelineRiver } from "@/components/ClinicalTimelineRiver";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, FileText, MessageSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
}

export default function CaseDetailPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = React.use(params);
  const { setActiveCase, activeCase } = useCaseStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Cargar detalles del caso e historial de mensajes
  useEffect(() => {
    async function loadCaseData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/patient/cases/${caseId}/messages`);
        const data = await res.json();

        if (data.success) {
          // Guardar en Zustand para que ClinicalTimelineRiver lea este caso
          setActiveCase(data.case);
          setMessages(data.messages);
        } else {
          setError(data.error || "No se pudo obtener el expediente.");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión al cargar el expediente.");
      } finally {
        setLoading(false);
      }
    }

    loadCaseData();
  }, [caseId, setActiveCase]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_analisis":
        return <Badge className="bg-primary/20 text-primary border-primary/30">En Análisis</Badge>;
      case "derivado":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Derivado a Físico</Badge>;
      case "curado":
        return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Curado</Badge>;
      case "en_tratamiento":
        return <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">En Tratamiento</Badge>;
      default:
        return <Badge variant="outline">{status.replace("_", " ")}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Cargando expediente clínico detallado...</span>
      </div>
    );
  }

  if (error || !activeCase) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-4">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm font-medium">
          {error || "El expediente clínico solicitado no se encuentra disponible."}
        </div>
        <Link href="/paciente/historial">
          <Button variant="ghost">Volver al Historial</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto z-10 relative h-full flex flex-col space-y-6">
      <div className="flex flex-col gap-4">
        <Link href="/paciente/historial">
          <Button variant="ghost" size="sm" className="w-fit -ml-3 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al historial
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-outfit font-bold">{activeCase.title}</h1>
              {getStatusBadge(activeCase.status)}
            </div>
            <p className="text-muted-foreground text-sm">
              Iniciado el{" "}
              {new Date(activeCase.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              • Última actualización hace poco
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" /> Compartir
            </Button>
            <Button className="gap-2">
              <Download className="w-4 h-4" /> Generar Reporte
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="timeline" className="flex-1 flex flex-col">
        <TabsList className="w-full md:w-auto self-start border-b border-glass-border rounded-none bg-transparent h-12 p-0 space-x-6">
          <TabsTrigger value="timeline" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0">Línea de Tiempo</TabsTrigger>
          <TabsTrigger value="dialogue" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0">Conversación</TabsTrigger>
          <TabsTrigger value="docs" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="flex-1 mt-6 h-full min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-background/50 rounded-xl overflow-hidden p-0">
              <ClinicalTimelineRiver />
            </div>
            <div className="glass-panel p-6 rounded-xl border border-glass-border space-y-4 h-fit">
              <h3 className="font-semibold text-foreground">Resumen Clínico</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Este expediente resume el seguimiento de tus síntomas guiado por nuestro asistente clínico de IA Angélica Med. Puedes descargar el reporte completo para compartirlo con tu médico físico.
              </p>
              <div className="p-3 bg-muted/20 rounded-xl border border-glass-border text-xs text-muted-foreground">
                <strong>Nota NOM-024:</strong> Toda la información de este expediente cumple con las guías de protección y privacidad de datos sensibles médicos.
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dialogue" className="flex-1 mt-6">
          <div className="glass-panel p-6 rounded-xl border border-glass-border space-y-4 max-h-[550px] overflow-y-auto flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col gap-1 max-w-[80%]",
                  msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                )}
              >
                <span className="text-[10px] text-muted-foreground px-1">
                  {msg.sender === "user" ? "Paciente" : "Asistente AI"} •{" "}
                  {new Date(msg.createdAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <div
                  className={cn(
                    "p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed border whitespace-pre-line",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none border-primary/20"
                      : "bg-elevated text-foreground rounded-tl-none border-glass-border"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="flex-1 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-glass-border flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg"><FileText className="w-6 h-6 text-primary" /></div>
              <div>
                <p className="font-medium text-sm">Resumen_Orientacion_Clinica.pdf</p>
                <p className="text-xs text-muted-foreground">Autogenerado hoy</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
