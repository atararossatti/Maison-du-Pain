import { EAR_CENTER, EAR_ZOOM, GRAIN_COUNT, PROCESS_VIEWBOX } from "@/config/process";
import { Field, WheatEar } from "./layers/Field";
import { Bowl, Bread, Clock, Dough, FlourFlow, KitchenBackdrop, Mill, Oven } from "./layers/Kitchen";

export function Illustration() {
  return (
    <svg
      viewBox={`0 0 ${PROCESS_VIEWBOX.width} ${PROCESS_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Ilustração do processo do pão: campo de trigo ao amanhecer, grãos caindo no moinho, farinha na tigela, massa que cresce, forno de tijolos e um pão dourado."
    >
      <defs>
        <radialGradient id="processFinalGlow" cx="80%" cy="68%" r="70%">
          <stop offset="0" stopColor="var(--color-gold)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--color-gold)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="processVignette" cx="50%" cy="48%" r="75%">
          <stop offset="0.55" stopColor="var(--color-chocolate)" stopOpacity="0" />
          <stop offset="1" stopColor="var(--color-chocolate)" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      <g data-el="field">
        <Field />
      </g>
      <g data-el="kitchen" style={{ opacity: 0 }}>
        <KitchenBackdrop />
      </g>

      <g data-el="ear" transform={`translate(${EAR_CENTER.x} ${EAR_CENTER.y}) scale(${EAR_ZOOM})`} style={{ opacity: 0 }}>
        <WheatEar grains={false} />
      </g>
      {Array.from({ length: GRAIN_COUNT }, (_, index) => (
        <ellipse key={index} data-el={`grain-${index}`} rx="3.6" ry="7" fill="var(--color-gold)" stroke="var(--color-crust)" strokeOpacity="0.5" strokeWidth="0.6" style={{ opacity: 0 }} />
      ))}

      <g data-el="mill" style={{ opacity: 0 }}>
        <Mill />
      </g>
      <Oven />
      <g data-el="bowl" style={{ opacity: 0 }}>
        <Bowl part="back" />
      </g>
      <FlourFlow />
      <Dough />
      <g data-el="bowlFront" style={{ opacity: 0 }}>
        <Bowl part="front" />
      </g>
      <Clock />
      <Bread />

      <rect data-el="finalGlow" width={PROCESS_VIEWBOX.width} height={PROCESS_VIEWBOX.height} fill="url(#processFinalGlow)" style={{ opacity: 0, mixBlendMode: "screen" }} />
      <rect width={PROCESS_VIEWBOX.width} height={PROCESS_VIEWBOX.height} fill="url(#processVignette)" />
    </svg>
  );
}