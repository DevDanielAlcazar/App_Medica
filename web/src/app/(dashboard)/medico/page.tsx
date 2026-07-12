"use client";

import { DoctorDashboard } from "@/components/doctor/DoctorDashboard";
import { useLanguage } from "@/providers/LanguageProvider";

export default function Page() {
  const { locale } = useLanguage();
  
  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <DoctorDashboard />
    </div>
  );
}