"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Stethoscope, Activity, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/providers/LanguageProvider";

export function MobileBottomBar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: "/paciente", label: t("nav.home"), icon: Home },
    { href: "/paciente/consulta", label: t("nav.consulta"), icon: Stethoscope },
    { href: "/paciente/historial", label: t("nav.historial"), icon: Activity },
    { href: "/paciente/calendario", label: t("nav.calendario"), icon: Calendar },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-panel border-t border-glass-border flex justify-around p-2 z-50">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex flex-col items-center p-2 rounded-lg gap-1 min-w-[64px]",
            pathname === link.href ? "text-primary font-medium" : "text-muted-foreground"
          )}
        >
          <link.icon className="w-5 h-5" />
          <span className="text-[10px]">{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}
