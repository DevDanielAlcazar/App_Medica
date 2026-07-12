"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Coffee, Utensils, Apple } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const MEAL_KEY_LABELS: Record<string, string> = {
  desayuno: "nutrition.breakfast",
  comida: "nutrition.lunch",
  cena: "nutrition.dinner",
};

export function NutritionPlanCard({ plan, loading }: { plan: DayPlan[] | null; loading: boolean }) {
  const { locale } = useLanguage();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="glass-panel border-glass-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 bg-muted rounded animate-pulse" />
                <div className="h-5 bg-muted rounded w-24 animate-pulse" />
              </div>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 bg-muted rounded w-full animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!plan || plan.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t("nutrition.no_plan")}
      </div>
    );
  }

  const mealIcons = {
    desayuno: Coffee,
    comida: Utensils,
    cena: Apple,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {["desayuno", "comida", "cena"].map((meal) => {
          const Icon = mealIcons[meal as keyof typeof mealIcons];
          return (
            <Card key={meal} className="glass-panel border-glass-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  {t(MEAL_KEY_LABELS[meal])}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {plan[0]?.meals?.[meal as "desayuno" | "comida" | "cena"] || "-"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t("nutrition.weekly_plan")}</h3>
        <div className="grid gap-3">
          {plan.map((dayPlan) => (
            <Card key={dayPlan.day} className="glass-panel border-glass-border">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">{dayPlan.day}</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-primary font-medium">
                      {t("nutrition.breakfast_label")}
                    </span>{" "}
                    {dayPlan.meals.desayuno}
                  </p>
                  <p>
                    <span className="text-primary font-medium">
                      {t("nutrition.lunch_label")}
                    </span>{" "}
                    {dayPlan.meals.comida}
                  </p>
                  <p>
                    <span className="text-primary font-medium">
                      {t("nutrition.dinner_label")}
                    </span>{" "}
                    {dayPlan.meals.cena}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm">
        <strong>{t("nutrition.note")}</strong>{" "}
        {t("nutrition.note_description")}
        <br />
        <span className="text-xs text-muted-foreground italic">
          {t("nutrition.disclaimer")}
        </span>
      </div>
    </div>
  );
}