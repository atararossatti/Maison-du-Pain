"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { useCroissantTimeline } from "./useCroissantTimeline";

// O WebGL só é baixado quando a cena se aproxima da tela.
const CroissantCanvas = dynamic(() => import("./CroissantCanvas"), { ssr: false });

const noSubscription = () => () => {};

function detectWebGL() {
  try {
    return document.createElement("canvas").getContext("webgl2") !== null;
  } catch {
    return false;
  }
}

/** Observa a seção: `near` liga o carregamento (uma vez); `visible` pausa o laço de render fora da tela. */
function useSceneVisibility(ref: React.RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nearObserver = new IntersectionObserver(([entry]) => entry?.isIntersecting && setNear(true), { rootMargin: "100% 0px" });
    const visibleObserver = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting ?? false));
    nearObserver.observe(el);
    visibleObserver.observe(el);
    return () => {
      nearObserver.disconnect();
      visibleObserver.disconnect();
    };
  }, [ref]);

  return { near, visible };
}

export function Scene03Croissant() {
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reduced = useReducedMotion();
  const tier = useDeviceTier();
  const webgl = useSyncExternalStore(noSubscription, detectWebGL, () => true);
  const { near, visible } = useSceneVisibility(rootRef);

  useCroissantTimeline(rootRef, !reduced, progressRef);

  return (
    <section
      ref={rootRef}
      data-scene="croissant"
      data-static={reduced}
      aria-labelledby="croissant-titulo"
      className="relative h-svh w-full overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 45%, var(--color-cream), var(--color-butter) 55%, var(--color-gold))" }}
    >
      <div
        className="absolute inset-0"
        role="img"
        aria-label="Croissant em três dimensões que gira e abre suas camadas folhadas, uma a uma."
      >
        {webgl && near && <CroissantCanvas progressRef={progressRef} active={visible} lowPower={tier === "low"} />}
      </div>

      <div
        data-ui="captionA"
        className="pointer-events-none absolute bottom-[10svh] left-[6vw] z-10 max-w-[16ch] will-change-transform sm:bottom-auto sm:left-[7vw] sm:top-1/2 sm:-translate-y-1/2"
        style={{ opacity: reduced ? 1 : 0 }}
      >
        <h2
          id="croissant-titulo"
          className="font-display text-[clamp(2rem,4.6vw,4.4rem)] font-light leading-[1.02] text-chocolate"
          style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144' }}
        >
          Uma obra de arte em cada camada.
        </h2>
      </div>

      <p
        data-ui="captionB"
        className="pointer-events-none absolute bottom-[6svh] right-[6vw] z-10 max-w-[22ch] text-right font-hand text-[clamp(1.6rem,3vw,2.6rem)] leading-tight text-chocolate will-change-transform"
        style={{ opacity: reduced ? 1 : 0 }}
      >
        Feito lentamente. Saboreado intensamente.
      </p>

      {!webgl && (
        <p className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-6 text-center text-chocolate/70">
          Seu navegador não oferece WebGL, então o croissant em 3D não pode ser exibido.
        </p>
      )}

      {/* Mesma massa em que a Cena 02 terminou; a máscara abre um furo que revela o croissant. */}
      <div
        data-ui="doughWash"
        className="dough-wash pointer-events-none absolute inset-0 z-20"
        style={{ ["--hole" as string]: reduced ? WASH_OPEN : 0 }}
        aria-hidden
      />
    </section>
  );
}

const WASH_OPEN = 140;
