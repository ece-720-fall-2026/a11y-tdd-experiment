// Mock data for the Trail Runner 2 product page.

export const store = {
  name: 'Stride',
  homeHref: '/',
}

export const product = {
  name: 'Trail Runner 2',
  price: 160,
  currency: 'USD',
  description:
    'Built for technical trails. A grippy outsole, a rock plate under the forefoot and a breathable mesh upper keep you planted and comfortable on long days out.',
  colors: [
    { id: 'blue', name: 'Blue', hex: '#1f4e9c' },
    { id: 'black', name: 'Black', hex: '#141414' },
    { id: 'grey', name: 'Grey', hex: '#8a8d91' },
  ],
  photos: ['Side view', 'Inner side', 'Top view', 'Outsole'],
  // Half sizes from US 7 to US 12. footCm is the foot length the size fits.
  sizes: [
    { us: 7, eu: 40, footCm: 25.0 },
    { us: 7.5, eu: 40.5, footCm: 25.5 },
    { us: 8, eu: 41, footCm: 26.0 },
    { us: 8.5, eu: 41.5, footCm: 26.5, soldOut: true },
    { us: 9, eu: 42, footCm: 27.0 },
    { us: 9.5, eu: 42.5, footCm: 27.5 },
    { us: 10, eu: 43, footCm: 28.0 },
    { us: 10.5, eu: 43.5, footCm: 28.5, soldOut: true },
    { us: 11, eu: 44, footCm: 29.0 },
    { us: 11.5, eu: 44.5, footCm: 29.5 },
    { us: 12, eu: 45, footCm: 30.0 },
  ],
  maxQuantity: 10,
  questions: [
    {
      q: 'Is the Trail Runner 2 waterproof?',
      a: 'It is water-resistant, so it handles wet grass and shallow puddles. It is not waterproof, so it will not keep out deep water.',
    },
    {
      q: 'How should I size it?',
      a: 'Most people wear their usual size. If you are between sizes, or have a wide foot, use the size guide next to the size picker or go up half a size.',
    },
    {
      q: 'How long do the shoes last?',
      a: 'Expect roughly 500 to 800 kilometres on mixed trails, depending on terrain and how often you run in them.',
    },
    {
      q: 'Can I return the shoes if they do not fit?',
      a: 'Yes. Unworn shoes in their original box can be returned within 30 days of delivery for a full refund.',
    },
  ],
  details: [
    'Upper: engineered mesh with reinforced toe cap',
    'Midsole: responsive foam with 6 mm drop',
    'Outsole: 4 mm multidirectional lugs for grip on wet and dry ground',
    'Rock plate under the forefoot for protection on sharp terrain',
    'Weight: about 265 g (US 9)',
  ],
  reviews: {
    average: 4.6,
    count: 128,
    items: [
      { author: 'Maya R.', rating: 5, text: 'Grip on wet roots is excellent. Comfortable straight out of the box.' },
      { author: 'Tom K.', rating: 4, text: 'Fits true to size. A little firm for the first few runs, then it softened up.' },
    ],
  },
  shipping: [
    'Free standard shipping on orders over $75.',
    'Standard delivery takes 3 to 5 business days.',
    'Express delivery takes 1 to 2 business days for an extra fee.',
    'Free returns within 30 days of delivery.',
  ],
  path: [
    { label: 'Shop', href: '/' },
    { label: 'Trail', href: '/' },
    { label: 'Trail Runner 2' },
  ],
}

export const footer = {
  customerHelp: { phone: '1-800-555-0142', hours: 'Mon to Fri, 8am to 6pm' },
  helpLinks: ['Help center', 'Returns', 'Order status', 'Shoe care'],
  companyLinks: ['About us', 'Careers', 'Press', 'Sustainability'],
  social: [
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'Facebook', href: 'https://facebook.com' },
    { name: 'YouTube', href: 'https://youtube.com' },
    { name: 'X (Twitter)', href: 'https://x.com' },
  ],
}
