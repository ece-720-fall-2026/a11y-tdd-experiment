const PHOTO_ANGLES = [
  { label: 'side view', rotation: -12 },
  { label: 'three-quarter view', rotation: 8 },
  { label: 'top view', rotation: 24 },
  { label: 'outsole view', rotation: -40 },
]

const PHOTO_BACKGROUNDS = ['#eef1f5', '#e3e8ee', '#f2ede6', '#dfe5ea']

function photoSrc(colorHex, background, rotation) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="${background}"/>
  <g transform="rotate(${rotation} 300 300)">
    <path d="M120 330 C140 290 190 280 230 285 C270 290 300 275 340 268 C400 258 470 275 480 320 C488 352 470 385 430 392 L200 392 C150 392 110 372 120 330 Z" fill="${colorHex}"/>
    <path d="M140 360 L470 378 L470 392 L180 392 Z" fill="#1b1b1b" opacity="0.35"/>
    <ellipse cx="300" cy="410" rx="190" ry="18" fill="#000" opacity="0.12"/>
    <path d="M230 285 C270 290 300 275 340 268" stroke="#ffffff" stroke-opacity="0.35" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M150 350 L430 370" stroke="#ffffff" stroke-opacity="0.25" stroke-width="6" stroke-dasharray="14 10"/>
    <circle cx="300" cy="300" r="0" fill="none"/>
  </g>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function photosFor(colorId) {
  const hex = { blue: '#2b5f9e', black: '#232323', grey: '#8d8d8d' }[colorId]
  return PHOTO_ANGLES.map((angle, index) => ({
    src: photoSrc(hex, PHOTO_BACKGROUNDS[index], angle.rotation),
    label: `${angle.label} (${index + 1} of ${PHOTO_ANGLES.length})`,
  }))
}

export const sizes = [
  { value: 7 },
  { value: 8 },
  { value: 8.5 },
  { value: 9 },
  { value: 9.5, soldOut: true },
  { value: 10 },
  { value: 10.5, soldOut: true },
  { value: 11 },
]

export const questions = [
  {
    id: 'waterproof',
    question: 'Is the Trail Runner 2 waterproof?',
    answer:
      'Yes. A waterproof breathable membrane keeps your feet dry through puddles, mud and rain, while still letting sweat escape.',
  },
  {
    id: 'fit',
    question: 'Does it run true to size?',
    answer:
      'Most runners find it true to size, but if you have wide feet we recommend going up half a size. Use the size guide above to check.',
  },
  {
    id: 'terrain',
    question: 'What terrain is it built for?',
    answer:
      'Soft forest trails, rocky ridges and wet ground. The 4mm lugs bite into mud and gravel without feeling clumsy on pavement.',
  },
  {
    id: 'care',
    question: 'How do I clean it?',
    answer:
      'Brush off dirt, then rinse with lukewarm water and mild soap. Let it dry at room temperature away from direct heat.',
  },
]
