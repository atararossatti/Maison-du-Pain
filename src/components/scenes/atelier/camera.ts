import { ATELIER_PHASE, ATELIER_STEPS } from "@/config/atelier";
import { clamp, smoothstep } from "@/lib/math";

export interface AtelierStepFrame {
  /** Abertura da máscara (0–1). */
  enter: number;
  /** Zoom da fotografia: assenta de 1,3 até 1 e depois avança devagar. */
  zoom: number;
  /** Visibilidade da legenda (0–1). */
  caption: number;
}

export interface AtelierFrame {
  steps: AtelierStepFrame[];
  /** Véu da cor do fundo da página, na entrada e na saída da cena. */
  veil: number;
  /** Título de abertura sobre o véu. */
  title: number;
  /** Etapa em destaque (índice). */
  active: number;
}

const STEP = (1 - ATELIER_PHASE.intro - ATELIER_PHASE.outro) / ATELIER_STEPS.length;

/** Função pura do progresso do scroll (0–1) para o quadro do Atelier. */
export function computeAtelierFrame(progress: number): AtelierFrame {
  const p = clamp(progress);
  const steps = ATELIER_STEPS.map((_, index) => {
    const start = ATELIER_PHASE.intro + index * STEP;
    const openFrom = index === 0 ? start : start - 0.03;
    const enter = smoothstep(openFrom, start + 0.07, p);
    const zoom = 1.3 - 0.3 * enter + 0.08 * smoothstep(start + 0.07, start + STEP, p);
    const last = index === ATELIER_STEPS.length - 1;
    const end = last ? 1 - ATELIER_PHASE.outro : start + STEP;
    const caption = smoothstep(start + 0.05, start + 0.1, p) * (1 - smoothstep(end - 0.05, end - 0.01, p));
    return { enter, zoom, caption };
  });
  const active = clamp(Math.floor((p - ATELIER_PHASE.intro + 0.02) / STEP), 0, ATELIER_STEPS.length - 1);
  return {
    steps,
    veil: Math.max(1 - smoothstep(0, ATELIER_PHASE.intro, p), smoothstep(1 - ATELIER_PHASE.outro, 1, p)),
    title: 1 - smoothstep(0, ATELIER_PHASE.intro, p),
    active,
  };
}
