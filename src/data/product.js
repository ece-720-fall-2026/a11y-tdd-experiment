// Mock data for the Trail Runner 2 product page.

export const product = {
  name: 'Trail Runner 2',
  price: 129,
  description:
    'A lightweight trail runner with a grippy outsole and a breathable, water-resistant upper that keeps you moving on rocky, muddy and fast descents.',
  cartCount: 2,
  breadcrumb: [
    { label: 'Shop', href: '/' },
    { label: 'Trail', href: '/shop/trail' },
  ],
  colors: [
    { id: 'blue', name: 'Blue', hex: '#2456a6' },
    { id: 'black', name: 'Black', hex: '#1d1d1f' },
    { id: 'grey', name: 'Grey', hex: '#7d8084' },
  ],
  sizes: [
    { us: '7', soldOut: false },
    { us: '7.5', soldOut: true },
    { us: '8', soldOut: false },
    { us: '8.5', soldOut: false },
    { us: '9', soldOut: false },
    { us: '9.5', soldOut: false },
    { us: '10', soldOut: false },
    { us: '10.5', soldOut: true },
    { us: '11', soldOut: false },
    { us: '11.5', soldOut: false },
    { us: '12', soldOut: false },
  ],
  // Foot length (cm) to size, used by the size guide.
  sizeChart: [
    { cm: 24.0, us: '6', eu: '38' },
    { cm: 24.5, us: '6.5', eu: '38.5' },
    { cm: 25.0, us: '7', eu: '39.5' },
    { cm: 25.5, us: '7.5', eu: '40' },
    { cm: 26.0, us: '8', eu: '41' },
    { cm: 26.5, us: '8.5', eu: '41.5' },
    { cm: 27.0, us: '9', eu: '42.5' },
    { cm: 27.5, us: '9.5', eu: '43' },
    { cm: 28.0, us: '10', eu: '44' },
    { cm: 28.5, us: '10.5', eu: '44.5' },
    { cm: 29.0, us: '11', eu: '45.5' },
    { cm: 29.5, us: '11.5', eu: '46' },
    { cm: 30.0, us: '12', eu: '47' },
  ],
  photos: [
    { view: 'side', label: 'side view' },
    { view: 'three-quarter', label: 'three-quarter view' },
    { view: 'top', label: 'top view' },
    { view: 'outsole', label: 'outsole' },
  ],
  tabs: {
    details: [
      'Engineered mesh upper with reinforced toe cap.',
      '6 mm lugs for traction on wet and loose ground.',
      'Removable insole and a cushioned midsole.',
      'Weight: 285 g (US 9).',
    ],
    reviews: [
      { author: 'Maya R.', rating: 5, text: 'Grip is excellent on wet rock and the fit is roomy in the toes.' },
      { author: 'Tom K.', rating: 4, text: 'Comfortable out of the box. Laces could be a little longer.' },
    ],
    reviewSummary: 'Rated 4.6 out of 5 from 128 reviews.',
    shipping: [
      'Free standard shipping on orders over $100.',
      'Orders placed before 2 pm ship the same business day.',
      'Returns are accepted within 30 days, unworn and in the original box.',
    ],
  },
  faqs: [
    {
      question: 'Is Trail Runner 2 true to size?',
      answer: 'Most runners find it true to size. If you fall between sizes, we recommend the larger one.',
    },
    {
      question: 'Is the upper waterproof?',
      answer: 'It is water-resistant: it sheds light rain and splashes, but it is not built for submersion.',
    },
    {
      question: 'How long does the outsole last?',
      answer: 'With regular trail use, the outsole typically lasts 600 to 800 km before the lugs wear down.',
    },
    {
      question: 'Can I return the shoes if they do not fit?',
      answer: 'Yes. Returns are free within 30 days as long as the shoes are unworn and in the original box.',
    },
  ],
}

export const footer = {
  customerHelp: [
    { label: 'Help center', href: '/help' },
    { label: 'Returns', href: '/returns' },
    { label: 'Order status', href: '/orders' },
    { label: 'Size guide', href: '/size-guide' },
  ],
  company: [
    { label: 'About us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'X', href: 'https://x.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
}
