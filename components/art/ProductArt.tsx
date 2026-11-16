import { useId } from "react";

export type ArtKind =
  | "phone-pro"
  | "phone-dual"
  | "phone-ultra"
  | "phone-round"
  | "earbuds"
  | "charger"
  | "cable"
  | "headphones"
  | "case"
  | "film"
  | "watch"
  | "powerbank";

export type ArtView = "back" | "front" | "side";

/**
 * Renderizações vetoriais de estúdio para os produtos demonstrativos.
 * Quando as fotos reais chegarem, basta trocar por <Image> no ProductCard/Gallery.
 */
export function ProductArt({
  kind,
  color,
  view = "back",
  className,
  title,
}: {
  kind: ArtKind;
  color: string;
  view?: ArtView;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const light = isLight(color);
  const g = {
    body: `b${uid}`,
    rim: `r${uid}`,
    glass: `g${uid}`,
    shade: `s${uid}`,
    screen: `sc${uid}`,
    lens: `l${uid}`,
    floor: `f${uid}`,
  };

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={title ?? "Ilustração do produto"}>
      <defs>
        <linearGradient id={g.body} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shade(color, 0.22)} />
          <stop offset="0.45" stopColor={color} />
          <stop offset="1" stopColor={shade(color, -0.32)} />
        </linearGradient>
        <linearGradient id={g.rim} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={shade(color, -0.45)} />
          <stop offset="0.12" stopColor={shade(color, 0.35)} />
          <stop offset="0.5" stopColor={shade(color, -0.1)} />
          <stop offset="0.88" stopColor={shade(color, 0.3)} />
          <stop offset="1" stopColor={shade(color, -0.45)} />
        </linearGradient>
        <linearGradient id={g.glass} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={light ? 0.55 : 0.22} />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={g.shade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={g.screen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b2a63" />
          <stop offset="0.5" stopColor="#0756C9" />
          <stop offset="1" stopColor="#020814" />
        </linearGradient>
        <radialGradient id={g.lens} cx="0.38" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#4a6a9a" />
          <stop offset="0.35" stopColor="#0c1424" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <radialGradient id={g.floor} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="372" rx="120" ry="14" fill={`url(#${g.floor})`} />
      {renderKind(kind, view, g, color)}
    </svg>
  );
}

type G = Record<"body" | "rim" | "glass" | "shade" | "screen" | "lens" | "floor", string>;
const u = (id: string) => `url(#${id})`;

function Lens({ cx, cy, r, g }: { cx: number; cy: number; r: number; g: G }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 4} fill="#0a0a0a" opacity="0.55" />
      <circle cx={cx} cy={cy} r={r + 2} fill="#2a2d33" />
      <circle cx={cx} cy={cy} r={r} fill={u(g.lens)} />
      <circle cx={cx} cy={cy} r={r * 0.42} fill="#05070c" />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.32} r={r * 0.16} fill="#9cc8ff" opacity="0.7" />
    </g>
  );
}

function PhoneBody({ g, children, x = 120, w = 160, h = 320, r = 30 }: { g: G; children?: React.ReactNode; x?: number; w?: number; h?: number; r?: number }) {
  const y = 30;
  return (
    <g>
      <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={r + 3} fill={u(g.rim)} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={u(g.body)} />
      {children}
      <rect x={x} y={y} width={w} height={h} rx={r} fill={u(g.glass)} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill={u(g.shade)} />
    </g>
  );
}

function PhoneFront({ g, notch }: { g: G; notch: "island" | "punch" }) {
  const x = 120, y = 30, w = 160, h = 320, r = 30;
  return (
    <g>
      <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={r + 3} fill={u(g.rim)} />
      <rect x={x} y={y} width={w} height={h} rx={r} fill="#050505" />
      <rect x={x + 7} y={y + 7} width={w - 14} height={h - 14} rx={r - 6} fill={u(g.screen)} />
      <path d={`M${x + 7} ${y + 200} C ${x + 60} ${y + 150}, ${x + 110} ${y + 260}, ${x + w - 7} ${y + 190} L ${x + w - 7} ${y + h - 30} Q ${x + w - 7} ${y + h - 7} ${x + w - 30} ${y + h - 7} L ${x + 30} ${y + h - 7} Q ${x + 7} ${y + h - 7} ${x + 7} ${y + h - 30} Z`} fill="#168AFF" opacity="0.35" />
      <text x="200" y="118" textAnchor="middle" fill="#fff" fontFamily="Sora, sans-serif" fontWeight="600" fontSize="44">09:41</text>
      <text x="200" y="140" textAnchor="middle" fill="#cfe5ff" fontFamily="Inter, sans-serif" fontSize="11" opacity="0.85">SOS TECH CEL</text>
      {notch === "island" ? <rect x="172" y="44" width="56" height="16" rx="8" fill="#000" /> : <circle cx="200" cy="52" r="6" fill="#000" />}
      <rect x={x} y={y} width={w} height={h} rx={r} fill={u(g.glass)} />
    </g>
  );
}

function PhoneSide({ g }: { g: G }) {
  return (
    <g>
      <rect x="185" y="27" width="30" height="326" rx="14" fill={u(g.rim)} />
      <rect x="190" y="30" width="20" height="320" rx="10" fill={u(g.body)} opacity="0.9" />
      <rect x="213" y="110" width="4" height="40" rx="2" fill={u(g.rim)} />
      <rect x="183" y="96" width="4" height="22" rx="2" fill={u(g.rim)} />
      <rect x="183" y="126" width="4" height="34" rx="2" fill={u(g.rim)} />
      <rect x="183" y="166" width="4" height="34" rx="2" fill={u(g.rim)} />
    </g>
  );
}

function renderKind(kind: ArtKind, view: ArtView, g: G, color: string) {
  if (kind.startsWith("phone")) {
    if (view === "front") return <PhoneFront g={g} notch={kind === "phone-pro" || kind === "phone-dual" ? "island" : "punch"} />;
    if (view === "side") return <PhoneSide g={g} />;
  }
  switch (kind) {
    case "phone-pro":
      return (
        <PhoneBody g={g}>
          <rect x="132" y="42" width="78" height="78" rx="22" fill={shade(color, -0.15)} stroke={shade(color, 0.3)} strokeWidth="1.5" />
          <Lens cx={153} cy={63} r={13} g={g} />
          <Lens cx={189} cy={99} r={13} g={g} />
          <circle cx="190" cy="61" r="5" fill="#f6f1df" opacity="0.9" />
          <circle cx="152" cy="101" r="3" fill="#0a0a0a" />
          <g opacity="0.6" transform="translate(186 186)">
            <circle r="14" fill="none" stroke={shade(color, 0.4)} strokeWidth="1.5" />
          </g>
        </PhoneBody>
      );
    case "phone-dual":
      return (
        <PhoneBody g={g}>
          <rect x="132" y="42" width="44" height="86" rx="20" fill={shade(color, -0.12)} stroke={shade(color, 0.3)} strokeWidth="1.5" />
          <Lens cx={154} cy={64} r={13} g={g} />
          <Lens cx={154} cy={106} r={13} g={g} />
          <circle cx="188" cy="56" r="5" fill="#f6f1df" opacity="0.9" />
        </PhoneBody>
      );
    case "phone-ultra":
      return (
        <PhoneBody g={g} r={22}>
          <Lens cx={150} cy={66} r={14} g={g} />
          <Lens cx={150} cy={106} r={14} g={g} />
          <Lens cx={150} cy={146} r={14} g={g} />
          <circle cx="178" cy="66" r="4.5" fill="#f6f1df" opacity="0.9" />
        </PhoneBody>
      );
    case "phone-round":
      return (
        <PhoneBody g={g} r={26}>
          <rect x="132" y="42" width="96" height="62" rx="18" fill={shade(color, -0.25)} stroke={shade(color, 0.25)} strokeWidth="1.5" />
          <Lens cx={156} cy={73} r={17} g={g} />
          <Lens cx={196} cy={62} r={9} g={g} />
          <Lens cx={196} cy={86} r={7} g={g} />
          <circle cx="216" cy="73" r="4" fill="#f6f1df" opacity="0.9" />
        </PhoneBody>
      );
    case "case":
      return (
        <g>
          <rect x="114" y="24" width="172" height="332" rx="36" fill={u(g.body)} />
          <rect x="126" y="36" width="148" height="308" rx="28" fill={shade(color, -0.2)} opacity="0.35" />
          <rect x="132" y="44" width="80" height="80" rx="22" fill="#050505" opacity="0.85" />
          <rect x="114" y="24" width="172" height="332" rx="36" fill={u(g.glass)} />
          <rect x="114" y="24" width="172" height="332" rx="36" fill="none" stroke={shade(color, 0.35)} strokeWidth="2" />
          <rect x="114" y="24" width="172" height="332" rx="36" fill={u(g.shade)} />
        </g>
      );
    case "film":
      return (
        <g>
          <g transform="translate(14 -6) rotate(6 200 190)" opacity="0.55">
            <rect x="122" y="32" width="156" height="316" rx="30" fill="#fff" opacity="0.12" stroke="#bfe0ff" strokeWidth="1.5" />
          </g>
          <rect x="120" y="30" width="160" height="320" rx="30" fill="#0b0f16" stroke="#3a4250" strokeWidth="3" />
          <rect x="128" y="38" width="144" height="304" rx="24" fill="#bfe0ff" opacity="0.16" />
          <rect x="128" y="38" width="144" height="304" rx="24" fill={u(g.glass)} />
          <path d="M150 60 L 250 330" stroke="#fff" strokeOpacity="0.25" strokeWidth="18" />
          <path d="M190 50 L 268 260" stroke="#fff" strokeOpacity="0.12" strokeWidth="8" />
          <rect x="176" y="46" width="48" height="12" rx="6" fill="#000" />
        </g>
      );
    case "charger":
      return (
        <g>
          <rect x="170" y="48" width="12" height="54" rx="3" fill="#b7bcc4" />
          <rect x="218" y="48" width="12" height="54" rx="3" fill="#b7bcc4" />
          <rect x="128" y="96" width="144" height="210" rx="34" fill={u(g.body)} />
          <rect x="128" y="96" width="144" height="210" rx="34" fill={u(g.glass)} />
          <rect x="128" y="96" width="144" height="210" rx="34" fill={u(g.shade)} />
          <rect x="182" y="262" width="36" height="14" rx="7" fill="#1a1d22" />
          <rect x="188" y="266" width="24" height="6" rx="3" fill="#41464f" />
          <text x="200" y="196" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="700" fontSize="28" fill={shade(color, -0.45)}>20W</text>
        </g>
      );
    case "cable":
      return (
        <g fill="none">
          <path d="M120 300 C 60 230, 120 140, 200 160 S 330 120, 290 70" stroke={shade(color, -0.18)} strokeWidth="16" strokeLinecap="round" />
          <path d="M120 300 C 60 230, 120 140, 200 160 S 330 120, 290 70" stroke={color} strokeWidth="11" strokeLinecap="round" />
          <path d="M120 300 C 60 230, 120 140, 200 160 S 330 120, 290 70" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" transform="translate(-2 -3)" />
          <rect x="100" y="296" width="40" height="62" rx="10" fill={u(g.body)} />
          <rect x="110" y="352" width="20" height="18" rx="4" fill="#c4c8cf" />
          <rect x="272" y="30" width="38" height="56" rx="10" fill={u(g.body)} transform="rotate(20 291 58)" />
          <rect x="282" y="10" width="18" height="24" rx="3" fill="#c4c8cf" transform="rotate(20 291 58)" />
        </g>
      );
    case "earbuds":
      return (
        <g>
          <rect x="96" y="190" width="208" height="150" rx="66" fill={u(g.body)} />
          <rect x="96" y="190" width="208" height="150" rx="66" fill={u(g.glass)} />
          <path d="M96 252 H 304" stroke={shade(color, -0.25)} strokeWidth="2" />
          <circle cx="200" cy="300" r="4" fill="#33d17a" />
          <rect x="96" y="190" width="208" height="150" rx="66" fill={u(g.shade)} />
          {[150, 250].map((cx, i) => (
            <g key={cx} transform={`rotate(${i ? 14 : -14} ${cx} 140)`}>
              <rect x={cx - 13} y="120" width="26" height="88" rx="13" fill={u(g.body)} />
              <ellipse cx={cx} cy="112" rx="30" ry="34" fill={u(g.body)} />
              <ellipse cx={cx} cy="112" rx="30" ry="34" fill={u(g.glass)} />
              <ellipse cx={cx + (i ? -10 : 10)} cy="104" rx="12" ry="14" fill="#1b1f26" opacity="0.85" />
            </g>
          ))}
        </g>
      );
    case "headphones":
      return (
        <g>
          <path d="M100 220 C 100 90, 300 90, 300 220" fill="none" stroke={shade(color, 0.25)} strokeWidth="22" strokeLinecap="round" />
          <path d="M100 220 C 100 90, 300 90, 300 220" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" />
          {[96, 304].map((cx) => (
            <g key={cx}>
              <rect x={cx - 34} y="196" width="68" height="120" rx="32" fill={u(g.body)} />
              <rect x={cx - 34} y="196" width="68" height="120" rx="32" fill={u(g.glass)} />
              <rect x={cx - 24} y="210" width="48" height="92" rx="24" fill="#0a0c10" opacity="0.6" />
            </g>
          ))}
          <path d="M150 112 C 180 100, 220 100, 250 112" stroke="#168AFF" strokeOpacity="0.5" strokeWidth="2" fill="none" />
        </g>
      );
    case "watch":
      return (
        <g>
          <rect x="150" y="18" width="100" height="110" rx="26" fill={shade(color, -0.1)} />
          <rect x="150" y="270" width="100" height="110" rx="26" fill={shade(color, -0.1)} />
          <rect x="128" y="100" width="144" height="180" rx="44" fill={u(g.rim)} />
          <rect x="138" y="110" width="124" height="160" rx="36" fill="#050505" />
          <rect x="146" y="118" width="108" height="144" rx="30" fill={u(g.screen)} />
          <text x="200" y="196" textAnchor="middle" fill="#fff" fontFamily="Sora, sans-serif" fontWeight="600" fontSize="32">10:09</text>
          <circle cx="200" cy="228" r="16" fill="none" stroke="#168AFF" strokeWidth="4" strokeDasharray="70 100" transform="rotate(-90 200 228)" />
          <rect x="270" y="160" width="10" height="34" rx="5" fill={u(g.rim)} />
          <rect x="138" y="110" width="124" height="160" rx="36" fill={u(g.glass)} />
        </g>
      );
    case "powerbank":
      return (
        <g>
          <rect x="118" y="60" width="164" height="270" rx="30" fill={u(g.body)} />
          <rect x="118" y="60" width="164" height="270" rx="30" fill={u(g.glass)} />
          <rect x="118" y="60" width="164" height="270" rx="30" fill={u(g.shade)} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={176 + i * 16} cy="290" r="4" fill={i < 3 ? "#168AFF" : "#2f343c"} />
          ))}
          <text x="200" y="200" textAnchor="middle" fontFamily="Sora, sans-serif" fontWeight="700" fontSize="22" fill="#cfd6e0" opacity="0.8">10.000</text>
          <text x="200" y="222" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fill="#cfd6e0" opacity="0.6">mAh</text>
          <rect x="182" y="64" width="36" height="8" rx="4" fill="#0a0c10" />
        </g>
      );
    default:
      return null;
  }
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function isLight(hex: string) {
  const [r, gg, b] = hexToRgb(hex);
  return (r * 299 + gg * 587 + b * 114) / 1000 > 150;
}
/** clareia (amt > 0) ou escurece (amt < 0) uma cor hex */
function shade(hex: string, amt: number) {
  const [r, gg, b] = hexToRgb(hex);
  const f = (c: number) => Math.round(amt > 0 ? c + (255 - c) * amt : c * (1 + amt));
  return `rgb(${f(r)},${f(gg)},${f(b)})`;
}
