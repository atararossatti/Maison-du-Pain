import { useCallback, type RefObject } from "react";
import { LAYER_IDS, SCROLL_SCREENS } from "@/config/awakening";
import { useScrubbedScene } from "@/hooks/useScrubbedScene";
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

const setup = (root: HTMLElement) => (progress: number) => applyFrame(root, computeFrame(progress));

/** Liga o scroll à câmera da Cena 01 (ver `computeFrame`). */
export function useAwakeningTimeline(rootRef: RefObject<HTMLElement | null>, enabled: boolean) {
  const stableSetup = useCallback(setup, []);
  useScrubbedScene(rootRef, { enabled, screens: SCROLL_SCREENS, setup: stableSetup, staticProgress: 0 });
}