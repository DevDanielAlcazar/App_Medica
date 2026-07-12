"use client";

import { useEffect, useState } from "react";
import { HeartPulse } from "lucide-react";
import { NutritionPlanCard } from "@/components/patient/NutritionPlanCard";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";
import { useTranslation } from "@/lib/i18n/config";

interface DayPlan {
  day: string;
  meals: {
    desayuno: string;
    comida: string;
    cena: string;
  };
}

export default function NutritionPage() {
  const { locale } = useLanguage();
  const { t } = useTranslation();
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/patient/nutrition")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlan(data.plan?.days || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto z-10 relative space-y-6 p-4 pb-20 md:pb-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <HeartPulse className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-outfit font-bold">
            {t("nav.nutricion")}
          </h1>
          <p className="text-muted-foreground">
            {t("nutrition.subtitle")}
          </p>
        </div>
      </div>

      <NutritionPlanCard plan={plan} loading={loading} />
    </div>
  );
}