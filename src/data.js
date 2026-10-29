export const product = {
  id: 'trail-runner-2',
  name: 'Trail Runner 2',
  tagline: 'Grip for adventure',
  price: 120,
  currency: 'CAD',
  rating: 4,
  reviewCount: 128,
  colors: [
    { id: 'blue', name: 'Blue', hex: '#2f6db3' },
    { id: 'black', name: 'Black', hex: '#1d1d1f' },
    { id: 'grey', name: 'Grey', hex: '#8a8a8f' },
  ],
  sizes: [
    { id: 'us-8', label: 'US 8', eu: 41, soldOut: true },
    { id: 'us-8-5', label: 'US 8.5', eu: 42, soldOut: false },
    { id: 'us-9', label: 'US 9', eu: 43, soldOut: false },
    { id: 'us-10', label: 'US 10', eu: 44, soldOut: false },
    { id: 'us-11', label: 'US 11', eu: 45, soldOut: true },
  ],
}

export const sizeChart = [
  { cm: 23, us: 5, eu: 37 },
  { cm: 24, us: 6, eu: 38 },
  { cm: 25, us: 7, eu: 40 },
  { cm: 26, us: 8, eu: 41 },
  { cm: 27, us: 9, eu: 43 },
  { cm: 28, us: 10, eu: 44 },
  { cm: 29, us: 11, eu: 46 },
  { cm: 30, us: 12, eu: 47 },
]

export const questions = [
  {
    id: 'waterproof',
    question: 'Is the Trail Runner 2 waterproof?',
    answer: 'The ripstop upper is water repellent, so it shrugs off dew, puddle spray and light rain. It is not fully waterproof, so it is not the best pick for sustained downpours.',
  },
  {
    id: 'sizing',
    question: 'How does the sizing run?',
    answer: 'It fits true to size for most feet. If you are between sizes or run long trails downhill, we suggest going up half a size.',
  },
  {
    id: 'road-miles',
    question: 'Can I run road miles in these?',
    answer: 'Yes. The midsole foam is happy on pavement, though the lugs are made for dirt and will wear faster on asphalt.',
  },
]
