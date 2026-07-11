"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UserCheck, ShieldCheck, XCircle, Users, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  doctorProfile?: {
    id: string;
    cedula: string | null;
    verificationStatus: string;
    ineFront: string | null;
    ineBack: string | null;
  } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadUsersAndDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/doctors/verify");
      const data = await res.json();
      if (data.success) {
        setUsers(data.doctors); // El endpoint retorna médicos, pero también podemos usarlo para listarlos
      } else {
        toast.error(data.error || "No se pudo cargar la lista de usuarios.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión al cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsersAndDoctors();
  }, []);

  const handleVerifyDoctor = async (doctorId: string, status: "activo" | "rechazado") => {
    try {
      setUpdatingId(doctorId);
      const res = await fetch("/api/admin/doctors/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo actualizar el estatus.");
      }

      toast.success(status === "activo" ? "Médico activado y verificado." : "Verificación rechazada.");
      // Actualizar localmente el estado en la lista
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === doctorId && u.doctorProfile) {
            return {
              ...u,
              doctorProfile: {
                ...u.doctorProfile,
                verificationStatus: status,
              },
            };
          }
          return u;
        })
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error al actualizar la verificación.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "activo":
        return "border-emerald-500/30 text-emerald-500 bg-emerald-500/10";
      case "en_revision":
        return "border-primary/30 text-primary bg-primary/10 animate-pulse";
      case "rechazado":
        return "border-destructive/30 text-destructive bg-destructive/10";
      default:
        return "border-glass-border text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "activo":
        return "Activo";
      case "en_revision":
        return "En Revisión";
      case "rechazado":
        return "Rechazado";
      default:
        return "Pendiente";
    }
  };

  // Médicos pendientes de validación o revisión
  const pendingDoctors = users.filter(
    (u) => u.doctorProfile && (u.doctorProfile.verificationStatus === "en_revision" || u.doctorProfile.verificationStatus === "pendiente")
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 z-10 relative">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-outfit font-bold">Gestión de Usuarios</h1>
        <Button variant="outline" onClick={loadUsersAndDoctors} className="rounded-xl">
          Recargar Lista
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>Consultando registros de usuarios y médicos...</span>
        </div>
      ) : (
        <Tabs defaultValue="verify" className="w-full">
          <TabsList className="border-b border-glass-border rounded-none bg-transparent h-12 p-0 space-x-6 mb-6">
            <TabsTrigger value="verify" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0 text-sm font-semibold">
              Verificación Médica ({pendingDoctors.length})
            </TabsTrigger>
            <TabsTrigger value="doctors" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0 text-sm font-semibold">
              Médicos Registrados
            </TabsTrigger>
          </TabsList>

          {/* PESTAÑA: SOLICITUDES DE VERIFICACIÓN */}
          <TabsContent value="verify" className="space-y-4">
            {pendingDoctors.length === 0 ? (
              <Card className="glass-panel border-glass-border bg-background/25">
                <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                  <ShieldCheck className="w-12 h-12 text-primary opacity-60" />
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Sin solicitudes pendientes</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      No hay médicos con documentación profesional pendiente de revisar en este momento.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingDoctors.map((doc) => (
                  <Card key={doc.id} className="glass-panel border-glass-border bg-background/25 hover:border-primary/20 transition-colors">
                    <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg text-foreground">{doc.name}</h3>
                          <Badge variant="outline" className={cn("text-[10px] font-bold rounded-full", getStatusColor(doc.doctorProfile?.verificationStatus || ""))}>
                            {getStatusLabel(doc.doctorProfile?.verificationStatus || "")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Email: {doc.email}</p>
                        <p className="text-xs text-foreground font-medium flex items-center gap-1">
                          <FileText className="w-4 h-4 text-primary" /> Cédula Profesional: {doc.doctorProfile?.cedula || "No provista"}
                        </p>
                      </div>

                      <div className="flex flex-row items-center gap-2 self-end md:self-center">
                        <Button
                          size="sm"
                          onClick={() => handleVerifyDoctor(doc.id, "activo")}
                          disabled={updatingId !== null}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs gap-1.5 shadow-sm shadow-emerald-500/10"
                        >
                          {updatingId === doc.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                          Aprobar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerifyDoctor(doc.id, "rechazado")}
                          disabled={updatingId !== null}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg text-xs gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Rechazar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* PESTAÑA: MÉDICOS REGISTRADOS */}
          <TabsContent value="doctors" className="space-y-4">
            <Card className="glass-panel border-glass-border bg-background/25">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cédula</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((doc) => (
                      <TableRow key={doc.id} className="hover:bg-background/20 transition-colors">
                        <TableCell className="font-semibold text-xs text-foreground">{doc.name}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{doc.email}</TableCell>
                        <TableCell className="text-foreground text-xs font-mono">{doc.doctorProfile?.cedula || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-[9px] uppercase font-bold rounded-full", getStatusColor(doc.doctorProfile?.verificationStatus || ""))}>
                            {getStatusLabel(doc.doctorProfile?.verificationStatus || "")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
