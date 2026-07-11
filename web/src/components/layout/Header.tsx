"use client";

import { useUiStore } from "@/stores/uiStore";
import { useUserStore } from "@/stores/userStore";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { toggleSidebar } = useUiStore();
  const { user, logout } = useUserStore();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Error al cerrar sesión desde el encabezado:", err);
    }
  };

  const getProfilePath = () => {
    if (!user) return "/";
    return `/${user.role}/perfil`;
  };

  return (
    <header className="h-16 border-b border-glass-border glass-panel flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="font-outfit font-semibold text-lg hidden md:block">
          Dashboard
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full bg-muted w-9 h-9 flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer outline-none">
            <User className="w-5 h-5" />
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 glass-panel border-glass-border p-1">
            <div className="px-2.5 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-foreground leading-none">{user?.name || "Cargando..."}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email || "cargando..."}</p>
              </div>
            </div>
            
            <DropdownMenuSeparator className="bg-glass-border" />
            
            <DropdownMenuItem className="focus:bg-muted/50 cursor-default">
              <span className="text-xs font-semibold uppercase text-primary tracking-wider">
                Rol: {user?.role || "Invitado"}
              </span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-glass-border" />
            
            <Link href={getProfilePath()}>
              <DropdownMenuItem className="focus:bg-muted/50 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
            </Link>
            
            <DropdownMenuSeparator className="bg-glass-border" />
            
            <DropdownMenuItem 
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
