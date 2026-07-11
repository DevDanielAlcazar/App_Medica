"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useCaseStore } from "@/stores/caseStore";
import { ClinicalTimelineRiver } from "@/components/ClinicalTimelineRiver";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, FileText, MessageSquare, Loader2, AlertCircle, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [printing, setPrinting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const handleGenerateReport = async () => {
    setPrinting(true);
    try {
      const res = await fetch(`/api/patient/cases/${caseId}/recommendation`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const rec = data.recommendation;

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Permite las ventanas emergentes para descargar tu reporte.");
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Recomendación Sintomatológica - ${rec.title}</title>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; padding: 40px; line-height: 1.6; }
              .header { border-bottom: 2px solid #5F69F8; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
              .logo { font-size: 24px; font-weight: bold; color: #5F69F8; }
              .title { font-size: 18px; font-weight: bold; margin-top: 10px; }
              .meta { font-size: 12px; color: #666; margin-bottom: 20px; }
              .section { margin-bottom: 25px; }
              .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #5F69F8; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
              .badge { display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: bold; border-radius: 20px; }
              .badge-alta { background-color: #fee2e2; color: #ef4444; }
              .badge-media { background-color: #fef3c7; color: #d97706; }
              .badge-baja { background-color: #d1fae5; color: #059669; }
              .disclaimer { background-color: #f9fafb; border: 1px solid #e5e7eb; border-left: 4px solid #9ca3af; padding: 15px; font-size: 11px; color: #4b5563; border-radius: 8px; margin-top: 40px; }
              .guidelines { padding-left: 20px; }
              .red-flags { color: #ef4444; font-weight: bold; }
              @media print {
                body { padding: 20px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="logo">Angélica Med</div>
                <div class="title">RECOMENDACIÓN SINTOMATOLÓGICA PRELIMINAR</div>
              </div>
              <div>
                <span class="badge badge-${rec.severity.toLowerCase()}">${rec.severity} Prioridad</span>
              </div>
            </div>

            <div class="meta">
              <strong>ID del Expediente:</strong> ${rec.caseId}<br>
              <strong>Paciente:</strong> ${rec.patientName}<br>
              <strong>Fecha de Emisión:</strong> ${new Date(rec.date).toLocaleString("es-ES")}<br>
              <strong>Título de la consulta:</strong> ${rec.title}
            </div>

            <div class="section">
              <div class="section-title">Síntomas Reportados</div>
              <ul>
                ${rec.symptoms.map((s: string) => `<li>${s}</li>`).join("")}
              </ul>
            </div>

            <div class="section">
              <div class="section-title">Sospechas de Orientación AI y Resumen Clínico</div>
              <p>${rec.summary}</p>
            </div>

            <div class="section">
              <div class="section-title">Acción Recomendada</div>
              <p><strong>${rec.actionRequired}</strong></p>
            </div>

            <div class="section">
              <div class="section-title">Lineamientos de Medicamentos Sugeridos (Venta Libre - OTC)</div>
              <ul>
                ${rec.otcGuidelines.map((g: string) => `<li>${g}</li>`).join("")}
              </ul>
            </div>

            <div class="section">
              <div class="section-title" style="color: #ef4444;">Señales de Alarma Críticas (Acudir a Urgencias)</div>
              <ul class="red-flags">
                ${rec.redFlags.map((f: string) => `<li>${f}</li>`).join("")}
              </ul>
            </div>

            <div class="disclaimer">
              <strong>Aviso Legal Importante:</strong> ${rec.disclaimer}
            </div>

            <script>
              window.onload = function() {
                window.print();
                setTimeout(() => window.close(), 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      toast.success("Documento PDF generado correctamente.");
    } catch (err: any) {
      console.error(err);
      toast.error("Error al generar el reporte PDF.");
    } finally {
      setPrinting(false);
    }
  };

  const handleDeleteCase = async () => {
    if (deleteConfirmationText !== "ELIMINAR") {
      toast.error("Escribe la palabra ELIMINAR para confirmar.");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/patient/cases/${caseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo borrar el expediente.");

      toast.success("Expediente clínico eliminado permanentemente.");
      setDeleteModalOpen(false);
      router.push("/paciente/historial");
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar expediente.");
    } finally {
      setDeleting(false);
    }
  };

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
            <Button onClick={handleGenerateReport} disabled={printing} className="gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl">
              {printing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Generar Reporte
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
            <div className="glass-panel p-6 rounded-xl border border-glass-border space-y-4 h-fit bg-background/30">
              <h3 className="font-semibold text-foreground">Resumen Clínico</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Este expediente resume el seguimiento de tus síntomas guiado por nuestro asistente clínico de IA Angélica Med. Puedes descargar el reporte completo para compartirlo con tu médico físico.
              </p>
              <div className="p-3 bg-muted/20 rounded-xl border border-glass-border text-xs text-muted-foreground">
                <strong>Nota NOM-024:</strong> Toda la información de este expediente cumple con las guías de protección y privacidad de datos sensibles médicos.
              </div>

              {/* Botón de Eliminación Segura */}
              <div className="pt-4 border-t border-glass-border space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Zona de Seguridad</p>
                <Button
                  onClick={() => setDeleteModalOpen(true)}
                  variant="ghost"
                  className="w-full justify-start text-xs text-destructive hover:bg-destructive/10 rounded-xl gap-2 h-9"
                >
                  <Trash2 className="w-4 h-4" /> Eliminar Expediente
                </Button>
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

      {/* Modal de Eliminación Legal de Expediente */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setDeleteModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Body */}
          <div className="relative glass-panel bg-background/95 w-full max-w-md p-6 rounded-2xl border border-glass-border shadow-2xl space-y-6 z-10">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-destructive flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" /> Eliminar Expediente Clínico
              </h3>
              <button onClick={() => setDeleteModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p className="font-bold text-foreground">¿Estás completamente seguro de que deseas eliminar este expediente?</p>
              <p>
                De acuerdo con la regulación de expedientes clínicos y privacidad de datos, esta acción es <strong className="text-destructive">permanente e irreversible</strong>. Se eliminarán de forma definitiva:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Todo el historial de chat con el orientador clínico de IA.</li>
                <li>Los hitos y diagnósticos preliminares de la línea de tiempo.</li>
                <li>Los reportes de recomendaciones sintomatológicas y adjuntos.</li>
              </ul>
              <p className="bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-destructive font-semibold">
                Esta acción no se puede deshacer y perderás el acceso a la información clínica de este caso para siempre.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">
                Para confirmar, escribe la palabra <strong className="text-foreground">ELIMINAR</strong> a continuación:
              </label>
              <input
                type="text"
                placeholder="ELIMINAR"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                className="w-full bg-elevated border border-glass-border text-foreground text-sm rounded-xl p-3 outline-none focus:border-destructive/50"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setDeleteModalOpen(false)}
                variant="outline"
                className="flex-1 border-glass-border rounded-xl text-xs h-10"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteCase}
                disabled={deleting || deleteConfirmationText !== "ELIMINAR"}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-white rounded-xl text-xs gap-1 h-10"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Confirmar Eliminación
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
