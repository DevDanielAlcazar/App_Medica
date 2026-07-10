"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";
import { useUiStore } from "@/stores/uiStore";
import { Home, Calendar, CreditCard, Activity, Stethoscope, ShieldCheck, HeartPulse, UserCircle, MessageSquare } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useUserStore();
  const { sidebarOpen } = useUiStore();

  const patientLinks = [
    { href: "/paciente", label: "Inicio", icon: Home },
    { href: "/paciente/consulta", label: "Consulta", icon: Stethoscope },
    { href: "/paciente/historial", label: "Historial", icon: Activity },
    { href: "/paciente/calendario", label: "Calendario", icon: Calendar },
    { href: "/paciente/wallet", label: "Wallet", icon: CreditCard },
    { href: "/paciente/nutricion", label: "Nutrición", icon: HeartPulse },
    { href: "/paciente/soporte", label: "Soporte", icon: MessageSquare },
    { href: "/paciente/perfil", label: "Perfil", icon: UserCircle },
  ];

  const links = role === "paciente" ? patientLinks : []; // Expand for other roles in next phases

  return (
    <aside className={cn(
      "hidden md:flex flex-col border-r border-glass-border glass-panel transition-all duration-300",
      sidebarOpen ? "w-64" : "w-16"
    )}>
      <div className="h-16 flex items-center justify-center border-b border-glass-border">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center">
          <span className="text-white font-bold">A</span>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-muted/50",
                  pathname === link.href ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                )}
                title={!sidebarOpen ? link.label : undefined}
              >
                <link.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{link.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
