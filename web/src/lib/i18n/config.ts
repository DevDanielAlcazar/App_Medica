import { useLanguage } from "@/providers/LanguageProvider";

export function useTranslation() {
  const { t } = useLanguage();
  return { t };
}
