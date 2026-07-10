"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Stethoscope, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-panel border-b border-glass-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="font-outfit font-bold text-xl tracking-tight">Angélica Med</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Características</a>
            <a href="#plans" className="hover:text-foreground transition-colors">Planes</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contacto</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
        
        <div className="container mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl lg:text-7xl font-outfit font-extrabold tracking-tight mb-6">
              IA Médica <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Gold Standard
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Asistente médico impulsado por inteligencia artificial con rigor clínico, diseñado para pacientes y profesionales de la salud.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Comenzar Ahora <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Agendar Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-outfit font-bold text-center mb-16">Nuestros Pilares Clínicos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Stethoscope className="w-8 h-8 text-cyan-400" />}
              title="Rigor Clínico"
              description="Basado en protocolos médicos actualizados y revisados por especialistas."
            />
            <FeatureCard
              icon={<Activity className="w-8 h-8 text-purple-400" />}
              title="Monitoreo Continuo"
              description="Seguimiento proactivo de síntomas y evolución del paciente."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-green-400" />}
              title="Seguridad y Privacidad"
              description="Cumplimiento estricto con normativas de protección de datos médicos."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-glass-border">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Angélica Med. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-foreground">Privacidad</Link>
            <Link href="/terms" className="hover:text-foreground">Términos</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl glass-panel border border-glass-border flex flex-col items-center text-center"
    >
      <div className="mb-4 p-4 rounded-full bg-background/50">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
