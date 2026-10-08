const JARS = [
  { x: 1080, fill: "var(--color-cream)" },
  { x: 1130, fill: "var(--color-caramel)" },
  { x: 1180, fill: "var(--color-olive)" },
  { x: 1230, fill: "var(--color-gold)" },
  { x: 1280, fill: "var(--color-cream)" },
];

export const MOTES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 330 + ((i * 97) % 420),
  y: 300 + ((i * 61) % 300),
  r: 1.8 + (i % 3),
  delay: (i * 0.6) % 6,
  dur: 6 + (i % 4),
}));

export function Lamp({ x, cord }: { x: number; cord: number }) {
  return (
    <g>
      <circle className="amb-flicker" cx={x} cy={cord + 40} r="190" fill="url(#lampHalo)" />
      <path d={`M${x} -20V${cord}`} stroke="var(--color-chocolate)" strokeWidth="3" />
      <path d={`M${x - 46} ${cord + 46}Q${x - 40} ${cord} ${x} ${cord - 4}Q${x + 40} ${cord} ${x + 46} ${cord + 46}Z`} fill="var(--color-chocolate)" />
      <ellipse cx={x} cy={cord + 48} rx="42" ry="9" fill="var(--color-gold)" />
    </g>
  );
}

export function Window() {
  const frame = "M150 480V300A90 90 0 0 1 330 300V480Z";
  return (
    <g>
      <defs>
        <linearGradient id="windowSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-rose)" />
          <stop offset="1" stopColor="var(--color-gold)" />
        </linearGradient>
        <clipPath id="bakeryWindowClip">
          <path d={frame} />
        </clipPath>
      </defs>
      <path d={frame} fill="url(#windowSky)" />
      <g clipPath="url(#bakeryWindowClip)" fill="var(--color-olive)" opacity="0.7">
        <circle cx="190" cy="440" r="60" />
        <circle cx="290" cy="450" r="70" />
      </g>
      <path d={frame} fill="none" stroke="var(--color-butter)" strokeWidth="22" />
      <path d={`${frame}M240 210V480M150 380H330`} fill="none" stroke="var(--color-chocolate)" strokeWidth="6" />
      <rect x="136" y="480" width="208" height="16" rx="4" fill="var(--color-crust)" />
      <polygon className="amb-flicker" points="150,300 330,300 900,650 520,650" fill="var(--color-gold)" opacity="0.17" style={{ ["--delay" as string]: "1s" }} />
      <polygon className="amb-flicker" points="200,330 280,330 700,650 560,650" fill="var(--color-cream)" opacity="0.16" />
    </g>
  );
}

function Shelves() {
  return (
    <g>
      <rect x="1040" y="262" width="480" height="12" rx="3" fill="var(--color-chocolate)" />
      <rect x="1040" y="372" width="480" height="12" rx="3" fill="var(--color-chocolate)" />
      {JARS.map((jar) => (
        <g key={jar.x}>
          <rect x={jar.x - 17} y="214" width="34" height="48" rx="6" fill={jar.fill} fillOpacity="0.85" stroke="var(--color-chocolate)" strokeWidth="2.5" />
          <rect x={jar.x - 19} y="206" width="38" height="10" rx="3" fill="var(--color-chocolate)" />
        </g>
      ))}
      {[1360, 1440].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="246" rx="34" ry="16" fill="var(--color-crust)" stroke="var(--color-chocolate)" strokeWidth="2.5" />
          <path d={`M${x - 14} 238l10 8M${x} 234l10 10M${x + 14} 238l8 8`} stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
      {[1090, 1160, 1230, 1300, 1370, 1440].map((x) => (
        <rect key={x} x={x - 22} y="348" width="44" height="24" rx="12" fill="var(--color-caramel)" stroke="var(--color-chocolate)" strokeWidth="2.5" />
      ))}
    </g>
  );
}

export function Utensils() {
  return (
    <g stroke="var(--color-chocolate)" strokeWidth="3" fill="none" strokeLinecap="round">
      <path d="M380 200H700" strokeWidth="6" />
      <g transform="translate(430 200)">
        <path d="M0 0V70" />
        <ellipse cx="0" cy="84" rx="16" ry="14" fill="var(--color-caramel)" />
      </g>
      <g transform="translate(520 200)">
        <path d="M0 0V50" />
        <path d="M0 50Q-16 64 -2 90Q0 96 2 90Q16 64 0 50ZM-9 58Q0 94 9 58" />
      </g>
      <g transform="translate(610 200)">
        <path d="M0 0V26" />
        <circle cx="0" cy="62" r="34" fill="var(--color-crust)" />
        <circle cx="0" cy="62" r="24" fill="var(--color-ink)" fillOpacity="0.5" />
      </g>
    </g>
  );
}

export function Wall() {
  return (
    <g>
      <defs>
        <linearGradient id="wallTone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-butter)" />
          <stop offset="1" stopColor="var(--color-blush)" />
        </linearGradient>
        <pattern id="stripes" width="44" height="10" patternUnits="userSpaceOnUse">
          <rect width="22" height="10" fill="var(--color-gold)" opacity="0.12" />
        </pattern>
        <radialGradient id="lampHalo">
          <stop offset="0" stopColor="var(--color-cream)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--color-gold)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-300" y="-300" width="2200" height="1500" fill="url(#wallTone)" />
      <rect x="-300" y="-300" width="2200" height="1500" fill="url(#stripes)" />
      <rect x="-300" y="500" width="2200" height="500" fill="var(--color-olive)" opacity="0.55" />
      <rect x="-300" y="494" width="2200" height="12" fill="var(--color-chocolate)" opacity="0.35" />
      <Window />
      <Shelves />
      <Utensils />
      <Lamp x={560} cord={130} />
      <Lamp x={1060} cord={110} />
      {MOTES.map((mote) => (
        <circle
          key={mote.id}
          className="amb-mote"
          cx={mote.x}
          cy={mote.y}
          r={mote.r}
          fill="var(--color-cream)"
          style={{ ["--delay" as string]: `${mote.delay}s`, ["--dur" as string]: `${mote.dur}s` }}
        />
      ))}
    </g>
  );
}

export function Oven() {
  const body = "M1190 660V520A130 130 0 0 1 1450 520V660Z";
  return (
    <g>
      <defs>
        <pattern id="ovenBricks" width="44" height="22" patternUnits="userSpaceOnUse">
          <rect width="44" height="22" fill="var(--color-brick)" />
          <path d="M0 .5H44M0 11.5H44M0 .5V11.5M22 11.5V22" stroke="var(--color-ink)" strokeOpacity="0.28" strokeWidth="1.6" fill="none" />
        </pattern>
        <radialGradient id="fire" cx="50%" cy="75%" r="70%">
          <stop offset="0" stopColor="var(--color-gold)" />
          <stop offset="0.6" stopColor="var(--color-caramel)" />
          <stop offset="1" stopColor="var(--color-brick)" />
        </radialGradient>
      </defs>
      <rect x="1296" y="392" width="48" height="140" fill="var(--color-ink)" opacity="0.75" />
      <path d={body} fill="url(#ovenBricks)" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="3" />
      <path d="M1260 660V560A60 60 0 0 1 1380 560V660Z" fill="var(--color-ink)" />
      <path className="amb-flicker" d="M1268 660V562A52 52 0 0 1 1372 562V660Z" fill="url(#fire)" />
    </g>
  );
}
