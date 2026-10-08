import {
  BAKERY_LAYER_IDS,
  BAKERY_LAYER_SCALE,
  DOUGH_CENTER,
  INGREDIENTS,
  KNEAD_CYCLES,
  PHASE,
  type BakeryLayerId,
} from "@/config/bakery";
import { clamp, smoothstep } from "@/lib/math";

export interface BakeryFrame {
  layerScale: Record<BakeryLayerId, number>;
  wash: number;
  sack: { y: number; tilt: number; opacity: number };
  /** Trecho visível do fio de farinha, em fração da queda (0 = boca do saco, 1 = bancada). */
  stream: { from: number; to: number };
  pile: { scale: number; opacity: number };
  ingredients: { x: number; y: number; scale: number; opacity: number }[];
  dough: { opacity: number; scale: number; squash: number };
  arms: { left: { angle: number; length: number }; right: { angle: number; length: number }; opacity: number };
  headBob: number;
  captionA: number;
  captionB: number;
}

type Range = readonly [number, number];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Função pura do progresso → quadro. A sova usa a fase `2π·ciclos·progresso`, então os braços
 * acompanham o dedo do usuário: rolar para trás desfaz o movimento em vez de reproduzir um loop.
 */
export function computeBakeryFrame(progress: number): BakeryFrame {
  const p = clamp(progress);
  const step = ([from, to]: Range) => smoothstep(from, to, p);
  const pulse = ([inFrom, inTo, outFrom, outTo]: readonly [number, number, number, number]) =>
    smoothstep(inFrom, inTo, p) * (1 - smoothstep(outFrom, outTo, p));

  const dive = step(PHASE.dive);
  const drift = 1 + 0.05 * p;
  // Chegada: a sala começa ampliada (como se a câmera tivesse acabado de atravessar a janela) e se acomoda.
  const arrival = 1 - step(PHASE.arrival);
  const layerScale = {} as Record<BakeryLayerId, number>;
  for (const id of BAKERY_LAYER_IDS) {
    const closeness = id === "wall" ? 0.25 : id === "oven" ? 0.4 : id === "main" ? 0.7 : 1;
    layerScale[id] = Math.pow(BAKERY_LAYER_SCALE[id], dive) * drift * (1 + 0.55 * closeness * arrival);
  }

  const sackIn = step(PHASE.sackIn);
  const sackOut = step(PHASE.sackOut);
  const tilt = step(PHASE.sackTilt) * (1 - step(PHASE.sackUntilt));

  const ingredients = INGREDIENTS.map((item, index) => {
    const offset = index * PHASE.ingredientStagger;
    const t = smoothstep(PHASE.ingredient[0] + offset, PHASE.ingredient[1] + offset, p);
    return {
      x: lerp(item.from.x, DOUGH_CENTER.x, t),
      y: lerp(item.from.y, DOUGH_CENTER.y - 20, t) - Math.sin(Math.PI * t) * 150,
      scale: lerp(1, 0.45, t),
      opacity: 1 - smoothstep(0.85, 1, t),
    };
  });

  const form = step(PHASE.doughForm);
  const rise = step(PHASE.rise);

  const kneadSpan = step(PHASE.kneadSpan);
  const phase = Math.PI * 2 * KNEAD_CYCLES * kneadSpan;
  const amplitude = step(PHASE.kneadIn) * (1 - step(PHASE.kneadOut));
  const reach = step(PHASE.kneadIn);
  const push = Math.sin(phase) * amplitude;
  const counterPush = Math.sin(phase + Math.PI) * amplitude;

  return {
    layerScale,
    wash: 1 - step(PHASE.wash),
    sack: { y: -150 * (1 - sackIn) - 150 * sackOut, tilt: -9 * tilt, opacity: sackIn * (1 - sackOut) },
    stream: { from: step(PHASE.streamOut), to: step(PHASE.streamIn) },
    pile: { scale: step(PHASE.pile), opacity: 1 - step(PHASE.pileOut) },
    ingredients,
    dough: {
      opacity: step(PHASE.doughIn),
      scale: (0.35 + 0.45 * form) * (1 + 0.9 * rise),
      squash: 1 + 0.07 * Math.sin(phase * 2) * amplitude,
    },
    arms: {
      left: { angle: lerp(-35, -21, reach) + 8 * push, length: 1 + 0.07 * push },
      right: { angle: lerp(35, 21, reach) - 8 * counterPush, length: 1 + 0.07 * counterPush },
      // As mãos se afastam antes do mergulho; escaladas junto com a massa viram manchas.
      opacity: 1 - step(PHASE.kneadOut),
    },
    headBob: 5 * Math.sin(phase) * amplitude,
    captionA: pulse(PHASE.captionA),
    captionB: pulse(PHASE.captionB),
  };
}

export function scaleAbout(scale: number) {
  const { x, y } = DOUGH_CENTER;
  return `translate(${x} ${y}) scale(${scale.toFixed(4)}) translate(${-x} ${-y})`;
}