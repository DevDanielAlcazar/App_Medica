"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, Pencil, CheckCircle2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";

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
}

interface PlanEditorProps {
  plans: Plan[];
  onUpdate: (plans: Plan[]) => void;
}

export function PlanEditor({ plans, onUpdate }: PlanEditorProps) {
  const { locale } = useLanguage();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleToggleActive = async (plan: Plan) => {
    try {
      const res = await fetch("/api/admin/plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: plan.id, isActive: !plan.isActive }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      onUpdate(plans.map(p => p.id === plan.id ? { ...p, isActive: !p.isActive } : p));
    } catch (err) {
      toast.error(locale === "es" ? "Error al actualizar plan" : "Error updating plan");
    }
  };

  const handleSavePriceId = async (plan: Plan, stripePriceId: string) => {
    try {
      const res = await fetch("/api/admin/plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: plan.id, stripePriceId }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      onUpdate(plans.map(p => p.id === plan.id ? { ...p, stripePriceId } : p));
      setEditingPlan(null);
    } catch (err) {
      toast.error(locale === "es" ? "Error al guardar" : "Error saving");
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm(locale === "es" ? "¿Eliminar este plan?" : "Delete this plan?")) return;
    await fetch(`/api/admin/plans?id=${id}`, { method: "DELETE" });
    toast.success(locale === "es" ? "Plan eliminado" : "Plan deleted");
    onUpdate(plans.filter(p => p.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {plans.map(plan => (
        <Card key={plan.id} className={`glass-panel border-glass-border bg-background/25 flex flex-col h-full transition-colors ${plan.isActive ? "hover:border-primary/30" : "opacity-60"}`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
              </div>
              <Badge variant="outline" className={`text-[9px] font-bold rounded-full ${plan.isActive ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-glass-border text-muted-foreground"}`}>
                {plan.isActive ? (locale === "es" ? "Activo" : "Active") : (locale === "es" ? "Inactivo" : "Inactive")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-3xl font-bold font-outfit text-foreground">
                ${plan.price.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">{plan.currency}</span>
              </p>
              {plan.credits > 0 && (
                <p className="text-xs text-primary mt-1">
                  {plan.credits} {locale === "es" ? "créditos incluidos/mes" : "credits/month"}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-glass-border">
              <label className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> {locale === "es" ? "Stripe Price ID" : "Stripe Price ID"}
              </label>
              {editingPlan?.id === plan.id ? (
                <div className="flex gap-2 mt-1">
                  <Input defaultValue={plan.stripePriceId || ""} id={`price-${plan.id}`} placeholder="price_xxx" className="rounded-lg border-glass-border bg-elevated/35 font-mono text-xs h-8" autoFocus />
                  <Button size="sm" onClick={() => {
                    const el = document.getElementById(`price-${plan.id}`) as HTMLInputElement;
                    handleSavePriceId(plan, el.value);
                  }} className="bg-primary text-primary-foreground rounded-lg h-8 text-xs px-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingPlan(null)} className="h-8 rounded-lg px-2">
                    ✕
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs text-muted-foreground flex-1 truncate">
                    {plan.stripePriceId || <em className="opacity-50">{locale === "es" ? "Sin configurar" : "Not configured"}</em>}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => setEditingPlan(plan)} className="h-7 rounded-lg px-2 text-xs gap-1 text-primary hover:bg-primary/10">
                    <Pencil className="w-3 h-3" /> {locale === "es" ? "Editar" : "Edit"}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch checked={plan.isActive} onCheckedChange={() => handleToggleActive(plan)} />
                <span className="text-xs text-muted-foreground">{locale === "es" ? "Publicado" : "Published"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)} className="text-destructive hover:bg-destructive/10 rounded-lg gap-1 text-xs h-7">
                <Trash2 className="w-3 h-3" /> {locale === "es" ? "Eliminar" : "Delete"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}