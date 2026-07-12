"use client";

import { useEffect, useState } from "react";
import { DoctorPaymentsTable } from "@/components/accounting/DoctorPaymentsTable";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

export default function Page() {
  const { locale } = useLanguage();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/contabilidad/payouts")
      .then((res) => res.json())
      .then((data) => {
        if (data.payouts) setPayouts(data.payouts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <h1 className="text-3xl font-outfit font-bold">
        {locale === "es" ? "Pagos a Médicos" : "Doctor Payments"}
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <DoctorPaymentsTable initialPayouts={payouts} onUpdate={() => {}} />
      )}
    </div>
  );
}