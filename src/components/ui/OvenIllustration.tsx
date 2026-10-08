export const SPARK_COUNT = 10;

const SPARKS = Array.from({ length: SPARK_COUNT }, (_, index) => ({
  x: 150 + ((index * 37) % 100),
  y: 290 - ((index * 23) % 90),
  r: 1.6 + (index % 3) * 0.7,
  delay: (index * 0.37) % 2.4,
}));

const MOUTH = "M122 346 V236 A78 78 0 0 1 278 236 V346 Z";

/** Segmentos do croissant, do centro às pontas. */
const SEGMENTS = [
  { cx: 0, cy: 0, rx: 30, ry: 22, rotate: 0 },
  { cx: -34, cy: 8, rx: 24, ry: 17, rotate: -28 },
  { cx: 34, cy: 8, rx: 24, ry: 17, rotate: 28 },
  { cx: -62, cy: 26, rx: 16, ry: 10, rotate: -52 },
  { cx: 62, cy: 26, rx: 16, ry: 10, rotate: 52 },
];

function Croissant({ golden }: { golden: boolean }) {
  return (
    <g>
      {SEGMENTS.map((s) => (
        <ellipse
          key={s.cx}
          cx={s.cx}
          cy={s.cy}
          rx={s.rx}
          ry={s.ry}
          transform={`rotate(${s.rotate} ${s.cx} ${s.cy})`}
          fill={golden ? "url(#bakedDough)" : "#ead3a6"}
          stroke={golden ? "var(--color-crust)" : "#c9ae80"}
          strokeWidth="1.6"
        />
      ))}
      {golden &&
        SEGMENTS.slice(0, 3).map((s) => (
          <ellipse
            key={`shine-${s.cx}`}
            cx={s.cx - 4}
            cy={s.cy - 7}
            rx={s.rx * 0.5}
            ry={s.ry * 0.22}
            transform={`rotate(${s.rotate} ${s.cx} ${s.cy})`}
            fill="var(--color-cream)"
            opacity="0.45"
          />
        ))}
    </g>
  );
}

export function OvenIllustration() {
  return (
    <svg viewBox="0 0 400 420" className="block h-auto w-full overflow-visible" aria-hidden focusable="false">
      <defs>
        <radialGradient id="ovenGlow" cx="50%" cy="68%" r="65%">
          <stop offset="0" stopColor="var(--color-gold)" />
          <stop offset="0.5" stopColor="var(--color-caramel)" />
          <stop offset="1" stopColor="var(--color-brick)" />
        </radialGradient>
        <linearGradient id="bakedDough" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-gold)" />
          <stop offset="1" stopColor="var(--color-caramel)" />
        </linearGradient>
        <pattern id="bricks" width="44" height="22" patternUnits="userSpaceOnUse">
          <rect width="44" height="22" fill="var(--color-brick)" />
          <path d="M0 .5H44M0 11.5H44M0 .5V11.5M22 11.5V22" stroke="var(--color-ink)" strokeOpacity="0.28" strokeWidth="1.6" fill="none" />
        </pattern>
        <clipPath id="mouthClip">
          <path d={MOUTH} />
        </clipPath>
      </defs>

      <ellipse cx="200" cy="392" rx="160" ry="12" fill="var(--color-chocolate)" opacity="0.18" />
      <rect x="50" y="356" width="300" height="32" rx="6" fill="var(--color-chocolate)" />
      <rect x="178" y="48" width="44" height="60" rx="4" fill="url(#bricks)" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="2" />
      <rect x="170" y="42" width="60" height="12" rx="3" fill="var(--color-chocolate)" />
      <path d="M70 360V200A130 130 0 0 1 330 200V360Z" fill="url(#bricks)" stroke="var(--color-ink)" strokeOpacity="0.45" strokeWidth="3" />

      <path d={MOUTH} fill="var(--color-ink)" />
      <g clipPath="url(#mouthClip)">
        <rect data-el="glow" x="110" y="150" width="180" height="200" fill="url(#ovenGlow)" opacity="0" />
        <rect x="110" y="320" width="180" height="30" fill="var(--color-chocolate)" opacity="0.55" />
        <g transform="translate(200 304) scale(1.05)">
          <Croissant golden={false} />
          <g data-el="golden" opacity="0">
            <Croissant golden />
          </g>
        </g>
        {SPARKS.map((spark) => (
          <circle
            key={spark.delay}
            data-el="spark"
            className="amb-spark"
            cx={spark.x}
            cy={spark.y}
            r={spark.r}
            fill="var(--color-gold)"
            style={{ ["--delay" as string]: `${spark.delay}s`, opacity: 0, transition: "opacity .6s" }}
          />
        ))}
      </g>

      <g data-el="door">
        <path d={MOUTH} fill="var(--color-cream)" fillOpacity="0.14" />
        <path d="M150 236 Q160 200 190 190" stroke="var(--color-cream)" strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d={MOUTH} fill="none" stroke="var(--color-chocolate)" strokeWidth="9" strokeLinejoin="round" />
        <circle cx="264" cy="292" r="6" fill="var(--color-gold)" stroke="var(--color-crust)" strokeWidth="1.5" />
      </g>

      <g aria-hidden>
        {[
          [150, 250, 62],
          [250, 245, 70],
          [200, 210, 80],
          [190, 280, 66],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} data-el="steam-puff" cx={cx} cy={cy} r={r} fill="var(--color-cream)" opacity="0" />
        ))}
      </g>
    </svg>
  );
}
