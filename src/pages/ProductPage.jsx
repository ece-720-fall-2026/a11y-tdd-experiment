import { useState } from 'react'

const product = {
  name: 'Trail Runner 2',
  price: 120,
  colors: [
    { id: 'blue', label: 'Deep Blue', hex: '#2f5d8c' },
    { id: 'black', label: 'Black', hex: '#22252a' },
    { id: 'grey', label: 'Storm Grey', hex: '#8a8f95' },
  ],
  sizes: [
    { us: 7, eu: 40, available: true },
    { us: 8, eu: 41, available: true },
    { us: 9, eu: 42, available: true },
    { us: 10, eu: 43, available: false },
    { us: 11, eu: 44, available: true },
    { us: 12, eu: 45, available: false },
  ],
}

function ShoeImage({ colorHex, angle }) {
  // Inline SVG "photo" of the shoe in the chosen color.
  return (
    <svg viewBox="0 0 400 220" role="img" aria-label="Trail Runner 2 shoe" style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect width="400" height="220" fill="#f2f3f5" />
      <ellipse cx="200" cy="185" rx="160" ry="16" fill="#dcdfe4" />
      <g transform={`rotate(${angle} 200 110)`}>
        <path
          d="M60 150 C60 120 80 110 120 105 C160 100 200 85 240 80 C290 74 330 90 345 115 C352 128 350 145 340 150 L70 155 C63 155 60 153 60 150 Z"
          fill={colorHex}
        />
        <path d="M60 150 L340 150 C345 158 340 168 330 168 L75 168 C65 168 58 160 60 150 Z" fill="#1a1c20" />
        <path d="M120 105 C160 100 200 85 240 80 L250 100 C210 105 170 118 130 122 Z" fill="#ffffff" opacity="0.15" />
        <path d="M250 92 L300 86 M258 104 L312 96 M266 116 L322 108" stroke="#ffffff" strokeWidth="3" opacity="0.5" fill="none" />
        <circle cx="352" cy="118" r="7" fill="#ffffff" opacity="0.3" />
      </g>
    </svg>
  )
}

function SizeGuide({ onClose }) {
  const [footLength, setFootLength] = useState('')
  const [unit, setUnit] = useState('us')
  const size = (() => {
    const cm = parseFloat(footLength)
    if (!cm || cm < 18 || cm > 33) return null
    // Rough mapping: 24 cm -> US 7, each 1 cm is roughly one size.
    const us = Math.min(15, Math.max(5, Math.round(cm - 17)))
    return { us, eu: us + 33 }
  })()
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Size guide" onClick={(e) => e.stopPropagation()}>
        <h3>Size guide</h3>
        <p>Enter your foot length in centimetres to find your size.</p>
        <label>
          Foot length (cm)
          <input
            type="number"
            min="18"
            max="33"
            step="0.5"
            value={footLength}
            onChange={(e) => setFootLength(e.target.value)}
          />
        </label>
        <div className="unit-toggle" role="radiogroup" aria-label="Size system">
          <button
            type="button"
            className={unit === 'us' ? 'active' : ''}
            onClick={() => setUnit('us')}
          >
            US
          </button>
          <button
            type="button"
            className={unit === 'eu' ? 'active' : ''}
            onClick={() => setUnit('eu')}
          >
            EU
          </button>
        </div>
        {footLength !== '' && (
          <p className="size-guide-result" aria-live="polite">
            {size
              ? `Your size is ${unit === 'us' ? `US ${size.us}` : `EU ${size.eu}`}.`
              : 'Please enter a foot length between 18 and 33 cm.'}
          </p>
        )}
        <button type="button" className="btn btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default function ProductPage() {
  const [color, setColor] = useState('blue')
  const [photoIndex, setPhotoIndex] = useState(0)
  const [size, setSize] = useState(null)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [cartMessage, setCartMessage] = useState('')
  const [tab, setTab] = useState('details')
  const [openQuestion, setOpenQuestion] = useState(null)

  const activeColor = product.colors.find((c) => c.id === color)
  const photos = [0, -8, 10]

  const addToCart = () => {
    if (!size) {
      setCartMessage('Please pick a size first.')
      return
    }
    setCartCount((n) => n + quantity)
    setCartMessage(
      `Added ${quantity} × Trail Runner 2 (${activeColor.label}, US ${size.us} / EU ${size.eu}) to your cart.`,
    )
  }

  return (
    <div className="product-page">
      <header className="store-header">
        <a className="store-name" href="/">Stride</a>
        <div className="cart" aria-label="Cart items">
          <span aria-hidden="true">🛒</span> Cart: {cartCount}
        </div>
      </header>

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Shop</a>
        <span aria-hidden="true">›</span>
        <a href="/">Trail</a>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Trail Runner 2</span>
      </nav>

      <main className="product-layout">
        <section className="gallery" aria-label="Product photos">
          <div className="photo-frame">
            <ShoeImage colorHex={activeColor.hex} angle={photos[photoIndex]} />
          </div>
          <div className="gallery-controls">
            <button type="button" onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)} aria-label="Previous photo">
              ‹
            </button>
            <span className="photo-count">{photoIndex + 1} / {photos.length}</span>
            <button type="button" onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)} aria-label="Next photo">
              ›
            </button>
          </div>
        </section>

        <section className="product-info">
          <h1>Trail Runner 2</h1>
          <p className="price">
            ${product.price.toFixed(2)}{' '}
            <span className="info-tip" tabIndex={0}>
              <span className="info-icon" aria-hidden="true">i</span>
              <span className="tooltip" role="tooltip">Price includes taxes.</span>
            </span>
          </p>

          <div className="option-group">
            <h2>Color: {activeColor.label}</h2>
            <div className="swatches" role="radiogroup" aria-label="Color">
              {product.colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={color === c.id}
                  aria-label={c.label}
                  className={`swatch ${color === c.id ? 'selected' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setColor(c.id)}
                />
              ))}
            </div>
          </div>

          <div className="option-group">
            <h2>
              Size{' '}
              {size ? `US ${size.us} / EU ${size.eu}` : 'not selected'}
            </h2>
            <div className="size-row">
              <div className="size-select">
                <button
                  type="button"
                  className="size-button"
                  aria-haspopup="listbox"
                  aria-expanded={sizeOpen}
                  onClick={() => setSizeOpen((o) => !o)}
                >
                  {size ? `US ${size.us} / EU ${size.eu}` : 'Choose a size'}
                </button>
                {sizeOpen && (
                  <ul className="size-list" role="listbox" aria-label="Available sizes">
                    {product.sizes.map((s) => (
                      <li key={s.us}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={size?.us === s.us}
                          disabled={!s.available}
                          onClick={() => {
                            setSize(s)
                            setSizeOpen(false)
                          }}
                        >
                          US {s.us} / EU {s.eu} {!s.available && '(sold out)'}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="button" className="link" onClick={() => setSizeGuideOpen(true)}>
                Size guide
              </button>
            </div>
          </div>

          <div className="option-group">
            <h2>Quantity</h2>
            <div className="quantity">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                aria-label="Quantity"
              />
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          <div className="buy-row">
            <button type="button" className="btn btn-primary" onClick={addToCart}>
              Add to bag
            </button>
            <button
              type="button"
              className="btn btn-wishlist"
              aria-pressed={wishlist}
              onClick={() => setWishlist((w) => !w)}
            >
              {wishlist ? '♥' : '♡'} {wishlist ? 'Saved' : 'Save'}
            </button>
          </div>
          {cartMessage && (
            <p className={`cart-message ${size ? 'success' : 'error'}`} role="status">
              {cartMessage}
            </p>
          )}
        </section>
      </main>

      <section className="info-tabs">
        <div className="tab-buttons" role="tablist" aria-label="More information">
          {[
            ['details', 'Details'],
            ['reviews', 'Reviews'],
            ['shipping', 'Shipping'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={tab === id ? 'active' : ''}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="tab-panel" role="tabpanel">
          {tab === 'details' && (
            <ul>
              <li>Fabric-free fit: engineered knit upper that breathes on long climbs.</li>
              <li>All-terrain outsole with 4 mm lugs for wet rock and loose gravel.</li>
              <li>Rock plate underfoot and 1200 g tear-strength ripstop overlays.</li>
              <li>Weighs 300 g in a US 9.</li>
            </ul>
          )}
          {tab === 'reviews' && (
            <ul>
              <li>★★★★★ “Grippy and light — the best trail shoe I’ve owned.” — Maya R.</li>
              <li>★★★★☆ “Great on scree, a touch narrow in the toe box.” — Jonas P.</li>
              <li>★★★★★ “Held up through a 50 km ultra with no blisters.” — Sam K.</li>
            </ul>
          )}
          {tab === 'shipping' && (
            <ul>
              <li>Free standard shipping on orders over $75.</li>
              <li>Express shipping: 2–3 business days.</li>
              <li>Free returns within 30 days, worn on trails or not.</li>
            </ul>
          )}
        </div>
      </section>

      <section className="faq">
        <h2>Questions</h2>
        {[
          ['Do these run true to size?', 'Yes — most runners stick with their usual street-shoe size. If you wear thick trail socks, consider going up half a size.'],
          ['Are they waterproof?', 'They are water-resistant, not waterproof. They shed light rain and stream splashes but will soak through in sustained downpours.'],
          ['Can I use them on road runs?', 'You can, but the lugs are designed for dirt. For mostly-road training, our Road Runner line will feel smoother.'],
        ].map(([q, a], i) => (
          <div className="faq-item" key={q}>
            <button
              type="button"
              className="faq-question"
              aria-expanded={openQuestion === i}
              onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
            >
              {q}
            </button>
            {openQuestion === i && <p className="faq-answer">{a}</p>}
          </div>
        ))}
      </section>

      <footer className="page-footer">
        <div>
          <h3>Customer help</h3>
          <ul>
            <li><a href="/">Contact us</a></li>
            <li><a href="/">Shipping &amp; returns</a></li>
            <li><a href="/">Size guide</a></li>
          </ul>
        </div>
        <div>
          <h3>Company</h3>
          <ul>
            <li><a href="/">About Stride</a></li>
            <li><a href="/">Careers</a></li>
            <li><a href="/">Sustainability</a></li>
          </ul>
        </div>
        <div>
          <h3>Social</h3>
          <ul className="social">
            <li><a href="/">Instagram</a></li>
            <li><a href="/">Facebook</a></li>
            <li><a href="/">X</a></li>
          </ul>
        </div>
      </footer>

      {sizeGuideOpen && <SizeGuide onClose={() => setSizeGuideOpen(false)} />}
    </div>
  )
}
