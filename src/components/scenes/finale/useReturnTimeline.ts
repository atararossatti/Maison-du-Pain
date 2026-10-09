import { type RefObject } from "react";
import { LAYER_IDS } from "@/config/awakening";
import { useScrubbedScene } from "@/hooks/useScrubbedScene";
import { clamp, smoothstep } from "@/lib/math";
import { applyDoor, computeFrame, scaleAboutOrigin } from "../awakening/camera";

/** Fração do scroll em que o recuo da câmera termina; o resto é pausa para ler e agir. */
const PULL_BACK_END = 0.8;

const setOpacity = (el: Element | null, value: number) => {
  if (el instanceof HTMLElement || el instanceof SVGElement) el.style.opacity = value.toFixed(3);
};

function setupReturn(root: HTMLElement) {
  const layers = LAYER_IDS.map((id) => ({ id, el: root.querySelector(`[data-layer="${id}"]`) }));
  const fx = (name: string) => root.querySelector(`[data-fx="${name}"]`);
  const ui = (name: string) => root.querySelector<HTMLElement>(`[data-ui="${name}"]`);
  const nodes = { glow: fx("windowGlow"), glass: fx("glass"), frame: fx("windowFrame"), tint: fx("dawnTint"), lights: fx("lights") };
  const parts = { wash: ui("wash"), headline: ui("headline"), signature: ui("signature"), actions: ui("actions") };

  return (progress: number) => {
    const q = clamp(progress);
    // O recuo é a Cena 01 ao contrário: reaproveita a mesma câmera, de dentro da janela até a rua.
    const frame = computeFrame(1 - clamp(q / PULL_BACK_END));

    layers.forEach(({ id, el }) => el?.setAttribute("transform", scaleAboutOrigin(frame.layerScale[id], frame.lift)));
    applyDoor(root, frame.door);
    setOpacity(nodes.glass, frame.glassAlpha);
    setOpacity(nodes.frame, frame.frameAlpha);
    setOpacity(nodes.glow, smoothstep(0.1, 0.7, q));
    setOpacity(nodes.lights, smoothstep(0.35, 0.8, q));
    setOpacity(nodes.tint, 0.3 * smoothstep(0.15, 0.8, q));
    setOpacity(parts.wash, 1 - smoothstep(0, 0.08, q));

    const headline = smoothstep(0.68, 0.82, q);
    const signature = smoothstep(0.8, 0.9, q);
    const actions = smoothstep(0.86, 0.95, q);
    if (parts.headline) {
      parts.headline.style.opacity = headline.toFixed(3);
      parts.headline.style.transform = `translate3d(0, ${((1 - headline) * 30).toFixed(1)}px, 0)`;
    }
    setOpacity(parts.signature, signature);
    if (parts.actions) {
      parts.actions.style.opacity = actions.toFixed(3);
      // Oculto até aparecer: botões invisíveis não podem receber foco do teclado.
      parts.actions.style.visibility = actions > 0.02 ? "visible" : "hidden";
    }
  };
}

/** Cena 06: a câmera recua da janela até a rua ao entardecer, com as luzes acendendo. */
export function useReturnTimeline(rootRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useScrubbedScene(rootRef, { enabled, setup: setupReturn, staticProgress: 1 });
}
