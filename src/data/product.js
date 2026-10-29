export const store = {
  name: 'Stride',
  supportPhone: '1-800-800-4953',
}

export const product = {
  id: 'trail-runner-2',
  name: 'Trail Runner 2',
  price: 120,
  currency: 'CAD',
  rating: 4.8,
  reviewCount: 216,
  colors: [
    { id: 'blue', name: 'Blue', swatch: '#2563eb' },
    { id: 'black', name: 'Black', swatch: '#1f2937' },
    { id: 'grey', name: 'Grey', swatch: '#9ca3af' },
  ],
  views: [
    { id: 'side', label: 'side view' },
    { id: 'top', label: 'top view' },
    { id: 'back', label: 'back view' },
  ],
  sizes: [
    { id: '7', label: '7', soldOut: false },
    { id: '8', label: '8', soldOut: true },
    { id: '9', label: '9', soldOut: false },
    { id: '10', label: '10', soldOut: false },
    { id: '11', label: '11', soldOut: true },
    { id: '12', label: '12', soldOut: false },
  ],
}

export function imagePath(colorId, viewId) {
  return `/images/trail-runner-2-${colorId}-${viewId}.svg`
}

export function photoAlt(colorName, viewLabel) {
  return `${product.name} in ${colorName.toLowerCase()}, ${viewLabel}`
}

// Size guide: foot length in cm -> US / EU size.
export const sizeChart = [
  { min: 24.5, max: 25.1, us: 7, eu: 39 },
  { min: 25.2, max: 25.8, us: 8, eu: 41 },
  { min: 25.9, max: 26.5, us: 9, eu: 42 },
  { min: 26.6, max: 27.2, us: 10, eu: 43 },
  { min: 27.3, max: 27.9, us: 11, eu: 45 },
  { min: 28.0, max: 28.6, us: 12, eu: 46 },
]

export function recommendedSize(footLength, unit) {
  const length = Number(footLength)
  if (!Number.isFinite(length) || length <= 0) return null
  const row =
    sizeChart.find((row) => length >= row.min && length <= row.max) ??
    (length < sizeChart[0].min ? sizeChart[0] : sizeChart[sizeChart.length - 1])
  return unit === 'eu' ? `EU ${row.eu}` : `US ${row.us}`
}
