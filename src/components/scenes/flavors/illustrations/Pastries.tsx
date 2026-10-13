/** Cada ilustração lê `--v`, `--px` e `--py` do `ProductStage` que a envolve. */

/**
 * Cristas ao longo de um arco em "∩" cujas pontas se enrolam para baixo, como as pontas do croissant.
 * Cada crista é alongada na direção radial (perpendicular ao arco) e as vizinhas se sobrepõem.
 */
const ARC_RADIUS = 128;
const ARC_CENTER = { x: 210, y: 196 };
const SEGMENTS = Array.from({ length: 9 }, (_, index) => {
  const t = (index - 4) / 4;
  const phi = t * (84 * Math.PI) / 180;
  const size = 0.3 + 0.7 * Math.pow(Math.cos((t * Math.PI) / 2), 0.9);
  return {
    key: index,
    x: ARC_CENTER.x + ARC_RADIUS * Math.sin(phi),
    y: ARC_CENTER.y - ARC_RADIUS * Math.cos(phi),
    angle: (phi * 180) / Math.PI,
    rx: 26 * size + 12,
    ry: 38 * size + 14,
  };
});

const CROISSANT_LAYERS = [
  { fill: "var(--color-gold)", offset: 30, grow: 1.1 },
  { fill: "var(--color-caramel)", offset: 0, grow: 1.05 },
  { fill: "var(--color-crust)", offset: -30, grow: 1 },
] as const;

export function CroissantArt() {
  return (
    <svg viewBox="0 0 420 300" className="h-full w-full overflow-visible" aria-hidden focusable="false">
      <ellipse cx="210" cy="262" rx="150" ry="14" fill="var(--color-chocolate)" opacity="0.18" />
      <g className="fb" style={{ transform: "translate(calc(var(--px) * 14px), calc(var(--py) * 8px)) rotate(calc(var(--px) * 3deg))" }}>
        {CROISSANT_LAYERS.map((layer) => (
          <g key={layer.fill} style={{ transform: `translateY(calc(var(--v) * ${layer.offset}px))` }}>
            {SEGMENTS.map((segment) => (
              <g key={segment.key} transform={`rotate(${segment.angle.toFixed(1)} ${segment.x.toFixed(1)} ${segment.y.toFixed(1)})`}>
                <ellipse
                  cx={segment.x}
                  cy={segment.y}
                  rx={segment.rx * layer.grow}
                  ry={segment.ry * layer.grow}
                  fill={layer.fill}
                  stroke="var(--color-chocolate)"
                  strokeOpacity="0.35"
                  strokeWidth="2"
                />
                {layer.offset < 0 && (
                  <>
                    {/* Camada de cima: sombra na borda de baixo, dobras da massa e brilho de manteiga. */}
                    <path
                      d={`M${segment.x - segment.rx * 0.8} ${segment.y + segment.ry * 0.35}Q${segment.x} ${segment.y + segment.ry * 0.7} ${segment.x + segment.rx * 0.8} ${segment.y + segment.ry * 0.35}`}
                      stroke="var(--color-ink)"
                      strokeOpacity="0.22"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M${segment.x - segment.rx * 0.55} ${segment.y - segment.ry * 0.05}Q${segment.x} ${segment.y - segment.ry * 0.3} ${segment.x + segment.rx * 0.55} ${segment.y - segment.ry * 0.05}`}
                      stroke="var(--color-crust)"
                      strokeOpacity="0.55"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <ellipse
                      cx={segment.x - segment.rx * 0.25}
                      cy={segment.y - segment.ry * 0.5}
                      rx={segment.rx * 0.45}
                      ry={segment.ry * 0.14}
                      fill="var(--color-cream)"
                      opacity="0.4"
                    />
                  </>
                )}
              </g>
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}

export function PainAuChocolatArt() {
  return (
    <svg viewBox="0 0 420 300" className="h-full w-full overflow-visible" aria-hidden focusable="false">
      <ellipse cx="210" cy="246" rx="160" ry="14" fill="var(--color-chocolate)" opacity="0.18" />
      <g className="fb" style={{ transform: "rotate(-5deg)" }}>
        {[-1, 1].map((side) => (
          <g key={side} style={{ transform: `translateX(calc(var(--v) * ${side * 58}px))` }}>
            <rect x={side < 0 ? 50 : 270} y="142" width="100" height="30" rx="8" fill="var(--color-ink)" />
            <rect x={side < 0 ? 58 : 278} y="148" width="84" height="6" rx="3" fill="var(--color-brick)" opacity="0.7" />
          </g>
        ))}
        <rect x="76" y="96" width="268" height="116" rx="52" fill="var(--color-caramel)" stroke="var(--color-crust)" strokeWidth="4" />
        {[0, 1, 2, 3, 4].map((stripe) => (
          <path
            key={stripe}
            d={`M${112 + stripe * 48} 104Q${126 + stripe * 48} 154 ${112 + stripe * 48} 204`}
            stroke="var(--color-crust)"
            strokeOpacity="0.55"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        <ellipse cx="170" cy="118" rx="62" ry="9" fill="var(--color-cream)" opacity="0.35" />
      </g>
    </svg>
  );
}

const SPIRAL_POINTS = Array.from({ length: 160 }, (_, i) => {
  const angle = (i / 159) * Math.PI * 7;
  const radius = 6 + (i / 159) * 86;
  return `${(200 + Math.cos(angle) * radius).toFixed(1)} ${(150 + Math.sin(angle) * radius).toFixed(1)}`;
});
const SPIRAL = `M${SPIRAL_POINTS.join("L")}`;

export function CinnamonRollArt() {
  return (
    <svg viewBox="0 0 420 300" className="h-full w-full overflow-visible" aria-hidden focusable="false">
      <ellipse cx="200" cy="262" rx="130" ry="12" fill="var(--color-chocolate)" opacity="0.18" />
      <g className="fb" style={{ transform: "rotate(calc(var(--v) * 150deg))" }}>
        <circle cx="200" cy="150" r="104" fill="var(--color-gold)" stroke="var(--color-crust)" strokeWidth="4" />
        <path d={SPIRAL} stroke="var(--color-brick)" strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d={SPIRAL} stroke="var(--color-caramel)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
        <path
          d={SPIRAL}
          pathLength="100"
          stroke="var(--color-cream)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          style={{ strokeDasharray: 100, strokeDashoffset: "calc((1 - var(--v)) * 100)" }}
        />
      </g>
    </svg>
  );
}