"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Pencil, CheckCircle2, CreditCard, Coins, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string | null;
  stripeProductId: string | null;
  credits: number;
  price: number;
  currency: string;
  interval: string;
  isActive: boolean;
  features: string[];
  sortOrder: number;
}

const INTERVAL_LABELS: Record<string, string> = { monthly: "Mensual", yearly: "Anual", one_time: "Pago único" };

export default function AdminPlanesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Formulario nuevo plan
  const [newPlan, setNewPlan] = useState({
    name: "", description: "", stripePriceId: "", stripeProductId: "",
    credits: "", price: "", currency: "MXN", interval: "monthly",
    isActive: true, features: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadPlans = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/plans");
    const data = await res.json();
    if (data.success) setPlans(data.plans);
    setLoading(false);
  };

  useEffect(() => { loadPlans(); }, []);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPlan,
          credits: parseInt(newPlan.credits) || 0,
          price: parseFloat(newPlan.price) || 0,
          features: newPlan.features.split("\n").map(f => f.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Plan creado exitosamente.");
      setNewPlan({ name: "", description: "", stripePriceId: "", stripeProductId: "", credits: "", price: "", currency: "MXN", interval: "monthly", isActive: true, features: "" });
      loadPlans();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (plan: Plan) => {
    const res = await fetch("/api/admin/plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: plan.id, isActive: !plan.isActive }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error); return; }
    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, isActive: !p.isActive } : p));
  };

  const handleSavePriceId = async (plan: Plan, stripePriceId: string) => {
    const res = await fetch("/api/admin/plans", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: plan.id, stripePriceId }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error); return; }
    toast.success("Price ID de Stripe actualizado.");
    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, stripePriceId } : p));
    setEditingPlan(null);
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm("¿Eliminar este plan de suscripción?")) return;
    await fetch(`/api/admin/plans?id=${id}`, { method: "DELETE" });
    toast.success("Plan eliminado.");
    loadPlans();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 z-10 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-outfit font-bold">Planes de Suscripción</h1>
        <Button variant="outline" size="sm" onClick={loadPlans} className="gap-2 rounded-xl">
          <RefreshCw className="w-4 h-4" /> Recargar
        </Button>
      </div>

      {/* Formulario nuevo plan */}
      <Card className="glass-panel border-glass-border bg-background/25">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-primary uppercase flex items-center gap-2">
            <Plus className="w-4 h-4" /> Crear Nuevo Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePlan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Nombre del Plan</label>
                <Input value={newPlan.name} onChange={e => setNewPlan(p => ({ ...p, name: e.target.value }))} placeholder="Plan Familiar, Premium..." required className="rounded-xl border-glass-border bg-elevated/35" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Precio</label>
                <div className="flex gap-2">
                  <Input type="number" step="0.01" value={newPlan.price} onChange={e => setNewPlan(p => ({ ...p, price: e.target.value }))} placeholder="199.00" required className="rounded-xl border-glass-border bg-elevated/35" />
                  <select value={newPlan.currency} onChange={e => setNewPlan(p => ({ ...p, currency: e.target.value }))} className="bg-elevated/35 border border-glass-border text-foreground text-sm rounded-xl px-2 outline-none shrink-0">
                    <option>MXN</option><option>USD</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Periodicidad</label>
                <select value={newPlan.interval} onChange={e => setNewPlan(p => ({ ...p, interval: e.target.value }))} className="w-full bg-elevated/35 border border-glass-border text-foreground text-sm rounded-xl p-2.5 outline-none">
                  <option value="monthly">Mensual</option><option value="yearly">Anual</option><option value="one_time">Pago único</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Créditos Incluidos / Mes</label>
                <Input type="number" value={newPlan.credits} onChange={e => setNewPlan(p => ({ ...p, credits: e.target.value }))} placeholder="0" className="rounded-xl border-glass-border bg-elevated/35" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Stripe Price ID</label>
                <Input value={newPlan.stripePriceId} onChange={e => setNewPlan(p => ({ ...p, stripePriceId: e.target.value }))} placeholder="price_xxx (opcional)" className="rounded-xl border-glass-border bg-elevated/35 font-mono text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Stripe Product ID</label>
                <Input value={newPlan.stripeProductId} onChange={e => setNewPlan(p => ({ ...p, stripeProductId: e.target.value }))} placeholder="prod_xxx (opcional)" className="rounded-xl border-glass-border bg-elevated/35 font-mono text-xs" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Descripción</label>
              <Input value={newPlan.description} onChange={e => setNewPlan(p => ({ ...p, description: e.target.value }))} placeholder="Descripción breve del plan..." className="rounded-xl border-glass-border bg-elevated/35" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Features (una por línea)</label>
              <textarea value={newPlan.features} onChange={e => setNewPlan(p => ({ ...p, features: e.target.value }))} rows={3} placeholder={"Consultas ilimitadas\nHistorial clínico completo\nSoporte prioritario"} className="w-full bg-elevated/35 border border-glass-border text-foreground text-xs rounded-xl p-3 outline-none resize-none" />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground rounded-xl gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Crear Plan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de planes */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-glass-border rounded-2xl text-muted-foreground text-sm">
          No hay planes configurados. Crea el primero arriba.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map(plan => (
            <motion.div key={plan.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className={`glass-panel border-glass-border bg-background/25 flex flex-col h-full transition-colors ${plan.isActive ? "hover:border-primary/30" : "opacity-60"}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge variant="outline" className={`text-[9px] font-bold rounded-full ${plan.isActive ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-glass-border text-muted-foreground"}`}>
                        {plan.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <Badge variant="outline" className="text-[9px] border-glass-border text-muted-foreground">
                        {INTERVAL_LABELS[plan.interval] || plan.interval}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  {/* Precio y créditos */}
                  <div>
                    <div className="text-3xl font-bold font-outfit text-foreground">
                      ${plan.price.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">{plan.currency}</span>
                    </div>
                    {plan.credits > 0 && (
                      <div className="flex items-center gap-1 text-xs text-primary mt-1">
                        <Coins className="w-3.5 h-3.5" /> {plan.credits} créditos incluidos/mes
                      </div>
                    )}
                    {/* Features */}
                    {Array.isArray(plan.features) && plan.features.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {(plan.features as string[]).map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />{f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Stripe Price ID editable */}
                  <div className="space-y-2 pt-3 border-t border-glass-border">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><CreditCard className="w-3 h-3" /> Stripe Price ID</label>
                    {editingPlan?.id === plan.id ? (
                      <div className="flex gap-2">
                        <Input
                          defaultValue={plan.stripePriceId || ""}
                          id={`price-id-${plan.id}`}
                          placeholder="price_xxx"
                          className="rounded-lg border-glass-border bg-elevated/35 font-mono text-xs h-8"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => {
                          const el = document.getElementById(`price-id-${plan.id}`) as HTMLInputElement;
                          handleSavePriceId(plan, el.value);
                        }} className="bg-primary text-primary-foreground rounded-lg h-8 text-xs px-2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingPlan(null)} className="h-8 rounded-lg px-2">
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground flex-1 truncate">
                          {plan.stripePriceId || <em className="opacity-50">Sin configurar</em>}
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => setEditingPlan(plan)} className="h-7 rounded-lg px-2 text-xs gap-1 text-primary hover:bg-primary/10">
                          <Pencil className="w-3 h-3" /> Editar
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Switch checked={plan.isActive} onCheckedChange={() => handleToggleActive(plan)} />
                      <span className="text-xs text-muted-foreground">Publicado</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)} className="text-destructive hover:bg-destructive/10 rounded-lg gap-1 text-xs h-7">
                      <Trash2 className="w-3 h-3" /> Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
