import { CAMERA_ORIGIN, LAYER_IDS, OPENING_LIFT, LAYER_SCALE, type LayerId } from "@/config/awakening";
import { clamp, smoothstep } from "@/lib/math";

export interface CameraFrame {
  layerScale: Record<LayerId, number>;
  lift: number;
  dawnTint: number;
  windowGlow: number;
  /** 0 = porta fechada, 1 = aberta: a folha gira enquanto a câmera se aproxima. */
  door: number;
  glassAlpha: number;
  frameAlpha: number;
  headline: { opacity: number; y: number };
  scrollHint: number;
  caption: number;
}

/**
 * Função pura do progresso (0–1) → estado completo da cena. Não guarda histórico, então rolar
 * rápido, inverter a direção ou redimensionar sempre produz exatamente o mesmo quadro.
 */
export function computeFrame(progress: number): CameraFrame {
  const p = clamp(progress);
  // Dolly exponencial: a escala cresce de forma multiplicativa, como uma câmera real avançando.
  // Expoente 1: a câmera já se move no primeiro toque da roda (com expoente maior a abertura parecia parada).
  const dolly = clamp(p / 0.92);

  const layerScale = {} as Record<LayerId, number>;
  for (const id of LAYER_IDS) layerScale[id] = Math.pow(LAYER_SCALE[id], dolly);

  const headlineOut = smoothstep(0.03, 0.16, p);

  return {
    layerScale,
    lift: OPENING_LIFT * (1 - dolly),
    dawnTint: 0.38 * (1 - smoothstep(0, 0.5, p)),
    windowGlow: smoothstep(0.12, 0.7, p),
    door: smoothstep(0.1, 0.5, p),
    glassAlpha: 1 - 0.85 * smoothstep(0.6, 0.86, p),
    frameAlpha: 1 - smoothstep(0.8, 0.93, p),
    headline: { opacity: 1 - headlineOut, y: -70 * headlineOut },
    scrollHint: 1 - smoothstep(0.01, 0.06, p),
    caption: smoothstep(0.88, 0.985, p),
  };
}

/** Gira a folha da porta (escala horizontal em torno da dobradiça, com leve inclinação de perspectiva). */
export const DOOR_HINGE_X = 995;
export function applyDoor(root: Element, open: number) {
  const leaf = root.querySelector("[data-fx='doorLeaf']");
  if (!leaf) return;
  const width = 1 - 0.88 * open;
  leaf.setAttribute("transform", `translate(${DOOR_HINGE_X} 580) skewY(${(-6 * open).toFixed(2)}) scale(${width.toFixed(3)} 1) translate(${-DOOR_HINGE_X} -580)`);
}

/** `scale` em torno de um ponto, expresso como atributo SVG (rápido e livre de CSS). */
export function scaleAboutOrigin(scale: number, lift = 0) {
  const { x, y } = CAMERA_ORIGIN;
  return `translate(0 ${lift.toFixed(2)}) translate(${x} ${y}) scale(${scale.toFixed(4)}) translate(${-x} ${-y})`;
}