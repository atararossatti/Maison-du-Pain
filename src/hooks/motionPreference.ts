import { useSyncExternalStore } from "react";

const KEY = "mdp-static-mode";

/**
 * A experiência cinematográfica é o padrão para todos os visitantes, em qualquer navegador.
 * O modo estático (sem pins nem câmera) só existe por escolha explícita do visitante, guardada
 * neste navegador. A troca recarrega a página: nunca há mudança de modo no meio da navegação.
 */
export function readStaticMode(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function setStaticMode(enabled: boolean) {
  try {
    if (enabled) window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
  } catch {
    // Sem armazenamento disponível (modo privado restrito): a escolha vale só até recarregar.
  }
  window.location.reload();
}

const noSubscription = () => () => {};

export const useStaticMode = () => useSyncExternalStore(noSubscription, readStaticMode, () => false);