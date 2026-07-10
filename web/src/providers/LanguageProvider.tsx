"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Locale = "es" | "en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && (savedLocale === "es" || savedLocale === "en")) {
      // Setting locale later in the lifecycle to avoid synchronous update issues with the effect hook.
      setTimeout(() => setLocaleState(savedLocale), 0);
    }
  }, []);

  useEffect(() => {
    import(`../lib/i18n/${locale}.json`)
      .then((module) => {
        setMessages(module.default);
      })
      .catch((err) => {
        console.error(`Error loading language file for ${locale}:`, err);
      });
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string) => {
    return messages[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
