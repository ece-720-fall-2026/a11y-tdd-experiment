// Draws a mock product photo of the shoe as an SVG data URI, tinted with the chosen colour.

const BG = '#eef0f2'
const SOLE = '#2b2b2b'

const VIEWS = {
  side: (hex) => `
    <rect width="400" height="300" fill="${BG}"/>
    <ellipse cx="200" cy="246" rx="160" ry="10" fill="#000" opacity="0.12"/>
    <path d="M70 200 L70 140 Q72 110 110 108 L170 118 Q205 135 250 146 Q305 152 340 186 Q352 200 340 206 L70 206 Z" fill="${hex}"/>
    <path d="M60 200 L345 200 Q352 200 350 212 L346 226 Q344 236 330 236 L72 236 Q60 236 60 224 Z" fill="${SOLE}"/>
    <path d="M170 118 L200 146 M185 124 L212 150 M200 130 L226 152" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
  'three-quarter': (hex) => `
    <rect width="400" height="300" fill="${BG}"/>
    <ellipse cx="205" cy="250" rx="170" ry="12" fill="#000" opacity="0.12"/>
    <g transform="translate(18 14) scale(1.08)">
      <path d="M70 200 L70 140 Q72 110 110 108 L170 118 Q205 135 250 146 Q305 152 340 186 Q352 200 340 206 L70 206 Z" fill="${hex}"/>
      <path d="M170 118 Q205 135 250 146 Q305 152 340 186 L340 170 Q300 140 250 132 Q205 122 170 104 Z" fill="#fff" opacity="0.18"/>
      <path d="M60 200 L345 200 Q352 200 350 212 L346 226 Q344 236 330 236 L72 236 Q60 236 60 224 Z" fill="${SOLE}"/>
      <path d="M170 118 L200 146 M185 124 L212 150 M200 130 L226 152" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    </g>`,
  top: (hex) => `
    <rect width="400" height="300" fill="${BG}"/>
    <ellipse cx="200" cy="150" rx="150" ry="92" fill="${hex}" stroke="${SOLE}" stroke-width="4"/>
    <path d="M170 105 L230 105 M172 125 L228 125 M174 145 L226 145 M172 165 L228 165 M170 185 L230 185" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
  outsole: (hex) => {
    let lugs = ''
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 6; col++) {
        lugs += `<circle cx="${110 + col * 36}" cy="${120 + row * 30}" r="8" fill="#555"/>`
      }
    }
    return `
    <rect width="400" height="300" fill="${BG}"/>
    <rect x="60" y="80" width="280" height="140" rx="60" fill="${SOLE}" stroke="${hex}" stroke-width="14"/>
    ${lugs}`
  },
}

export function shoeImageSrc(hex, view) {
  const draw = VIEWS[view] ?? VIEWS.side
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">${draw(hex)}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
