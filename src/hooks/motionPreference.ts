import { useSyncExternalStore } from "react";

/**
 * Escolha explícita do visitante de ver a experiência completa mesmo com `prefers-reduced-motion`.
 * Fica só em memória (vale até recarregar): a preferência do sistema continua sendo o padrão.
 */
let forcedFull = false;
const listeners = new Set<() => void>();

const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};

export function enableFullMotion() {
  forcedFull = true;
  document.documentElement.dataset.motion = "full";
  listeners.forEach((notify) => notify());
}

export const useForcedFullMotion = () =>
  useSyncExternalStore(
    subscribe,
    () => forcedFull,
    () => false,
  );