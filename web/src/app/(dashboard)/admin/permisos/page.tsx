"use client";

import { PermissionMatrix } from "@/components/admin/PermissionMatrix";
import { useLanguage } from "@/providers/LanguageProvider";

export default function Page() {
  const { locale } = useLanguage();
  
  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-outfit font-bold">
        {locale === "es" ? "Roles y Permisos" : "Roles and Permissions"}
      </h1>
      <PermissionMatrix />
    </div>
  );
}