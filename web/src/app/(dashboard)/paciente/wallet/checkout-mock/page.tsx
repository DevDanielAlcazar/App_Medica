"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2, Coins, CreditCard, ChevronRight, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const CREDIT_PACKAGES: Record<number, { cost: number; name: string }> = {
  200: { cost: 200, name: "Paquete Clínico Básico (200 créditos)" },
  500: { cost: 450, name: "Paquete Clínico Premium (500 créditos)" },
  1000: { cost: 800, name: "Paquete Clínico Elite (1000 créditos)" },
};

function CheckoutMockContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const creditsParam = searchParams.get("credits");
  const credits = creditsParam ? parseInt(creditsParam, 10) : 200;
  const selectedPackage = CREDIT_PACKAGES[credits] || CREDIT_PACKAGES[200];

  // Estado del formulario
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("•••");
  const [cardName, setCardName] = useState("DANIEL ALCAZAR");
  
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handlePaySimulated = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setError("");

    try {
      // Llamar a la API de éxito simulado
      const res = await fetch("/api/patient/wallet/mock-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al procesar la simulación de pago.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/paciente/wallet?success=true");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al simular la transacción.");
      setPaying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto z-10 relative space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-outfit text-foreground flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-primary" /> Pasarela Simulada
        </h1>
        <Link href="/paciente/wallet?cancel=true">
          <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <XCircle className="w-4 h-4" /> Cancelar
          </button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="glass-panel border-glass-border overflow-hidden bg-background/40 backdrop-blur-md shadow-2xl">
          <div className="p-4 bg-primary/10 border-b border-glass-border flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold uppercase">Modo Bypass Activo</span>
            <span className="text-primary font-bold">Créditos de prueba</span>
          </div>

          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Coins className="w-5 h-5 text-warning" />
              Resumen del Pedido
            </CardTitle>
            <div className="flex justify-between items-center border-t border-glass-border pt-4 mt-2">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-foreground block">{selectedPackage.name}</span>
                <span className="text-xs text-muted-foreground block">Recarga de {credits} créditos</span>
              </div>
              <span className="text-xl font-bold font-outfit text-foreground">${selectedPackage.cost}.00 MXN</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg text-xs font-semibold">
                {error}
              </div>
            )}

            {success ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                <h3 className="font-bold text-lg text-emerald-500">¡Simulación de Pago Exitosa!</h3>
                <p className="text-xs text-muted-foreground">Abonando créditos al ledger contable...</p>
              </div>
            ) : (
              <form onSubmit={handlePaySimulated} className="space-y-4">
                {/* Nombre de Tarjeta */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Titular de Tarjeta</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="w-full bg-elevated border border-glass-border text-foreground text-xs rounded-xl p-3 outline-none"
                    disabled={paying}
                  />
                </div>

                {/* Número de Tarjeta */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">Número de Tarjeta</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-elevated border border-glass-border text-foreground text-xs rounded-xl p-3 outline-none pl-10"
                      disabled={paying}
                    />
                    <CreditCard className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Expiración y CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Expiración</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-elevated border border-glass-border text-foreground text-xs rounded-xl p-3 outline-none"
                      disabled={paying}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-elevated border border-glass-border text-foreground text-xs rounded-xl p-3 outline-none"
                      disabled={paying}
                    />
                  </div>
                </div>

                {/* Aviso Informativo */}
                <div className="flex gap-2 p-3 bg-muted/20 border border-glass-border rounded-xl text-[10px] text-muted-foreground leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Estás operando en <strong>Modo Bypass de Prueba</strong>. No se realizará ningún cargo real. Da clic al botón para acreditar saldo automáticamente.
                  </span>
                </div>

                {/* Botón de Confirmación */}
                <Button
                  type="submit"
                  disabled={paying}
                  className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 gap-2 text-xs"
                >
                  {paying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Procesando Cobro Simulado...
                    </>
                  ) : (
                    <>
                      Simular Pago de ${selectedPackage.cost}.00 MXN
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function CheckoutMockPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Cargando pasarela de pago segura...</span>
      </div>
    }>
      <CheckoutMockContent />
    </Suspense>
  );
}
