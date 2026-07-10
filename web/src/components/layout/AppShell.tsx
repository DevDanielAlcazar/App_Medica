"use client";

import { useUiStore } from "@/stores/uiStore";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileBottomBar } from "./MobileBottomBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useUiStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full overflow-hidden transition-all">
        <Header />
        <main className="flex-1 overflow-auto bg-muted/10 relative p-4 lg:p-6 pb-20 md:pb-6">
          {children}
        </main>
        <MobileBottomBar />
      </div>
    </div>
  );
}
