// Simple inline SVG "product photo" so the demo needs no external assets.
const VIEWS = ['side', 'top', 'detail']

export default function ShoeImage({ color, index }) {
  const palette = {
    blue: { base: '#2b5d8c', accent: '#1f4368', laces: '#dfe8f0' },
    black: { base: '#22252b', accent: '#14161a', laces: '#e6e6e6' },
    grey: { base: '#8d8d8d', accent: '#6f6f6f', laces: '#f1f1f1' },
  }
  const c = palette[color] ?? palette.blue
  const viewName = VIEWS[index] ?? 'side'

  return (
    <svg viewBox="0 0 600 400" role="img" aria-label={`Trail Runner 2 in ${color}, ${viewName} view`} width="100%" height="100%">
      <rect width="600" height="400" fill="#eceff1" />
      <ellipse cx="300" cy="330" rx="220" ry="26" fill="#d3d8dc" />
      {viewName === 'top' ? (
        <g>
          <path d="M120 260 q60 -120 180 -120 q120 0 180 60 q30 30 -10 60 q-170 60 -350 20 z" fill={c.base} />
          <path d="M170 210 q130 -70 260 0" stroke={c.accent} strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M150 250 q150 -80 300 10" stroke={c.laces} strokeWidth="8" strokeDasharray="18 14" fill="none" />
        </g>
      ) : viewName === 'detail' ? (
        <g>
          <circle cx="230" cy="200" r="90" fill="#ffffff" opacity="0.35" />
          <path d="M150 250 q40 -60 90 -60 q60 0 90 40 q20 25 -5 50 q-175 45 -175 -30 z" fill={c.base} />
          <path d="M160 250 q30 -30 80 -30" stroke={c.laces} strokeWidth="10" fill="none" />
          <path d="M155 258 q80 40 175 20" stroke={c.accent} strokeWidth="12" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path d="M70 250 q30 -70 120 -80 q50 -6 90 20 q60 30 150 40 q80 8 90 45 q6 25 -30 30 q-250 10 -420 -10 q-25 -5 -20 -35 z" fill={c.base} />
          <path d="M190 175 q70 -30 140 10 q50 25 90 32" stroke={c.accent} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M215 195 l55 -22 M230 210 l58 -20 M245 222 l60 -18" stroke={c.laces} strokeWidth="9" strokeLinecap="round" />
          <path d="M75 262 q220 25 425 -2 q10 14 -5 22 q-220 22 -410 -4 q-18 -4 -10 -16 z" fill={c.accent} />
        </g>
      )}
      <text x="24" y="38" fontSize="20" fill="#7c868d">
        Trail Runner 2 · {color} · photo {index + 1} of {VIEWS.length}
      </text>
    </svg>
  )
}
