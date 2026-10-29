// Placeholder product photography: a stylised trail shoe rendered as SVG,
// tinted to the selected colour.

const LUGS = [78, 118, 158, 198, 238, 278, 314]

function SideShoe({ c }) {
  return (
    <g>
      <path
        d="M70 200 C64 160 96 140 140 136 C160 134 168 112 194 110 C222 108 232 130 262 138 C300 146 330 160 336 190 L338 204 Z"
        fill={c.upper}
      />
      <path d="M96 168 Q150 152 230 172" stroke={c.accent} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M168 118 L200 122 M176 130 L208 134 M184 142 L214 146" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
      <rect x="66" y="150" width="26" height="30" rx="6" fill={c.accent} />
      <path d="M64 200 Q60 224 90 226 L330 226 Q348 224 340 204 Z" fill={c.sole} />
      {LUGS.map((x) => (
        <rect key={x} x={x} y="220" width="14" height="12" rx="3" fill={c.sole} stroke="#000" strokeOpacity="0.25" />
      ))}
    </g>
  )
}

function SoleShoe({ c }) {
  return (
    <g>
      <ellipse cx="200" cy="150" rx="150" ry="70" fill={c.sole} />
      <ellipse cx="200" cy="150" rx="128" ry="52" fill={c.upper} opacity="0.35" />
      {[...Array(14)].map((_, i) => {
        const a = (i / 14) * Math.PI * 2
        const x = 200 + Math.cos(a) * 118
        const y = 150 + Math.sin(a) * 56
        return <circle key={i} cx={x} cy={y} r="7" fill="#000" opacity="0.35" />
      })}
      <ellipse cx="200" cy="150" rx="40" ry="16" fill={c.accent} opacity="0.8" />
    </g>
  )
}

const TRANSFORMS = {
  side: '',
  angle: 'translate(200 150) rotate(-7) scale(0.92) translate(-200 -150)',
  heel: 'translate(-70 -55) scale(1.55)',
}

export default function ShoeArt({ color, view = 'side', label }) {
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} className="shoe-art">
      <defs>
        <linearGradient id={`bg-${view}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f5f7" />
          <stop offset="1" stopColor="#d9dde3" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#bg-${view})`} />
      <ellipse cx="200" cy="246" rx="150" ry="10" fill="#000" opacity="0.12" />
      {view === 'sole' ? (
        <SoleShoe c={color} />
      ) : (
        <g transform={TRANSFORMS[view]}>
          <SideShoe c={color} />
        </g>
      )}
    </svg>
  )
}
