"use client";

import { useEffect, type ReactNode } from "react";

/** Bloqueia o scroll enquanto o loader cobre a tela. O scroll em si é o nativo do navegador. */
export function ScrollLock({ locked, children }: { locked: boolean; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [locked]);

  return <>{children}</>;
}