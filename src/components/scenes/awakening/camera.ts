import { CAMERA_ORIGIN, LAYER_IDS, OPENING_LIFT, LAYER_SCALE, type LayerId } from "@/config/awakening";
import { clamp, smoothstep } from "@/lib/math";

export interface CameraFrame {
  layerScale: Record<LayerId, number>;
  lift: number;
  dawnTint: number;
  windowGlow: number;
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
  const dolly = Math.pow(clamp(p / 0.95), 1.55);

  const layerScale = {} as Record<LayerId, number>;
  for (const id of LAYER_IDS) layerScale[id] = Math.pow(LAYER_SCALE[id], dolly);

  const headlineOut = smoothstep(0.03, 0.16, p);

  return {
    layerScale,
    lift: OPENING_LIFT * (1 - dolly),
    dawnTint: 0.38 * (1 - smoothstep(0, 0.5, p)),
    windowGlow: smoothstep(0.12, 0.7, p),
    glassAlpha: 1 - 0.85 * smoothstep(0.6, 0.86, p),
    frameAlpha: 1 - smoothstep(0.8, 0.93, p),
    headline: { opacity: 1 - headlineOut, y: -70 * headlineOut },
    scrollHint: 1 - smoothstep(0.01, 0.06, p),
    caption: smoothstep(0.88, 0.985, p),
  };
}

/** `scale` em torno de um ponto, expresso como atributo SVG (rápido e livre de CSS). */
export function scaleAboutOrigin(scale: number, lift = 0) {
  const { x, y } = CAMERA_ORIGIN;
  return `translate(0 ${lift.toFixed(2)}) translate(${x} ${y}) scale(${scale.toFixed(4)}) translate(${-x} ${-y})`;
}