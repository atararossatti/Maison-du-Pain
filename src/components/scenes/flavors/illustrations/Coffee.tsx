const WISPS = [
  { x: 168, delay: 0, sway: 1 },
  { x: 208, delay: 1.2, sway: 1.5 },
  { x: 248, delay: 2.4, sway: 0.8 },
] as const;

export function CoffeeArt() {
  return (
    <svg viewBox="0 0 420 300" className="h-full w-full overflow-visible" aria-hidden focusable="false">
      <ellipse cx="210" cy="262" rx="150" ry="14" fill="var(--color-chocolate)" opacity="0.18" />
      {WISPS.map((wisp) => (
        <g
          key={wisp.x}
          className="fb"
          style={{
            transformOrigin: "50% 100%",
            transform: `translateX(calc(var(--px) * ${28 * wisp.sway}px)) skewX(calc(var(--px) * ${-14 * wisp.sway}deg))`,
          }}
        >
          <path
            className="amb-wisp"
            d={`M${wisp.x} 130Q${wisp.x - 18} 104 ${wisp.x} 80Q${wisp.x + 18} 56 ${wisp.x} 30`}
            stroke="var(--color-chocolate)"
            strokeOpacity="0.4"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            style={{ ["--delay" as string]: `${wisp.delay}s` }}
          />
        </g>
      ))}
      <ellipse cx="210" cy="226" rx="148" ry="26" fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeOpacity="0.4" strokeWidth="3" />
      <ellipse cx="210" cy="222" rx="104" ry="16" fill="var(--color-butter)" />
      <path d="M118 150H302Q302 224 210 232Q118 224 118 150Z" fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeOpacity="0.5" strokeWidth="3.5" />
      <path d="M302 164Q348 160 340 196Q332 224 296 214" stroke="var(--color-chocolate)" strokeOpacity="0.5" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M302 164Q348 160 340 196Q332 224 296 214" stroke="var(--color-cream)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="210" cy="150" rx="92" ry="14" fill="var(--color-chocolate)" />
      <ellipse cx="210" cy="150" rx="70" ry="9" fill="var(--color-brick)" opacity="0.8" />
      <path d="M150 190Q210 206 270 190" stroke="var(--color-gold)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}