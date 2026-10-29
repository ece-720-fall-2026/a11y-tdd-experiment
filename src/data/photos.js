// Mock product photos, drawn as SVG and passed as data URIs.
// Each colour has four views, so the photo src changes as the shopper moves through them.

const BACKGROUND = '#eceef1'

const VIEWS = [
  { name: 'side view', draw: sideView },
  { name: 'top view', draw: topView },
  { name: 'heel view', draw: heelView },
  { name: 'outsole', draw: outsoleView },
]

function sideView(c) {
  const lugs = []
  for (let x = 100; x <= 520; x += 42) lugs.push(`<rect x="${x}" y="344" width="22" height="8" rx="3"/>`)
  return `
    <ellipse cx="320" cy="362" rx="250" ry="14" fill="#000" opacity=".12"/>
    <path d="M70 300 Q60 300 60 326 Q60 350 90 352 L540 352 Q584 350 584 322 Q584 300 556 300 Z" fill="#1d1d1d"/>
    <g fill="#3a3a3a">${lugs.join('')}</g>
    <path d="M80 300 L80 200 Q82 160 124 158 L196 170 Q246 180 282 134 Q322 96 366 122 L418 190 Q470 206 520 246 Q560 268 560 300 Z" fill="${c}"/>
    <path d="M124 158 Q150 136 186 166 L176 204 Q146 192 120 204 Z" fill="#0b0b0b" opacity=".55"/>
    <path d="M80 258 Q200 246 330 276 Q440 300 560 282" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="8"/>
    <g stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".85">
      <path d="M282 134 L306 152"/><path d="M304 122 L330 142"/><path d="M328 110 L354 132"/>
    </g>`
}

function topView(c) {
  return `
    <ellipse cx="320" cy="392" rx="130" ry="12" fill="#000" opacity=".12"/>
    <path d="M320 40 C404 40 440 128 440 232 C440 336 396 372 320 372 C244 372 200 336 200 232 C200 128 236 40 320 40 Z" fill="${c}" stroke="#0b0b0b" stroke-opacity=".35" stroke-width="3"/>
    <path d="M270 70 Q320 56 370 70 L366 110 Q320 100 274 110 Z" fill="#0b0b0b" opacity=".35"/>
    <rect x="296" y="120" width="48" height="60" rx="10" fill="#fff" opacity=".7"/>
    <g stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85">
      <path d="M262 150 L378 150"/><path d="M262 178 L378 178"/><path d="M262 206 L378 206"/>
    </g>
    <path d="M240 300 Q320 330 400 300" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="6"/>`
}

function heelView(c) {
  return `
    <ellipse cx="320" cy="376" rx="130" ry="10" fill="#000" opacity=".12"/>
    <path d="M218 60 Q320 28 422 60 Q444 200 432 340 Q320 372 208 340 Q196 200 218 60 Z" fill="${c}" stroke="#0b0b0b" stroke-opacity=".35" stroke-width="3"/>
    <path d="M226 250 Q320 276 414 250" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="16"/>
    <rect x="292" y="34" width="56" height="26" rx="6" fill="#fff" opacity=".75"/>`
}

function outsoleView() {
  const lugs = []
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const offset = row % 2 ? 30 : 0
      lugs.push(`<circle cx="${210 + col * 60 + offset}" cy="${96 + row * 44}" r="13" fill="#4a4a4a"/>`)
    }
  }
  return `
    <ellipse cx="320" cy="396" rx="150" ry="12" fill="#000" opacity=".12"/>
    <path d="M180 60 Q320 22 460 60 Q492 200 470 350 Q320 392 170 350 Q148 200 180 60 Z" fill="#262626"/>
    ${lugs.join('')}`
}

function toDataUri(body) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" width="640" height="420"><rect width="640" height="420" fill="${BACKGROUND}"/>${body}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// Returns the photos for one colour as { src, alt }.
export function productPhotos(product, colorId) {
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0]
  return VIEWS.map((view) => ({
    src: toDataUri(view.draw(color.hex)),
    alt: `${product.name} in ${color.label}, ${view.name}`,
  }))
}
