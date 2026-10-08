/** Imagens que precisam estar decodificadas antes de revelar a primeira cena. */
export const CRITICAL_IMAGES: readonly string[] = [];

export const LOAD_TIMEOUT_MS = 12_000;

/**
 * Tempo mínimo da animação do forno. O progresso mostrado é sempre o menor entre o
 * carregamento real e o tempo decorrido, para a sequência ser legível em conexões rápidas.
 */
export const MIN_BAKE_MS = 2_600;