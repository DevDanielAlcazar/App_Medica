"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

interface Transaction {
  id: string;
  createdAt: string;
  description: string;
  amount: number;
  type: string;
  status: string;
}

interface WalletLedgerProps {
  transactions: Transaction[];
  loading?: boolean;
}

export function WalletLedger({ transactions }: WalletLedgerProps) {
  const { locale } = useLanguage();
  const t = (key: string) => {
    const translations: Record<string, string> = {
      ledger_history: locale === "es" ? "Historial de Transacciones" : "Transaction History",
      date: locale === "es" ? "Fecha" : "Date",
      concept: locale === "es" ? "Concepto" : "Concept",
      amount: locale === "es" ? "Monto" : "Amount",
      status: locale === "es" ? "Estado" : "Status",
      no_transactions: locale === "es" ? "No se registran movimientos en tu cuenta contable." : "No transactions recorded on this account.",
      completed: locale === "es" ? "completado" : "completed",
    };
    return translations[key] || key;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-xs text-muted-foreground border border-dashed border-glass-border rounded-xl">
        {t("no_transactions")}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-glass-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>{t("date")}</TableHead>
            <TableHead>{t("concept")}</TableHead>
            <TableHead>{t("amount")}</TableHead>
            <TableHead>{t("status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="hover:bg-background/20 transition-colors">
              <TableCell className="text-muted-foreground text-xs">
                {new Date(tx.createdAt).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="font-medium text-xs">{tx.description}</TableCell>
              <TableCell>
                <span className={`flex items-center gap-1 text-xs font-semibold ${tx.type === "in" ? "text-emerald-500" : "text-foreground"}`}>
                  {tx.type === "in" ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} cr
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase font-bold rounded-full ${
                    tx.status === "completed"
                      ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                      : "border-glass-border text-muted-foreground"
                  }`}
                >
                  {tx.status === "completed" ? t("completed") : tx.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}