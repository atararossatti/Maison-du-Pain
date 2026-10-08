import { INGREDIENTS } from "@/config/bakery";

/** Pontos de ancoragem compartilhados com `camera.ts`/`useBakeryTimeline.ts`. */
export const SHOULDERS = { left: { x: 735, y: 470 }, right: { x: 865, y: 470 } } as const;
/** O saco paira à direita da padeira; o fio cai em diagonal até a bancada para nunca cruzar o rosto dela. */
export const SACK_X = 960;
export const STREAM = { x: 800, top: 252, bottom: 667, width: 16, tilt: 18.3 } as const;

const DUST = Array.from({ length: 7 }, (_, i) => ({ id: i, dx: ((i * 5) % 14) - 7, delay: i * 0.18, r: 1.6 + (i % 3) }));
const SPECKS = [
  [-60, -50, 5], [-20, -78, 4], [30, -60, 6], [70, -34, 4], [-84, -22, 4], [10, -24, 5], [50, -86, 3],
] as const;

function Baker() {
  return (
    <g>
      <rect x="690" y="430" width="220" height="260" rx="46" fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeOpacity="0.3" strokeWidth="3" />
      <rect x="736" y="500" width="128" height="200" rx="20" fill="var(--color-olive)" />
      <rect x="756" y="462" width="88" height="50" rx="16" fill="var(--color-olive)" />
      <path d="M770 466L742 440M830 466L858 440" stroke="var(--color-chocolate)" strokeWidth="6" strokeLinecap="round" />
      <rect x="772" y="530" width="56" height="34" rx="8" fill="var(--color-moss)" />
      <ellipse cx="800" cy="428" rx="40" ry="12" fill="var(--color-gold)" />
      <g data-el="head">
        <circle cx="739" cy="356" r="12" fill="var(--color-skin)" />
        <circle cx="861" cy="356" r="12" fill="var(--color-skin)" />
        <circle cx="800" cy="352" r="62" fill="var(--color-skin)" />
        <path d="M740 330Q742 262 800 258Q858 262 860 330Q834 296 800 296Q766 296 740 330Z" fill="var(--color-chocolate)" />
        <path d="M732 318Q738 252 800 250Q862 252 868 318Z" fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeOpacity="0.35" strokeWidth="3" />
        <rect x="734" y="314" width="132" height="16" rx="8" fill="var(--color-caramel)" />
        <circle cx="800" cy="248" r="16" fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeOpacity="0.35" strokeWidth="3" />
        <path d="M774 356q9 -10 18 0M808 356q9 -10 18 0" stroke="var(--color-ink)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="768" cy="372" r="11" fill="var(--color-rose)" opacity="0.65" />
        <circle cx="832" cy="372" r="11" fill="var(--color-rose)" opacity="0.65" />
        <path d="M786 380q14 14 28 0" stroke="var(--color-ink)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="800" cy="366" r="4" fill="var(--color-crust)" opacity="0.35" />
      </g>
    </g>
  );
}

function Counter() {
  return (
    <g>
      <defs>
        <linearGradient id="counterShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-ink)" stopOpacity="0.4" />
          <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="-400" y="700" width="2400" height="500" fill="var(--color-crust)" />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={`M${-400 + i * 160} 700V1200`} stroke="var(--color-ink)" strokeOpacity="0.28" strokeWidth="3" />
      ))}
      <rect x="-400" y="700" width="2400" height="60" fill="url(#counterShade)" />
      <rect x="-400" y="650" width="2400" height="52" fill="var(--color-caramel)" />
      <rect x="-400" y="650" width="2400" height="7" fill="var(--color-gold)" />
      <rect x="-400" y="699" width="2400" height="5" fill="var(--color-ink)" opacity="0.35" />
    </g>
  );
}

function Ingredient({ id }: { id: string }) {
  switch (id) {
    case "butter":
      return (
        <g>
          <rect x="-30" y="-26" width="60" height="26" rx="4" fill="var(--color-gold)" stroke="var(--color-chocolate)" strokeWidth="2.5" />
          <rect x="-30" y="-26" width="60" height="11" rx="4" fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeWidth="2.5" />
        </g>
      );
    case "milk":
      return (
        <g stroke="var(--color-chocolate)" strokeWidth="2.5">
          <rect x="-20" y="-60" width="40" height="60" rx="8" fill="var(--color-cream)" />
          <rect x="-9" y="-76" width="18" height="18" fill="var(--color-cream)" />
          <rect x="-12" y="-82" width="24" height="8" rx="3" fill="var(--color-olive)" />
          <rect x="-20" y="-34" width="40" height="14" fill="var(--color-gold)" stroke="none" opacity="0.5" />
        </g>
      );
    case "eggs":
      return (
        <g stroke="var(--color-caramel)" strokeWidth="2.5" fill="var(--color-cream)">
          <ellipse cx="-14" cy="-16" rx="12" ry="15" />
          <ellipse cx="13" cy="-14" rx="12" ry="15" />
          <ellipse cx="0" cy="-30" rx="12" ry="15" />
        </g>
      );
    default:
      return (
        <g stroke="var(--color-chocolate)" strokeWidth="2.5">
          <rect x="-22" y="-34" width="44" height="34" rx="4" fill="var(--color-olive)" />
          <rect x="-24" y="-40" width="48" height="9" rx="3" fill="var(--color-cream)" />
          <circle cx="0" cy="-17" r="8" fill="var(--color-gold)" stroke="none" />
        </g>
      );
  }
}

function Sack() {
  return (
    <g data-el="sack" style={{ opacity: 0 }}>
      <g transform={`translate(${SACK_X - 800} 0)`}>
      <g className="amb-sway" style={{ ["--dur" as string]: "4s" }}>
        <path d="M752 140Q744 200 758 246H842Q856 200 848 140Q800 126 752 140Z" fill="var(--color-butter)" stroke="var(--color-chocolate)" strokeWidth="3.5" />
        <path d="M770 140Q800 112 830 140" fill="var(--color-butter)" stroke="var(--color-chocolate)" strokeWidth="3.5" />
        <path d="M772 144Q800 156 828 144" stroke="var(--color-caramel)" strokeWidth="6" fill="none" strokeLinecap="round" />
        <rect x="770" y="176" width="60" height="38" rx="6" fill="var(--color-cream)" stroke="var(--color-caramel)" strokeWidth="2.5" />
        <text x="800" y="201" textAnchor="middle" fontSize="19" fill="var(--color-chocolate)" style={{ fontFamily: "var(--font-hand)" }}>
          farine
        </text>
        <rect x="788" y="244" width="24" height="12" rx="4" fill="var(--color-butter)" stroke="var(--color-chocolate)" strokeWidth="3" />
      </g>
      </g>
    </g>
  );
}

function Dough() {
  return (
    <g data-el="dough" style={{ opacity: 0 }}>
      <ellipse cx="0" cy="18" rx="118" ry="14" fill="var(--color-ink)" opacity="0.28" />
      <ellipse cx="0" cy="-40" rx="112" ry="62" fill="url(#doughTone)" stroke="var(--color-butter)" strokeWidth="2" />
      <ellipse cx="-34" cy="-70" rx="46" ry="14" fill="var(--color-cream)" opacity="0.5" />
      {SPECKS.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="var(--color-cream)" opacity="0.75" />
      ))}
      <path d="M-80 -30Q-30 -2 30 -6Q76 -10 100 -34" stroke="var(--color-caramel)" strokeOpacity="0.28" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Arm({ side }: { side: "left" | "right" }) {
  return (
    <g data-el={side === "left" ? "armL" : "armR"}>
      <rect x="-20" y="-4" width="40" height="116" rx="19" fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeOpacity="0.35" strokeWidth="3" />
      <rect x="-21" y="96" width="42" height="14" rx="5" fill="var(--color-caramel)" />
      <rect x="-13" y="108" width="26" height="44" rx="10" fill="var(--color-skin)" />
      <circle cx="0" cy="160" r="21" fill="var(--color-skin)" />
      <circle cx="-6" cy="154" r="3.5" fill="var(--color-cream)" opacity="0.8" />
      <circle cx="7" cy="165" r="3" fill="var(--color-cream)" opacity="0.8" />
    </g>
  );
}

/** Padeira, bancada e tudo o que acontece sobre ela: compartilham a mesma camada para nunca se separarem no mergulho. */
export function Main() {
  return (
    <g>
      <defs>
        <radialGradient id="doughTone" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="var(--color-cream)" />
          <stop offset="0.6" stopColor="var(--color-butter)" />
          <stop offset="1" stopColor="var(--color-gold)" />
        </radialGradient>
      </defs>
      <Baker />
      <Counter />

      <g transform={`translate(${SACK_X} ${STREAM.top}) rotate(${STREAM.tilt}) translate(${-STREAM.x} ${-STREAM.top})`}>
        <rect data-el="stream" x={STREAM.x - STREAM.width / 2} y={STREAM.top} width={STREAM.width} height="0" rx="7" fill="var(--color-cream)" opacity="0.92" />
        <g data-el="dust" style={{ opacity: 0 }}>
          {DUST.map((speck) => (
            <circle key={speck.id} className="amb-fall" cx={STREAM.x + speck.dx} cy={STREAM.top + 10} r={speck.r} fill="var(--color-cream)" style={{ ["--delay" as string]: `${speck.delay}s` }} />
          ))}
        </g>
      </g>
      <Sack />

      <path
        data-el="pile"
        d="M-120 0Q-92 -40 -40 -48Q0 -62 40 -48Q92 -40 120 0Z"
        fill="var(--color-cream)"
        stroke="var(--color-butter)"
        strokeWidth="3"
        transform="translate(800 648) scale(0)"
      />

      {INGREDIENTS.map((item) => (
        <g key={item.id} data-el={`ingredient-${item.id}`} transform={`translate(${item.from.x} ${item.from.y})`}>
          <ellipse cx="0" cy="2" rx="38" ry="7" fill="var(--color-ink)" opacity="0.25" />
          <Ingredient id={item.id} />
        </g>
      ))}

      <Dough />
      <g data-el="arms">
        <g transform={`translate(${SHOULDERS.left.x} ${SHOULDERS.left.y})`}>
          <Arm side="left" />
        </g>
        <g transform={`translate(${SHOULDERS.right.x} ${SHOULDERS.right.y})`}>
          <Arm side="right" />
        </g>
      </g>
    </g>
  );
}

/** Peças em primeiro plano, sobre a frente da bancada. */
export function Foreground() {
  return (
    <g>
      <g transform="translate(1290 756)">
        <ellipse cx="0" cy="40" rx="110" ry="14" fill="var(--color-ink)" opacity="0.25" />
        <path d="M-100 0H100Q96 64 40 76H-40Q-96 64 -100 0Z" fill="var(--color-crust)" stroke="var(--color-chocolate)" strokeWidth="4" />
        <ellipse cx="0" cy="0" rx="100" ry="18" fill="var(--color-brick)" stroke="var(--color-chocolate)" strokeWidth="4" />
        <ellipse cx="-30" cy="-16" rx="22" ry="28" fill="var(--color-cream)" stroke="var(--color-caramel)" strokeWidth="3" />
        <ellipse cx="22" cy="-12" rx="22" ry="28" fill="var(--color-cream)" stroke="var(--color-caramel)" strokeWidth="3" />
      </g>
      <g transform="translate(330 790) rotate(-6)">
        <rect x="-150" y="-14" width="300" height="28" rx="14" fill="var(--color-gold)" stroke="var(--color-chocolate)" strokeWidth="4" />
        <rect x="-190" y="-8" width="44" height="16" rx="8" fill="var(--color-caramel)" stroke="var(--color-chocolate)" strokeWidth="3" />
        <rect x="146" y="-8" width="44" height="16" rx="8" fill="var(--color-caramel)" stroke="var(--color-chocolate)" strokeWidth="3" />
      </g>
    </g>
  );
}
