"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/providers/LanguageProvider";

interface Penalty {
  id: string;
  doctor: {
    user: { name: string; email: string };
  };
  amount: number;
  penaltyReason: string | null;
  status: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  applied: "Aplicada",
  disputed: "Disputada",
  reverted: "Revertida",
};

export function PenaltyTracker({ penalties }: { penalties: Penalty[] }) {
  const { locale } = useLanguage();

  return (
    <div className="space-y-4">
      {penalties.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          {locale === "es" ? "No hay penalizaciones registradas." : "No penalties registered."}
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-4 py-2 text-left">{locale === "es" ? "Médico" : "Doctor"}</th>
              <th className="px-4 py-2 text-left">{locale === "es" ? "Motivo" : "Reason"}</th>
              <th className="px-4 py-2 text-right">{locale === "es" ? "Monto" : "Amount"}</th>
              <th className="px-4 py-2 text-center">{locale === "es" ? "Estado" : "Status"}</th>
              <th className="px-4 py-2 text-left">{locale === "es" ? "Fecha" : "Date"}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {penalties.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.doctor.user.name}</div>
                  <div className="text-xs text-muted-foreground">{p.doctor.user.email}</div>
                </td>
                <td className="px-4 py-3">{p.penaltyReason || "-"}</td>
                <td className="px-4 py-3 text-right font-mono text-destructive">
                  -${p.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    className={p.status === "applied" ? "bg-destructive/10 text-destructive" : "bg-muted"}
                  >
                    {STATUS_LABELS[p.status] || p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}