"use client";

import { useEffect, useState } from "react";
import { MOTIVATIONAL_PHRASES } from "@/lib/constants";
import { useLanguage } from "@/providers/LanguageProvider";

export function MotivationalGreeting({ userName }: { userName?: string }) {
  const { locale } = useLanguage();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting = "";
    if (hour < 12) timeGreeting = locale === "es" ? "Buenos días" : "Good morning";
    else if (hour < 18) timeGreeting = locale === "es" ? "Buenas tardes" : "Good afternoon";
    else timeGreeting = locale === "es" ? "Buenas noches" : "Good evening";

    const dayOfYear = new Date().getDayOfYear ? new Date().getDayOfYear() : Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const phrase = MOTIVATIONAL_PHRASES[dayOfYear % MOTIVATIONAL_PHRASES.length] || "Tu salud es tu mayor tesoro. Hoy es un buen día para cuidarte.";

    setGreeting(`${timeGreeting}${userName ? ", " + userName : ""}. ${phrase}`);
  }, [userName, locale]);

  return (
    <div className="text-center px-4 py-2 text-sm text-muted-foreground italic">
      {greeting}
    </div>
  );
}