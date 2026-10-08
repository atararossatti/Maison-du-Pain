export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Interpolação suave (Hermite) de 0 a 1 entre `from` e `to`. */
export function smoothstep(from: number, to: number, value: number) {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
}