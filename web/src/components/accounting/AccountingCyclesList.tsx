"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";

interface Cycle {
  id: string;
  periodName: string;
  startDate: string;
  endDate: string;
  status: string;
  _count?: { payouts: number };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open: { label: "Abierto", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  closed: { label: "Cerrado", color: "bg-gray-100 text-gray-800 border-gray-200" },
  paid: { label: "Pagado", color: "bg-blue-100 text-blue-800 border-blue-200" },
};

export function AccountingCyclesList({ cycles }: { cycles: Cycle[] }) {
  const { locale } = useLanguage();

  return (
    <div className="space-y-4">
      {cycles.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          {locale === "es" ? "No hay ciclos registrados." : "No cycles registered."}
        </div>
      ) : (
        <div className="grid gap-4">
          {cycles.map((cycle) => (
            <div
              key={cycle.id}
              className="p-4 rounded-xl border border-glass-border bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{cycle.periodName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(cycle.startDate).toLocaleDateString()} -{" "}
                    {new Date(cycle.endDate).toLocaleDateString()}
                  </p>
                  {cycle._count && (
                    <p className="text-xs mt-1">{cycle._count.payouts} {locale === "es" ? "pagos" : "payments"}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      "text-xs",
                      STATUS_LABELS[cycle.status]?.color || ""
                    )}
                  >
                    {STATUS_LABELS[cycle.status]?.label || cycle.status}
                  </Badge>
                  <a
                    href={`/admin/contabilidad/ciclos/${cycle.id}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-muted h-8 px-3"
                  >
                    {locale === "es" ? "Ver Detalle" : "View Detail"}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}