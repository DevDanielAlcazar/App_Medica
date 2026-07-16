"use client";

import { useUiStore } from "@/stores/uiStore";
import { useUserStore } from "@/stores/userStore";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: string;
}

export function Header() {
  const { toggleSidebar } = useUiStore();
  const { user, logout } = useUserStore();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementOpen, setAnnouncementOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetch("/api/announcements")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setAnnouncements(data.announcements);
        })
        .catch(() => {});
    }
  }, [user]);

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

  const hasUnreadAnnouncements = announcements.length > 0;

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
        
        <DropdownMenu open={announcementOpen} onOpenChange={setAnnouncementOpen}>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {hasUnreadAnnouncements && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover text-popover-foreground border shadow-md z-50 p-1 max-h-96 overflow-y-auto">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-semibold uppercase text-primary">
                Anuncios
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {announcements.length === 0 ? (
                <DropdownMenuItem disabled className="text-muted-foreground text-xs cursor-default">
                  No hay anuncios nuevos
                </DropdownMenuItem>
              ) : (
                announcements.map((a) => (
                  <DropdownMenuItem key={a.id} className="flex flex-col items-start gap-1 cursor-pointer focus:bg-accent">
                    <div className="font-medium text-sm">{a.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{a.content}</div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full bg-muted w-9 h-9 flex items-center justify-center hover:bg-muted/80 transition-colors cursor-pointer outline-none">
            <User className="w-5 h-5" />
          </DropdownMenuTrigger>
          
<DropdownMenuContent align="end" className="w-56 bg-popover text-popover-foreground border shadow-md z-50 p-1">
             <div className="px-2.5 py-2">
               <div className="flex flex-col space-y-1">
                 <p className="text-sm font-medium text-foreground leading-none">{user?.name || "Cargando..."}</p>
                 <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email || "cargando..."}</p>
               </div>
             </div>
             
             <DropdownMenuSeparator className="bg-border" />
             
             <DropdownMenuItem className="focus:bg-accent cursor-default">
               <span className="text-xs font-semibold uppercase text-primary tracking-wider">
                 Rol: {user?.role || "Invitado"}
               </span>
             </DropdownMenuItem>
             
             <DropdownMenuSeparator className="bg-border" />
             
             <DropdownMenuItem
               className="focus:bg-accent cursor-pointer"
               onClick={() => router.push(getProfilePath())}
             >
               <User className="mr-2 h-4 w-4" />
               <span>Mi Perfil</span>
             </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-border" />
            
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
