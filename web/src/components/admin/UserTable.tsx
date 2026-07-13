"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, UserCheck, Loader2, ShieldCheck, XCircle, Users, Edit, Trash2, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/providers/LanguageProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  planId?: string;
  createdAt: string;
  doctorProfile?: {
    cedula: string | null;
    verificationStatus: string;
  } | null;
}

interface UserTableProps {
  users: User[];
  onVerify: (doctorId: string, status: "activo" | "rechazado") => Promise<void>;
  updatingId: string | null;
  onRefresh?: () => void;
}

export function UserTable({ users, onVerify, updatingId, onRefresh }: UserTableProps) {
  const { locale } = useLanguage();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [createForm, setCreateForm] = useState({ email: "", password: "", name: "", role: "paciente" });
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "paciente" });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
        return "En Revision";
      case "rechazado":
        return "Rechazado";
      default:
        return "Pendiente";
    }
  };

  const handleCreateUser = async () => {
    try {
      const res = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear usuario");
      toast.success("Usuario creado exitosamente");
      setShowCreateModal(false);
      setCreateForm({ email: "", password: "", name: "", role: "paciente" });
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch("/api/admin/usuarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: editingUser.id, action: "update", ...editForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");
      toast.success("Usuario actualizado");
      setShowEditModal(false);
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleBanUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch("/api/admin/usuarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "ban" }),
      });
      if (!res.ok) throw new Error("Error al banear");
      toast.success("Usuario baneado");
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Eliminar usuario? Esta accion no se puede deshacer.")) return;
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/usuarios?id=${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      toast.success("Usuario eliminado");
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const pendingDoctors = users.filter(
    (u) => u.doctorProfile && (u.doctorProfile.verificationStatus === "en_revision" || u.doctorProfile.verificationStatus === "pendiente")
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="verify" className="w-full">
        <TabsList className="border-b border-glass-border rounded-none bg-transparent h-12 p-0 space-x-6 mb-6">
          <TabsTrigger value="verify" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0 text-sm font-semibold">
            {locale === "es" ? "Verificacion Medica" : "Doctor Verification"} ({pendingDoctors.length})
          </TabsTrigger>
          <TabsTrigger value="doctors" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0 text-sm font-semibold">
            {locale === "es" ? "Medicos Registrados" : "Registered Doctors"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verify" className="space-y-4">
          {pendingDoctors.length === 0 ? (
            <Card className="glass-panel border-glass-border bg-background/25">
              <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                <ShieldCheck className="w-12 h-12 text-primary opacity-60" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {locale === "es" ? "Sin solicitudes pendientes" : "No pending requests"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {locale === "es" ? "No hay medicos con documentacion profesional pendiente de revisar en este momento." : "No doctors with pending professional documentation."}
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
                        onClick={() => onVerify(doc.id, "activo")}
                        disabled={updatingId !== null}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs gap-1.5 shadow-sm shadow-emerald-500/10"
                      >
                        {updatingId === doc.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UserCheck className="w-3.5 h-3.5" />
                        )}
                        {locale === "es" ? "Aprobar" : "Approve"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onVerify(doc.id, "rechazado")}
                        disabled={updatingId !== null}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg text-xs gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> {locale === "es" ? "Rechazar" : "Reject"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger>
                <Button size="sm" className="gap-2">
                  <Users className="w-4 h-4" /> Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{locale === "es" ? "Crear Usuario Manual" : "Create User"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>{locale === "es" ? "Nombre" : "Name"}</Label>
                    <Input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>{locale === "es" ? "Email" : "Email"}</Label>
                    <Input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>{locale === "es" ? "Contrasena" : "Password"}</Label>
                    <Input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>{locale === "es" ? "Rol" : "Role"}</Label>
                    <Select onValueChange={(v: string | null) => v && setCreateForm({ ...createForm, role: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paciente">Paciente</SelectItem>
                        <SelectItem value="medico">Medico</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateUser}>{locale === "es" ? "Crear" : "Create"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="glass-panel border-glass-border bg-background/25">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead>{locale === "es" ? "Nombre" : "Name"}</TableHead>
                    <TableHead>{locale === "es" ? "Email" : "Email"}</TableHead>
                    <TableHead>{locale === "es" ? "Cedula" : "License"}</TableHead>
                    <TableHead>{locale === "es" ? "Estado" : "Status"}</TableHead>
                    <TableHead>Acciones</TableHead>
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
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" aria-label="Editar" onClick={() => { setEditingUser(doc); setEditForm({ name: doc.name, email: doc.email, role: doc.role }); setShowEditModal(true); }}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" aria-label="Banear" onClick={() => handleBanUser(doc.id)} disabled={actionLoading === doc.id}>
                            <Ban className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" aria-label="Eliminar" onClick={() => handleDeleteUser(doc.id)} disabled={actionLoading === doc.id}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{locale === "es" ? "Editar Usuario" : "Edit User"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>{locale === "es" ? "Nombre" : "Name"}</Label>
              <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{locale === "es" ? "Email" : "Email"}</Label>
              <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>{locale === "es" ? "Rol" : "Role"}</Label>
              <Select onValueChange={(v: string | null) => v && setEditForm({ ...editForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="paciente">Paciente</SelectItem>
                  <SelectItem value="medico">Medico</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdateUser}>{locale === "es" ? "Guardar" : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}