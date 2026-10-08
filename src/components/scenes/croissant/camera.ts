import { CAMERA, CROISSANT_PHASE as PHASE, SPIN_TURNS } from "@/config/croissant";
import { clamp, smoothstep } from "@/lib/math";

export interface CroissantFrame {
  /** 0 = massa cobre a tela, 1 = revelação completa (usado pela máscara HTML). */
  reveal: number;
  unfold: number;
  bake: number;
  spin: number;
  explode: number;
  camera: { distance: number; elevation: number };
  burstUnfold: number;
  burstExplode: number;
  captionA: number;
  captionB: number;
  exit: number;
}

type Range = readonly [number, number];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Função pura do progresso → quadro; o mesmo progresso sempre produz a mesma cena 3D. */
export function computeCroissantFrame(progress: number): CroissantFrame {
  const p = clamp(progress);
  const step = ([from, to]: Range) => smoothstep(from, to, p);
  const close = step(PHASE.closeUp);

  // As camadas se juntam de novo no fim para que a próxima cena comece de um objeto inteiro.
  const explode = step(PHASE.explode) * (1 - 0.65 * step(PHASE.reassemble));
  const [aIn, aFullIn, aOut, aFullOut] = PHASE.captionA;

  return {
    reveal: step(PHASE.wash),
    unfold: step(PHASE.unfold),
    bake: step(PHASE.bake),
    // A rotação cessa conforme o leque abre, para as seções ficarem de frente para a câmera.
    spin: step(PHASE.spin) * SPIN_TURNS * Math.PI * 2 * (1 - explode),
    explode,
    camera: {
      distance: lerp(CAMERA.distance.far, CAMERA.distance.near, close),
      elevation: lerp(CAMERA.elevation.high, CAMERA.elevation.low, close),
    },
    burstUnfold: step(PHASE.burstUnfold),
    burstExplode: step(PHASE.burstExplode),
    captionA: smoothstep(aIn, aFullIn, p) * (1 - smoothstep(aOut, aFullOut, p)),
    captionB: step(PHASE.captionB),
    exit: step(PHASE.exit),
  };
}
