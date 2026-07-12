"use client";

import { useEffect, useState } from "react";
import { PenaltyTracker } from "@/components/accounting/PenaltyTracker";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

export default function Page() {
  const { locale } = useLanguage();
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch penalties from payouts with penaltyAmount > 0
    fetch("/api/admin/contabilidad/payouts")
      .then((res) => res.json())
      .then((data) => {
        // Filter to get only penalties
        const penaltyData = (data.payouts || [])
          .filter((p: any) => p.penaltyAmount > 0)
          .map((p: any) => ({
            ...p,
            amount: p.penaltyAmount,
            status: "applied",
          }));
        setPenalties(penaltyData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-outfit font-bold">
        {locale === "es" ? "Penalizaciones" : "Penalties"}
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <PenaltyTracker penalties={penalties} />
      )}
    </div>
  );
}