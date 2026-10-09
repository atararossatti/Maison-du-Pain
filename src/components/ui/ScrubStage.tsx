import type { ReactNode } from "react";

interface ScrubStageProps {
  /** Telas de scroll que a cena ocupa fixa; a altura do palco é (telas + 1) × altura da viewport. */
  screens: number;
  /** Sobrepõe a última tela da cena anterior: a nova cena sobe por cima do último quadro dela. */
  overlap?: boolean;
  /** Há uma cena seguinte sobreposta: reserva uma tela extra em que o último quadro fica parado enquanto ela cobre. */
  covered?: boolean;
  /** Ordem de empilhamento: cenas seguintes cobrem as anteriores. */
  layer: number;
  reduced: boolean;
  children: ReactNode;
}

/** Classes da seção-palco: `sticky` (fixação feita pelo navegador, sem saltos) ou fluxo normal no modo estático. */
export const stageClass = (reduced: boolean) => (reduced ? "relative" : "sticky top-0");

/**
 * Container alto cujo filho (`stageClass`) fica colado ao topo enquanto o scroll percorre o container.
 * Substitui o pin do ScrollTrigger: `position: sticky` roda na thread do compositor, então não há
 * o salto de um quadro que o pin por JavaScript tinha ao engatar e soltar.
 */
export function ScrubStage({ screens, overlap = false, covered = false, layer, reduced, children }: ScrubStageProps) {
  return (
    <div
      data-stage
      data-covered={covered}
      className="relative"
      style={reduced ? undefined : { height: `${(screens + 1 + (covered ? 1 : 0)) * 100}svh`, marginTop: overlap ? "-100svh" : undefined, zIndex: layer }}
    >
      {children}
    </div>
  );
}