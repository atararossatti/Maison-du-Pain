import type { ReactNode } from "react";
import { BAKERY_VIEWBOX, type BakeryLayerId } from "@/config/bakery";
import { Foreground, Main } from "./layers/Main";
import { Oven, Wall } from "./layers/Room";

function Layer({ id, children }: { id: BakeryLayerId; children: ReactNode }) {
  return <g data-layer={id}>{children}</g>;
}

export function Interior() {
  return (
    <svg
      viewBox={`0 0 ${BAKERY_VIEWBOX.width} ${BAKERY_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Ilustração do interior da padaria: uma padeira de avental verde sova a massa sobre a bancada de madeira, com forno de tijolos, prateleiras e lâmpadas acesas ao fundo."
    >
      <defs>
        <radialGradient id="cozyVignette" cx="50%" cy="48%" r="75%">
          <stop offset="0.5" stopColor="var(--color-chocolate)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-chocolate)" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      <Layer id="wall"><Wall /></Layer>
      <Layer id="oven"><Oven /></Layer>
      <Layer id="main"><Main /></Layer>
      <Layer id="foreground"><Foreground /></Layer>
      <rect width={BAKERY_VIEWBOX.width} height={BAKERY_VIEWBOX.height} fill="url(#cozyVignette)" />
    </svg>
  );
}
