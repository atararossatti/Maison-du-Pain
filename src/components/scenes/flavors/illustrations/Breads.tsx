const LOAF = "M20 128Q34 96 90 86L482 52Q548 48 548 88Q548 126 482 136L90 160Q34 158 20 128Z";
const SCORES = [96, 186, 276, 366, 446];
const CRUMB_HOLES = [
  [90, 112, 9], [150, 100, 6], [210, 118, 11], [262, 96, 7], [320, 110, 10], [376, 92, 6], [430, 104, 9], [490, 90, 7],
  [124, 132, 6], [236, 134, 8], [348, 126, 6], [410, 120, 8],
] as const;

export function BaguetteArt() {
  return (
    <svg viewBox="0 0 570 220" className="h-full w-full overflow-visible" aria-hidden focusable="false">
      <defs>
        <linearGradient id="crustTone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-gold)" />
          <stop offset="1" stopColor="var(--color-crust)" />
        </linearGradient>
        <linearGradient id="crumbTone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-cream)" />
          <stop offset="1" stopColor="var(--color-butter)" />
        </linearGradient>
        <clipPath id="loafClip">
          <path d={LOAF} />
        </clipPath>
      </defs>
      <g className="fb" style={{ transform: "rotate(-7deg)" }}>
        <ellipse cx="285" cy="176" rx="250" ry="12" fill="var(--color-chocolate)" opacity="0.18" />
        <path d={LOAF} fill="url(#crustTone)" stroke="var(--color-crust)" strokeWidth="4" />
        {SCORES.map((x) => (
          <path key={x} d={`M${x} 126Q${x + 30} 86 ${x + 62} 80`} stroke="var(--color-cream)" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8" />
        ))}
        {/* Miolo: o clip-path revela a textura interna conforme o ponteiro avança pela baguete. */}
        <g className="fb" style={{ clipPath: "inset(0 calc((1 - var(--v)) * 100%) 0 0)" }}>
          <g clipPath="url(#loafClip)">
            <rect x="0" y="40" width="570" height="130" fill="url(#crumbTone)" />
            {CRUMB_HOLES.map(([x, y, r]) => (
              <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={r * 1.3} ry={r} fill="var(--color-butter)" stroke="var(--color-gold)" strokeOpacity="0.55" strokeWidth="1.5" />
            ))}
            {/* A casca aparece como aro dourado no corte; o clip mantém só a metade interna do traço. */}
            <path d={LOAF} fill="none" stroke="url(#crustTone)" strokeWidth="18" />
          </g>
        </g>
        <rect x="26" y="40" width="4" height="132" rx="2" fill="var(--color-cream)" style={{ transform: "translateX(calc(var(--v) * 510px))" }} opacity="0.9" />
      </g>
    </svg>
  );
}

const EARS = Array.from({ length: 5 }, (_, i) => ({ angle: i * 72, key: i }));
const FLOUR = [
  [150, 120, 4], [230, 110, 5], [270, 170, 4], [180, 200, 5], [215, 150, 3], [130, 170, 3], [250, 130, 3],
] as const;

export function SourdoughArt() {
  return (
    <svg viewBox="0 0 420 300" className="h-full w-full overflow-visible" aria-hidden focusable="false">
      <defs>
        <radialGradient id="boule" cx="42%" cy="36%" r="75%">
          <stop offset="0" stopColor="var(--color-gold)" />
          <stop offset="0.6" stopColor="var(--color-caramel)" />
          <stop offset="1" stopColor="var(--color-crust)" />
        </radialGradient>
      </defs>
      <ellipse cx="210" cy="262" rx="140" ry="12" fill="var(--color-chocolate)" opacity="0.18" />
      <g className="fb" style={{ transform: "rotate(calc(var(--v) * 320deg))" }}>
        <ellipse cx="210" cy="150" rx="128" ry="108" fill="url(#boule)" stroke="var(--color-crust)" strokeWidth="4" />
        {EARS.map((ear) => (
          <g key={ear.key} transform={`rotate(${ear.angle} 210 150)`}>
            <path d="M210 150Q226 100 210 52" stroke="var(--color-cream)" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.85" />
            <path d="M210 150Q226 100 210 52" stroke="var(--color-brick)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" transform="translate(8 0)" />
          </g>
        ))}
        {FLOUR.map(([x, y, r]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="var(--color-cream)" opacity="0.75" />
        ))}
      </g>
      <ellipse cx="170" cy="100" rx="52" ry="22" fill="var(--color-cream)" opacity="0.25" transform="rotate(-24 170 100)" />
    </svg>
  );
}