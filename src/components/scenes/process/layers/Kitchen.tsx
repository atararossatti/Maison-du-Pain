import { BOWL } from "@/config/process";

export const STREAM_GEOMETRY = { x: 800, top: 420, bottom: 640, width: 14 } as const;
export const CLOCK_CENTER = { x: 1320, y: 220 } as const;
const OVEN_MOUTH_PATH = "M1230 700V610A70 70 0 0 1 1370 610V700Z";
const BUBBLES = [
  [-60, -50, 9], [-20, -78, 7], [30, -64, 10], [64, -34, 7], [-78, -22, 6], [8, -32, 8], [48, -88, 5],
] as const;

export function KitchenBackdrop() {
  return (
    <g>
      <defs>
        <linearGradient id="kitchenWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-butter)" />
          <stop offset="1" stopColor="var(--color-blush)" />
        </linearGradient>
        <pattern id="processStripes" width="44" height="10" patternUnits="userSpaceOnUse">
          <rect width="22" height="10" fill="var(--color-gold)" opacity="0.12" />
        </pattern>
        <linearGradient id="counterEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-ink)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-ink)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="-300" y="-300" width="2200" height="1500" fill="url(#kitchenWall)" />
      <rect x="-300" y="-300" width="2200" height="1500" fill="url(#processStripes)" />
      <rect x="-300" y="720" width="2200" height="500" fill="var(--color-crust)" />
      <rect x="-300" y="720" width="2200" height="50" fill="url(#counterEdge)" />
      <rect x="-300" y="690" width="2200" height="34" fill="var(--color-caramel)" />
      <rect x="-300" y="690" width="2200" height="6" fill="var(--color-gold)" />
    </g>
  );
}

export function Bowl({ part }: { part: "back" | "front" }) {
  return part === "back" ? <BowlBack /> : <BowlFront />;
}

function BowlBack() {
  return (
    <g transform={`translate(${BOWL.x} ${BOWL.y})`}>
      <ellipse cx="0" cy="62" rx="190" ry="14" fill="var(--color-ink)" opacity="0.22" />
      <ellipse cx="0" cy="-4" rx="168" ry="30" fill="var(--color-brick)" />
      <ellipse cx="0" cy="0" rx="150" ry="22" fill="var(--color-ink)" opacity="0.5" />
    </g>
  );
}

function BowlFront() {
  return (
    <g transform={`translate(${BOWL.x} ${BOWL.y})`}>
      <path d="M-168 -4Q-160 70 0 74Q160 70 168 -4Q100 26 0 28Q-100 26 -168 -4Z" fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeOpacity="0.45" strokeWidth="3" />
      <path d="M-150 26Q0 46 150 26" stroke="var(--color-olive)" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

export function Mill() {
  return (
    <g>
      <path d="M690 240H910L842 322H758Z" fill="var(--color-crust)" stroke="var(--color-chocolate)" strokeWidth="4" strokeLinejoin="round" />
      <rect x="758" y="318" width="84" height="26" fill="var(--color-brick)" />
      <ellipse cx="800" cy="392" rx="132" ry="26" fill="var(--color-ink)" opacity="0.45" />
      <path d="M668 360V392A132 26 0 0 0 932 392V360Z" fill="var(--color-chocolate)" opacity="0.55" />
      <ellipse cx="800" cy="360" rx="132" ry="26" fill="var(--color-butter)" stroke="var(--color-chocolate)" strokeOpacity="0.5" strokeWidth="3" />
      <ellipse cx="800" cy="360" rx="96" ry="17" fill="none" stroke="var(--color-chocolate)" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M800 392V420" stroke="var(--color-chocolate)" strokeWidth="6" />
      <g data-el="handle">
        <circle r="13" fill="var(--color-caramel)" stroke="var(--color-chocolate)" strokeWidth="3" />
        <path d="M0 0L0 -34" stroke="var(--color-chocolate)" strokeWidth="6" strokeLinecap="round" />
      </g>
    </g>
  );
}

export function FlourFlow() {
  const { x, top, width } = STREAM_GEOMETRY;
  return (
    <g>
      <rect data-el="stream" x={x - width / 2} y={top} width={width} height="0" rx="6" fill="var(--color-cream)" opacity="0.95" />
      <path
        data-el="pile"
        d="M-120 0Q-92 -34 -40 -42Q0 -54 40 -42Q92 -34 120 0Z"
        fill="var(--color-cream)"
        stroke="var(--color-butter)"
        strokeWidth="3"
        transform={`translate(${BOWL.x} ${BOWL.y + 4}) scale(0)`}
      />
      {[0, 1, 2].map((index) => (
        <path key={index} data-el={`drop-${index}`} d="M0 -14Q9 0 0 9Q-9 0 0 -14Z" fill="#9bc2cf" opacity="0" transform={`translate(${BOWL.x - 40 + index * 40} 500)`} />
      ))}
    </g>
  );
}

export function Dough() {
  return (
    <g data-el="dough" style={{ opacity: 0 }}>
      <defs>
        <radialGradient id="processDough" cx="38%" cy="30%" r="75%">
          <stop offset="0" stopColor="var(--color-cream)" />
          <stop offset="0.6" stopColor="var(--color-butter)" />
          <stop offset="1" stopColor="var(--color-gold)" />
        </radialGradient>
      </defs>
      <ellipse cx="0" cy="-34" rx="112" ry="64" fill="url(#processDough)" stroke="var(--color-butter)" strokeWidth="2" />
      <ellipse cx="-34" cy="-66" rx="46" ry="14" fill="var(--color-cream)" opacity="0.5" />
      <g data-el="bubbles" style={{ opacity: 0 }}>
        {BUBBLES.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="var(--color-cream)" stroke="var(--color-gold)" strokeOpacity="0.6" strokeWidth="1.5" />
        ))}
      </g>
    </g>
  );
}

export function Clock() {
  const { x, y } = CLOCK_CENTER;
  return (
    <g data-el="clock" transform={`translate(${x} ${y})`} style={{ opacity: 0 }}>
      <circle r="78" fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeWidth="5" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M0 -64V-54" stroke="var(--color-chocolate)" strokeWidth={i % 3 === 0 ? 4 : 2} strokeLinecap="round" transform={`rotate(${i * 30})`} />
      ))}
      <path data-el="clockHand" d="M0 6V-52" stroke="var(--color-crust)" strokeWidth="5" strokeLinecap="round" />
      <circle r="7" fill="var(--color-chocolate)" />
      <text y="108" textAnchor="middle" fontSize="30" fill="var(--color-chocolate)" style={{ fontFamily: "var(--font-hand)" }}>
        le temps
      </text>
    </g>
  );
}

export function Oven() {
  return (
    <g data-el="oven" style={{ opacity: 0 }}>
      <defs>
        <pattern id="processBricks" width="44" height="22" patternUnits="userSpaceOnUse">
          <rect width="44" height="22" fill="var(--color-brick)" />
          <path d="M0 .5H44M0 11.5H44M0 .5V11.5M22 11.5V22" stroke="var(--color-ink)" strokeOpacity="0.28" strokeWidth="1.6" fill="none" />
        </pattern>
        <radialGradient id="processFire" cx="50%" cy="80%" r="75%">
          <stop offset="0" stopColor="var(--color-gold)" />
          <stop offset="0.6" stopColor="var(--color-caramel)" />
          <stop offset="1" stopColor="var(--color-brick)" />
        </radialGradient>
        <clipPath id="ovenMouthClip">
          <path d={OVEN_MOUTH_PATH} />
        </clipPath>
      </defs>
      <path d="M1160 700V540A140 140 0 0 1 1440 540V700Z" fill="url(#processBricks)" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="3" />
      <path d={OVEN_MOUTH_PATH} fill="var(--color-ink)" />
      <path data-el="glow" d={OVEN_MOUTH_PATH} fill="url(#processFire)" />
      <g clipPath="url(#ovenMouthClip)">
        <g data-el="door">
          <path d={OVEN_MOUTH_PATH} fill="var(--color-chocolate)" stroke="var(--color-ink)" strokeWidth="5" />
          <circle cx="1300" cy="640" r="30" fill="none" stroke="var(--color-caramel)" strokeWidth="5" />
          <rect x="1334" y="640" width="22" height="8" rx="4" fill="var(--color-gold)" />
        </g>
      </g>
    </g>
  );
}

export function Bread() {
  return (
    <g data-el="bread" style={{ opacity: 0 }}>
      <ellipse cx="0" cy="8" rx="120" ry="16" fill="var(--color-ink)" opacity="0.25" />
      <defs>
        <radialGradient id="processBoule" cx="42%" cy="30%" r="80%">
          <stop offset="0" stopColor="var(--color-gold)" />
          <stop offset="0.6" stopColor="var(--color-caramel)" />
          <stop offset="1" stopColor="var(--color-crust)" />
        </radialGradient>
      </defs>
      <path d="M-110 0Q-120 -100 0 -112Q120 -100 110 0Q60 14 0 14Q-60 14 -110 0Z" fill="url(#processBoule)" stroke="var(--color-crust)" strokeWidth="3" />
      {[-48, -8, 32].map((x) => (
        <path key={x} d={`M${x} -88Q${x + 14} -60 ${x + 4} -30`} stroke="var(--color-cream)" strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.85" />
      ))}
      {[0, 1, 2].map((i) => (
        <path key={i} className="amb-wisp" d={`M${-40 + i * 40} -122Q${-52 + i * 40} -146 ${-40 + i * 40} -168`} stroke="var(--color-cream)" strokeWidth="9" fill="none" strokeLinecap="round" strokeOpacity="0.6" style={{ ["--delay" as string]: `${i * 1.1}s` }} />
      ))}
    </g>
  );
}
