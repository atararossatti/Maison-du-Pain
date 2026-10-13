export const CROISSANT_SCREENS = 6;

/** Intervalos [início, fim] do progresso (0–1) de cada etapa. */
export const CROISSANT_PHASE = {
  wash: [0, 0.14],
  unfold: [0.12, 0.42],
  bake: [0.16, 0.5],
  spin: [0.1, 0.95],
  explode: [0.62, 0.84],
  reassemble: [0.92, 1],
  closeUp: [0.58, 0.84],
  burstUnfold: [0.12, 0.5],
  burstExplode: [0.64, 0.92],
  captionA: [0.6, 0.68, 0.86, 0.9],
  captionB: [0.9, 0.96],
  /** Saída: o fundo vira o creme liso da Cena 04 e o croissant se dissolve. */
  exit: [0.95, 1],
} as const;

/** Croissant procedural: `SEGMENTS` cristas em barril ao longo de um arco; abertas em leque, mostram a laminação em espiral. */
export const SEGMENTS = 7;
export const ARC_ANGLE = 1.25;
export const ARC_RADIUS = 1.7;
/** Inclinação das cristas em relação ao arco: dá o aspecto de massa enrolada. */
export const RIDGE_SKEW = 0.32;
/** Abertura horizontal do leque quando as camadas se separam. */
export const FAN_SPREAD = 2.15;
export const SPIN_TURNS = 0.85;

export const FLOUR_PARTICLES = 140;
export const SHARD_PARTICLES = 90;

/** Câmera em coordenadas polares: afasta-se na revelação e aproxima-se para ver as camadas. */
export const CAMERA = {
  distance: { far: 7, near: 6 },
  elevation: { high: 0.62, low: 0.38 },
  fov: 34,
} as const;

/** Cores em sRGB: massa crua e crosta assada (centro mais claro, pontas mais tostadas). */
export const DOUGH_COLOR = "#f1dfb8";
export const BAKED_CENTER = "#d9a45f";
export const BAKED_TIP = "#a8662e";
