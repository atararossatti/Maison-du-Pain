import { useSyncExternalStore } from "react";
import { useForcedFullMotion } from "./motionPreference";

/** Assina uma media query; `serverValue` evita divergência de hidratação. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", notify);
      return () => list.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Movimento reduzido: preferência do sistema, a menos que o visitante tenha escolhido a experiência completa. */
export function useReducedMotion() {
  const system = useMediaQuery("(prefers-reduced-motion: reduce)");
  const forcedFull = useForcedFullMotion();
  return system && !forcedFull;
}

/** Preferência do sistema, sem o override (para decidir se o aviso deve aparecer). */
export const useSystemReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");