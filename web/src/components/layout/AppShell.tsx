"use client";

import { useEffect } from "react";
import { useUiStore } from "@/stores/uiStore";
import { useUserStore } from "@/stores/userStore";
import { useCaseStore } from "@/stores/caseStore";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileBottomBar } from "./MobileBottomBar";
import { SafetyRibbon } from "../SafetyRibbon";
import { useTranslation } from "@/lib/i18n/config";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUiStore();
  const { role, user, setUser } = useUserStore();
  const { safetyStatus } = useCaseStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      fetch("/api/auth/me")
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error(t("auth.not_authenticated"));
        })
        .then((data) => {
          setUser(data.user, data.user.role);
        })
        .catch((err) => {
          console.error(t("auth.session_error"), err);
        });
    }
  }, [user, setUser, t]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full overflow-hidden transition-all">
        <Header />
        {role === "paciente" && <SafetyRibbon status={safetyStatus} />}
        <main className="flex-1 overflow-auto bg-muted/10 relative p-4 lg:p-6 pb-20 md:pb-6">
          {children}
        </main>
        <MobileBottomBar />
      </div>
    </div>
  );
}
