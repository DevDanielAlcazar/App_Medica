import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl py-12 relative z-10">
      <Link href="/">
        <Button variant="ghost" className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver
        </Button>
      </Link>

      <div className="glass-panel p-8 md:p-12 rounded-2xl border border-glass-border">
        <h1 className="text-3xl font-outfit font-bold mb-2">Términos y Condiciones</h1>
        <p className="text-muted-foreground mb-8">Última actualización: 10 de Julio de 2026</p>

        <div className="prose prose-invert max-w-none">
          <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg mb-8">
            <h3 className="text-destructive font-bold mt-0">DISCLAIMER MÉDICO OBLIGATORIO</h3>
            <p className="text-sm text-destructive-foreground/90 mb-0">
              Angélica Med es un asistente informativo basado en inteligencia artificial. <strong>En ningún caso sustituye el diagnóstico, tratamiento, o consejo médico profesional.</strong> En caso de emergencia médica, contacte inmediatamente a los servicios de urgencia de su localidad o acuda al centro de salud más cercano.
            </p>
          </div>

          <h3>1. Aceptación de los términos</h3>
          <p>Al utilizar Angélica Med, usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al servicio.</p>

          <h3>2. Naturaleza del Servicio</h3>
          <p>El servicio proporciona análisis sintomático y orientación general basada en protocolos médicos. No prescribe medicamentos controlados ni emite diagnósticos definitivos.</p>

          <h3>3. Responsabilidad del Usuario</h3>
          <p>Usted es responsable de la veracidad de la información proporcionada. La precisión de las recomendaciones de Angélica depende directamente de la información que usted ingresa.</p>
        </div>
      </div>
    </div>
  );
}
