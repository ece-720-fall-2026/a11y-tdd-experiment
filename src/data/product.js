// Mock data for the Trail Runner 2 product page.

export const store = {
  name: 'Stride',
  homeHref: '/',
  cartHref: '/cart',
}

export const product = {
  name: 'Trail Runner 2',
  price: 129.0,
  currency: 'USD',
  rating: 4.6,
  reviewCount: 128,
  maxQuantity: 10,
  breadcrumb: [
    { label: 'Shop', href: '/' },
    { label: 'Trail', href: '/shop/trail' },
  ],
  colors: [
    { id: 'blue', name: 'Blue', hex: '#1f5fa8' },
    { id: 'black', name: 'Black', hex: '#1e1f22' },
    { id: 'grey', name: 'Grey', hex: '#8c9199' },
  ],
  // Photos per color, shown one at a time in the gallery.
  views: [
    { id: 'side', label: 'side view' },
    { id: 'top', label: 'top view' },
    { id: 'sole', label: 'outsole view' },
  ],
  // US sizes in half steps. `soldOut` sizes are listed but cannot be chosen.
  sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13].map((us) => ({
    us,
    eu: us + 33,
    soldOut: [7.5, 9.5, 12.5].includes(us),
  })),
  // Size chart: whole US sizes with approximate foot length in cm.
  sizeChart: [7, 8, 9, 10, 11, 12, 13].map((us) => ({
    us,
    eu: us + 33,
    footCm: (24 + (us - 7) * 0.85).toFixed(1),
  })),
  description:
    'Trail Runner 2 is built for steep climbs, loose gravel and long days on the trail. ' +
    'A grippy outsole, a supportive midsole and a breathable mesh upper keep you planted and comfortable from the first mile to the last.',
  features: [
    'Lugged rubber outsole with 4 mm lugs for wet and dry ground',
    'Responsive foam midsole with a rock plate',
    'Breathable engineered mesh upper with reinforced toe cap',
    'Gusseted tongue and secure lace lock',
    'Drop: 8 mm. Weight: 280 g (US 9)',
  ],
  reviews: [
    { id: 1, author: 'Maya R.', rating: 5, date: '2026-09-12', text: 'Grip on wet rock is excellent. My feet stayed dry through a creek crossing and the fit is roomy in the toe box.' },
    { id: 2, author: 'Tomás L.', rating: 4, date: '2026-08-30', text: 'Comfortable right out of the box. The laces could be a little longer, but the lock keeps them in place.' },
    { id: 3, author: 'Priya K.', rating: 5, date: '2026-08-02', text: 'Used these on a 30 km ultra. No hot spots and the rock plate gave me confidence on descents.' },
  ],
  shipping: [
    'Free standard shipping on orders over $75 within the US.',
    'Standard delivery takes 3 to 5 business days. Express delivery takes 1 to 2 business days.',
    'Returns are accepted within 30 days of delivery for unworn shoes in their original box.',
  ],
  faqs: [
    {
      id: 'waterproof',
      question: 'Is Trail Runner 2 waterproof?',
      answer: 'The upper is water-resistant and sheds light rain and splashes. It is not waterproof, so it will let water in when you cross deep streams.',
    },
    {
      id: 'fit',
      question: 'Does it run true to size?',
      answer: 'Yes. Most runners find their usual size fits well. If you are between sizes, or want more room for thick socks, size up half a size.',
    },
    {
      id: 'wear',
      question: 'How long do the outsoles last?',
      answer: 'On mixed trail terrain, most runners get 600 to 800 km before the lugs wear down. Tread wear depends on terrain and running style.',
    },
    {
      id: 'care',
      question: 'How do I clean them?',
      answer: 'Remove the insoles and laces, brush off mud when it is dry, and hand wash the upper with lukewarm water and mild soap. Air dry them away from direct heat.',
    },
  ],
}

export const footer = {
  customerHelp: [
    { label: 'Help center', href: '/help' },
    { label: 'Returns', href: '/returns' },
    { label: 'Order status', href: '/orders' },
    { label: 'Warranty', href: '/warranty' },
    { label: 'Accessibility statement', href: '/accessibility' },
  ],
  company: [
    { label: 'About us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Store locations', href: '/stores' },
    { label: 'Press', href: '/press' },
  ],
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/stridefootwear' },
    { label: 'YouTube', href: 'https://www.youtube.com/@stridefootwear' },
    { label: 'Facebook', href: 'https://www.facebook.com/stridefootwear' },
    { label: 'X (Twitter)', href: 'https://x.com/stridefootwear' },
  ],
  phone: { label: 'Customer care: 1-800-555-0199', href: 'tel:+18005550199' },
}
