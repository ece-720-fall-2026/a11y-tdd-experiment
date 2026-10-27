// Mock data for the Trail Runner 2 product page.

export const product = {
  name: 'Trail Runner 2',
  price: 139,
  currency: 'USD',
  rating: 4.6,
  reviewCount: 128,
  description:
    'A lightweight trail shoe built for rocky descents and muddy climbs. A rock plate guards your feet, and the grippy outsole holds on wet ground.',
  colors: [
    { id: 'blue', name: 'Blue', hex: '#1f5fbf' },
    { id: 'black', name: 'Black', hex: '#1c1c1c' },
    { id: 'grey', name: 'Grey', hex: '#8b9099' },
  ],
  // Sizes in the size chart. `cm` is the foot length the size fits best.
  // The first size must be available: the spec's tests pick the first
  // available option.
  sizes: [
    { us: '7', eu: '40', cm: 24.5 },
    { us: '7.5', eu: '40.5', cm: 25 },
    { us: '8', eu: '41', cm: 25.5 },
    { us: '8.5', eu: '42', cm: 26 },
    { us: '9', eu: '42.5', cm: 26.5 },
    { us: '9.5', eu: '43', cm: 27 },
    { us: '10', eu: '44', cm: 27.5 },
    { us: '10.5', eu: '44.5', cm: 28, soldOut: true },
    { us: '11', eu: '45', cm: 28.5 },
    { us: '12', eu: '46', cm: 29.5, soldOut: true },
  ],
  features: [
    'Rock plate under the forefoot for protection on sharp trails',
    '4 mm lugs that grip wet and loose ground',
    'Recycled mesh upper that drains quickly',
    'Weight: 290 g (US men’s 9)',
    '8 mm heel-to-toe drop',
  ],
  reviews: [
    { author: 'Maya R.', rating: 5, text: 'Great grip on wet roots. Felt secure on long descents.' },
    { author: 'Tom K.', rating: 4, text: 'Comfortable out of the box. Runs about half a size small.' },
    { author: 'Ana L.', rating: 5, text: 'Light enough for fast days and tough enough for rocky trails.' },
  ],
  shipping:
    'Free standard shipping on orders over $75. Orders ship within 2 business days. Returns are accepted within 30 days if the shoes are unworn.',
  questions: [
    {
      question: 'Are these shoes waterproof?',
      answer:
        'The upper is water-resistant and drains quickly, but it is not waterproof. Your feet can still get wet in deep water or heavy rain.',
    },
    {
      question: 'How do I know my size?',
      answer:
        'Open the size guide next to the size selector. Enter your foot length in centimetres and choose US or EU to get your size.',
    },
    {
      question: 'How long does the outsole last?',
      answer:
        'Most runners get several hundred kilometres from the outsole, depending on terrain and running style.',
    },
    {
      question: 'Can I return the shoes if they do not fit?',
      answer:
        'Yes. You can return unworn shoes within 30 days of delivery, and we will send a prepaid return label.',
    },
  ],
  footer: {
    customerHelp: ['Help center', 'Returns', 'Order status', 'Contact us'],
    company: ['About Stride', 'Careers', 'Press'],
    social: [
      { name: 'Instagram', href: 'https://www.instagram.com' },
      { name: 'Facebook', href: 'https://www.facebook.com' },
      { name: 'X', href: 'https://x.com' },
      { name: 'YouTube', href: 'https://www.youtube.com' },
      { name: 'TikTok', href: 'https://www.tiktok.com' },
    ],
  },
}

export const storeName = 'Stride'
export const MAX_QUANTITY = 10
