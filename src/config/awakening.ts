export const VIEWBOX = { width: 1600, height: 900 } as const;
/** Enquadramento para telas em retrato (proporção ~0,46): mostra a fachada inteira e abre céu para o título. */
export const VIEWBOX_PORTRAIT = { x: 350, y: -480, width: 900, height: 1950 } as const;

/** Ponto de fuga da câmera: o centro da porta da padaria, em coordenadas do viewBox. */
export const CAMERA_ORIGIN = { x: 1040, y: 580 } as const;

/** Distância de scroll (em alturas de viewport) que a cena ocupa fixada na tela. */
export const SCROLL_SCREENS = 4;

/** Telas de scroll da Cena 06 (o recuo da câmera termina antes; o resto é pausa para ler e agir). */
export const RETURN_SCREENS = 5;

/** Deslocamento vertical inicial (unidades do viewBox) que abre espaço de céu para o título; some com o dolly. */
export const OPENING_LIFT = 125;

/**
 * Escala final de cada camada quando a câmera chega à porta. Quanto mais perto da câmera,
 * maior o valor; a diferença entre camadas é o que gera paralaxe real durante o dolly.
 */
export const LAYER_SCALE = {
  sky: 1.15,
  clouds: 1.5,
  town: 3.2,
  street: 20,
  facade: 20,
  trees: 26,
  props: 30,
  foreground: 44,
} as const;

export type LayerId = keyof typeof LAYER_SCALE;
export const LAYER_IDS = Object.keys(LAYER_SCALE) as LayerId[];
