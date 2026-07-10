"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Stethoscope, Activity, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomBar() {
  const pathname = usePathname();

  const links = [
    { href: "/paciente", label: "Inicio", icon: Home },
    { href: "/paciente/consulta", label: "Consulta", icon: Stethoscope },
    { href: "/paciente/historial", label: "Historial", icon: Activity },
    { href: "/paciente/calendario", label: "Calendario", icon: Calendar },
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
