const BLOSSOMS = ["var(--color-cream)", "var(--color-rose)", "var(--color-gold)", "var(--color-caramel)"];

interface FlowersProps {
  x: number;
  y: number;
  width: number;
  /** Deslocamento da sequência determinística, para variar caixas vizinhas. */
  seed?: number;
}

/** Caixa de flores: folhas, botões e ramos pendentes. Determinística para não divergir na hidratação. */
export function Flowers({ x, y, width, seed = 0 }: FlowersProps) {
  const count = Math.round(width / 11);
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: count }, (_, i) => {
        const cx = (i + 0.5) * (width / count);
        const lift = ((i * 7 + seed * 5) % 5) * 3;
        return (
          <g key={i} className="amb-sway" style={{ ["--delay" as string]: `${(i * 0.37) % 3}s`, ["--dur" as string]: `${4 + (i % 3)}s` }}>
            <ellipse cx={cx - 5} cy={-6 - lift / 2} rx="9" ry="4.5" transform={`rotate(-30 ${cx - 5} ${-6 - lift / 2})`} fill="var(--color-olive)" />
            <ellipse cx={cx + 5} cy={-8 - lift / 2} rx="9" ry="4.5" transform={`rotate(28 ${cx + 5} ${-8 - lift / 2})`} fill="var(--color-moss)" />
            <circle cx={cx} cy={-12 - lift} r={4.6 + (i % 2)} fill={BLOSSOMS[(i + seed) % BLOSSOMS.length]} />
            <circle cx={cx} cy={-12 - lift} r="1.7" fill="var(--color-crust)" opacity="0.7" />
          </g>
        );
      })}
      {Array.from({ length: Math.round(count / 3) }, (_, i) => (
        <path
          key={`trail-${i}`}
          d={`M${(i + 0.5) * (width / (count / 3))} 6q-3 16 2 28`}
          stroke="var(--color-olive)"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

function Tree({ x, flip = 1, size = 1 }: { x: number; flip?: number; size?: number }) {
  return (
    <g transform={`translate(${x} 735) scale(${flip * size} ${size})`}>
      <path d="M-14 0Q-10 -150 -4 -250H8Q14 -130 18 0Z" fill="var(--color-chocolate)" opacity="0.92" />
      <g>
        <circle cx="-60" cy="-300" r="82" fill="var(--color-moss)" />
        <circle cx="70" cy="-320" r="88" fill="var(--color-olive)" />
        <circle cx="0" cy="-390" r="92" fill="var(--color-olive)" />
        <circle cx="-30" cy="-340" r="66" fill="var(--color-moss)" opacity="0.8" />
        <circle cx="30" cy="-420" r="40" fill="var(--color-gold)" opacity="0.4" />
        <circle cx="96" cy="-300" r="28" fill="var(--color-gold)" opacity="0.28" />
      </g>
    </g>
  );
}

export function Trees() {
  return (
    <g>
      <Tree x={165} size={1} />
      <Tree x={1440} flip={-1} size={0.88} />
    </g>
  );
}

/** Folhagem em primeiro plano: emoldura a cena e atravessa a tela no início do dolly. */
export function Foreground() {
  return (
    <g>
      <g fill="var(--color-moss)">
        <path d="M-40 920Q60 640 200 560Q150 700 260 760Q140 790 120 920Z" />
        <path d="M-40 920Q-10 760 -40 640Q90 700 90 820Z" fill="var(--color-olive)" />
      </g>
      <g fill="var(--color-moss)">
        <path d="M1640 920Q1540 660 1400 590Q1450 720 1350 770Q1470 800 1490 920Z" />
        <path d="M1640 920Q1610 770 1640 660Q1510 720 1510 830Z" fill="var(--color-olive)" />
      </g>
      <g>
        <path d="M-20 -20Q200 20 360 -10Q220 60 150 90Q90 40 -20 70Z" fill="var(--color-moss)" />
        <g fill="var(--color-cream)">
          <circle cx="220" cy="42" r="13" />
          <circle cx="285" cy="22" r="10" />
          <circle cx="130" cy="58" r="9" />
        </g>
        <g fill="var(--color-gold)">
          <circle cx="220" cy="42" r="5" />
          <circle cx="285" cy="22" r="4" />
          <circle cx="130" cy="58" r="3.5" />
        </g>
      </g>
    </g>
  );
}