import { VIEWBOX, type LayerId } from "@/config/awakening";
import { Clouds, Sky, Town } from "./layers/Backdrop";
import { Facade } from "./layers/Facade";
import { Foreground, Trees } from "./layers/Flora";
import { Props, Street } from "./layers/Street";
import type { ReactNode } from "react";

/**
 * Cada camada tem dois grupos: o interno recebe a transformação do scroll (atributo `transform`),
 * o externo recebe o deslocamento do ponteiro. Separados, nunca disputam a mesma propriedade.
 */
function Layer({ id, children }: { id: LayerId; children: ReactNode }) {
  return (
    <g data-pointer={id}>
      <g data-layer={id}>{children}</g>
    </g>
  );
}

export function Illustration({ dusk = false }: { dusk?: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label={dusk ? "Ilustração da fachada da Maison du Pain ao entardecer: janelas acesas, rua de paralelepípedos dourada e mesas na calçada." : "Ilustração da fachada da Maison du Pain ao amanhecer: sobrado francês com flores nas janelas, mesas na calçada, árvores e uma chaminé soltando fumaça."}
    >
      <defs>
        <filter id="paperGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0.29  0 0 0 0 0.19  0 0 0 0 0.15  0 0 0 0.9 -0.28" />
        </filter>
        <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
          <stop offset="0.55" stopColor="var(--color-chocolate)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-chocolate)" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      <Layer id="sky"><Sky dusk={dusk} /></Layer>
      <Layer id="clouds"><Clouds /></Layer>
      <Layer id="town"><Town /></Layer>
      <Layer id="street"><Street /></Layer>
      <Layer id="facade"><Facade dusk={dusk} /></Layer>
      <Layer id="trees"><Trees /></Layer>
      <Layer id="props"><Props /></Layer>
      <Layer id="foreground"><Foreground /></Layer>

      <rect data-fx="dawnTint" width={VIEWBOX.width} height={VIEWBOX.height} fill={dusk ? "var(--color-dusk)" : "var(--color-rose)"} style={{ opacity: dusk ? 0 : 0.38, mixBlendMode: "multiply" }} />
      <rect width={VIEWBOX.width} height={VIEWBOX.height} fill="url(#vignette)" />
      <rect className="grain" width={VIEWBOX.width} height={VIEWBOX.height} filter="url(#paperGrain)" opacity="0.5" style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
}