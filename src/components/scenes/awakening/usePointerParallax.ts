import { useEffect, type RefObject } from "react";
import { POINTER_DEPTH } from "@/config/awakening";
import { gsap } from "@/lib/gsap";

/** Desloca cada camada em proporção à sua profundidade, seguindo o ponteiro. Só em mouse. */
export function usePointerParallax(rootRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const ctx = gsap.context(() => {
      const movers = Array.from(root.querySelectorAll<SVGGElement>("[data-pointer]")).map((el) => {
        const depth = POINTER_DEPTH[el.dataset.pointer as keyof typeof POINTER_DEPTH] ?? 0;
        return {
          depth,
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
        };
      });

      const onMove = (event: PointerEvent) => {
        const nx = event.clientX / window.innerWidth - 0.5;
        const ny = event.clientY / window.innerHeight - 0.5;
        movers.forEach(({ depth, x, y }) => {
          x(-nx * depth);
          y(-ny * depth * 0.6);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    }, root);

    return () => ctx.revert();
  }, [rootRef, enabled]);
}