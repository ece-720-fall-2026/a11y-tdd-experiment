// Mock data for the Trail Runner 2 product page.

export const store = {
  name: 'Stride',
  cartCount: 2,
}

export const product = {
  name: 'Trail Runner 2',
  description:
    'A grippy, lightweight trail shoe for steep climbs, technical descents and long days out.',
  price: 129,
  currency: 'USD',
  breadcrumb: [
    { label: 'Shop', href: '/' },
    { label: 'Trail', href: '/shop/trail' },
  ],
  colors: [
    { id: 'blue', label: 'Blue', hex: '#2357a8' },
    { id: 'black', label: 'Black', hex: '#1f1f22' },
    { id: 'grey', label: 'Grey', hex: '#8b9099' },
  ],
  // US sizes shown in the size list. Sold-out sizes cannot be picked.
  sizes: [6, 7, 8, 9, 10, 11, 12].map((us) => ({ us, soldOut: us === 7 || us === 11 })),
  // Size chart: foot length range in cm for each US/EU size.
  sizeChart: [
    { us: 6, eu: 39, minCm: 23.5, maxCm: 24.0 },
    { us: 7, eu: 40, minCm: 24.1, maxCm: 24.7 },
    { us: 8, eu: 41, minCm: 24.8, maxCm: 25.3 },
    { us: 9, eu: 42, minCm: 25.4, maxCm: 25.9 },
    { us: 10, eu: 43, minCm: 26.0, maxCm: 26.6 },
    { us: 11, eu: 44, minCm: 26.7, maxCm: 27.2 },
    { us: 12, eu: 45, minCm: 27.3, maxCm: 28.0 },
  ],
  maxQuantity: 10,
  faqs: [
    {
      question: 'Is Trail Runner 2 waterproof?',
      answer:
        'It is water-resistant rather than waterproof. The mesh handles light rain and wet grass, but deep puddles will soak through.',
    },
    {
      question: 'Does it run true to size?',
      answer:
        'Most runners find it true to size. If you are between sizes, go up half a size. Use the size guide next to the size selector to check.',
    },
    {
      question: 'How long does a pair last?',
      answer:
        'On mixed trail terrain you can expect roughly 500 to 700 km, depending on your running style, weight and conditions.',
    },
  ],
  details: [
    'Upper: recycled ripstop mesh with TPU overlays for durability',
    'Midsole: 8 mm drop with a responsive foam for cushioning',
    'Outsole: 4 mm multi-directional lugs for grip on wet and dry trails',
    'Weight: 285 g for a US men’s size 9',
  ],
  reviews: {
    average: 4.5,
    count: 128,
    items: [
      {
        author: 'Maya R.',
        rating: 5,
        text: 'Grip on wet roots is excellent and the fit is secure on fast descents.',
      },
      {
        author: 'Tom K.',
        rating: 4,
        text: 'Comfortable out of the box. The toe box could be a little roomier.',
      },
    ],
  },
  shipping: [
    'Free standard shipping on orders over $100.',
    'Standard delivery in 3 to 5 working days.',
    'Free returns within 30 days if the shoes are unworn.',
  ],
}

export const footer = {
  customerHelp: [
    { label: 'Help centre', href: '/help' },
    { label: 'Contact us', href: '/contact' },
    { label: 'Returns', href: '/returns' },
    { label: 'Order status', href: '/orders' },
    { label: 'Accessibility statement', href: '/accessibility' },
  ],
  company: [
    { label: 'About Stride', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Sustainability', href: '/sustainability' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'X', href: 'https://x.com' },
  ],
}
