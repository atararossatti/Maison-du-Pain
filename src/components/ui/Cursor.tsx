"use client";

import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "@/hooks/useMediaQuery";
import { gsap } from "@/lib/gsap";

const INTERACTIVE = "a, button, [role='slider'], input, summary";

/**
 * Anel que acompanha o mouse. É só um complemento visual: o cursor nativo continua visível,
 * o anel ignora eventos e não existe em toque nem com movimento reduzido.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const active = fine && !reduced;

  useEffect(() => {
    const ring = ringRef.current;
    if (!active || !ring) return;
    const moveX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const moveY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
      ring.dataset.visible = "true";
      ring.dataset.active = String((event.target as Element | null)?.closest(INTERACTIVE) !== null);
    };
    const onLeave = () => {
      ring.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(ring);
    };
  }, [active]);

  if (!active) return null;
  return <div ref={ringRef} aria-hidden className="cursor-ring" data-visible="false" data-active="false" />;
}