"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, Apple, Coffee, Utensils } from "lucide-react";

export default function NutritionPage() {
  const plan = [
    { meal: "Desayuno", items: ["Avena con leche de almendras", "Manzana", "Té verde"], icon: Coffee },
    { meal: "Comida", items: ["Pechuga de pollo a la plancha", "Ensalada verde", "Quinoa"], icon: Utensils },
    { meal: "Cena", items: ["Salmón al horno", "Espárragos", "Agua mineral"], icon: Apple },
  ];

  return (
    <div className="max-w-4xl mx-auto z-10 relative space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <HeartPulse className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-outfit font-bold">Plan Nutricional</h1>
          <p className="text-muted-foreground">Generado por IA basado en tu historial clínico</p>
        </div>
      </div>

      <div className="grid gap-4 mt-6">
        {plan.map((p, i) => (
          <Card key={i} className="glass-panel border-glass-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <p.icon className="w-5 h-5 text-primary" /> {p.meal}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {p.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm">
        <strong>Nota de Angélica:</strong> He evitado incluir alimentos altos en sodio debido a tus registros recientes de presión arterial.
        <br/><br/>
        <span className="text-xs text-muted-foreground italic">Plan orientativo. Consulte a su nutriólogo.</span>
      </div>
    </div>
  );
}
