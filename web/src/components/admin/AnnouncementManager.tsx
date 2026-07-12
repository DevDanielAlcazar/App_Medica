"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Calendar, Users, AlertCircle, Loader2, Search, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";

interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: string;
  startDate: string;
  endDate: string | null;
  priority: number;
  isActive: boolean;
  createdAt: string;
}

const AUDIENCE_LABELS: Record<string, string> = {
  all: "Todos",
  paciente: "Pacientes",
  medico: "Médicos",
  admin: "Administradores",
  soporte: "Soporte",
  contabilidad: "Contabilidad",
};

export function AnnouncementManager() {
  const { locale } = useLanguage();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/anuncios");
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      } else {
        toast.error(data.error || "Error al cargar anuncios.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setAudience("all");
    setStartDate("");
    setEndDate("");
    setPriority(0);
    setIsActive(true);
    setEditingId(null);
    setFormOpen(false);
  };

  const handleEdit = (a: Announcement) => {
    setEditingId(a.id);
    setTitle(a.title);
    setContent(a.content);
    setAudience(a.audience);
    setStartDate(a.startDate.split("T")[0]);
    setEndDate(a.endDate ? a.endDate.split("T")[0] : "");
    setPriority(a.priority);
    setIsActive(a.isActive);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === "es" ? "¿Eliminar este anuncio?" : "Delete this announcement?")) return;

    try {
      const res = await fetch(`/api/admin/anuncios?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success(locale === "es" ? "Anuncio eliminado." : "Announcement deleted.");
        loadAnnouncements();
      } else {
        toast.error(data.error || "Error al eliminar.");
      }
    } catch (err) {
      toast.error("Error de conexión.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const body: any = {
        title,
        content,
        audience,
        priority,
        isActive,
      };

      const today = startDate || new Date().toISOString().split("T")[0];
      body.startDate = today;

      if (endDate) body.endDate = endDate;
      else body.endDate = null;

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? "/api/admin/anuncios" : "/api/admin/anuncios";
      if (editingId) body.id = editingId;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          editingId
            ? locale === "es"
              ? "Anuncio actualizado."
              : "Announcement updated."
            : locale === "es"
              ? "Anuncio creado."
              : "Announcement created."
        );
        resetForm();
        loadAnnouncements();
      } else {
        toast.error(data.error || "Error al guardar.");
      }
    } catch (err) {
      toast.error("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  const filteredAnnouncements = announcements.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder={locale === "es" ? "Buscar anuncios..." : "Search announcements..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {locale === "es" ? "Nuevo Anuncio" : "New Announcement"}
        </Button>
      </div>

      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="glass-panel border-glass-border">
              <CardHeader>
                <CardTitle>
                  {editingId
                    ? locale === "es"
                      ? "Editar Anuncio"
                      : "Edit Announcement"
                    : locale === "es"
                      ? "Crear Anuncio"
                      : "Create Announcement"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {locale === "es" ? "Título" : "Title"}
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {locale === "es" ? "Audiencia" : "Audience"}
                      </label>
                      <select
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        className="w-full rounded-md border border-glass-border bg-background px-3 py-2"
                      >
                        {Object.entries(AUDIENCE_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {locale === "es" ? "Contenido" : "Content"}
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      className="w-full rounded-md border border-glass-border bg-background px-3 py-2"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {locale === "es" ? "Fecha de inicio" : "Start Date"}
                      </label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {locale === "es" ? "Fecha de fin (opcional)" : "End Date (optional)"}
                      </label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">
                        {locale === "es" ? "Activo" : "Active"}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {locale === "es"
                          ? "Determina si el anuncio se muestra a los usuarios."
                          : "Determines if the announcement is shown to users."}
                      </p>
                    </div>
                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      {editingId
                        ? locale === "es"
                          ? "Actualizar"
                          : "Update"
                        : locale === "es"
                          ? "Crear"
                          : "Create"}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      {locale === "es" ? "Cancelar" : "Cancel"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <Card className="glass-panel border-glass-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {locale === "es" ? "No hay anuncios registrados." : "No announcements registered."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAnnouncements.map((a) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-panel border-glass-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{a.title}</h3>
                          <Badge
                            variant={a.isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {a.isActive
                              ? locale === "es"
                                ? "Activo"
                                : "Active"
                              : locale === "es"
                                ? "Inactivo"
                                : "Inactive"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {AUDIENCE_LABELS[a.audience] || a.audience}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{a.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {a.startDate.split("T")[0]}
                            {a.endDate && ` - ${a.endDate.split("T")[0]}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <GripVertical className="w-3 h-3" />
                            {locale === "es" ? "Prioridad" : "Priority"}: {a.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(a)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(a.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}