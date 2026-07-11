"use client";

import { useEffect, useState, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowUpRight, ArrowDownRight, Plus, Loader2, Coins, ArrowRight, ShieldCheck, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

interface Transaction {
  id: string;
  createdAt: string;
  description: string;
  amount: number;
  type: string;
  status: string;
}

function WalletPageContent() {
  const searchParams = useSearchParams();

  // Estados de datos
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de control del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [buyingOption, setBuyingOption] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // 1. Cargar datos del Wallet
  const loadWalletData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/patient/wallet");
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
        setTransactions(data.transactions);
      } else {
        toast.error(data.error || "No se pudo obtener el saldo de tu billetera.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error de conexión al cargar la billetera.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();

    // Mostrar notificaciones de éxito o cancelación basadas en query params
    if (searchParams.get("success")) {
      toast.success("¡Tu pago ha sido procesado! Los créditos han sido añadidos.");
    }
    if (searchParams.get("cancel")) {
      toast.error("El proceso de pago fue cancelado.");
    }
  }, [searchParams]);

  // 2. Procesar compra de créditos
  const handlePurchase = async (option: number) => {
    try {
      setCheckoutLoading(true);
      setBuyingOption(option);

      const res = await fetch("/api/patient/wallet/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creditsOption: option }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar el checkout.");
      }

      // Redireccionar al checkout de Stripe (o al simulador local)
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error al procesar la compra.");
      setCheckoutLoading(false);
      setBuyingOption(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto z-10 relative space-y-6">
      <h1 className="text-3xl font-outfit font-bold">Wallet y Créditos</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>Consultando tu saldo y transacciones contables...</span>
        </div>
      ) : (
        <>
          {/* Card del Balance */}
          <Card className="glass-panel border-glass-border overflow-hidden relative bg-background/30 backdrop-blur-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
            <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Saldo Disponible</p>
                <h2 className="text-5xl font-bold font-outfit flex items-end gap-2 text-foreground">
                  {balance ?? 0} <span className="text-xl text-primary font-normal pb-1">créditos</span>
                </h2>
              </div>
              <Button onClick={() => setModalOpen(true)} size="lg" className="w-full md:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl">
                <Plus className="w-5 h-5" /> Comprar Créditos
              </Button>
            </CardContent>
          </Card>

          {/* Historial de Movimientos */}
          <div className="glass-panel rounded-2xl border border-glass-border p-6 bg-background/25">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              Historial de Movimientos Ledger
            </h3>

            {transactions.length === 0 ? (
              <div className="text-center py-10 text-xs text-muted-foreground border border-dashed border-glass-border rounded-xl">
                No se registran movimientos en tu cuenta contable.
              </div>
            ) : (
              <div className="rounded-xl border border-glass-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((t) => (
                      <TableRow key={t.id} className="hover:bg-background/20 transition-colors">
                        <TableCell className="text-muted-foreground text-xs">
                          {new Date(t.createdAt).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="font-medium text-xs">{t.description}</TableCell>
                        <TableCell>
                          <span className={`flex items-center gap-1 text-xs font-semibold ${t.type === 'in' ? 'text-emerald-500' : 'text-foreground'}`}>
                            {t.type === 'in' ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                            {t.amount > 0 ? `+${t.amount}` : t.amount} cr
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] uppercase font-bold rounded-full ${t.status === 'completed' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 'border-glass-border text-muted-foreground'}`}>
                            {t.status === "completed" ? "completado" : t.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de Selección de Paquetes */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative glass-panel bg-background/95 w-full max-w-lg p-6 rounded-2xl border border-glass-border shadow-2xl space-y-6 z-10"
            >
              <div className="flex justify-between items-center pb-3 border-b border-glass-border">
                <h3 className="text-xl font-bold text-foreground">Comprar Créditos</h3>
                <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Paquete 1: 200 cr */}
                <div className="glass-panel bg-background/30 hover:border-primary/50 transition-all border border-glass-border p-4 rounded-xl flex flex-col justify-between h-[180px]">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Básico</h4>
                    <span className="text-2xl font-bold text-foreground block mt-2">200 cr</span>
                    <span className="text-xs text-muted-foreground mt-1 block">Ideal para 1 consulta virtual</span>
                  </div>
                  <Button
                    onClick={() => handlePurchase(200)}
                    disabled={checkoutLoading}
                    className="w-full bg-elevated hover:bg-primary hover:text-primary-foreground text-foreground border border-glass-border rounded-lg text-xs"
                  >
                    {checkoutLoading && buyingOption === 200 ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      "Comprar por $200 MXN"
                    )}
                  </Button>
                </div>

                {/* Paquete 2: 500 cr */}
                <div className="glass-panel bg-primary/5 hover:border-primary/50 border-2 border-primary/40 transition-all p-4 rounded-xl flex flex-col justify-between h-[180px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-bold py-0.5 px-2 rounded-bl-lg uppercase">
                    10% Ahorro
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-primary uppercase tracking-wider">Premium</h4>
                    <span className="text-2xl font-bold text-foreground block mt-2">500 cr</span>
                    <span className="text-xs text-muted-foreground mt-1 block">Ideal para 2.5 consultas</span>
                  </div>
                  <Button
                    onClick={() => handlePurchase(500)}
                    disabled={checkoutLoading}
                    className="w-full bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg text-xs shadow-sm"
                  >
                    {checkoutLoading && buyingOption === 500 ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      "Comprar por $450 MXN"
                    )}
                  </Button>
                </div>

                {/* Paquete 3: 1000 cr */}
                <div className="glass-panel bg-background/30 hover:border-primary/50 transition-all border border-glass-border p-4 rounded-xl flex flex-col justify-between h-[180px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-secondary text-white text-[8px] font-bold py-0.5 px-2 rounded-bl-lg uppercase">
                    20% Ahorro
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Elite</h4>
                    <span className="text-2xl font-bold text-foreground block mt-2">1000 cr</span>
                    <span className="text-xs text-muted-foreground mt-1 block">Ideal para 5 consultas</span>
                  </div>
                  <Button
                    onClick={() => handlePurchase(1000)}
                    disabled={checkoutLoading}
                    className="w-full bg-elevated hover:bg-secondary hover:text-white text-foreground border border-glass-border rounded-lg text-xs"
                  >
                    {checkoutLoading && buyingOption === 1000 ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      "Comprar por $800 MXN"
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 p-3 bg-muted/30 border border-glass-border rounded-xl text-[10px] text-muted-foreground leading-relaxed items-start">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Pago Seguro:</strong> Todas las transacciones son encriptadas de forma segura de extremo a extremo a través de Stripe. Tus datos financieros nunca tocan nuestros servidores.
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Cargando tu monedero seguro...</span>
      </div>
    }>
      <WalletPageContent />
    </Suspense>
  );
}
