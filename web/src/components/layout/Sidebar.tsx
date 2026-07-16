"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";
import { useUiStore } from "@/stores/uiStore";
import { 
  Home, 
  Calendar, 
  CreditCard, 
  Activity, 
  Stethoscope, 
  ShieldCheck, 
  HeartPulse, 
  UserCircle, 
  MessageSquare,
  Users,
  Settings,
  Mail,
  AlertOctagon,
  FileSpreadsheet
} from "lucide-react";

import { useLanguage } from "@/providers/LanguageProvider";

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useUserStore();
  const { sidebarOpen } = useUiStore();
  const { t } = useLanguage();

  const getLabel = (label: string) => {
    switch (label) {
      case "Inicio": return t("nav.home");
      case "Consulta": return t("nav.consulta");
      case "Historial": return t("nav.historial");
      case "Calendario": return t("nav.calendario");
      case "Wallet": return t("nav.wallet");
      case "Nutrición": return t("nav.nutricion");
      case "Soporte": return t("nav.soporte");
      case "Perfil": return t("nav.perfil");
      default: return label;
    }
  };

  // 1. Enlaces para Paciente
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

  // 2. Enlaces para Médico
  const doctorLinks = [
    { href: "/medico", label: "Inicio", icon: Home },
    { href: "/medico/verificacion", label: "Verificación", icon: ShieldCheck },
    { href: "/medico/agenda", label: "Agenda", icon: Calendar },
    { href: "/medico/citas", label: "Citas", icon: Activity },
    { href: "/medico/pagos", label: "Pagos", icon: CreditCard },
    { href: "/medico/perfil", label: "Perfil", icon: UserCircle },
  ];

  // 3. Enlaces para Administrador y Superadministrador
  const adminLinks = [
    { href: "/admin", label: "Inicio", icon: Home },
    { href: "/admin/perfil", label: "Perfil", icon: UserCircle },
    { href: "/admin/usuarios", label: "Usuarios", icon: Users },
    { href: "/admin/ia", label: "Config IA", icon: Settings },
    { href: "/admin/planes", label: "Planes", icon: HeartPulse },
    { href: "/admin/stripe", label: "Stripe", icon: CreditCard },
    { href: "/admin/gmail", label: "Gmail SMTP", icon: Mail },
    { href: "/admin/anuncios", label: "Anuncios", icon: MessageSquare },
    { href: "/admin/permisos", label: "Permisos", icon: ShieldCheck },
  ];

  // 4. Enlaces para Soporte
  const supportLinks = [
    { href: "/soporte", label: "Inicio", icon: Home },
    { href: "/soporte/tickets", label: "Tickets", icon: MessageSquare },
    { href: "/soporte/usuarios", label: "Usuarios", icon: Users },
    { href: "/soporte/compensaciones", label: "Compensaciones", icon: CreditCard },
  ];

  // 5. Enlaces para Contabilidad
  const accountingLinks = [
    { href: "/contabilidad", label: "Inicio", icon: Home },
    { href: "/contabilidad/pagos-medicos", label: "Pagos Médicos", icon: CreditCard },
    { href: "/contabilidad/cortes", label: "Cortes", icon: Calendar },
    { href: "/contabilidad/penalizaciones", label: "Penalizaciones", icon: AlertOctagon },
    { href: "/contabilidad/reportes", label: "Reportes", icon: FileSpreadsheet },
  ];

  // Asignación dinámica de enlaces basados en el rol activo del store
  let links = patientLinks; // default fallback
  if (role === "medico") links = doctorLinks;
  else if (role === "admin" || role === "superadmin") links = adminLinks;
  else if (role === "soporte") links = supportLinks;
  else if (role === "contabilidad") links = accountingLinks;

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
                title={!sidebarOpen ? getLabel(link.label) : undefined}
              >
                <link.icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{getLabel(link.label)}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
