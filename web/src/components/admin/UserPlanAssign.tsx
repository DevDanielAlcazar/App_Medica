"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, UserCog, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/config";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  planId: string | null;
  plan?: {
    id: string;
    name: string;
  } | null;
}

interface Plan {
  id: string;
  name: string;
  credits: number;
}

export function UserPlanAssign() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, plansRes] = await Promise.all([
        fetch("/api/admin/usuarios").then(r => r.json()),
        fetch("/api/admin/plans").then(r => r.json()),
      ]);
      if (usersRes.success) setUsers(usersRes.users);
      if (plansRes.success) setPlans(plansRes.plans);
    } catch (err) {
      toast.error(t("admin.error_connection"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const assignPlan = async (userId: string, planId: string) => {
    setAssigning(userId);
    try {
      const res = await fetch("/api/admin/usuarios/plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planId: planId || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, planId } : u));
      toast.success(t("admin.permissions_updated"));
    } catch (err) {
      toast.error(t("admin.error_save"));
    } finally {
      setAssigning(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="glass-panel border-glass-border">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <UserCog className="w-4 h-4 text-primary" />
          {t("admin.assign_plans")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <select
                value={user.planId || ""}
                onChange={e => assignPlan(user.id, e.target.value)}
                disabled={assigning === user.id}
                className="bg-background/50 border border-glass-border rounded px-2 py-1 text-xs"
              >
                <option value="">Sin plan</option>
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.credits} créditos)</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}