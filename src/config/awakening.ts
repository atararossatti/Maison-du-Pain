/** Ponto de fuga da cÃ¢mera: o centro da janela principal, em coordenadas do viewBox. */
export const VIEWBOX = { width: 1600, height: 900 } as const;
/** Enquadramento para telas em retrato (proporção ~0,46): mostra a fachada inteira e abre céu para o título. */
export const VIEWBOX_PORTRAIT = { x: 350, y: -480, width: 900, height: 1950 } as const;
export const CAMERA_ORIGIN = { x: 800, y: 480 } as const;

/** DistÃ¢ncia de scroll (em alturas de viewport) que a cena ocupa fixada na tela. */
export const SCROLL_SCREENS = 5;

/** Deslocamento vertical inicial (unidades do viewBox) que abre espaÃ§o de cÃ©u para o tÃ­tulo; some com o dolly. */
export const OPENING_LIFT = 125;

/**
 * Escala final de cada camada quando a cÃ¢mera chega Ã  janela. Quanto mais perto da cÃ¢mera,
 * maior o valor; a diferenÃ§a entre camadas Ã© o que gera paralaxe real durante o dolly.
 */
export const LAYER_SCALE = {
  sky: 1.15,
  clouds: 1.5,
  town: 3.2,
  street: 14,
  facade: 14,
  trees: 18,
  props: 21,
  foreground: 30,
} as const;

export type LayerId = keyof typeof LAYER_SCALE;
export const LAYER_IDS = Object.keys(LAYER_SCALE) as LayerId[];

/** Intensidade do deslocamento por ponteiro (unidades do viewBox) em cada camada. */
export const POINTER_DEPTH: Partial<Record<LayerId, number>> = {
  sky: 4,
  clouds: 8,
  town: 12,
  facade: 20,
  trees: 28,
  props: 34,
  foreground: 46,
};