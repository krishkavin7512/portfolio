import type { Emblem as EmblemKind } from "@/data/projects";

/*
 * Small generative illustrations for the project cards. Each is a 200×200 SVG drawn in
 * cream + blue, with a quiet idle loop (CSS) that speeds up when the card is hovered.
 */

const CREAM = "#eeeae1";
const BLUE = "#7d88ff";
const BLUE_DEEP = "#3346ff";

// round so server and client render identical attribute strings
const r2 = (n: number) => Math.round(n * 100) / 100;

// MediaPipe hand topology
const HAND: [number, number][] = [
  [100, 178], [78, 165], [60, 148], [48, 130], [38, 114],
  [80, 118], [74, 90], [70, 70], [67, 52],
  [98, 114], [97, 82], [96, 60], [95, 40],
  [115, 118], [119, 88], [122, 68], [124, 50],
  [130, 126], [139, 104], [145, 88], [150, 73],
];
const BONES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20],
];

function Hand() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <defs>
        <linearGradient id="scan" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={BLUE} stopOpacity="0" />
          <stop offset="1" stopColor={BLUE} stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <rect x="28" y="26" width="140" height="164" fill="none" stroke={BLUE} strokeOpacity="0.5" strokeDasharray="3 4" />
      <rect x="28" y="12" width="94" height="14" fill={BLUE_DEEP} />
      <text x="33" y="22.5" fill="#fff" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.6">
        THANK YOU · 0.94
      </text>
      {BONES.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={HAND[a][0]} y1={HAND[a][1]} x2={HAND[b][0]} y2={HAND[b][1]} stroke={CREAM} strokeOpacity="0.55" strokeWidth="1.6" />
      ))}
      {HAND.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" fill={i % 4 === 0 ? BLUE : CREAM} className="emb-pulse" style={{ animationDelay: `${i * 0.09}s` }} />
      ))}
      <rect x="28" y="26" width="140" height="34" fill="url(#scan)" className="emb-scan" />
    </svg>
  );
}

function Gauge() {
  const ticks = Array.from({ length: 48 });
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <defs>
        <clipPath id="gauge-clip">
          <circle cx="100" cy="100" r="58" />
        </clipPath>
      </defs>
      {ticks.map((_, i) => {
        const a = (i / ticks.length) * Math.PI * 2;
        const long = i % 4 === 0;
        const r1 = long ? 72 : 75;
        return (
          <line
            key={i}
            x1={r2(100 + Math.cos(a) * r1)}
            y1={r2(100 + Math.sin(a) * r1)}
            x2={r2(100 + Math.cos(a) * 80)}
            y2={r2(100 + Math.sin(a) * 80)}
            stroke={i < 13 ? BLUE : CREAM}
            strokeOpacity={i < 13 ? 1 : 0.3}
            strokeWidth="1.4"
            transform="rotate(-90 100 100)"
          />
        );
      })}
      <circle cx="100" cy="100" r="58" fill="none" stroke={CREAM} strokeOpacity="0.25" />
      <g clipPath="url(#gauge-clip)">
        <g className="emb-wave">
          <path d="M-60 128 Q-45 120 -30 128 T0 128 T30 128 T60 128 T90 128 T120 128 T150 128 T180 128 T210 128 T240 128 T270 128 V200 H-60Z" fill={BLUE_DEEP} fillOpacity="0.85" />
          <path d="M-60 132 Q-45 126 -30 132 T0 132 T30 132 T60 132 T90 132 T120 132 T150 132 T180 132 T210 132 T240 132 T270 132 V200 H-60Z" fill={BLUE} fillOpacity="0.5" />
        </g>
      </g>
      <text x="100" y="104" textAnchor="middle" fill={CREAM} fontSize="34" fontWeight="800" fontFamily="var(--font-mona)" letterSpacing="-1">
        26%
      </text>
      <text x="100" y="120" textAnchor="middle" fill={CREAM} fillOpacity="0.55" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="1.4">
        CALIBRATED RISK
      </text>
    </svg>
  );
}

function Rain() {
  const bars = [22, 38, 30, 54, 78, 92, 64, 40, 26];
  const threshold = 60;
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <g stroke={CREAM} strokeOpacity="0.35" strokeWidth="1" className="emb-rain">
        {Array.from({ length: 26 }).map((_, i) => {
          const x = (i * 37) % 210;
          const y = (i * 53) % 120;
          return <line key={i} x1={x} y1={y - 40} x2={x - 6} y2={y - 26} />;
        })}
      </g>
      {bars.map((h, i) => {
        const x = 30 + i * 16;
        const over = h > threshold;
        return <rect key={i} x={x} y={170 - h} width="10" height={h} rx="1.5" fill={over ? BLUE : CREAM} fillOpacity={over ? 1 : 0.28} className="emb-bar" style={{ animationDelay: `${i * 0.1}s` }} />;
      })}
      <line x1="22" x2="178" y1={170 - threshold} y2={170 - threshold} stroke={BLUE} strokeDasharray="4 3" />
      <text x="22" y={170 - threshold - 6} fill={BLUE} fontSize="7" fontFamily="var(--font-mono)" letterSpacing="1">
        TRIGGER · 64 MM
      </text>
      <line x1="22" x2="178" y1="170.5" y2="170.5" stroke={CREAM} strokeOpacity="0.4" />
      <g className="emb-pop">
        <rect x="104" y="40" width="70" height="20" rx="10" fill={BLUE_DEEP} />
        <text x="139" y="53.5" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="var(--font-mono)" letterSpacing="0.8">
          ₹650 PAID
        </text>
      </g>
    </svg>
  );
}

function Cube() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <g transform="translate(100 78)" className="emb-float">
        <path d="M0 -44 L44 -22 L0 0 L-44 -22Z" fill={CREAM} fillOpacity="0.22" stroke={CREAM} strokeOpacity="0.6" />
        <path d="M-44 -22 L0 0 L0 50 L-44 28Z" fill={CREAM} fillOpacity="0.1" stroke={CREAM} strokeOpacity="0.6" />
        <path d="M44 -22 L0 0 L0 50 L44 28Z" fill={BLUE_DEEP} fillOpacity="0.55" stroke={CREAM} strokeOpacity="0.6" />
        <path d="M-30 -10 L-22 4 L-26 14 L-18 26" fill="none" stroke={CREAM} strokeOpacity="0.5" strokeWidth="0.8" />
        <text x="22" y="18" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800" fontFamily="var(--font-mona)" transform="skewY(-26)">
          M30
        </text>
      </g>
      <line x1="30" x2="176" y1="176" y2="176" stroke={CREAM} strokeOpacity="0.35" />
      <line x1="30" x2="30" y1="132" y2="176" stroke={CREAM} strokeOpacity="0.35" />
      <line x1="30" x2="176" y1="142" y2="142" stroke={BLUE} strokeDasharray="3 3" strokeOpacity="0.8" />
      <path d="M30 176 C 46 158, 62 150, 86 146 S 140 140, 176 137" fill="none" stroke={BLUE} strokeWidth="2" className="emb-draw" pathLength={1} />
      {[[42, 165], [62, 152], [96, 145], [150, 139]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.6" fill={CREAM} />
      ))}
      <text x="176" y="190" textAnchor="end" fill={CREAM} fillOpacity="0.5" fontSize="7" fontFamily="var(--font-mono)" letterSpacing="1">
        DAY 28
      </text>
    </svg>
  );
}

function WarliFigure({ angle }: { angle: number }) {
  return (
    <g transform={`rotate(${angle} 100 100) translate(100 34)`}>
      <circle cx="0" cy="-12" r="4" fill={CREAM} />
      <path d="M-6 -6 L6 -6 L0 3Z M0 3 L-6 12 L6 12Z" fill={CREAM} />
      <path d="M-6 -4 L-14 4 M6 -4 L14 4 M-4 12 L-7 22 M4 12 L7 22" stroke={CREAM} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function Warli() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <circle cx="100" cy="100" r="92" fill="#3a1d12" fillOpacity="0.35" />
      <g className="emb-spin">
        {Array.from({ length: 12 }).map((_, i) => (
          <WarliFigure key={i} angle={i * 30} />
        ))}
        <circle cx="100" cy="100" r="54" fill="none" stroke={CREAM} strokeOpacity="0.35" strokeDasharray="2 4" />
      </g>
      <g className="emb-spin-rev">
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 45} 100 100) translate(100 64) scale(0.7)`}>
            <circle cx="0" cy="-12" r="4" fill={BLUE} />
            <path d="M-6 -6 L6 -6 L0 3Z M0 3 L-6 12 L6 12Z" fill={BLUE} />
            <path d="M-6 -4 L-14 4 M6 -4 L14 4 M-4 12 L-7 22 M4 12 L7 22" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" />
          </g>
        ))}
      </g>
      <g transform="translate(100 102)">
        <circle cx="0" cy="-15" r="5" fill={CREAM} />
        <path d="M-8 -8 L8 -8 L0 4Z M0 4 L-8 15 L8 15Z" fill={CREAM} />
        <path d="M6 -6 L20 -16 M20 -16 L26 -12" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function MapEmblem() {
  const route = "M24 176 L24 132 L70 132 L70 96 L118 96 L118 58 L176 58 L176 24";
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <g stroke={CREAM} strokeOpacity="0.14">
        {[24, 48, 70, 96, 118, 146, 176].map((v) => (
          <g key={v}>
            <line x1={v} x2={v} y1="10" y2="190" />
            <line y1={v} y2={v} x1="10" x2="190" />
          </g>
        ))}
      </g>
      <path d="M118 120 C 132 108, 162 112, 170 128 C 178 146, 160 168, 138 164 C 120 160, 106 136, 118 120Z" fill={BLUE_DEEP} fillOpacity="0.45" stroke={BLUE} strokeDasharray="3 3" className="emb-breathe" />
      <path d="M30 40 C 44 26, 74 30, 80 46 C 86 62, 66 76, 48 72 C 30 68, 20 52, 30 40Z" fill={BLUE_DEEP} fillOpacity="0.45" stroke={BLUE} strokeDasharray="3 3" className="emb-breathe" style={{ animationDelay: "1.2s" }} />
      <path d={route} fill="none" stroke={CREAM} strokeWidth="2.4" strokeLinejoin="round" strokeDasharray="5 5" className="emb-dash" />
      <circle cx="24" cy="176" r="4" fill={CREAM} />
      <circle cx="176" cy="24" r="5" fill={BLUE} />
      <circle r="4.5" fill="#fff">
        <animateMotion dur="6s" repeatCount="indefinite" path={route} />
      </circle>
      <circle r="10" fill="none" stroke="#fff" strokeOpacity="0.5">
        <animateMotion dur="6s" repeatCount="indefinite" path={route} />
        <animate attributeName="r" values="5;14;5" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function Emblem({ kind }: { kind: EmblemKind }) {
  switch (kind) {
    case "hand":
      return <Hand />;
    case "gauge":
      return <Gauge />;
    case "rain":
      return <Rain />;
    case "cube":
      return <Cube />;
    case "warli":
      return <Warli />;
    case "map":
      return <MapEmblem />;
  }
}

/* ───────────── previews for the "more work" list ───────────── */

export function Preview({ kind }: { kind: "ticket" | "wafer" | "goa" | "snake" | "tetris" }) {
  if (kind === "ticket") {
    return (
      <svg viewBox="0 0 240 160" className="h-full w-full">
        <rect width="240" height="160" fill="#0e1017" />
        <rect x="26" y="24" width="188" height="112" rx="10" fill={CREAM} />
        <rect x="26" y="24" width="188" height="30" rx="10" fill={BLUE_DEEP} />
        <rect x="26" y="44" width="188" height="10" fill={BLUE_DEEP} />
        <text x="40" y="44" fill="#fff" fontSize="10" fontWeight="700" fontFamily="var(--font-mona)">WARRANTY · ACTIVE</text>
        <text x="40" y="74" fill="#0e0e11" fontSize="9" fontFamily="var(--font-mono)">SN 4H2-77Q-019</text>
        <text x="40" y="88" fill="#0e0e11" fillOpacity="0.6" fontSize="8" fontFamily="var(--font-mono)">VALID TILL 03 / 2027</text>
        {Array.from({ length: 34 }).map((_, i) => (
          <rect key={i} x={40 + i * 4.6} y="100" width={i % 3 === 0 ? 2.6 : 1.3} height="24" fill="#0e0e11" />
        ))}
        <rect x="36" y="96" width="168" height="2" fill={BLUE} className="emb-scan-x" />
      </svg>
    );
  }
  if (kind === "wafer") {
    const cells: [number, number][] = [];
    for (let x = -6; x <= 6; x++) for (let y = -6; y <= 6; y++) if (x * x + y * y <= 38) cells.push([x, y]);
    return (
      <svg viewBox="0 0 240 160" className="h-full w-full">
        <rect width="240" height="160" fill="#0e1017" />
        <circle cx="120" cy="80" r="70" fill="#1b2140" stroke={CREAM} strokeOpacity="0.3" />
        {cells.map(([x, y]) => {
          const defect = (x - 2) ** 2 + (y + 1) ** 2 < 6 || (y === 4 && x < 0);
          return <rect key={`${x}.${y}`} x={120 + x * 10 - 4} y={80 + y * 10 - 4} width="8" height="8" fill={defect ? BLUE : CREAM} fillOpacity={defect ? 1 : 0.2} />;
        })}
      </svg>
    );
  }
  if (kind === "goa") {
    return (
      <svg viewBox="0 0 240 160" className="h-full w-full">
        <rect width="240" height="160" fill="#f2b33d" />
        <circle cx="120" cy="92" r="40" fill="#fff4dc" />
        <g className="emb-wave-goa">
          <path d="M-40 104 Q-30 98 -20 104 T0 104 T20 104 T40 104 T60 104 T80 104 T100 104 T120 104 T140 104 T160 104 T180 104 T200 104 T220 104 T240 104 T260 104 T280 104 V160 H-40Z" fill={BLUE_DEEP} />
          <path d="M-40 118 Q-30 112 -20 118 T0 118 T20 118 T40 118 T60 118 T80 118 T100 118 T120 118 T140 118 T160 118 T180 118 T200 118 T220 118 T240 118 T260 118 T280 118 V160 H-40Z" fill={BLUE} />
        </g>
        <text x="120" y="40" textAnchor="middle" fill="#0e0e11" fontSize="22" fontWeight="800" fontFamily="var(--font-mona)">GOA 13</text>
      </svg>
    );
  }
  if (kind === "snake") {
    const body: [number, number][] = [[3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [7, 4], [7, 3], [8, 3], [9, 3], [10, 3]];
    return (
      <svg viewBox="0 0 240 160" className="h-full w-full">
        <rect width="240" height="160" fill="#0e1017" />
        <g stroke={CREAM} strokeOpacity="0.06">
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={i} x1={i * 16} x2={i * 16} y1="0" y2="160" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} y1={i * 16} y2={i * 16} x1="0" x2="240" />
          ))}
        </g>
        {body.map(([x, y], i) => (
          <rect key={i} x={x * 16 + 1} y={y * 16 + 1} width="14" height="14" rx="3" fill={i === body.length - 1 ? CREAM : BLUE} fillOpacity={0.45 + (i / body.length) * 0.55} />
        ))}
        <rect x={12 * 16 + 3} y={3 * 16 + 3} width="10" height="10" rx="5" fill="#ff5a5f" className="emb-pulse" />
      </svg>
    );
  }
  const blocks: [number, number, string][] = [
    [0, 8, BLUE], [1, 8, BLUE], [2, 8, BLUE], [3, 8, BLUE], [4, 8, CREAM], [5, 8, CREAM], [6, 8, BLUE_DEEP], [7, 8, BLUE_DEEP], [9, 8, CREAM],
    [0, 7, CREAM], [1, 7, BLUE_DEEP], [5, 7, CREAM], [6, 7, BLUE_DEEP], [7, 7, BLUE_DEEP], [8, 7, BLUE], [9, 7, BLUE],
    [0, 6, CREAM], [8, 6, BLUE], [9, 6, BLUE],
  ];
  return (
    <svg viewBox="0 0 240 160" className="h-full w-full">
      <rect width="240" height="160" fill="#0e1017" />
      <g transform="translate(70 4)">
        <rect width="100" height="152" fill="none" stroke={CREAM} strokeOpacity="0.2" />
        {blocks.map(([x, y, c], i) => (
          <rect key={i} x={x * 10 + 0.5} y={y * 16 + 8.5} width="9" height="15" fill={c} />
        ))}
        <g className="emb-fall">
          {[[3, 0], [4, 0], [5, 0], [4, 1]].map(([x, y]) => (
            <rect key={`${x}${y}`} x={x * 10 + 0.5} y={y * 16 + 8.5} width="9" height="15" fill={BLUE} />
          ))}
        </g>
      </g>
    </svg>
  );
}
