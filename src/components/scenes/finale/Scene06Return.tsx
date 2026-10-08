"use client";

import { useRef, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";
import { Illustration } from "../awakening/Illustration";
import { usePointerParallax } from "../awakening/usePointerParallax";
import { MenuDialog, OrderDialog, VisitDialog } from "./FinaleDialogs";
import { useReturnTimeline } from "./useReturnTimeline";

type DialogName = "menu" | "visit" | "order";

const ACTIONS: { id: DialogName; label: string; primary?: boolean }[] = [
  { id: "menu", label: "Conheça nosso cardápio" },
  { id: "visit", label: "Venha nos visitar" },
  { id: "order", label: "Faça seu pedido", primary: true },
];

export function Scene06Return() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const tier = useDeviceTier();
  const [open, setOpen] = useState<DialogName | null>(null);

  useReturnTimeline(rootRef, !reduced);
  usePointerParallax(rootRef, !reduced && finePointer && tier === "high");
  const close = () => setOpen(null);

  return (
    <section ref={rootRef} data-scene="return" aria-labelledby="retorno" className="relative h-svh w-full overflow-hidden bg-chocolate">
      <Illustration dusk />

      <div data-ui="headline" className="pointer-events-none absolute inset-x-0 top-[9svh] z-10 px-6 text-center will-change-transform" style={{ opacity: reduced ? 1 : 0 }}>
        <h2
          id="retorno"
          className="mx-auto max-w-[20ch] font-display text-[clamp(2rem,5vw,4.4rem)] font-light leading-[1.02] text-cream"
          style={{ fontVariationSettings: '"SOFT" 100, "opsz" 144', textShadow: "0 2px 24px rgba(46,29,22,.7)" }}
        >
          Algumas histórias merecem ser saboreadas.
        </h2>
        <p data-ui="signature" lang="fr" className="mt-3 font-hand text-[clamp(1.8rem,3.4vw,2.8rem)] text-gold" style={{ opacity: reduced ? 1 : 0, textShadow: "0 2px 18px rgba(46,29,22,.7)" }}>
          Le bonheur se savoure.
        </p>
      </div>

      <div
        data-ui="actions"
        className="absolute inset-x-0 bottom-[7svh] z-20 flex flex-wrap items-center justify-center gap-3 px-4"
        style={{ opacity: reduced ? 1 : 0, visibility: reduced ? "visible" : "hidden" }}
      >
        {ACTIONS.map((action) => (
          <MagneticButton
            key={action.id}
            onClick={() => setOpen(action.id)}
            className={`rounded-full px-6 py-3 text-sm tracking-wide shadow-lg transition hover:-translate-y-0.5 ${
              action.primary ? "bg-gold text-chocolate hover:bg-caramel" : "bg-cream/90 text-chocolate hover:bg-cream"
            }`}
          >
            {action.label}
          </MagneticButton>
        ))}
      </div>

      <div
        data-ui="wash"
        className="pointer-events-none absolute inset-0 z-30"
        style={{ background: "linear-gradient(to bottom, var(--color-butter), var(--color-blush))", opacity: reduced ? 0 : 1 }}
        aria-hidden
      />

      <MenuDialog open={open === "menu"} onClose={close} />
      <VisitDialog open={open === "visit"} onClose={close} />
      <OrderDialog open={open === "order"} onClose={close} />
    </section>
  );
}
