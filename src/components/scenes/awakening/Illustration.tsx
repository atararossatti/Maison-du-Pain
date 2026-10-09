import { VIEWBOX, VIEWBOX_PORTRAIT, type LayerId } from "@/config/awakening";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Clouds, Sky, Town } from "./layers/Backdrop";
import { Facade } from "./layers/Facade";
import { Foreground, Trees } from "./layers/Flora";
import { Props, Street } from "./layers/Street";
import type { ReactNode } from "react";

/**
 * Cada camada recebe a transformação do scroll no atributo `transform`. O deslocamento do ponteiro NÃO é
 * aplicado aqui: é um único translate no elemento `<svg>` (ver `usePointerParallax`), para não invalidar a pintura.
 */
function Layer({ id, children }: { id: LayerId; children: ReactNode }) {
  return (
    <g data-layer={id}>{children}</g>
  );
}

export function Illustration({ dusk = false }: { dusk?: boolean }) {
  // Em retrato o viewBox fica alto e estreito: a fachada inteira cabe, em vez de só a janela central.
  const portrait = useMediaQuery("(max-aspect-ratio: 4/5)");
  const box = portrait ? VIEWBOX_PORTRAIT : { x: 0, y: 0, ...VIEWBOX };

  return (
    <svg
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
      preserveAspectRatio="xMidYMid slice"
      data-pointer-root
      // Um pouco maior que a seção: o deslocamento do ponteiro nunca deixa uma borda vazia à mostra.
      // Sem `will-change`/transform 3D de propósito: um <svg> promovido a camada própria com filhos animados
      // deixa o Chrome com a rasterização pela metade (parede, copas e telhado somem até a próxima repintura).
      className="absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)]"
      role="img"
      aria-label={dusk ? "Ilustração da fachada da Maison du Pain ao entardecer: janelas acesas, rua de paralelepípedos dourada e mesas na calçada." : "Ilustração da fachada da Maison du Pain ao amanhecer: sobrado francês com flores nas janelas, mesas na calçada, árvores e uma chaminé soltando fumaça."}
    >
      <defs>
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

      <rect data-fx="dawnTint" x={box.x} y={box.y} width={box.width} height={box.height} fill={dusk ? "var(--color-dusk)" : "var(--color-rose)"} style={{ opacity: dusk ? 0 : 0.2 }} />
      <rect x={box.x} y={box.y} width={box.width} height={box.height} fill="url(#vignette)" />
    </svg>
  );
}