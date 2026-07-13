"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbMap: Record<string, string> = {
    dashboard: "Panel",
    admin: "Admin",
    paciente: "Paciente",
    medico: "Médico",
    soporte: "Soporte",
    tickets: "Tickets",
    usuarios: "Usuarios",
    planes: "Planes",
    contabilidad: "Contabilidad",
    ia: "Inteligencia Artificial",
    anuncios: "Anuncios",
    gmail: "Gmail",
    perfil: "Perfil",
    wallet: "Wallet",
    nutrition: "Nutrición",
  };

  return (
    <nav aria-label="Migas de pan" className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
      <Link href="/(dashboard)" className="hover:text-foreground transition-colors" aria-label="Inicio">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {segments.map((seg, idx) => {
        const path = "/" + segments.slice(0, idx + 1).join("/");
        const isLast = idx === segments.length - 1;
        const label = breadcrumbMap[seg] || decodeURIComponent(seg);

        return isLast ? (
          <span key={path} className="font-medium text-foreground" aria-current="page">
            <ChevronRight className="w-3.5 h-3.5 inline mx-1" />
            {label}
          </span>
        ) : (
          <Link key={path} href={path} className="hover:text-foreground transition-colors">
            <ChevronRight className="w-3.5 h-3.5 inline mx-1" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}