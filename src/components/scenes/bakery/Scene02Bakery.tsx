"use client";

import { ScrubStage, stageClass } from "@/components/ui/ScrubStage";
import { useRef } from "react";
import { Grain } from "@/components/ui/Grain";
import { BAKERY_SCREENS } from "@/config/bakery";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { Interior } from "./Interior";
import { useBakeryTimeline } from "./useBakeryTimeline";

export function Scene02Bakery() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useBakeryTimeline(rootRef, !reduced);

  return (
    <ScrubStage screens={BAKERY_SCREENS} overlap covered layer={2} reduced={reduced}>
    <section ref={rootRef} data-scene="bakery" aria-labelledby="interior" className={`${stageClass(reduced)} h-svh w-full overflow-hidden bg-butter`}>
      <Interior />
      <Grain />

      <div
        data-ui="captionA"
        className="absolute left-[6vw] top-[10svh] z-10 max-w-[20ch] will-change-transform sm:top-[16svh] sm:max-w-[30ch]"
        style={{ opacity: reduced ? 1 : 0, textShadow: "0 0 14px rgba(255,248,236,.9), 0 0 3px rgba(255,248,236,.85)" }}
      >
        <p lang="fr" className="font-hand text-[clamp(1.55rem,3.6vw,3.2rem)] leading-tight text-chocolate">
          Un peu de douceur, beaucoup d&apos;amour.
        </p>
        <p className="mt-1 w-[88vw] text-[0.68rem] uppercase tracking-[0.16em] text-chocolate/80 sm:mt-2 sm:w-auto sm:text-sm sm:tracking-[0.25em] sm:text-chocolate/70 [@media(max-height:700px)]:hidden">Um pouco de doçura, muito amor.</p>
      </div>

      <div data-ui="captionB" className="absolute bottom-[14svh] left-[6vw] z-10 max-w-[18ch] will-change-transform sm:left-[8vw]" style={{ opacity: reduced ? 1 : 0 }}>
        <h2 id="interior" className="font-display text-[clamp(2rem,4.6vw,4.2rem)] font-light leading-[1.02] text-cream" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144', textShadow: "0 2px 22px rgba(73,49,38,.6)" }}>
          Aqui, nada se faz com pressa.
        </h2>
      </div>

      {/* Continuidade com o fim da Cena 01: a mesma luz âmbar se dissolve no interior. */}
      <div
        data-ui="wash"
        className="iris-wash pointer-events-none absolute inset-0 z-20"
        style={{ ["--hole" as string]: reduced ? 140 : 0 }}
        aria-hidden
      />
    </section>
    </ScrubStage>
  );
}
