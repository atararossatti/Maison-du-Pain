import { type RefObject } from "react";
import { ATELIER_STEPS } from "@/config/atelier";
import { useScrubbedScene } from "@/hooks/useScrubbedScene";
import { computeAtelierFrame } from "./camera";

function setupAtelier(root: HTMLElement) {
  const steps = ATELIER_STEPS.map((step, index) => {
    const el = root.querySelector<HTMLElement>(`[data-step="${index}"]`);
    return {
      bleed: step.mode === "bleed",
      bg: el?.querySelector<HTMLElement>("[data-bg]") ?? null,
      win: el?.querySelector<HTMLElement>("[data-win]") ?? null,
      img: el?.querySelector<HTMLElement>("[data-img]") ?? null,
      cap: el?.querySelector<HTMLElement>("[data-cap]") ?? null,
    };
  });
  const veil = root.querySelector<HTMLElement>("[data-veil]");
  const title = root.querySelector<HTMLElement>("[data-title]");
  const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-dot]"));

  return (progress: number) => {
    const frame = computeAtelierFrame(progress);
    steps.forEach((step, index) => {
      const f = frame.steps[index];
      if (!f) return;
      if (step.bg) step.bg.style.opacity = f.enter.toFixed(3);
      if (step.win) {
        step.win.style.clipPath = step.bleed ? `circle(${(f.enter * 118).toFixed(1)}% at 50% 56%)` : `inset(${((1 - f.enter) * 100).toFixed(2)}% 0% 0% 0%)`;
        step.win.style.visibility = f.enter <= 0.001 ? "hidden" : "visible";
      }
      if (step.img) step.img.style.transform = `scale(${f.zoom.toFixed(4)})`;
      if (step.cap) {
        step.cap.style.opacity = f.caption.toFixed(3);
        step.cap.style.transform = `translate3d(0, ${((1 - f.caption) * 28).toFixed(1)}px, 0)`;
        step.cap.style.visibility = f.caption <= 0.01 ? "hidden" : "visible";
      }
    });
    if (veil) veil.style.opacity = frame.veil.toFixed(3);
    if (title) {
      title.style.opacity = frame.title.toFixed(3);
      title.style.visibility = frame.title <= 0.01 ? "hidden" : "visible";
    }
    dots.forEach((dot, index) => {
      dot.style.opacity = index === frame.active ? "1" : "0.4";
      if (index === frame.active) dot.setAttribute("aria-current", "step");
      else dot.removeAttribute("aria-current");
    });
  };
}

/** Atelier: fotografias que se abrem por máscara e assentam de um zoom, uma por etapa, ligadas ao scroll. */
export function useAtelierTimeline(rootRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useScrubbedScene(rootRef, { enabled, setup: setupAtelier, staticProgress: 0.5 });
}
