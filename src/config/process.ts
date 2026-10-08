export const PROCESS_VIEWBOX = { width: 1600, height: 900 } as const;
export const PROCESS_SCREENS = 8;

/** Centro da espiga principal: origem do zoom do campo e posição da espiga ampliada. */
export const EAR_CENTER = { x: 800, y: 360 } as const;
export const EAR_ZOOM = 5;
export const HOPPER = { x: 800, y: 300 } as const;
export const BOWL = { x: 800, y: 650 } as const;
export const OVEN_MOUTH = { x: 1300, y: 610 } as const;

/** Etapas exibidas no indicador, na ordem da história. */
export const STAGES = ["Campo", "Grãos", "Farinha", "Massa", "Fermentação", "Forno", "Pão"] as const;

/** Intervalos [início, fim] (0–1) de cada acontecimento. */
export const PHASE = {
  fieldZoom: [0.02, 0.2],
  fieldOut: [0.17, 0.24],
  earIn: [0.15, 0.2],
  earOut: [0.3, 0.38],
  grainsFall: [0.2, 0.33],
  grainStagger: 0.006,
  kitchenIn: [0.28, 0.4],
  millIn: [0.26, 0.32],
  millOut: [0.5, 0.56],
  millSpin: [0.3, 0.5],
  streamIn: [0.34, 0.38],
  streamOut: [0.46, 0.5],
  pile: [0.34, 0.48],
  pileOut: [0.52, 0.58],
  drops: [0.46, 0.52],
  doughIn: [0.5, 0.58],
  knead: [0.52, 0.62],
  rise: [0.62, 0.78],
  clock: [0.6, 0.64, 0.8, 0.84],
  ovenIn: [0.72, 0.8],
  carry: [0.8, 0.87],
  doorClose: [0.86, 0.9],
  doorOpen: [0.92, 0.95],
  breadOut: [0.95, 1],
  captionA: [0.04, 0.1, 0.16, 0.22],
  captionB: [0.64, 0.7, 0.82, 0.88],
} as const;

export const GRAIN_COUNT = 24;
export const KNEAD_CYCLES = 5;
export const MILL_TURNS = 7;
export const CLOCK_TURNS = 2;

/** Grãos da espiga: duas fileiras de 12, em coordenadas locais (espiga com 1× de escala). */
export const EAR_GRAINS = Array.from({ length: GRAIN_COUNT }, (_, index) => {
  const row = Math.floor(index / 2);
  const side = index % 2 === 0 ? -1 : 1;
  return { id: index, x: side * 5.5, y: -62 + row * 10.5, angle: side * 24 };
});