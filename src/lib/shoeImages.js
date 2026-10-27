// Generates the shoe "photos" as SVG data URIs, coloured with the chosen
// colour. Each view is a different drawing, so every photo has its own src.

const BACKGROUND = '#eef0f2'
const SOLE = '#2b2b2b'
const OUTLINE = 'M300 40 C380 40 430 110 430 220 C430 330 390 410 300 410 C210 410 170 330 170 220 C170 110 220 40 300 40Z'

function svgUrl(body) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450">` +
    `<rect width="600" height="450" fill="${BACKGROUND}"/>${body}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function sideView(c) {
  return `
    <path d="M85 300 H515 Q535 300 532 325 L528 340 Q524 358 500 358 H105 Q82 358 82 335 Z" fill="${SOLE}"/>
    <path d="M95 300 L95 225 Q95 190 130 185 L230 170 Q260 150 290 125 L330 110 Q350 108 355 130 L370 195 L420 215 Q490 225 505 265 L510 300 Z" fill="${c}"/>
    <path d="M95 300 Q96 262 140 258 L190 256 L190 300 Z" fill="#00000026"/>
    <path d="M230 170 Q250 200 300 205 L330 190" stroke="#00000040" stroke-width="6" fill="none"/>
    <g stroke="#ffffffcc" stroke-width="5" stroke-linecap="round">
      <path d="M270 145 L300 158"/><path d="M292 130 L322 143"/><path d="M250 162 L278 172"/>
    </g>
    <path d="M150 230 Q230 215 300 235" stroke="#ffffff88" stroke-width="5" fill="none"/>`
}

function topView(c) {
  let laces = ''
  for (let y = 150; y <= 290; y += 35) {
    laces += `<path d="M268 ${y} H332" stroke="#ffffffaa" stroke-width="6" stroke-linecap="round"/>`
  }
  return `
    <path d="${OUTLINE}" fill="${c}"/>
    <path d="M300 120 C330 120 350 150 350 210 C350 320 330 370 300 370 C270 370 250 320 250 210 C250 150 270 120 300 120Z" fill="#00000014"/>
    ${laces}
    <path d="${OUTLINE}" fill="none" stroke="${SOLE}" stroke-width="8"/>`
}

function soleView(c) {
  let lugs = ''
  for (let y = 80; y <= 380; y += 40) {
    for (let x = 180; x <= 420; x += 40) {
      const inside = ((x - 300) / 125) ** 2 + ((y - 225) / 190) ** 2 < 0.8
      if (inside) lugs += `<circle cx="${x}" cy="${y}" r="9" fill="#5a5a5a"/>`
    }
  }
  return `
    <path d="${OUTLINE}" fill="${c}"/>
    <g transform="translate(300 225) scale(0.86) translate(-300 -225)">
      <path d="${OUTLINE}" fill="${SOLE}"/>
      ${lugs}
    </g>`
}

export function shoePhotos(hex) {
  return [
    { label: 'side view', src: svgUrl(sideView(hex)) },
    { label: 'top view', src: svgUrl(topView(hex)) },
    { label: 'outsole', src: svgUrl(soleView(hex)) },
  ]
}
