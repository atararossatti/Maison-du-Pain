import { useEffect, type RefObject } from "react";
import { LAYER_IDS, SCROLL_SCREENS } from "@/config/awakening";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { computeFrame, scaleAboutOrigin, type CameraFrame } from "./camera";

const setOpacity = (el: Element | null, value: number) => {
  if (el instanceof HTMLElement || el instanceof SVGElement) el.style.opacity = value.toFixed(3);
};

function applyFrame(root: HTMLElement, frame: CameraFrame) {
  for (const id of LAYER_IDS) {
    root.querySelector(`[data-layer="${id}"]`)?.setAttribute("transform", scaleAboutOrigin(frame.layerScale[id], frame.lift));
  }
  root.querySelectorAll("[data-fx]").forEach((el) => {
    const fx = (el as HTMLElement).dataset.fx;
    if (fx === "dawnTint") setOpacity(el, frame.dawnTint);
    if (fx === "windowGlow") setOpacity(el, frame.windowGlow);
    if (fx === "glass") setOpacity(el, frame.glassAlpha);
    if (fx === "windowFrame") setOpacity(el, frame.frameAlpha);
  });

  const headline = root.querySelector<HTMLElement>("[data-ui='headline']");
  if (headline) {
    headline.style.opacity = frame.headline.opacity.toFixed(3);
    headline.style.transform = `translate3d(0, ${frame.headline.y.toFixed(1)}px, 0)`;
  }
  setOpacity(root.querySelector("[data-ui='hint']"), frame.scrollHint);

  const caption = root.querySelector<HTMLElement>("[data-ui='caption']");
  if (caption) {
    caption.style.clipPath = `inset(0 ${((1 - frame.caption) * 100).toFixed(1)}% 0 0)`;
    caption.style.opacity = frame.caption > 0 ? "1" : "0";
  }
}

/**
 * Fixa a cena e liga o progresso do scroll à câmera. O `scrub` suaviza apenas o valor
 * de `progress`; o desenho do quadro continua sendo uma função pura (ver `computeFrame`).
 */
export function useAwakeningTimeline(rootRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    const ctx = gsap.context(() => {
      const state = { progress: 0 };
      const render = () => applyFrame(root, computeFrame(state.progress));

      gsap.to(state, {
        progress: 1,
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * SCROLL_SCREENS}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      render();
    }, root);

    // Fontes e a ilustração mudam alturas depois da hidratação; recalcula os pontos de pin.
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [rootRef, enabled]);
}