// Builds lightweight inline SVG "photos" of the shoe for each color and view,
// so the page needs no binary assets.
export function shoePhoto(colorHex, view) {
  const backgrounds = { side: '#eef2f6', sole: '#e7ecef', detail: '#f2f4f6' }
  const upper = colorHex
  const accent = '#0b3057'
  const soleColour = '#f2b632'

  const shapes = {
    side: `
      <path d="M110 210 C110 210 130 178 190 172 C255 166 320 178 350 200 C365 211 368 226 362 236 L112 236 Z" fill="${upper}"/>
      <path d="M112 236 L362 236 C368 246 366 254 356 258 L120 258 C108 258 104 248 112 236 Z" fill="${soleColour}"/>
      <ellipse cx="200" cy="196" rx="26" ry="16" fill="${accent}" opacity="0.35"/>
      <path d="M150 172 C150 172 158 128 196 120 C230 113 262 122 282 140 C296 152 310 166 320 172 L190 172 Z" fill="${upper}" opacity="0.85"/>
      <circle cx="205" cy="150" r="10" fill="${accent}"/>`,
    sole: `
      <rect x="90" y="150" width="300" height="90" rx="44" fill="${upper}"/>
      <rect x="90" y="196" width="300" height="46" rx="23" fill="${soleColour}"/>
      <g fill="${accent}" opacity="0.55">
        <circle cx="140" cy="222" r="9"/><circle cx="185" cy="226" r="9"/><circle cx="230" cy="224" r="9"/>
        <circle cx="275" cy="228" r="9"/><circle cx="320" cy="222" r="9"/>
      </g>`,
    detail: `
      <path d="M120 140 C180 110 280 110 360 150 L360 250 L120 250 Z" fill="${upper}"/>
      <g stroke="${accent}" stroke-width="7" opacity="0.5">
        <path d="M150 230 L330 160"/><path d="M170 240 L345 190"/>
      </g>
      <rect x="120" y="236" width="240" height="14" fill="${soleColour}"/>`,
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" role="img">
    <rect width="480" height="320" fill="${backgrounds[view]}"/>
    <circle cx="400" cy="70" r="46" fill="#ffffff" opacity="0.6"/>
    ${shapes[view]}
  </svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const photoViews = [
  { id: 'side', label: 'side view' },
  { id: 'sole', label: 'outsole view' },
  { id: 'detail', label: 'upper detail' },
]
