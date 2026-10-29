const COLORS = {
  blue: '#2563eb',
  black: '#111827',
  grey: '#6b7280',
}

const VIEWS = [
  { id: 'side', label: 'Side view' },
  { id: 'angle', label: 'Angle view' },
  { id: 'outsole', label: 'Outsole' },
  { id: 'detail', label: 'Lace detail' },
]

function sideShoe(color, mirrored) {
  const body = COLORS[color]
  return `<g${mirrored ? ' transform="translate(420,0) scale(-1,1)"' : ''}>
    <ellipse cx="205" cy="272" rx="170" ry="14" fill="#d1d5db" opacity="0.6" />
    <path d="M28 236 Q22 262 62 266 L352 266 Q402 262 396 228 Q330 214 268 216 L128 218 Q64 222 28 236 Z" fill="#1f2937" />
    <rect x="42" y="248" width="14" height="14" rx="3" fill="#f9fafb" />
    <rect x="70" y="250" width="14" height="14" rx="3" fill="#f9fafb" />
    <rect x="98" y="252" width="14" height="14" rx="3" fill="#f9fafb" />
    <rect x="150" y="252" width="14" height="14" rx="3" fill="#f9fafb" />
    <rect x="192" y="252" width="14" height="14" rx="3" fill="#f9fafb" />
    <rect x="246" y="250" width="14" height="14" rx="3" fill="#f9fafb" />
    <rect x="292" y="248" width="14" height="14" rx="3" fill="#f9fafb" />
    <rect x="338" y="246" width="14" height="14" rx="3" fill="#f9fafb" />
    <path d="M52 236 Q58 150 168 140 Q258 132 330 196 Q352 214 352 226 L120 232 Q70 234 52 236 Z" fill="${body}" />
    <path d="M52 236 Q58 150 168 140 Q190 138 208 141 Q150 168 132 232 Z" fill="#ffffff" opacity="0.12" />
    <path d="M62 232 Q70 180 150 168" stroke="#f9fafb" stroke-width="6" fill="none" stroke-linecap="round" />
    <path d="M96 228 Q110 172 190 160" stroke="#f9fafb" stroke-width="6" fill="none" stroke-linecap="round" />
    <path d="M134 226 Q152 178 226 162" stroke="#f9fafb" stroke-width="6" fill="none" stroke-linecap="round" />
    <path d="M172 226 Q196 182 258 168" stroke="#f9fafb" stroke-width="6" fill="none" stroke-linecap="round" />
    <path d="M210 226 Q238 188 290 176" stroke="#f9fafb" stroke-width="6" fill="none" stroke-linecap="round" />
    <path d="M330 196 Q352 214 352 226 L262 230 Q296 208 330 196 Z" fill="#111827" opacity="0.25" />
    <rect x="296" y="132" width="16" height="34" rx="6" transform="rotate(18 304 149)" fill="#facc15" />
    <circle cx="346" cy="214" r="6" fill="#f9fafb" />
  </g>`
}

function outsoleShoe(color) {
  const lugs = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 9; col++) {
      lugs.push(
        `<rect x="${52 + col * 34 + (row % 2) * 8}" y="${70 + row * 42}" width="22" height="26" rx="6" fill="#f9fafb" />`,
      )
    }
  }
  return `<ellipse cx="210" cy="272" rx="170" ry="14" fill="#d1d5db" opacity="0.6" />
    <path d="M30 60 Q30 44 46 44 L374 44 Q390 44 390 60 L390 216 Q390 232 374 232 L46 232 Q30 232 30 216 Z" fill="#1f2937" />
    ${lugs.join('')}
    <path d="M30 60 Q30 44 46 44 L200 44 L200 232 L46 232 Q30 232 30 216 Z" fill="${COLORS[color]}" opacity="0.35" />`
}

function shoeSvg(color, viewId) {
  let viewBox = '0 0 420 300'
  let inner = ''
  if (viewId === 'side') {
    inner = sideShoe(color, false)
  } else if (viewId === 'angle') {
    inner = sideShoe(color, true)
  } else if (viewId === 'outsole') {
    inner = outsoleShoe(color)
  } else {
    viewBox = '40 100 240 180'
    inner = sideShoe(color, false)
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img">${inner}</svg>`
}

export function photoFor(color, index) {
  const view = VIEWS[index % VIEWS.length]
  const svg = shoeSvg(color, view.id)
  return {
    src: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    alt: `Trail Runner 2 in ${color[0].toUpperCase() + color.slice(1)}, ${view.label.toLowerCase()}`,
    caption: `${view.label} — photo ${(index % VIEWS.length) + 1} of ${VIEWS.length}`,
  }
}

export const PHOTO_COUNT = VIEWS.length
export const COLOR_OPTIONS = [
  { id: 'blue', name: 'Blue' },
  { id: 'black', name: 'Black' },
  { id: 'grey', name: 'Grey' },
]
