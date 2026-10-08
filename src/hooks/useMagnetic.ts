import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "./useMediaQuery";

/** Atrai o elemento em direção ao ponteiro enquanto ele está por perto; só com mouse e sem movimento reduzido. */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.3) {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const active = fine && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;
    const moveX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      moveX((event.clientX - (rect.left + rect.width / 2)) * strength);
      moveY((event.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      moveX(0);
      moveY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [ref, active, strength]);
}