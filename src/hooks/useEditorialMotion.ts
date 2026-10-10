import { useEffect, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

const MASKS = {
  up: ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 0%)"],
  down: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
  left: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
  right: ["inset(0% 0% 0% 100%)", "inset(0% 0% 0% 0%)"],
  iris: ["circle(0% at 50% 60%)", "circle(80% at 50% 60%)"],
} as const;

type MaskName = keyof typeof MASKS;

/**
 * Movimentos editoriais ligados ao scroll (`scrub`, portanto reversíveis), declarados no HTML:
 * - `data-reveal="up|down|left|right|iris"`: a fotografia surge por uma máscara enquanto a imagem interna (`data-reveal-img`) assenta de um zoom.
 * - `data-drift="N"`: a imagem desliza ±N% da própria altura em relação ao quadro (paralaxe interna).
 * - `data-rise`: o bloco sobe e aparece.
 * - `data-words`: título que sobe palavra a palavra (usa `SplitWords`).
 */
export function useEditorialMotion(rootRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((frame) => {
        const [from, to] = MASKS[(frame.dataset.reveal as MaskName) in MASKS ? (frame.dataset.reveal as MaskName) : "up"];
        const img = frame.querySelector("[data-reveal-img]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 92%", end: "top 40%", scrub: true } });
        tl.fromTo(frame, { clipPath: from }, { clipPath: to, ease: "none" }, 0);
        if (img) tl.fromTo(img, { scale: 1.4 }, { scale: 1, ease: "none" }, 0);
      });

      root.querySelectorAll<HTMLElement>("[data-drift]").forEach((el) => {
        const amount = Number(el.dataset.drift ?? 8);
        gsap.fromTo(
          el,
          { yPercent: -amount },
          { yPercent: amount, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-rise]").forEach((el) => {
        gsap.fromTo(el, { y: 46, opacity: 0 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 94%", end: "top 66%", scrub: true } });
      });

      root.querySelectorAll<HTMLElement>("[data-words]").forEach((title) => {
        gsap.fromTo(
          title.querySelectorAll(".word-inner"),
          { yPercent: 115 },
          { yPercent: 0, stagger: 0.1, ease: "none", scrollTrigger: { trigger: title, start: "top 92%", end: "top 52%", scrub: true } },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [rootRef, enabled]);
}
