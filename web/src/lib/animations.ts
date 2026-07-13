import { useReducedMotion } from "@/hooks/useReducedMotion";

export function useSafeAnimation() {
  const reduced = useReducedMotion();

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: reduced ? 0 : 0.3, ease: "easeOut" } },
  };

  return { variants, reduced };
}