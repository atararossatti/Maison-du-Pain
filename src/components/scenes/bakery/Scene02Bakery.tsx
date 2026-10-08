"use client";

import { useRef } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { Interior } from "./Interior";
import { useBakeryTimeline } from "./useBakeryTimeline";

export function Scene02Bakery() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useBakeryTimeline(rootRef, !reduced);

  return (
    <section ref={rootRef} data-scene="bakery" aria-labelledby="interior" className="relative h-svh w-full overflow-hidden bg-butter">
      <Interior />

      <div data-ui="captionA" className="absolute left-[6vw] top-[16svh] z-10 max-w-[30ch] will-change-transform" style={{ opacity: reduced ? 1 : 0 }}>
        <p lang="fr" className="font-hand text-[clamp(1.8rem,3.6vw,3.2rem)] leading-tight text-chocolate">
          Un peu de douceur, beaucoup d&apos;amour.
        </p>
        <p className="mt-2 text-sm uppercase tracking-[0.25em] text-chocolate/70">Um pouco de doçura, muito amor.</p>
      </div>

      <div data-ui="captionB" className="absolute bottom-[14svh] left-[6vw] z-10 max-w-[18ch] will-change-transform sm:left-[8vw]" style={{ opacity: reduced ? 1 : 0 }}>
        <h2 id="interior" className="font-display text-[clamp(2rem,4.6vw,4.2rem)] font-light leading-[1.02] text-cream" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144', textShadow: "0 2px 22px rgba(73,49,38,.6)" }}>
          Aqui, nada se faz com pressa.
        </h2>
      </div>

      {/* Continuidade com o fim da Cena 01: a mesma luz âmbar se dissolve no interior. */}
      <div
        data-ui="wash"
        className="pointer-events-none absolute inset-0 z-20"
        style={{ background: "linear-gradient(to bottom, var(--color-caramel), var(--color-gold))", opacity: reduced ? 0 : 1 }}
        aria-hidden
      />
    </section>
  );
}
