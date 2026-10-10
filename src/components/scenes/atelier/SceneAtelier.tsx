"use client";

import { useRef } from "react";
import { Photo } from "@/components/ui/Photo";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { ScrubStage, stageClass } from "@/components/ui/ScrubStage";
import { ATELIER_SCREENS, ATELIER_STEPS, type AtelierStep } from "@/config/atelier";
import { PHOTOS } from "@/config/photos";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useAtelierTimeline } from "./useAtelierTimeline";

function Caption({ step, reduced }: { step: AtelierStep; reduced: boolean }) {
  return (
    <div
      data-cap
      className={`absolute bottom-[9svh] left-6 right-6 z-10 max-w-[30rem] ${reduced ? "text-chocolate" : "text-cream"} sm:left-[6vw] sm:right-auto lg:bottom-[15svh]`}
      style={{ opacity: reduced ? 1 : 0, visibility: reduced ? "visible" : "hidden" }}
    >
      <span aria-hidden className="font-display text-[clamp(3.6rem,8vw,7rem)] italic leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-gold)]">{step.numeral}</span>
      <p className="mt-1 font-hand text-3xl text-gold" lang="fr">{step.french}</p>
      <h3 className="font-display text-[clamp(2.2rem,4.4vw,3.8rem)] font-light leading-none" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>{step.title}</h3>
      <p className="mt-3 max-w-[34ch] text-[0.95rem] text-cream/85">{step.text}</p>
    </div>
  );
}

/** Versão estática (modo estático): as quatro etapas empilhadas, sem fixação nem máscaras. */
function StaticAtelier() {
  return (
    <section id="atelier" data-nav="atelier" aria-labelledby="atelier-titulo" className="bg-ink px-6 py-24 text-cream sm:px-12 lg:px-[6vw]">
      <p className="font-hand text-3xl text-gold" lang="fr">Notre atelier</p>
      <h2 id="atelier-titulo" className="mt-2 font-display text-[clamp(2.8rem,7vw,6rem)] font-light leading-none">Nosso Atelier</h2>
      <div className="mt-14 grid gap-16 lg:grid-cols-2">
        {ATELIER_STEPS.map((step) => (
          <figure key={step.photo}>
            <PhotoFrame id={step.photo} drift={0} sizes="(min-width: 1024px) 45vw, 92vw" />
            <figcaption className="mt-4">
              <p className="font-hand text-2xl text-gold" lang="fr">{step.french}</p>
              <p className="font-display text-3xl">{step.title}</p>
              <p className="mt-2 max-w-[40ch] text-cream/80">{step.text}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/** Nosso Atelier: cena fixa em que quatro fotografias se abrem por máscara, uma a uma, conforme o scroll. */
export function SceneAtelier() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useAtelierTimeline(rootRef, !reduced);

  if (reduced) return <StaticAtelier />;

  return (
    <ScrubStage screens={ATELIER_SCREENS} layer={4} navId="atelier" reduced={reduced}>
      <section ref={rootRef} data-scene="atelier" aria-labelledby="atelier-titulo" className={`${stageClass(false)} h-svh w-full overflow-hidden bg-ink text-cream`}>
        {ATELIER_STEPS.map((step, index) => {
          const photo = PHOTOS[step.photo];
          return (
            <div key={step.photo} data-step={index} className="absolute inset-0" style={{ zIndex: index + 1 }}>
              {step.mode === "window" ? (
                <>
                  <div data-bg className="absolute inset-0 opacity-0" style={{ backgroundImage: `url(${photo.blur})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                    <div className="absolute inset-0 bg-ink/55" />
                  </div>
                  <div
                    data-win
                    className="absolute inset-x-[10vw] top-[13svh] h-[48svh] overflow-hidden sm:inset-x-auto sm:right-[8vw] sm:top-[10svh] sm:h-[80svh] sm:aspect-[3/4]"
                    style={{ clipPath: "inset(100% 0% 0% 0%)", visibility: "hidden", background: photo.color }}
                  >
                    <div data-img className="absolute inset-0" style={{ transform: "scale(1.3)" }}>
                      <Photo id={step.photo} sizes="(min-width: 640px) 40vw, 80vw" />
                    </div>
                  </div>
                </>
              ) : (
                <div data-win className="absolute inset-0" style={{ clipPath: "circle(0% at 50% 56%)", visibility: "hidden", background: photo.color }}>
                  <div data-img className="absolute inset-0" style={{ transform: "scale(1.3)" }}>
                    <Photo id={step.photo} sizes="100vw" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/25 to-transparent max-sm:bg-gradient-to-t max-sm:from-ink/85 max-sm:via-ink/25" />
                </div>
              )}
              <Caption step={step} reduced={false} />
            </div>
          );
        })}

        <div data-veil className="pointer-events-none absolute inset-0 z-20 bg-butter" />
        <div data-title className="pointer-events-none absolute inset-0 z-[21] grid place-items-center px-6 text-center text-chocolate">
          <div>
            <p className="font-hand text-3xl text-crust-text" lang="fr">Notre atelier</p>
            <h2 id="atelier-titulo" className="font-display text-[clamp(3rem,9vw,8rem)] font-light leading-[0.95]" style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}>
              Nosso Atelier
            </h2>
            <p className="mx-auto mt-4 max-w-[34ch] text-chocolate/75">Onde o pão ganha forma. Role para acompanhar a fornada.</p>
          </div>
        </div>

        <ol aria-label="Etapas do atelier" className="absolute bottom-[4svh] right-6 z-10 flex gap-3 font-display text-sm text-cream sm:right-[6vw]">
          {ATELIER_STEPS.map((step) => (
            <li key={step.photo} data-dot className="opacity-40 transition-opacity">{step.numeral}</li>
          ))}
        </ol>
      </section>
    </ScrubStage>
  );
}
