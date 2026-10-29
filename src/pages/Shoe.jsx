// Simple inline SVG shoe illustration, tinted per color.
const PALETTES = {
  blue: { main: '#2b5d9e', accent: '#8fc2ff', sole: '#f2f2ee', detail: '#17406e' },
  black: { main: '#26262a', accent: '#6d6d75', sole: '#f2f2ee', detail: '#101013' },
  grey: { main: '#8b8b88', accent: '#c9c9c4', sole: '#f2f2ee', detail: '#5f5f5c' },
}

export default function Shoe({ color = 'blue', variant = 0 }) {
  const p = PALETTES[color] ?? PALETTES.blue
  const rotate = [0, -8, 12, 4][variant % 4]
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label={`Trail Runner 2 shoe in ${color}`} style={{ transform: `rotate(${rotate}deg)` }}>
      {/* lugs / tread */}
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={24 + i * 30} y={150} width={16} height={14} rx={3} fill={p.detail} />
      ))}
      {/* sole */}
      <path d="M14 132 Q10 118 34 112 L268 96 Q306 92 304 122 Q303 148 282 150 L44 150 Q18 150 14 132 Z" fill={p.sole} />
      {/* upper */}
      <path d="M34 112 Q60 44 130 38 Q206 32 262 74 Q276 84 268 96 L34 112 Z" fill={p.main} />
      {/* toe cap */}
      <path d="M34 112 Q46 74 82 58 Q60 86 52 112 Z" fill={p.detail} />
      {/* collar */}
      <path d="M196 42 Q232 52 262 74 Q238 66 208 54 Z" fill={p.accent} />
      {/* lace panel */}
      <path d="M96 70 Q150 48 214 62 L222 78 Q158 64 106 86 Z" fill={p.accent} opacity="0.9" />
      {[112, 140, 168, 196].map((x, i) => (
        <line key={i} x1={x} y1={60 + i * 2} x2={x + 22} y2={82 + i * 2} stroke={p.detail} strokeWidth="4" strokeLinecap="round" />
      ))}
      {/* swoosh-ish stripe */}
      <path d="M150 96 Q210 82 258 96 Q212 92 156 104 Z" fill={p.accent} />
      {/* heel clip */}
      <path d="M252 78 Q272 86 268 96 L240 90 Z" fill={p.detail} />
      {/* trailRunner badge */}
      <circle cx="86" cy="98" r="7" fill="#fff" />
      <text x="86" y="102" textAnchor="middle" fontSize="9" fontWeight="700" fill={p.detail}>2</text>
    </svg>
  )
}
