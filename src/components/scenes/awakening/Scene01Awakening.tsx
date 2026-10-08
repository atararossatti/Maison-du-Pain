"use client";

import { useEffect, useRef } from "react";
import { SplitWords } from "@/components/ui/SplitWords";
import { Grain } from "@/components/ui/Grain";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { gsap } from "@/lib/gsap";
import { Illustration } from "./Illustration";
import { useAwakeningTimeline } from "./useAwakeningTimeline";
import { usePointerParallax } from "./usePointerParallax";

export function Scene01Awakening({ ready }: { ready: boolean }) {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const tier = useDeviceTier();

  useAwakeningTimeline(rootRef, !reduced);
  usePointerParallax(rootRef, !reduced && finePointer && tier === "high");

  // Entrada tipográfica disparada pelo fim do loader (tempo, não scroll).
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".word-inner",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.07, delay: 0.15, clearProps: "transform" },
      );
      gsap.from("[data-ui='sub'], [data-ui='hint']", { opacity: 0, y: 14, duration: 1, delay: 1, ease: "power2.out" });
    }, root);
    return () => ctx.revert();
  }, [ready, reduced]);

  return (
    <section
      ref={rootRef}
      data-scene="awakening"
      data-ready={ready}
      aria-labelledby="abertura"
      className="relative h-svh w-full overflow-hidden bg-butter"
    >
      <Illustration />
      <Grain />

      <div data-ui="headline" className="absolute inset-x-0 top-[11svh] z-10 px-6 text-center will-change-transform sm:top-[8svh]">
        <h1
          id="abertura"
          className="mx-auto max-w-[22ch] font-display text-[clamp(2.1rem,5vw,4.6rem)] font-light leading-[0.98] tracking-tight text-chocolate"
          style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
        >
          <SplitWords text="Toda manhã começa com uma história." />
        </h1>
        <p data-ui="sub" className="mx-auto mt-5 max-w-[34ch] font-sans text-base text-chocolate/80 sm:text-lg">
          E a nossa começa com farinha, manteiga e um pouco de magia.
        </p>
      </div>

      <p
        data-ui="hint"
        className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-chocolate/80"
      >
        Role para entrar
        <span className="block h-8 w-px bg-chocolate/60" aria-hidden />
      </p>

      <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6 text-center">
        <p
          data-ui="caption"
          lang="fr"
          className="font-hand text-[clamp(2.6rem,8vw,6rem)] leading-none text-cream"
          style={{ clipPath: reduced ? "none" : "inset(0 100% 0 0)", opacity: reduced ? 1 : 0, textShadow: "0 2px 24px rgba(73,49,38,.55)" }}
        >
          La magie commence ici.
        </p>
      </div>
    </section>
  );
}