export const BAKERY_VIEWBOX = { width: 1600, height: 900 } as const;
/** Ponto de mergulho final: o centro da massa sobre a bancada. */
export const DOUGH_CENTER = { x: 800, y: 648 } as const;
export const BAKERY_SCREENS = 6;

/** Camadas mais próximas da câmera têm escala final maior (paralaxe do mergulho). */
export const BAKERY_LAYER_SCALE = { wall: 2.4, oven: 3.6, main: 9, foreground: 15 } as const;
export type BakeryLayerId = keyof typeof BAKERY_LAYER_SCALE;
export const BAKERY_LAYER_IDS = Object.keys(BAKERY_LAYER_SCALE) as BakeryLayerId[];

/** Intervalos [início, fim] do progresso (0–1) de cada etapa da história. */
export const PHASE = {
  wash: [0, 0.07],
  sackIn: [0.04, 0.1],
  sackOut: [0.3, 0.37],
  sackTilt: [0.1, 0.15],
  sackUntilt: [0.27, 0.32],
  streamIn: [0.08, 0.14],
  streamOut: [0.28, 0.34],
  pile: [0.1, 0.3],
  pileOut: [0.5, 0.62],
  ingredient: [0.3, 0.46],
  ingredientStagger: 0.04,
  doughIn: [0.44, 0.54],
  doughForm: [0.46, 0.62],
  kneadIn: [0.38, 0.48],
  kneadOut: [0.84, 0.9],
  kneadSpan: [0.42, 0.86],
  rise: [0.7, 0.88],
  dive: [0.88, 1],
  captionA: [0.03, 0.1, 0.3, 0.36],
  captionB: [0.5, 0.58, 0.8, 0.86],
} as const;

export const KNEAD_CYCLES = 7;

export interface IngredientSpec {
  id: string;
  /** Posição inicial na bancada (unidades do viewBox). */
  from: { x: number; y: number };
}

export const INGREDIENTS: readonly IngredientSpec[] = [
  { id: "butter", from: { x: 420, y: 646 } },
  { id: "milk", from: { x: 300, y: 646 } },
  { id: "eggs", from: { x: 1190, y: 650 } },
  { id: "yeast", from: { x: 1300, y: 646 } },
];