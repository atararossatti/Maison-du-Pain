import { useSyncExternalStore } from "react";
import { useStaticMode } from "./motionPreference";

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

/** Verdadeiro só no modo estático escolhido pelo visitante; a preferência do sistema não desliga a experiência. */
export const useReducedMotion = () => useStaticMode();
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");