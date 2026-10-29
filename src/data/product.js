// Mock data for Trail Runner 2. Replace with a real API later.

export const product = {
  name: 'Trail Runner 2',
  brand: 'Stride',
  price: 140,
  priceText: '$140.00',
  rating: 4.6,
  reviewCount: 128,
  summary:
    'Our grippiest trail shoe yet. A sticky outsole and a stable, low-drop platform keep you planted on steep descents and long days off-road.',
  colors: [
    { id: 'blue', name: 'Blue', hex: '#1d4ed8' },
    { id: 'black', name: 'Black', hex: '#171717' },
    { id: 'grey', name: 'Grey', hex: '#8a8f98' },
  ],
  // US sizes. Sold-out sizes cannot be selected.
  sizes: [
    { us: '7', soldOut: false },
    { us: '7.5', soldOut: false },
    { us: '8', soldOut: false },
    { us: '8.5', soldOut: false },
    { us: '9', soldOut: false },
    { us: '9.5', soldOut: true },
    { us: '10', soldOut: false },
    { us: '10.5', soldOut: false },
    { us: '11', soldOut: false },
    { us: '11.5', soldOut: false },
    { us: '12', soldOut: true },
    { us: '13', soldOut: false },
  ],
  // Foot length in cm (upper bound of each row) mapped to US and EU sizes.
  sizeChart: [
    { maxCm: 23.0, us: '5', eu: '36' },
    { maxCm: 23.5, us: '5.5', eu: '37' },
    { maxCm: 24.0, us: '6', eu: '38' },
    { maxCm: 24.5, us: '6.5', eu: '39' },
    { maxCm: 25.0, us: '7', eu: '40' },
    { maxCm: 25.5, us: '7.5', eu: '41' },
    { maxCm: 26.0, us: '8', eu: '42' },
    { maxCm: 26.5, us: '8.5', eu: '43' },
    { maxCm: 27.0, us: '9', eu: '44' },
    { maxCm: 27.5, us: '9.5', eu: '45' },
    { maxCm: 28.0, us: '10', eu: '46' },
  ],
  maxQuantity: 10,
  details: [
    ['Weight', '285 g (US men’s 9)'],
    ['Heel-to-toe drop', '6 mm'],
    ['Upper', 'Recycled ripstop mesh with a reinforced toe cap'],
    ['Outsole', 'Multi-directional lugs in high-grip rubber'],
    ['Cushioning', 'Responsive foam midsole'],
  ],
  reviews: [
    { author: 'Maya R.', rating: 5, text: 'Locked-in fit and the grip on wet roots is excellent.' },
    { author: 'Tom K.', rating: 4, text: 'Comfortable on long runs. Runs a touch narrow in the forefoot.' },
    { author: 'Ines G.', rating: 5, text: 'My go-to for steep, muddy climbs. Light for the protection it gives.' },
  ],
  shipping: [
    'Free standard shipping on orders over $100. Standard delivery takes 3 to 5 business days.',
    'Express delivery is available at checkout for next-day arrival in most areas.',
    'You can return unworn shoes within 30 days of delivery for a full refund.',
  ],
  faq: [
    {
      question: 'Does Trail Runner 2 run true to size?',
      answer: 'Yes, for most feet. If you are between sizes or have wide feet, we suggest going up half a size.',
    },
    {
      question: 'Is it suitable for wet and muddy trails?',
      answer: 'Yes. The lugs are spaced to shed mud, and the outsole rubber keeps its grip on wet rock and roots.',
    },
    {
      question: 'How long does the cushioning last?',
      answer: 'With regular trail use, the midsole keeps its responsiveness for roughly 500 to 700 kilometres.',
    },
    {
      question: 'Can I wear it for road running?',
      answer: 'You can, but it is designed for trails. On pavement the lugs feel firm and the shoe is heavier than a road shoe.',
    },
  ],
}

export const footerLinks = {
  help: [
    { label: 'Help Center', href: '/help' },
    { label: 'Returns', href: '/help/returns' },
    { label: 'Order status', href: '/help/order-status' },
    { label: 'Warranty', href: '/help/warranty' },
    { label: 'Accessibility statement', href: '/accessibility' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Store locations', href: '/stores' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'Facebook', href: 'https://facebook.com/' },
    { label: 'YouTube', href: 'https://youtube.com/' },
    { label: 'X (Twitter)', href: 'https://x.com/' },
  ],
}
