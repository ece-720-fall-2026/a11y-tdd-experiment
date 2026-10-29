// Placeholder product photos drawn as SVG so the page works without image assets.
// Each colour/view combination produces a different data URI.

const PALETTE = {
  blue: { upper: '#1d4ed8', accent: '#0b2f7a', lace: '#ffffff' },
  black: { upper: '#222428', accent: '#4a4f57', lace: '#9ca3af' },
  grey: { upper: '#8a8f98', accent: '#4b5058', lace: '#ffffff' },
}

export const VIEWS = [
  { id: 'side', label: 'side view' },
  { id: 'angle', label: 'three-quarter view' },
  { id: 'back', label: 'back view' },
  { id: 'sole', label: 'sole view' },
]

function sideShoe(c) {
  return `
    <path d="M150 330 C150 260 200 200 300 190 L380 170 C420 162 430 200 450 215 L560 240 C640 255 690 290 690 340 L690 360 L150 360 Z" fill="${c.upper}"/>
    <path d="M150 300 C190 300 230 300 300 300" stroke="${c.accent}" stroke-width="6" fill="none" opacity=".6"/>
    <path d="M330 195 L372 214 M356 182 L394 201 M382 172 L418 190" stroke="${c.lace}" stroke-width="7" stroke-linecap="round"/>
    <path d="M140 360 L700 360 L705 395 Q705 410 690 410 L150 410 Q135 410 135 395 Z" fill="${c.accent}"/>
    <path d="M190 410 L200 428 M290 410 L300 428 M390 410 L400 428 M490 410 L500 428 M590 410 L600 428" stroke="${c.accent}" stroke-width="10" stroke-linecap="round"/>`
}

function angleShoe(c) {
  return `<g transform="translate(420 300) rotate(-8) scale(0.88) translate(-420 -300)">${sideShoe(c)}</g>`
}

function backShoe(c) {
  return `
    <path d="M250 150 Q420 80 590 150 L600 380 Q420 425 240 380 Z" fill="${c.upper}"/>
    <path d="M300 170 Q420 130 540 170 L545 215 Q420 180 295 215 Z" fill="${c.accent}" opacity=".8"/>
    <rect x="390" y="200" width="60" height="70" rx="10" fill="${c.lace}" opacity=".85"/>
    <path d="M240 380 Q420 425 600 380 L610 405 Q420 452 230 405 Z" fill="${c.accent}"/>`
}

function soleShoe(c) {
  const lugs = []
  for (let x = 220; x <= 600; x += 60) {
    for (let y = 160; y <= 420; y += 65) lugs.push(`<circle cx="${x}" cy="${y}" r="13" fill="${c.upper}"/>`)
  }
  return `
    <path d="M190 250 Q190 130 420 120 Q650 130 650 250 L660 330 Q660 470 420 480 Q180 470 180 330 Z" fill="${c.accent}"/>
    ${lugs.join('')}`
}

const DRAW = { side: sideShoe, angle: angleShoe, back: backShoe, sole: soleShoe }

export function shoeImage(colorId, viewId) {
  const colors = PALETTE[colorId] ?? PALETTE.blue
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 560">
    <rect width="840" height="560" fill="#eef0f3"/>
    <ellipse cx="420" cy="470" rx="330" ry="28" fill="#000" opacity=".08"/>
    ${DRAW[viewId](colors)}
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
