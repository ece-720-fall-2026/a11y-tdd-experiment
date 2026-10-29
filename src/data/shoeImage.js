// Placeholder product photos drawn as SVG, so the page has images without
// shipping binary assets. Each photo is a different view of the shoe in the
// chosen color. Swap these for real photography when it is available.

const VIEWS = {
  0: { // side view
    body: 'M40 230 L40 150 Q60 120 120 118 L210 118 Q250 80 320 92 L410 120 L470 150 L470 230 Z',
    sole: 'M36 230 L474 230 L474 262 Q474 272 462 272 L48 272 Q36 272 36 262 Z',
    detail: 'M150 118 Q200 150 300 140',
  },
  1: { // inner side
    body: 'M60 226 L60 160 Q80 124 140 122 L230 124 Q270 86 340 98 L440 126 L484 160 L484 226 Z',
    sole: 'M56 226 L488 226 L488 256 Q488 268 476 268 L68 268 Q56 268 56 256 Z',
    detail: 'M90 150 Q200 130 330 150',
  },
  2: { // top view
    body: 'M120 40 Q260 10 380 60 Q420 150 390 250 Q260 280 130 240 Q100 150 120 40 Z',
    sole: 'M130 60 Q260 30 380 70 Q400 150 378 240 Q260 262 140 232 Q118 150 130 60 Z',
    detail: 'M200 60 L200 240',
  },
  3: { // outsole
    body: 'M50 150 L470 150 L470 210 Q470 240 440 240 L80 240 Q50 240 50 210 Z',
    sole: 'M50 200 L470 200 L470 240 Q470 262 440 262 L80 262 Q50 262 50 240 Z',
    detail: 'M90 220 L110 250 M160 220 L180 250 M230 220 L250 250 M300 220 L320 250 M370 220 L390 250',
  },
}

export function shoeImageSrc(colorHex, viewIndex) {
  const view = VIEWS[viewIndex % 4]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320">
<rect width="520" height="320" fill="#eceef1"/>
<ellipse cx="260" cy="292" rx="210" ry="10" fill="#d3d6db"/>
<path d="${view.sole}" fill="#2b2b2b"/>
<path d="${view.body}" fill="${colorHex}"/>
<path d="${view.detail}" fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="4" stroke-linecap="round"/>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
