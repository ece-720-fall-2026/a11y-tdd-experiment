// Mock data for the Trail Runner 2 product page.

export const product = {
  id: 'trail-runner-2',
  name: 'Trail Runner 2',
  subtitle: 'Lightweight trail running shoe',
  price: 120,
  currency: 'USD',
  rating: 4.4,
  reviewCount: 128,
  description:
    'Built for technical trails. A grippy outsole bites into mud and loose rock, while a breathable mesh upper keeps your feet cool on long climbs.',
  path: [
    { label: 'Shop', href: '/shop' },
    { label: 'Trail', href: '/shop/trail' },
    { label: 'Trail Runner 2' },
  ],
  colors: [
    { id: 'blue', name: 'Blue', hex: '#2456a6', trim: '#f2b632' },
    { id: 'black', name: 'Black', hex: '#1d1f24', trim: '#e4572e' },
    { id: 'grey', name: 'Grey', hex: '#8a9099', trim: '#1d1f24' },
  ],
  // Size chart: cm is the foot length the size fits; US and EU are the size labels.
  sizes: [
    { us: 7, eu: 40, cm: 24.5, soldOut: false },
    { us: 7.5, eu: 40.5, cm: 25, soldOut: false },
    { us: 8, eu: 41, cm: 25.5, soldOut: true },
    { us: 8.5, eu: 42, cm: 26, soldOut: false },
    { us: 9, eu: 42.5, cm: 26.5, soldOut: false },
    { us: 9.5, eu: 43, cm: 27, soldOut: false },
    { us: 10, eu: 44, cm: 27.5, soldOut: true },
    { us: 10.5, eu: 44.5, cm: 28, soldOut: false },
    { us: 11, eu: 45, cm: 28.5, soldOut: false },
    { us: 12, eu: 46, cm: 29.5, soldOut: false },
    { us: 13, eu: 47, cm: 30.5, soldOut: true },
  ],
  details: [
    'Weight: 280 g (men’s US 9)',
    'Drop: 8 mm',
    'Upper: recycled engineered mesh with reinforced toe cap',
    'Midsole: responsive EVA foam',
    'Outsole: 4 mm multi-directional lugs for wet and dry trails',
  ],
  shipping: [
    'Free standard shipping on orders over $75.',
    'Standard delivery in 3–5 business days.',
    'Free returns within 30 days, unworn and in the original box.',
  ],
  reviews: [
    { id: 1, author: 'Maya R.', rating: 5, text: 'Grips well on wet roots and the mesh keeps my feet cool on hot days.' },
    { id: 2, author: 'Tom K.', rating: 4, text: 'Comfortable out of the box. Runs a touch narrow in the toe.' },
    { id: 3, author: 'Priya S.', rating: 4, text: 'Light enough for long runs. The laces stay put.' },
  ],
  faqs: [
    {
      q: 'How do I choose my size?',
      a: 'Use the size guide next to the size selector. Enter your foot length in centimetres and choose US or EU to see your size.',
    },
    {
      q: 'Is this shoe waterproof?',
      a: 'No. The mesh upper is water-resistant and drains quickly, but it is not waterproof.',
    },
    {
      q: 'Can I wear it on the road?',
      a: 'It is designed for trails. You can run on pavement, but the lugs wear faster on hard surfaces.',
    },
  ],
}

export const sizeLabel = (size) => `US ${size.us} / EU ${size.eu}`
