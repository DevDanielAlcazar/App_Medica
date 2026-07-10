import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full max-w-4xl py-12 relative z-10">
      <Link href="/">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>
      </Link>

      <div className="glass-panel p-8 md:p-12 rounded-2xl border border-glass-border">
        <h1 className="text-3xl font-outfit font-bold mb-2">Política de Privacidad</h1>
        <p className="text-muted-foreground mb-8">Última actualización: 10 de Julio de 2026 | Versión 1.0</p>

        <div className="prose prose-invert max-w-none">
          <p>En Angélica Med, nos tomamos muy en serio la privacidad y seguridad de sus datos médicos. Esta política describe cómo recopilamos, usamos y protegemos su información.</p>

          <h3>1. Información que recopilamos</h3>
          <p>Recopilamos información personal como su nombre, correo electrónico y datos médicos proporcionados durante las consultas con Angélica.</p>

          <h3>2. Uso de la información</h3>
          <p>La información recopilada se utiliza exclusivamente para proporcionar análisis sintomático, recomendaciones de salud orientativas y mejorar la precisión de nuestros algoritmos médicos.</p>

          <h3>3. Protección de Datos (Compliance)</h3>
          <p>Todos los datos médicos se almacenan de forma cifrada y cumplen con las normativas internacionales de protección de datos en salud. No vendemos ni compartimos su información médica con terceros sin su consentimiento explícito.</p>
        </div>
      </div>
    </div>
  );
}
