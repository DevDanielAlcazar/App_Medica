import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { SafetyRibbon } from "@/components/SafetyRibbon";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

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
    <html lang="es" suppressHydrationWarning className={cn(inter.variable, outfit.variable, "antialiased font-sans")}>
      <body className={cn(inter.variable, outfit.variable, "antialiased font-sans flex flex-col h-screen overflow-hidden")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <SafetyRibbon status="warning" />
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
