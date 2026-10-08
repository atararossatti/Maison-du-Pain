"use client";

import { useRef } from "react";
import { STAGES } from "@/config/process";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { Illustration } from "./Illustration";
import { useProcessTimeline } from "./useProcessTimeline";

export function Scene05Process() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useProcessTimeline(rootRef, !reduced);

  return (
    <section ref={rootRef} data-scene="process" data-static={reduced} aria-labelledby="processo" className="relative h-svh w-full overflow-hidden bg-butter">
      <Illustration />

      <div data-ui="captionA" className="pointer-events-none absolute inset-x-0 top-[12svh] z-10 px-6 text-center will-change-transform" style={{ opacity: reduced ? 1 : 0 }}>
        <h2
          id="processo"
          className="mx-auto max-w-[20ch] font-display text-[clamp(2rem,5vw,4.4rem)] font-light leading-[1.02] text-chocolate"
          style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144', textShadow: "0 2px 18px rgba(255,249,239,.6)" }}
        >
          O segredo não está apenas nos ingredientes.
        </h2>
      </div>

      <p
        data-ui="captionB"
        className="pointer-events-none absolute bottom-[17svh] left-[6vw] z-10 max-w-[20ch] font-hand text-[clamp(1.8rem,3.4vw,3rem)] leading-tight text-chocolate will-change-transform"
        style={{ opacity: reduced ? 1 : 0 }}
      >
        Está no tempo, no cuidado e no amor por cada detalhe.
      </p>

      <ol aria-label="Etapas do processo" className="absolute inset-x-0 bottom-[4svh] z-10 flex flex-wrap justify-center gap-x-5 gap-y-1 px-4 text-[0.7rem] uppercase tracking-[0.22em] text-chocolate/55 sm:gap-x-8">
        {STAGES.map((stage, index) => (
          <li key={stage} data-stage={index} data-active={index === 0} className="transition-colors duration-300 data-[active=true]:text-chocolate data-[active=true]:underline data-[active=true]:underline-offset-8">
            {stage}
          </li>
        ))}
      </ol>
    </section>
  );
}