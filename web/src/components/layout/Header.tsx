"use client";

import { useUiStore } from "@/stores/uiStore";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { toggleSidebar } = useUiStore();

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
        <Button variant="ghost" size="icon" className="rounded-full bg-muted">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
