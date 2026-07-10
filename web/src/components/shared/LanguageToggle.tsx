"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageProvider";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(locale === "es" ? "en" : "es")}
      className="w-9 px-0"
    >
      {locale.toUpperCase()}
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}
