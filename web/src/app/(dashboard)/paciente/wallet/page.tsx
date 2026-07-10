"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function WalletPage() {
  const transactions = [
    { id: 1, date: "2026-07-10", desc: "Recarga de Créditos", amount: 100, type: "in", status: "completado" },
    { id: 2, date: "2026-07-05", desc: "Consulta Dr. Ramírez", amount: -50, type: "out", status: "completado" },
  ];

  return (
    <div className="max-w-4xl mx-auto z-10 relative space-y-6">
      <h1 className="text-3xl font-outfit font-bold">Wallet y Créditos</h1>

      <Card className="glass-panel border-glass-border overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
        <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Saldo Disponible</p>
            <h2 className="text-5xl font-bold font-outfit flex items-end gap-2">
              150 <span className="text-xl text-primary font-normal pb-1">créditos</span>
            </h2>
          </div>
          <Button size="lg" className="w-full md:w-auto gap-2">
            <Plus className="w-5 h-5" /> Comprar Créditos
          </Button>
        </CardContent>
      </Card>

      <div className="glass-panel rounded-xl border border-glass-border p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-muted-foreground" />
          Historial de Movimientos
        </h3>

        <div className="rounded-md border border-glass-border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground text-sm">{t.date}</TableCell>
                  <TableCell className="font-medium">{t.desc}</TableCell>
                  <TableCell>
                    <span className={`flex items-center gap-1 ${t.type === 'in' ? 'text-green-500' : ''}`}>
                      {t.type === 'in' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {t.amount > 0 ? `+${t.amount}` : t.amount} cr
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
