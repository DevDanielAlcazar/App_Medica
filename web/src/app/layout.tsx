import type { Metadata } from "next";
import { SafetyRibbon } from "@/components/SafetyRibbon";
import "./globals.css";

export const metadata: Metadata = {
  title: "Angélica Med | IA Médica Gold Standard",
  description: "Asistente médico impulsado por inteligencia artificial con rigor clínico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased font-sans flex flex-col h-screen overflow-hidden">
        <SafetyRibbon status="warning" />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
