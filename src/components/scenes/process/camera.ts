import {
  BOWL,
  CLOCK_TURNS,
  EAR_CENTER,
  EAR_GRAINS,
  EAR_ZOOM,
  HOPPER,
  KNEAD_CYCLES,
  MILL_TURNS,
  OVEN_MOUTH,
  PHASE,
  STAGES,
} from "@/config/process";
import { clamp, smoothstep } from "@/lib/math";

export interface GrainState {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
}

export interface ProcessFrame {
  fieldZoom: number;
  fieldOpacity: number;
  kitchen: number;
  ear: number;
  grains: GrainState[];
  mill: { opacity: number; handle: number };
  stream: { from: number; to: number };
  pile: { scale: number; opacity: number };
  drops: { y: number; opacity: number }[];
  dough: { opacity: number; x: number; y: number; scale: number; squash: number };
  bubbles: { opacity: number; pulse: number };
  clock: { opacity: number; angle: number };
  oven: { opacity: number; x: number; door: number; glow: number };
  bread: { opacity: number; x: number; y: number; scale: number };
  bowl: number;
  /** Brilho quente do forno que toma a tela no final. */
  finalGlow: number;
  stageIndex: number;
  captionA: number;
  captionB: number;
  captionC: number;
}

type Range = readonly [number, number];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Função pura do progresso → quadro; rolar rápido ou para trás reproduz exatamente os mesmos estados. */
export function computeProcessFrame(progress: number): ProcessFrame {
  const p = clamp(progress);
  const step = ([from, to]: Range) => smoothstep(from, to, p);
  const pulse = ([a, b, c, d]: readonly [number, number, number, number]) => smoothstep(a, b, p) * (1 - smoothstep(c, d, p));

  const grains = EAR_GRAINS.map((grain, index) => {
    const t = smoothstep(PHASE.grainsFall[0] + index * PHASE.grainStagger, PHASE.grainsFall[1] + index * PHASE.grainStagger, p);
    const startX = EAR_CENTER.x + grain.x * EAR_ZOOM;
    const startY = EAR_CENTER.y + grain.y * EAR_ZOOM;
    const spread = Math.sin(index * 2.3) * 120;
    return {
      x: lerp(startX, HOPPER.x + Math.sin(index * 1.7) * 26, t) + Math.sin(Math.PI * t) * spread,
      y: lerp(startY, HOPPER.y, t),
      rotate: grain.angle + t * 260 * (index % 2 ? 1 : -1),
      scale: EAR_ZOOM * lerp(1, 0.45, t),
      opacity: smoothstep(PHASE.earIn[0], PHASE.earIn[1], p) * (1 - smoothstep(0.86, 1, t)),
    };
  });

  const rise = step(PHASE.rise);
  const carry = step(PHASE.carry);
  const doorClose = step(PHASE.doorClose);
  const doorOpen = step(PHASE.doorOpen);
  const knead = step(PHASE.knead) * (1 - rise);
  const kneadPhase = Math.PI * 2 * KNEAD_CYCLES * step(PHASE.knead);
  const breadOut = step(PHASE.breadOut);

  // O pão de massa parte da tigela, entra no forno e some quando a porta fecha.
  const doughX = lerp(BOWL.x, OVEN_MOUTH.x, carry);
  const doughY = lerp(BOWL.y, OVEN_MOUTH.y, carry) - Math.sin(Math.PI * carry) * 120;
  const doughScale = (0.8 + 0.45 * step(PHASE.doughIn)) * (1 + 0.55 * rise) * lerp(1, 0.42, carry);

  const dropT = (index: number) => smoothstep(PHASE.drops[0] + index * 0.012, PHASE.drops[1] + index * 0.012, p);

  return {
    fieldZoom: Math.pow(EAR_ZOOM, step(PHASE.fieldZoom)),
    fieldOpacity: 1 - step(PHASE.fieldOut),
    kitchen: step(PHASE.kitchenIn),
    ear: smoothstep(PHASE.earIn[0], PHASE.earIn[1], p) * (1 - step(PHASE.earOut)),
    grains,
    mill: { opacity: step(PHASE.millIn) * (1 - step(PHASE.millOut)), handle: Math.PI * 2 * MILL_TURNS * step(PHASE.millSpin) },
    stream: { from: step(PHASE.streamOut), to: step(PHASE.streamIn) },
    pile: { scale: step(PHASE.pile), opacity: 1 - step(PHASE.pileOut) },
    drops: [0, 1, 2].map((index) => {
      const t = dropT(index);
      return { y: lerp(-40, 70, t), opacity: Math.sin(Math.PI * t) };
    }),
    dough: {
      opacity: step(PHASE.doughIn) * (1 - doorClose),
      x: doughX,
      y: doughY,
      scale: doughScale,
      squash: 1 + 0.08 * Math.sin(kneadPhase) * knead,
    },
    bubbles: { opacity: pulse(PHASE.clock) * (1 - carry), pulse: 0.5 + 0.5 * Math.sin(rise * Math.PI * 9) },
    clock: { opacity: pulse(PHASE.clock), angle: 360 * CLOCK_TURNS * rise },
    oven: { opacity: step(PHASE.ovenIn), x: 420 * (1 - step(PHASE.ovenIn)), door: Math.max(1 - doorClose, doorOpen), glow: 0.35 + 0.65 * doorClose * (1 - doorOpen * 0.4) },
    bread: {
      opacity: smoothstep(PHASE.doorOpen[0], PHASE.doorOpen[1], p),
      x: lerp(OVEN_MOUTH.x, 800, breadOut),
      y: lerp(OVEN_MOUTH.y + 10, 640, breadOut),
      scale: lerp(0.5, 1.6, breadOut),
    },
    bowl: step(PHASE.kitchenIn) * (1 - smoothstep(0.78, 0.84, p)),
    finalGlow: smoothstep(0.9, 1, p),
    stageIndex: stageIndexFor(p),
    captionA: pulse(PHASE.captionA),
    captionB: pulse(PHASE.captionB),
    captionC: smoothstep(PHASE.captionC[0], PHASE.captionC[1], p),
  };
}

const STAGE_STARTS = [0, 0.18, 0.32, 0.5, 0.62, 0.8, 0.94] as const;

function stageIndexFor(p: number) {
  let index = 0;
  STAGE_STARTS.forEach((start, i) => {
    if (p >= start) index = i;
  });
  return Math.min(index, STAGES.length - 1);
}