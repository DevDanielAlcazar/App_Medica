"use client";

import { useEffect, useState } from "react";
import { AccountingCyclesList } from "@/components/accounting/AccountingCyclesList";
import { Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageProvider";

export default function Page() {
  const { locale } = useLanguage();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCycles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/contabilidad/ciclos");
      const data = await res.json();
      if (data.cycles) setCycles(data.cycles);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  const createCycle = async () => {
    const periodName = prompt(
      locale === "es"
        ? "Nombre del periodo (ej. Semana 24, 2026):"
        : "Period name (ex: Week 24, 2026):"
    );
    if (!periodName) return;

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // Default 1 week

      const res = await fetch("/api/admin/contabilidad/ciclos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ periodName, startDate, endDate }),
      });

      if (res.ok) fetchCycles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-outfit font-bold">
          {locale === "es" ? "Periodos de Corte" : "Cutoff Periods"}
        </h1>
        <Button onClick={createCycle} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          {locale === "es" ? "Nuevo Corte" : "New Cutoff"}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <AccountingCyclesList cycles={cycles} />
      )}
    </div>
  );
}