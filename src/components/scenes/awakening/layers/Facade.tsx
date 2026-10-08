import { Flowers } from "./Flora";

const ARCH = "M700 600V460A100 100 0 0 1 900 460V600Z";
const SHOP_WINDOW_ID = "shopWindowClip";

const LOAVES = [
  { x: 730, y: 424, rx: 18, ry: 9 },
  { x: 768, y: 426, rx: 14, ry: 8 },
  { x: 842, y: 423, rx: 20, ry: 10 },
];

function Dormer({ x }: { x: number }) {
  return (
    <g>
      <polygon points={`${x - 40},228 ${x},194 ${x + 40},228`} fill="var(--color-chocolate)" />
      <rect x={x - 28} y="226" width="56" height="58" fill="var(--color-butter)" stroke="var(--color-chocolate)" strokeWidth="3" />
      <rect className="amb-flicker" x={x - 20} y="234" width="40" height="42" fill="var(--color-gold)" opacity="0.85" style={{ ["--delay" as string]: `${x % 5}s` }} />
      <path d={`M${x} 234V276M${x - 20} 255H${x + 20}`} stroke="var(--color-chocolate)" strokeWidth="2.5" />
    </g>
  );
}

function Neighbor({ x, tone }: { x: number; tone: string }) {
  return (
    <g>
      <rect x={x} y="320" width="350" height="400" fill={tone} />
      <rect x={x} y="296" width="350" height="30" fill="var(--color-brick)" opacity="0.85" />
      {[40, 190].map((offset) => (
        <g key={offset}>
          <rect x={x + offset} y="420" width="70" height="110" fill="var(--color-gold)" opacity="0.75" stroke="var(--color-chocolate)" strokeWidth="4" />
          <path d={`M${x + offset + 35} 420V530M${x + offset} 475H${x + offset + 70}`} stroke="var(--color-chocolate)" strokeWidth="3" />
        </g>
      ))}
    </g>
  );
}

function Lantern({ x }: { x: number }) {
  return (
    <g>
      <circle className="amb-flicker" cx={x} cy="466" r="46" fill="url(#lampGlow)" opacity="0.8" />
      <path d={`M${x} 440V452`} stroke="var(--color-chocolate)" strokeWidth="3" />
      <rect x={x - 8} y="452" width="16" height="28" rx="3" fill="var(--color-gold)" stroke="var(--color-chocolate)" strokeWidth="3" />
    </g>
  );
}

function SideWindow({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 20} y="430" width="22" height="140" fill="var(--color-olive)" />
      <rect x={x + 90} y="430" width="22" height="140" fill="var(--color-olive)" />
      <rect x={x} y="430" width="90" height="140" fill="var(--color-gold)" opacity="0.8" stroke="var(--color-chocolate)" strokeWidth="5" />
      <path d={`M${x + 45} 430V570M${x} 500H${x + 90}`} stroke="var(--color-chocolate)" strokeWidth="3.5" />
      <rect x={x - 6} y="570" width="102" height="16" rx="3" fill="var(--color-crust)" />
      <Flowers x={x - 4} y={572} width={98} seed={x} />
    </g>
  );
}

function ShopInterior() {
  return (
    <g clipPath={`url(#${SHOP_WINDOW_ID})`}>
      <defs>
        <linearGradient id="interiorWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-caramel)" />
          <stop offset="1" stopColor="var(--color-gold)" />
        </linearGradient>
        <radialGradient id="lampGlow">
          <stop offset="0" stopColor="var(--color-cream)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--color-gold)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="690" y="350" width="220" height="260" fill="url(#interiorWall)" />
      <circle className="amb-flicker" cx="800" cy="410" r="95" fill="url(#lampGlow)" />
      <path d="M800 350V398" stroke="var(--color-chocolate)" strokeWidth="2.5" />
      <path d="M786 410L792 398H808L814 410Z" fill="var(--color-chocolate)" />
      {[432, 492].map((y) => (
        <rect key={y} x="700" y={y} width="200" height="7" fill="var(--color-chocolate)" />
      ))}
      {LOAVES.map((loaf) => (
        <ellipse key={loaf.x} cx={loaf.x} cy={loaf.y} rx={loaf.rx} ry={loaf.ry} fill="var(--color-crust)" stroke="var(--color-chocolate)" strokeWidth="1.5" />
      ))}
      {[722, 760, 790, 850].map((x) => (
        <ellipse key={x} cx={x} cy="484" rx="14" ry="8" fill="var(--color-caramel)" stroke="var(--color-chocolate)" strokeWidth="1.5" />
      ))}
      <path d="M840 600V540A32 32 0 0 1 904 540V600Z" fill="var(--color-brick)" />
      <path className="amb-flicker" d="M852 600V546A20 20 0 0 1 892 546V600Z" fill="var(--color-gold)" />
      <rect x="690" y="562" width="220" height="48" fill="var(--color-chocolate)" />
      <rect x="690" y="558" width="220" height="7" fill="var(--color-crust)" />
      <ellipse cx="750" cy="553" rx="26" ry="8" fill="var(--color-cream)" />
      <ellipse cx="750" cy="549" rx="19" ry="7" fill="var(--color-butter)" />
    </g>
  );
}

const LIGHTS = [
  { x: 800, y: 480, r: 200 },
  { x: 515, y: 500, r: 100 },
  { x: 1175, y: 500, r: 100 },
  { x: 1040, y: 490, r: 90 },
  { x: 500, y: 255, r: 70 },
  { x: 800, y: 255, r: 70 },
  { x: 1100, y: 255, r: 70 },
] as const;

/** Halos das janelas acesas ao entardecer; ligados pelo `data-fx="lights"`. */
function Lights() {
  return (
    <g data-fx="lights" style={{ opacity: 0 }}>
      {LIGHTS.map((light) => (
        <circle key={`${light.x}-${light.y}`} className="amb-flicker" cx={light.x} cy={light.y} r={light.r} fill="url(#lampGlow)" />
      ))}
    </g>
  );
}

/** O que se vê pela porta aberta: parede quente, lâmpada, balcão e pães. A câmera termina aqui. */
function DoorInterior() {
  return (
    <g>
      <defs>
        <linearGradient id="doorWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-caramel)" />
          <stop offset="1" stopColor="var(--color-gold)" />
        </linearGradient>
      </defs>
      <rect x="995" y="440" width="90" height="280" fill="url(#doorWall)" />
      <circle className="amb-flicker" cx="1040" cy="520" r="70" fill="url(#lampGlow)" />
      <path d="M1040 440V500" stroke="var(--color-chocolate)" strokeWidth="1.5" />
      <path d="M1032 508L1036 500H1044L1048 508Z" fill="var(--color-chocolate)" />
      <rect x="995" y="602" width="90" height="118" fill="var(--color-chocolate)" />
      <rect x="995" y="598" width="90" height="6" fill="var(--color-crust)" />
      {[1012, 1040, 1068].map((x, i) => (
        <ellipse key={x} cx={x} cy={590 - (i % 2) * 2} rx="13" ry="7" fill="var(--color-crust)" stroke="var(--color-chocolate)" strokeWidth="1.2" />
      ))}
      <rect x="995" y="560" width="90" height="4" fill="var(--color-chocolate)" opacity="0.7" />
      {[1006, 1030, 1054, 1076].map((x) => (
        <ellipse key={x} cx={x} cy="555" rx="8" ry="5" fill="var(--color-caramel)" stroke="var(--color-chocolate)" strokeWidth="1" />
      ))}
    </g>
  );
}

export function Facade({ dusk = false }: { dusk?: boolean }) {
  return (
    <g>
      <defs>
        <clipPath id={SHOP_WINDOW_ID}>
          <path d={ARCH} />
        </clipPath>
        <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-cream)" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="var(--color-rose)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--color-cream)" stopOpacity="0.38" />
        </linearGradient>
      </defs>

      <Neighbor x={0} tone="var(--color-blush)" />
      <Neighbor x={1250} tone="var(--color-butter)" />

      <rect x="350" y="300" width="900" height="420" fill="var(--color-cream)" />
      <rect x="350" y="300" width="36" height="420" fill="var(--color-chocolate)" opacity="0.07" />
      <rect x="1214" y="300" width="36" height="420" fill="var(--color-chocolate)" opacity="0.07" />
      <rect x="350" y="684" width="900" height="36" fill="var(--color-crust)" opacity="0.55" />
      <polygon points="330,300 400,200 1200,200 1270,300" fill="var(--color-brick)" />
      <path d="M345 230H1255M338 260H1262M334 288H1266" stroke="var(--color-ink)" strokeOpacity="0.22" strokeWidth="2" transform="translate(0 0)" />
      <rect x="340" y="292" width="920" height="14" rx="3" fill="var(--color-butter)" stroke="var(--color-chocolate)" strokeOpacity="0.4" strokeWidth="2" />
      {[500, 800, 1100].map((x) => (
        <Dormer key={x} x={x} />
      ))}

      <rect x="930" y="110" width="54" height="100" fill="var(--color-brick)" />
      <rect x="922" y="102" width="70" height="12" rx="2" fill="var(--color-chocolate)" />
      {[0, 1.8, 3.6].map((delay) => (
        <circle key={delay} className="amb-smoke" cx="957" cy="98" r="16" fill="var(--color-cream)" style={{ ["--delay" as string]: `${delay}s` }} />
      ))}

      <rect x="640" y="312" width="320" height="40" rx="6" fill="var(--color-chocolate)" stroke="var(--color-gold)" strokeWidth="2.5" />
      <text x="800" y="340" textAnchor="middle" fontSize="23" letterSpacing="5" fill="var(--color-gold)" style={{ fontFamily: "var(--font-display)" }}>
        MAISON DU PAIN
      </text>

      <SideWindow x={470} />
      <SideWindow x={1130} />
      <Lantern x={630} />
      <Lantern x={970} />

      {/* Porta com toldo listrado. */}
      <DoorInterior />
      <g data-fx="doorLeaf">
        <rect x="995" y="440" width="90" height="280" fill="var(--color-olive)" stroke="var(--color-chocolate)" strokeWidth="5" />
        <rect x="1007" y="454" width="66" height="70" fill="var(--color-gold)" opacity="0.85" />
        <rect x="1007" y="540" width="66" height="150" fill="none" stroke="var(--color-moss)" strokeWidth="4" />
        <circle cx="1070" cy="610" r="5" fill="var(--color-gold)" />
      </g>
      {Array.from({ length: 6 }, (_, i) => (
        <polygon
          key={i}
          points={`${977 + i * 21.7},420 ${977 + (i + 1) * 21.7},420 ${967 + (i + 1) * 25},458 ${967 + i * 25},458`}
          fill={i % 2 ? "var(--color-cream)" : "var(--color-olive)"}
          stroke="var(--color-chocolate)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
      ))}

      {/* Janela principal: a câmera atravessa esta peça. */}
      <path d={ARCH} fill="none" stroke="var(--color-chocolate)" strokeOpacity="0.22" strokeWidth="34" />
      <path d={ARCH} fill="none" stroke="var(--color-butter)" strokeWidth="24" />
      <polygon points="788,346 812,346 806,374 794,374" fill="var(--color-butter)" stroke="var(--color-chocolate)" strokeOpacity="0.5" strokeWidth="2" />
      <ShopInterior />
      <g data-fx="glass">
        <path d={ARCH} fill="url(#glassSheen)" />
        <path d="M722 590L760 380M742 590L780 380" stroke="var(--color-cream)" strokeOpacity="0.6" strokeWidth="9" clipPath={`url(#${SHOP_WINDOW_ID})`} />
      </g>
      <g data-fx="windowFrame" fill="none" stroke="var(--color-chocolate)" strokeWidth="6" strokeLinecap="round">
        <path d={ARCH} />
        <path d="M800 360V600M700 500H900" />
      </g>
      <rect x="684" y="604" width="232" height="26" rx="4" fill="var(--color-crust)" stroke="var(--color-chocolate)" strokeWidth="3" />
      <path d="M700 604V630M740 604V630M780 604V630M820 604V630M860 604V630M900 604V630" stroke="var(--color-chocolate)" strokeOpacity="0.35" strokeWidth="2" />
      <Flowers x={688} y={606} width={224} />
      {dusk && <Lights />}
    </g>
  );
}