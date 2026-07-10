import type { Metadata } from "next";
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
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
