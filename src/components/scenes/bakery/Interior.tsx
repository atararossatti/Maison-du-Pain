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
        <filter id="bakeryGrain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" />
          <feColorMatrix values="0 0 0 0 0.29  0 0 0 0 0.19  0 0 0 0 0.15  0 0 0 0.9 -0.28" />
        </filter>
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
      <rect className="grain" width={BAKERY_VIEWBOX.width} height={BAKERY_VIEWBOX.height} filter="url(#bakeryGrain)" opacity="0.5" style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
}
