"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard, ShieldCheck, Webhook, Key, CheckCircle2,
  AlertCircle, ExternalLink, Info
} from "lucide-react";

const STRIPE_SECRET = process.env.NEXT_PUBLIC_APP_URL; // Solo para saber si estamos en producción

export default function AdminStripePage() {
  const stripeConfigured =
    typeof window !== "undefined" &&
    false; // En SSG siempre false; la verificación real es server-side en el webhook

  const envVars = [
    {
      key: "STRIPE_SECRET_KEY",
      label: "Clave Secreta de Stripe",
      hint: "Empieza con sk_live_ (producción) o sk_test_ (pruebas). Nunca la expongas al cliente.",
      example: "sk_test_51ABC...",
      docs: "https://dashboard.stripe.com/apikeys",
      type: "secret",
    },
    {
      key: "STRIPE_WEBHOOK_SECRET",
      label: "Webhook Signing Secret",
      hint: "Se obtiene al registrar el endpoint en el dashboard de Stripe. Empieza con whsec_.",
      example: "whsec_...",
      docs: "https://dashboard.stripe.com/webhooks",
      type: "secret",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 z-10 relative">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold">Configuración de Stripe</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra la integración de pagos real con Stripe para recarga de créditos y suscripciones.
          </p>
        </div>
        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-xs shrink-0">
          <Info className="w-3 h-3 mr-1" /> Bypass Mode Activo
        </Badge>
      </div>

      {/* Estado de integración */}
      <Card className="glass-panel border-glass-border bg-background/25">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Estado de la Integración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "STRIPE_SECRET_KEY", desc: "Llave secreta del backend" },
            { label: "STRIPE_WEBHOOK_SECRET", desc: "Verificación de firmas de webhook" },
          ].map((v) => (
            <div key={v.label} className="flex items-center justify-between p-3 rounded-xl bg-elevated/30 border border-glass-border">
              <div>
                <p className="font-mono text-xs font-bold text-foreground">{v.label}</p>
                <p className="text-[10px] text-muted-foreground">{v.desc}</p>
              </div>
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 bg-yellow-500/10 text-[9px] font-bold">
                <AlertCircle className="w-3 h-3 mr-1" /> No Configurada
              </Badge>
            </div>
          ))}
          <div className="flex gap-2 p-3 bg-primary/10 border border-primary/20 rounded-xl text-[10px] text-muted-foreground leading-relaxed">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>
              Las variables de entorno de Stripe se configuran directamente en el archivo <code className="font-mono bg-muted/40 px-1 rounded">.env</code> de la carpeta <code className="font-mono bg-muted/40 px-1 rounded">web/</code>. No se almacenan en base de datos para mayor seguridad. Al detectar la ausencia de estas variables, el sistema activa automáticamente el <strong>Bypass Mode</strong> de desarrollo.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Guía de configuración */}
      <div className="space-y-4">
        {envVars.map((v) => (
          <Card key={v.key} className="glass-panel border-glass-border bg-background/25">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                {v.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{v.hint}</p>
              <div className="bg-elevated/30 border border-glass-border rounded-xl p-3 space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Agregar al archivo web/.env</p>
                <code className="block font-mono text-xs text-primary bg-background/50 p-2 rounded-lg">
                  {v.key}=&quot;{v.example}&quot;
                </code>
              </div>
              <a href={v.docs} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                <ExternalLink className="w-3 h-3" /> Obtener en el Dashboard de Stripe
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Webhook endpoint */}
      <Card className="glass-panel border-glass-border bg-background/25">
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <Webhook className="w-4 h-4 text-secondary" />
            URL del Endpoint Webhook
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Registra esta URL en tu Dashboard de Stripe → Webhooks para procesar pagos en tiempo real.
          </p>
          <div className="bg-elevated/30 border border-glass-border rounded-xl p-3">
            <code className="font-mono text-xs text-primary">
              https://TU_DOMINIO.com/api/webhooks/stripe
            </code>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Eventos a suscribirse</p>
            {["checkout.session.completed", "payment_intent.succeeded", "invoice.payment_failed"].map((event) => (
              <div key={event} className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <code className="font-mono text-muted-foreground">{event}</code>
              </div>
            ))}
          </div>
          <div className="flex gap-2 p-3 bg-muted/20 border border-glass-border rounded-xl text-[10px] text-muted-foreground leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              El endpoint verifica la firma criptográfica <code className="font-mono bg-muted/40 px-1 rounded">stripe-signature</code> en cada request usando tu <code className="font-mono bg-muted/40 px-1 rounded">STRIPE_WEBHOOK_SECRET</code> antes de procesar cualquier pago.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Entorno de pruebas */}
      <Card className="glass-panel border-glass-border bg-background/25">
        <CardHeader>
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-yellow-500" />
            Tarjetas de Prueba (Stripe Test Mode)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-glass-border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Número</th>
                  <th className="text-left p-3 font-semibold text-muted-foreground">Escenario</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { num: "4242 4242 4242 4242", scenario: "Pago exitoso" },
                  { num: "4000 0000 0000 9995", scenario: "Fondos insuficientes" },
                  { num: "4000 0025 0000 3155", scenario: "Requiere autenticación 3D Secure" },
                  { num: "4000 0000 0000 0002", scenario: "Tarjeta declinada genérica" },
                ].map((t) => (
                  <tr key={t.num} className="border-t border-glass-border hover:bg-background/20 transition-colors">
                    <td className="p-3 font-mono text-primary">{t.num}</td>
                    <td className="p-3 text-muted-foreground">{t.scenario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Usa cualquier fecha de expiración futura y CVC de 3 dígitos con las tarjetas de prueba anteriores.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
