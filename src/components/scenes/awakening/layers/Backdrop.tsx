const BIRDS = [
  { y: 190, dur: 46, delay: -8, size: 1 },
  { y: 150, dur: 52, delay: -30, size: 0.8 },
  { y: 235, dur: 60, delay: -19, size: 0.65 },
];

const CLOUDS = [
  { x: 260, y: 130, scale: 1.2, dur: 55 },
  { x: 900, y: 90, scale: 0.9, dur: 70 },
  { x: 1320, y: 200, scale: 1.4, dur: 62 },
  { x: 620, y: 250, scale: 0.7, dur: 48 },
];

export function Sky({ dusk = false }: { dusk?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id="duskSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-dusk)" />
          <stop offset="0.45" stopColor="var(--color-brick)" />
          <stop offset="0.8" stopColor="var(--color-caramel)" />
          <stop offset="1" stopColor="var(--color-gold)" />
        </linearGradient>
        <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-rose)" />
          <stop offset="0.55" stopColor="var(--color-blush)" />
          <stop offset="1" stopColor="var(--color-gold)" />
        </linearGradient>
        <radialGradient id="sunHalo">
          <stop offset="0" stopColor="var(--color-cream)" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="var(--color-gold)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--color-gold)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-600" y="-1000" width="2800" height="3000" fill={dusk ? "url(#duskSky)" : "url(#dawnSky)"} />
      <circle cx="1190" cy={dusk ? 600 : 470} r="420" fill="url(#sunHalo)" />
      <circle cx="1190" cy={dusk ? 600 : 470} r="54" fill="var(--color-cream)" opacity="0.9" />
    </g>
  );
}

function Cloud({ scale }: { scale: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <ellipse cx="0" cy="14" rx="120" ry="26" fill="var(--color-rose)" opacity="0.5" />
      <g fill="var(--color-cream)" opacity="0.92">
        <ellipse cx="-50" cy="0" rx="58" ry="26" />
        <ellipse cx="10" cy="-14" rx="62" ry="34" />
        <ellipse cx="70" cy="2" rx="52" ry="24" />
      </g>
    </g>
  );
}

export function Clouds() {
  return (
    <g>
      {CLOUDS.map((cloud) => (
        <g key={cloud.x} transform={`translate(${cloud.x} ${cloud.y})`}>
          <g className="amb-drift" style={{ ["--dur" as string]: `${cloud.dur}s` }}>
            <Cloud scale={cloud.scale} />
          </g>
        </g>
      ))}
      {BIRDS.map((bird) => (
        <g key={bird.y} transform={`translate(0 ${bird.y}) scale(${bird.size})`}>
          <g className="amb-fly" style={{ ["--dur" as string]: `${bird.dur}s`, ["--delay" as string]: `${bird.delay}s` }}>
            <path className="amb-flap" d="M-14 0Q-7 -9 0 0Q7 -9 14 0" fill="none" stroke="var(--color-chocolate)" strokeWidth="2.6" strokeLinecap="round" />
          </g>
        </g>
      ))}
    </g>
  );
}

/** Silhuetas distantes: colinas, telhados e uma torre de igreja. */
export function Town() {
  return (
    <g>
      <path d="M-200 600Q200 470 560 560T1200 540T1800 590V760H-200Z" fill="var(--color-olive)" opacity="0.4" />
      <g fill="var(--color-brick)" opacity="0.42">
        <path d="M120 600V340L180 250L240 340V600Z" />
        <rect x="-60" y="400" width="180" height="200" />
        <path d="M-60 400L40 350L140 400Z" />
        <rect x="1280" y="380" width="200" height="220" />
        <path d="M1260 380L1380 320L1500 380Z" />
        <rect x="1470" y="430" width="220" height="170" />
      </g>
      <g fill="var(--color-gold)" opacity="0.7">
        <rect x="170" y="400" width="14" height="22" rx="7" />
        <rect x="1330" y="430" width="14" height="22" rx="2" />
        <rect x="1400" y="430" width="14" height="22" rx="2" />
      </g>
    </g>
  );
}