"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, RefreshCw, CheckCircle, XCircle, Clock, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/LanguageProvider";

interface Payout {
  id: string;
  doctor: {
    user: { name: string; email: string };
  };
  amount: number;
  status: string;
  clabe: string | null;
  bankName: string | null;
  comment: string | null;
  createdAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente", color: "bg-amber-100 text-amber-800 border-amber-200" },
  review: { label: "En Revisión", color: "bg-blue-100 text-blue-800 border-blue-200" },
  paid: { label: "Pagado", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  cancelled: { label: "Cancelado", color: "bg-gray-100 text-gray-800 border-gray-200" },
};

export function DoctorPaymentsTable({
  initialPayouts,
  onUpdate,
}: {
  initialPayouts: Payout[];
  onUpdate?: () => void;
}) {
  const { locale } = useLanguage();
  const [payouts, setPayouts] = useState<Payout[]>(initialPayouts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [commentDialog, setCommentDialog] = useState<{
    payoutId: string;
    action: "review" | "paid" | "cancelled";
    comment: string;
  } | null>(null);

  const filteredPayouts = payouts.filter((p) => {
    const matchesSearch =
      p.doctor.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.doctor.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (payoutId: string, status: string, comment?: string) => {
    setLoading(payoutId);
    try {
      const res = await fetch("/api/admin/contabilidad/payouts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutId, status, comment }),
      });

      if (res.ok) {
        setPayouts((prev) =>
          prev.map((p) => (p.id === payoutId ? { ...p, status, comment: comment || p.comment } : p))
        );
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
      setCommentDialog(null);
    }
  };

  const handleAction = (payoutId: string, action: "review" | "paid" | "cancelled") => {
    const actionRequiresComment = action === "review" || action === "cancelled";
    if (actionRequiresComment) {
      setCommentDialog({ payoutId, action, comment: "" });
    } else {
      updateStatus(payoutId, action);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={locale === "es" ? "Buscar médico..." : "Search doctor..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border border-glass-border bg-background px-3 py-2"
        >
          <option value="all">{locale === "es" ? "Todos" : "All"}</option>
          <option value="pending">{STATUS_LABELS.pending.label}</option>
          <option value="review">{STATUS_LABELS.review.label}</option>
          <option value="paid">{STATUS_LABELS.paid.label}</option>
          <option value="cancelled">{STATUS_LABELS.cancelled.label}</option>
        </select>
      </div>

      {filteredPayouts.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          {locale === "es" ? "No hay pagos registrados." : "No payments registered."}
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground border-b">
            <tr>
              <th className="px-4 py-2 text-left">{locale === "es" ? "Médico" : "Doctor"}</th>
              <th className="px-4 py-2 text-left">{locale === "es" ? "CLABE / Banco" : "CLABE / Bank"}</th>
              <th className="px-4 py-2 text-right">{locale === "es" ? "Monto" : "Amount"}</th>
              <th className="px-4 py-2 text-center">{locale === "es" ? "Estado" : "Status"}</th>
              <th className="px-4 py-2 text-center">{locale === "es" ? "Acciones" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredPayouts.map((p) => (
              <tr key={p.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.doctor.user.name}</div>
                  <div className="text-xs text-muted-foreground">{p.doctor.user.email}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  <div>{p.clabe || "N/A"}</div>
                  <div className="text-muted-foreground">{p.bankName || "N/A"}</div>
                </td>
                <td className="px-4 py-3 text-right font-mono">${p.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <Badge className={cn("text-xs", STATUS_LABELS[p.status]?.color)}>
                    {STATUS_LABELS[p.status]?.label || p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  {loading === p.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    <div className="flex gap-1 justify-center">
                      {p.status === "pending" && (
                        <>
                          <Button size="sm" onClick={() => handleAction(p.id, "review")}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                            onClick={() => handleAction(p.id, "paid")}
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction(p.id, "cancelled")}
                          >
                            <XCircle className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Comment Dialog */}
      {commentDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl max-w-md w-full">
            <h3 className="font-bold mb-2">
              {locale === "es" ? "Agregar comentario" : "Add comment"}
            </h3>
            <textarea
              value={commentDialog.comment}
              onChange={(e) =>
                setCommentDialog({ ...commentDialog, comment: e.target.value })
              }
              placeholder={
                locale === "es"
                  ? "Razón del cambio de estado..."
                  : "Reason for status change..."
              }
              className="w-full rounded-md border border-glass-border bg-background p-2 mb-4"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setCommentDialog(null)}>
                {locale === "es" ? "Cancelar" : "Cancel"}
              </Button>
              <Button
                onClick={() =>
                  updateStatus(commentDialog.payoutId, commentDialog.action, commentDialog.comment)
                }
              >
                {locale === "es" ? "Confirmar" : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}