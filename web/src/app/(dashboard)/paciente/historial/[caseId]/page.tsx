"use client";

import { ClinicalTimelineRiver } from "@/components/ClinicalTimelineRiver";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Share2, FileText } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CaseDetailPage({ params }: { params: { caseId: string } }) {
  return (
    <div className="max-w-6xl mx-auto z-10 relative h-full flex flex-col space-y-6">
      <div className="flex flex-col gap-4">
        <Link href="/paciente/historial">
          <Button variant="ghost" size="sm" className="w-fit -ml-3 text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al historial
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-outfit font-bold">Migraña Crónica</h1>
              <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 text-white">
                En Tratamiento
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">Iniciado el 01 Jul 2026 • Última actualización hoy</p>
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
          <TabsTrigger value="docs" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0">Documentos</TabsTrigger>
          <TabsTrigger value="recs" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="flex-1 mt-6 h-full min-h-[500px]">
          <div className="h-full bg-background/50 rounded-xl border border-glass-border overflow-hidden p-0">
             <ClinicalTimelineRiver />
          </div>
        </TabsContent>

        <TabsContent value="docs" className="flex-1 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-glass-border flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg"><FileText className="w-6 h-6 text-primary"/></div>
              <div>
                <p className="font-medium text-sm">Resonancia_Magnetica.pdf</p>
                <p className="text-xs text-muted-foreground">Subido el 05 Jul</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recs" className="flex-1 mt-6">
          <div className="glass-panel p-6 rounded-xl border border-glass-border">
            <h3 className="font-semibold mb-4 text-orange-400">Recomendaciones Activas</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-orange-400 shrink-0" />
                <p className="text-sm">Mantener un diario de dolores de cabeza, anotando alimentos consumidos y horas de sueño.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-orange-400 shrink-0" />
                <p className="text-sm">Evitar exposición prolongada a pantallas brillantes antes de dormir.</p>
              </li>
            </ul>
            <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-muted/50 text-xs text-muted-foreground">
              Recomendación orientativa. Consulte a su médico.
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
