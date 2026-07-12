"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface Ticket {
  id: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function SupportTicketsPage() {
  const { locale } = useLanguage();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
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
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "border-cyan-500/30 text-cyan-500 bg-cyan-500/10";
      case "in_progress":
        return "border-amber-500/30 text-amber-500 bg-amber-500/10 animate-pulse";
      case "resolved":
        return "border-emerald-500/30 text-emerald-500 bg-emerald-500/10";
      case "closed":
        return "border-glass-border text-muted-foreground";
      default:
        return "border-glass-border text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return locale === "es" ? "Abierto" : "Open";
      case "in_progress":
        return locale === "es" ? "En Proceso" : "In Progress";
      case "resolved":
        return locale === "es" ? "Resuelto" : "Resolved";
      case "closed":
        return locale === "es" ? "Cerrado" : "Closed";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-rose-500/30 text-rose-500 bg-rose-500/10";
      case "high":
        return "border-orange-500/30 text-orange-500 bg-orange-500/10";
      case "medium":
        return "border-amber-500/30 text-amber-500 bg-amber-500/10";
      default:
        return "border-glass-border text-muted-foreground";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 z-10 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-outfit font-bold">{locale === "es" ? "Bandeja de Tickets de Soporte" : "Support Tickets Inbox"}</h1>
          <p className="text-muted-foreground text-sm">
            {locale === "es" ? "Listado general de incidencias reportadas por pacientes y médicos." : "General listing of incidents reported by patients and doctors."}
          </p>
        </div>
        <Button onClick={loadTickets} variant="outline" className="rounded-xl gap-2 border-glass-border">
          <RefreshCw className="w-4 h-4" /> {locale === "es" ? "Actualizar" : "Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>{locale === "es" ? "Cargando bandeja de entrada..." : "Retrieving inbox queue..."}</span>
        </div>
      ) : (
        <Card className="glass-panel border-glass-border bg-background/25 overflow-hidden">
          <CardContent className="p-0">
            {tickets.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-12 h-12 text-primary opacity-60" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{locale === "es" ? "Bandeja vacía" : "Inbox empty"}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {locale === "es" ? "No se han registrado solicitudes de soporte en el sistema." : "No support inquiries registered in database."}
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>{locale === "es" ? "Usuario" : "User"}</TableHead>
                    <TableHead>{locale === "es" ? "Asunto del Reporte" : "Subject"}</TableHead>
                    <TableHead>{locale === "es" ? "Categoría" : "Category"}</TableHead>
                    <TableHead>{locale === "es" ? "Prioridad" : "Priority"}</TableHead>
                    <TableHead>{locale === "es" ? "Estado" : "Status"}</TableHead>
                    <TableHead>{locale === "es" ? "Fecha" : "Date"}</TableHead>
                    <TableHead className="text-right">{locale === "es" ? "Acción" : "Action"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((t) => (
                    <TableRow key={t.id} className="hover:bg-background/20 transition-colors">
                      <TableCell>
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-foreground block">{t.user.name}</span>
                          <span className="text-[10px] text-muted-foreground block font-mono">{t.user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-xs text-foreground max-w-xs truncate">{t.subject}</TableCell>
                      <TableCell className="text-primary text-xs capitalize font-medium">{t.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[9px] uppercase font-bold rounded-full", getPriorityColor(t.priority))}>
                          {t.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-[9px] uppercase font-bold rounded-full", getStatusColor(t.status))}>
                          {getStatusLabel(t.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/soporte/tickets/${t.id}`}>
                          <Button size="sm" variant="ghost" className="hover:bg-primary/10 text-primary gap-1 text-xs rounded-lg">
                            {locale === "es" ? "Atender" : "Open"} <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
