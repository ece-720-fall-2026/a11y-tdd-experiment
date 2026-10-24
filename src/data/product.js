// Mock data for the Trail Runner 2 product page.

export const store = {
  name: 'Stride',
  homeHref: '/',
};

export const product = {
  name: 'Trail Runner 2',
  tagline: 'Lightweight trail running shoe with a grippy outsole and a cushioned, breathable upper.',
  price: 129.0,
  currency: 'USD',
  priceNote: 'Price includes taxes.',
  rating: { average: 4.7, count: 3 },
  // Shown as the path from the store root to this product.
  breadcrumb: [
    { label: 'Shop', href: '/' },
    { label: 'Trail', href: '/shop/trail' },
    { label: 'Trail Runner 2' },
  ],
  colors: [
    { id: 'blue', label: 'Blue', hex: '#1f5fa8' },
    { id: 'black', label: 'Black', hex: '#1d1f23' },
    { id: 'grey', label: 'Grey', hex: '#8b9199' },
  ],
  // Photos per color. Each color has the same three views.
  photos: {
    blue: [
      { src: '/images/trail-runner-2-blue-1.svg', alt: 'Trail Runner 2 in blue, side view' },
      { src: '/images/trail-runner-2-blue-2.svg', alt: 'Trail Runner 2 in blue, inner side view' },
      { src: '/images/trail-runner-2-blue-3.svg', alt: 'Trail Runner 2 in blue, three-quarter view' },
    ],
    black: [
      { src: '/images/trail-runner-2-black-1.svg', alt: 'Trail Runner 2 in black, side view' },
      { src: '/images/trail-runner-2-black-2.svg', alt: 'Trail Runner 2 in black, inner side view' },
      { src: '/images/trail-runner-2-black-3.svg', alt: 'Trail Runner 2 in black, three-quarter view' },
    ],
    grey: [
      { src: '/images/trail-runner-2-grey-1.svg', alt: 'Trail Runner 2 in grey, side view' },
      { src: '/images/trail-runner-2-grey-2.svg', alt: 'Trail Runner 2 in grey, inner side view' },
      { src: '/images/trail-runner-2-grey-3.svg', alt: 'Trail Runner 2 in grey, three-quarter view' },
    ],
  },
  // Men's US sizes with EU equivalents and the foot length (cm) each one fits.
  sizes: [
    { us: 7, eu: 40, cm: 25.0, soldOut: true },
    { us: 8, eu: 41, cm: 25.7, soldOut: false },
    { us: 9, eu: 42, cm: 26.4, soldOut: false },
    { us: 10, eu: 43, cm: 27.1, soldOut: false },
    { us: 11, eu: 44, cm: 27.8, soldOut: false },
    { us: 12, eu: 45, cm: 28.5, soldOut: true },
    { us: 13, eu: 46, cm: 29.2, soldOut: false },
  ],
  faqs: [
    {
      id: 'waterproof',
      question: 'Is Trail Runner 2 waterproof?',
      answer:
        'The upper is water-resistant and sheds light rain and wet grass. It is not waterproof, so it will let water in when you run through deep puddles or streams.',
    },
    {
      id: 'drop',
      question: 'What is the heel-to-toe drop?',
      answer:
        'The heel-to-toe drop is 8 mm, which is the difference in height between the heel and the forefoot.',
    },
    {
      id: 'width',
      question: 'Does it come in wide sizes?',
      answer:
        'Trail Runner 2 is sold in regular width only. If your feet are wider than usual, try the next size up and check the fit with a lace-up around the midfoot.',
    },
    {
      id: 'returns',
      question: 'Can I return or exchange my shoes?',
      answer:
        'Yes. Unworn shoes in their original box can be returned or exchanged within 30 days of delivery.',
    },
  ],
  details: [
    'Outsole with multi-directional lugs for grip on mud, rock and loose gravel.',
    'Engineered mesh upper that breathes well and drains quickly.',
    'Cushioned midsole foam that stays responsive over long distances.',
    'Protective toe cap and a padded heel collar for a secure feel.',
    'Weight: 280 g for a size US 9.',
  ],
  reviews: [
    {
      id: 'r1',
      author: 'Maya R.',
      rating: 5,
      date: '2026-08-14',
      text: 'Great grip on wet roots and the fit is roomy in the toe box. My new favourite for long weekend runs.',
    },
    {
      id: 'r2',
      author: 'Tom K.',
      rating: 4,
      date: '2026-09-02',
      text: 'Comfortable straight out of the box. The laces could be a little longer for a double knot.',
    },
    {
      id: 'r3',
      author: 'Priya S.',
      rating: 4,
      date: '2026-09-21',
      text: 'Stable on steep descents and the cushioning holds up after 60 km. Runs about half a size small.',
    },
  ],
  shipping: [
    'Free standard shipping on orders over $75. Standard delivery takes 3 to 5 business days.',
    'Express delivery is available at checkout for next-business-day arrival.',
    'Returns are free within 30 days of delivery. Start a return from your order history.',
  ],
};

// Foot length to size lookup used by the size guide.
export const sizeChart = product.sizes;

export const footer = {
  customerHelp: [
    { label: 'Help Center', href: '/help' },
    { label: 'Returns', href: '/help/returns' },
    { label: 'Order status', href: '/help/order-status' },
    { label: 'Warranty', href: '/help/warranty' },
    { label: 'Product care', href: '/help/product-care' },
    { label: 'Accessibility statement', href: '/accessibility' },
  ],
  customerCare: { label: 'Customer care: (800) 555-0142', href: 'tel:+18005550142' },
  company: [
    { label: 'About us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Store locations', href: '/stores' },
  ],
  social: [
    { label: 'Stride on Instagram', href: 'https://instagram.com/stride' },
    { label: 'Stride on Facebook', href: 'https://facebook.com/stride' },
    { label: 'Stride on YouTube', href: 'https://youtube.com/stride' },
    { label: 'Stride on X', href: 'https://x.com/stride' },
  ],
  copyright: '© 2026 Stride. All rights reserved.',
};

export function formatPrice(amount, currency) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
