export function Street() {
  return (
    <g>
      <defs>
        <pattern id="cobbles" width="56" height="28" patternUnits="userSpaceOnUse">
          <rect width="56" height="28" fill="var(--color-blush)" />
          <g fill="var(--color-butter)" stroke="var(--color-chocolate)" strokeOpacity="0.28" strokeWidth="1.4">
            <rect x="2" y="2" width="24" height="11" rx="5" />
            <rect x="30" y="2" width="24" height="11" rx="5" />
            <rect x="-12" y="16" width="24" height="11" rx="5" />
            <rect x="16" y="16" width="24" height="11" rx="5" />
            <rect x="44" y="16" width="24" height="11" rx="5" />
          </g>
        </pattern>
        <linearGradient id="streetShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-chocolate)" stopOpacity="0.28" />
          <stop offset="0.25" stopColor="var(--color-chocolate)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="spill">
          <stop offset="0" stopColor="var(--color-gold)" stopOpacity="0.95" />
          <stop offset="1" stopColor="var(--color-gold)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="-400" y="736" width="2400" height="1200" fill="url(#cobbles)" />
      <rect x="-400" y="736" width="2400" height="1200" fill="url(#streetShade)" />
      <rect x="-400" y="716" width="2400" height="22" fill="var(--color-cream)" />
      <rect x="-400" y="736" width="2400" height="4" fill="var(--color-chocolate)" opacity="0.2" />
      {/* Luz que escapa da janela e se espalha pelo calçamento. */}
      <ellipse data-fx="windowGlow" cx="800" cy="790" rx="420" ry="90" fill="url(#spill)" style={{ opacity: 0 }} />
    </g>
  );
}

function Chair({ x, flip }: { x: number; flip: number }) {
  return (
    <g transform={`translate(${x} 0) scale(${flip} 1)`} stroke="var(--color-chocolate)" strokeWidth="4" strokeLinecap="round" fill="none">
      <path d="M0 -42V-12M0 -12H26M26 -12V16M0 -12V16" />
      <path d="M-4 -42H4" strokeWidth="6" />
    </g>
  );
}

function CafeTable({ x, y, mirrored = false }: { x: number; y: number; mirrored?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="18" rx="62" ry="8" fill="var(--color-chocolate)" opacity="0.18" />
      <Chair x={-46} flip={1} />
      <Chair x={46} flip={-1} />
      <path d="M0 -4V16M-14 16H14" stroke="var(--color-chocolate)" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="0" cy="-8" rx="38" ry="8" fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeWidth="3" />
      <g transform={`translate(${mirrored ? -10 : 10} -14)`}>
        <path d="M-7 0H7L5 10H-5Z" fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeWidth="2" />
        <path className="amb-smoke" d="M0 -4q-4 -8 0 -14" stroke="var(--color-chocolate)" strokeOpacity="0.4" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

function Chalkboard() {
  return (
    <g transform="translate(1004 748)">
      <path d="M-22 0L-14 -78M22 0L14 -78" stroke="var(--color-chocolate)" strokeWidth="5" strokeLinecap="round" />
      <path d="M-18 -66H18L22 -14H-22Z" fill="var(--color-ink)" stroke="var(--color-caramel)" strokeWidth="4" strokeLinejoin="round" />
      <text x="0" y="-48" textAnchor="middle" fontSize="11" fill="var(--color-cream)" style={{ fontFamily: "var(--font-hand)" }}>
        croissants
      </text>
      <text x="0" y="-33" textAnchor="middle" fontSize="11" fill="var(--color-gold)" style={{ fontFamily: "var(--font-hand)" }}>
        du jour
      </text>
    </g>
  );
}

/** Mobiliário da calçada, mais próximo da câmera que a fachada. */
export function Props() {
  return (
    <g>
      <CafeTable x={470} y={772} />
      <CafeTable x={1170} y={780} mirrored />
      <Chalkboard />
    </g>
  );
}