"use client";

import Lenis from "lenis";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Uma única instância do Lenis dirigida pelo ticker do GSAP, para que scroll suave e
 * ScrollTrigger compartilhem o mesmo relógio (sem isso os pins tremem).
 * Com movimento reduzido o Lenis não é criado: o scroll nativo permanece intacto.
 */
export function ScrollProvider({ locked, children }: { locked: boolean; children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.09 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    document.documentElement.style.overflow = locked ? "hidden" : "";
    if (locked) lenisRef.current?.stop();
    else lenisRef.current?.start();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [locked, reduced]);

  return <>{children}</>;
}