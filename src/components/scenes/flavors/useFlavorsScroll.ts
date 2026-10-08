import { useEffect, type RefObject } from "react";
import { useReducedMotion } from "@/hooks/useMediaQuery";
import { gsap } from "@/lib/gsap";

/**
 * Paralaxe por item (cada `data-speed` percorre ±speed% da própria altura) e título que sobe
 * palavra a palavra. Tudo está ligado ao progresso do scroll (`scrub`), então é reversível.
 */
export function useFlavorsScroll(rootRef: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((item) => {
        const speed = Number(item.dataset.speed ?? 0);
        gsap.fromTo(
          item,
          { yPercent: -speed },
          { yPercent: speed, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      gsap.fromTo(
        "[data-ui='flavorsTitle'] .word-inner",
        { yPercent: 115 },
        {
          yPercent: 0,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: "[data-ui='flavorsTitle']", start: "top 90%", end: "top 50%", scrub: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [rootRef, reduced]);
}