// Mock data for the Trail Runner 2 product page.

export const product = {
  name: 'Trail Runner 2',
  category: { label: 'Trail', href: '/shop/trail' },
  price: 129.99,
  currency: 'USD',
  reviews: [
    {
      id: 1,
      author: 'Maya R.',
      rating: 5,
      date: '2026-09-14',
      title: 'Grippy on wet rock',
      body: 'Took these up a muddy ridge last weekend and never slipped. Light enough for long days.',
    },
    {
      id: 2,
      author: 'Dan K.',
      rating: 4,
      date: '2026-08-02',
      title: 'Great out of the box',
      body: 'Needed no break-in. The toe box could be a touch roomier, but the fit is secure.',
    },
    {
      id: 3,
      author: 'Priya S.',
      rating: 5,
      date: '2026-07-21',
      title: 'My new go-to',
      body: 'Cushioning is firm but comfortable on 30-km runs. Laces stay put.',
    },
  ],
  colors: [
    { id: 'blue', name: 'Blue', swatch: '#2a5db0', upper: '#2a5db0', sole: '#1b3d78', accent: '#f2a93b' },
    { id: 'black', name: 'Black', swatch: '#1e1f22', upper: '#2b2d31', sole: '#0c0d0f', accent: '#c9d13a' },
    { id: 'grey', name: 'Grey', swatch: '#8d939b', upper: '#8d939b', sole: '#4f555d', accent: '#e4572e' },
  ],
  // US sizes offered; `soldOut` sizes are shown but cannot be picked.
  sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
  soldOut: [7.5, 10.5],
  // Size chart: `footCm` is the longest foot length that fits that size.
  sizeChart: [
    { us: 7, eu: 40, footCm: 24.5 },
    { us: 7.5, eu: 40.5, footCm: 25.0 },
    { us: 8, eu: 41, footCm: 25.5 },
    { us: 8.5, eu: 42, footCm: 26.0 },
    { us: 9, eu: 42.5, footCm: 26.5 },
    { us: 9.5, eu: 43, footCm: 27.0 },
    { us: 10, eu: 44, footCm: 27.5 },
    { us: 10.5, eu: 44.5, footCm: 28.0 },
    { us: 11, eu: 45, footCm: 28.5 },
    { us: 11.5, eu: 46, footCm: 29.0 },
    { us: 12, eu: 46.5, footCm: 29.5 },
  ],
  photos: [
    { view: 'side', alt: 'Trail Runner 2, side view' },
    { view: 'angle', alt: 'Trail Runner 2, three-quarter view' },
    { view: 'heel', alt: 'Trail Runner 2, heel view' },
    { view: 'sole', alt: 'Trail Runner 2, outsole' },
  ],
  highlights: [
    'Omni-grip lugs for wet and loose terrain',
    '8 mm drop with a responsive foam midsole',
    'Recycled mesh upper with reinforced toe cap',
    'Weighs 280 g (US 9)',
  ],
  details: [
    'Upper: recycled engineered mesh with TPU overlays for midfoot lockdown.',
    'Midsole: dual-density EVA for cushioning on long, uneven runs.',
    'Outsole: 4 mm multidirectional lugs in a rubber compound that grips wet rock.',
    'Insole: removable, with an antimicrobial treatment.',
    'Made in Vietnam.',
  ],
  shipping: [
    'Free standard shipping on orders over $75 (3–5 business days).',
    'Express shipping available at checkout (1–2 business days).',
    'Free returns within 30 days, unworn and in the original box.',
    'Need a different size? Exchanges are free for the first 60 days.',
  ],
  faqs: [
    {
      q: 'Is Trail Runner 2 waterproof?',
      a: 'No. The mesh upper is water-resistant and drains quickly, but it is not waterproof. For wet conditions, choose a pair with a membrane.',
    },
    {
      q: 'Does it run true to size?',
      a: 'Yes. Most customers take their usual size. If you have wide feet, consider going up half a size.',
    },
    {
      q: 'How long do the lugs last?',
      a: 'Under normal trail use, expect roughly 600 km before the lugs show significant wear.',
    },
    {
      q: 'Can I wash the shoes?',
      a: 'Yes. Remove the insoles, rinse off mud with cool water, and air-dry away from direct heat.',
    },
  ],
}

export function formatPrice(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

// Returns the chart row for a foot length in cm: the smallest size that fits.
// Returns null if the foot is longer than the largest size on the chart.
export function sizeForFootLength(footCm, chart = product.sizeChart) {
  const row = chart.find((r) => footCm <= r.footCm)
  return row ?? null
}
