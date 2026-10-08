import { EAR_CENTER, EAR_GRAINS } from "@/config/process";

/** Espiga de trigo; `grains` desliga os grãos quando eles são desenhados como partículas separadas. */
export function WheatEar({ grains = true }: { grains?: boolean }) {
  return (
    <g>
      <path d="M0 0V220" stroke="var(--color-olive)" strokeWidth="3" strokeLinecap="round" />
      {[-1, 1].map((side) => (
        <path key={side} d={`M${side * 3} -64Q${side * 14} -100 ${side * 10} -142`} stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      ))}
      <path d="M0 -66V-100" stroke="var(--color-gold)" strokeWidth="1.4" strokeLinecap="round" />
      {grains &&
        EAR_GRAINS.map((grain) => (
          <ellipse
            key={grain.id}
            cx={grain.x}
            cy={grain.y}
            rx="3.6"
            ry="7"
            transform={`rotate(${grain.angle} ${grain.x} ${grain.y})`}
            fill="var(--color-gold)"
            stroke="var(--color-crust)"
            strokeOpacity="0.5"
            strokeWidth="0.6"
          />
        ))}
    </g>
  );
}

const ROWS = [
  { y: 600, count: 30, height: 120, tone: "var(--color-olive)", dur: 6 },
  { y: 660, count: 24, height: 150, tone: "var(--color-gold)", dur: 5 },
  { y: 730, count: 18, height: 190, tone: "var(--color-caramel)", dur: 4.2 },
] as const;

function WheatRow({ y, count, height, tone, dur }: (typeof ROWS)[number]) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = (i + 0.5) * (1700 / count) - 50 + ((i * 37) % 23);
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g className="amb-sway" style={{ ["--dur" as string]: `${dur + (i % 4) * 0.5}s`, ["--delay" as string]: `${(i * 0.3) % 3}s` }}>
              <path d={`M0 0Q4 ${-height * 0.5} 0 ${-height}`} stroke={tone} strokeWidth="3.4" fill="none" strokeLinecap="round" />
              <ellipse cx="0" cy={-height - 14} rx="5.5" ry="18" fill={tone} />
              <path d={`M0 ${-height - 30}V${-height - 52}`} stroke={tone} strokeWidth="1.4" />
            </g>
          </g>
        );
      })}
    </g>
  );
}

/** Campo ao amanhecer: o céu, as colinas, três fileiras de trigo e a espiga principal. */
export function Field() {
  return (
    <g>
      <defs>
        <linearGradient id="fieldSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-rose)" />
          <stop offset="0.55" stopColor="var(--color-blush)" />
          <stop offset="1" stopColor="var(--color-gold)" />
        </linearGradient>
        <radialGradient id="fieldSun">
          <stop offset="0" stopColor="var(--color-cream)" />
          <stop offset="1" stopColor="var(--color-gold)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-300" y="-300" width="2200" height="1500" fill="url(#fieldSky)" />
      <circle cx="1180" cy="430" r="360" fill="url(#fieldSun)" />
      <path d="M-100 560Q300 470 700 540T1500 520T1800 560V900H-100Z" fill="var(--color-olive)" opacity="0.45" />
      <path d="M-100 620Q400 560 900 610T1800 600V900H-100Z" fill="var(--color-gold)" opacity="0.6" />
      {ROWS.map((row) => (
        <WheatRow key={row.y} {...row} />
      ))}
      <g transform={`translate(${EAR_CENTER.x} ${EAR_CENTER.y})`}>
        <WheatEar />
      </g>
    </g>
  );
}
