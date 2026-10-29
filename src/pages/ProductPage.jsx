import { useState } from 'react'
import './ProductPage.css'

const COLORS = [
  { id: 'blue', label: 'Blue', hex: '#3b6ea5' },
  { id: 'black', label: 'Black', hex: '#23272b' },
  { id: 'grey', label: 'Grey', hex: '#8a8d91' },
]

const SIZES = [
  { value: '7', soldOut: false },
  { value: '8', soldOut: true },
  { value: '9', soldOut: false },
  { value: '10', soldOut: false },
  { value: '11', soldOut: true },
  { value: '12', soldOut: false },
]

function photoSrc(color, index) {
  const hex = COLORS.find((c) => c.id === color).hex
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <rect width="600" height="450" fill="#f2f2f0"/>
    <ellipse cx="300" cy="270" rx="220" ry="90" fill="${hex}"/>
    <ellipse cx="300" cy="345" rx="235" ry="28" fill="#1c1c1c" opacity="0.15"/>
    <path d="M160 250 q60 -70 150 -80 q90 -10 140 30 l40 40 q20 20 -10 30 l-280 20 q-50 0 -40 -40 z" fill="${hex}" stroke="#00000022" stroke-width="6"/>
    <path d="M180 320 h260" stroke="#ffffff55" stroke-width="10" stroke-linecap="round"/>
    <text x="300" y="70" font-family="sans-serif" font-size="40" fill="#555" text-anchor="middle">Trail Runner 2 — photo ${index + 1}</text>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function RecommendedSize({ length, unit }) {
  const cm = Number(length)
  if (!cm || cm < 15 || cm > 35) return null
  if (unit === 'eu') return <p className="size-guide-result">Your size is EU {Math.round((cm + 1.5) * 1.5)}</p>
  return <p className="size-guide-result">Your size is US {Math.round((cm + 1.5) * 1.5 - 33)}</p>
}

const QUESTIONS = [
  {
    q: 'Is the Trail Runner 2 waterproof?',
    a: 'The upper is water-resistant, so light rain and damp trails are no problem, but it is not fully waterproof.',
  },
  {
    q: 'How does it fit?',
    a: 'It runs true to size with a roomy toe box. If you are between sizes, we recommend going half a size up.',
  },
  {
    q: 'Can I use it on roads as well as trails?',
    a: 'Yes. The midsole cushioning works well on pavement, while the outsole lugs grip dirt and gravel.',
  },
  {
    q: 'How do I clean it?',
    a: 'Brush off dirt, then hand wash with mild soap and lukewarm water. Let it air dry away from direct heat.',
  },
]

export default function ProductPage() {
  const [cartCount, setCartCount] = useState(0)
  const [cartMessage, setCartMessage] = useState(null)
  const [sizeError, setSizeError] = useState(false)
  const [color, setColor] = useState('blue')
  const [photoIndex, setPhotoIndex] = useState(0)
  const [showTaxInfo, setShowTaxInfo] = useState(false)
  const [size, setSize] = useState('')
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [footLength, setFootLength] = useState('')
  const [guideUnit, setGuideUnit] = useState('us')
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [openQuestion, setOpenQuestion] = useState(null)

  const photosOfColor = 3
  const alt = `Trail Runner 2 in ${COLORS.find((c) => c.id === color).label.toLowerCase()}`

  function nextPhoto() {
    setPhotoIndex((i) => (i + 1) % photosOfColor)
  }

  function previousPhoto() {
    setPhotoIndex((i) => (i - 1 + photosOfColor) % photosOfColor)
  }

  function addToCart() {
    if (!size) {
      setSizeError(true)
      setCartMessage(null)
      return
    }
    setSizeError(false)
    setCartCount((c) => c + quantity)
    setCartMessage(`Added to cart: ${quantity} × Trail Runner 2 (${color}, size ${size})`)
  }

  return (
    <div className="page">
      <header className="header" role="banner">
        <a className="store-name" href="/">
          Stride
        </a>
        <p className="cart-summary">
          Cart: <span id="cart-count">{cartCount} item{cartCount === 1 ? '' : 's'}</span>
        </p>
      </header>

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Shop</a></li>
          <li><a href="/trail">Trail</a></li>
          <li aria-current="page">Trail Runner 2</li>
        </ol>
      </nav>

      <main className="product">
        <section className="gallery">
          <button className="gallery-nav" aria-label="Previous photo" onClick={previousPhoto}>‹</button>
          <img
            className="product-photo"
            src={photoSrc(color, photoIndex)}
            alt={alt}
            width="600"
            height="450"
          />
          <button className="gallery-nav" aria-label="Next photo" onClick={nextPhoto}>›</button>
        </section>

        <section className="details">
          <h1>Trail Runner 2</h1>
          <p className="tagline">Shoes for every trail.</p>

          <p className="price">
            $120.00 CAD
            <button
              type="button"
              className="price-info"
              aria-label="Price information"
              onMouseEnter={() => setShowTaxInfo(true)}
              onMouseLeave={() => setShowTaxInfo(false)}
              onFocus={() => setShowTaxInfo(true)}
              onBlur={() => setShowTaxInfo(false)}
            >
              i
            </button>
            {showTaxInfo && (
              <span className="price-info-tip" role="tooltip">
                The price includes all taxes.
              </span>
            )}
          </p>

          <fieldset className="colors">
            <legend>Color</legend>
            <div role="radiogroup" aria-label="Color">
              {COLORS.map((c) => (
                <label key={c.id} className="color-option">
                  <input
                    type="radio"
                    name="color"
                    value={c.id}
                    checked={color === c.id}
                    onChange={() => {
                      setColor(c.id)
                      setPhotoIndex(0)
                    }}
                  />
                  <span className="swatch" style={{ background: c.hex }} />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="size-row">
            <label htmlFor="size">Size</label>
            <select
              id="size"
              className="size-select"
              value={size}
              onChange={(e) => {
                setSize(e.target.value)
                if (e.target.value) setSizeError(false)
              }}
            >
              <option value="">Select size</option>
              {SIZES.map((s) => (
                <option key={s.value} value={s.value} disabled={s.soldOut}>
                  {s.value}{s.soldOut ? ' (sold out)' : ''}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="size-guide-button"
              onClick={() => setSizeGuideOpen(true)}
            >
              Size guide
            </button>
          </div>
          {sizeError && (
            <p className="size-error" role="alert">
              Please pick a size before adding to cart.
            </p>
          )}

          <div className="quantity-row">
            <span id="quantity-label">Quantity</span>
            <div className="quantity-control" role="group" aria-labelledby="quantity-label">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <input
                type="number"
                min="1"
                max="9"
                value={quantity}
                aria-label="Quantity"
                onChange={(e) => {
                  const v = Number(e.target.value)
                  setQuantity(Number.isNaN(v) || v < 1 ? 1 : v)
                }}
              />
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((q) => Math.min(9, q + 1))}>+</button>
            </div>
          </div>

          <div className="actions">
            <button type="button" className="add-to-cart" onClick={addToCart}>
              Add to cart
            </button>
            <button
              type="button"
              className="wishlist"
              aria-pressed={wishlist}
              aria-label="Save to wishlist"
              onClick={() => setWishlist((w) => !w)}
            >
              {wishlist ? '♥' : '♡'} Wishlist
            </button>
          </div>
          {cartMessage && (
            <p className="cart-message" role="status">
              {cartMessage}
            </p>
          )}
        </section>
      </main>

      {sizeGuideOpen && (
        <div className="overlay">
          <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
            <h2 id="size-guide-title">Size guide</h2>
            <p>Enter your foot length to find your Trail Runner 2 size.</p>
            <div className="guide-controls">
              <label htmlFor="foot-length">Foot length (cm)</label>
              <input
                id="foot-length"
                type="number"
                step="0.5"
                min="15"
                max="35"
                value={footLength}
                onChange={(e) => setFootLength(e.target.value)}
              />
              <fieldset>
                <legend>Unit</legend>
                <label>
                  <input
                    type="radio"
                    name="guide-unit"
                    checked={guideUnit === 'us'}
                    onChange={() => setGuideUnit('us')}
                  />
                  US
                </label>
                <label>
                  <input
                    type="radio"
                    name="guide-unit"
                    value="eu"
                    checked={guideUnit === 'eu'}
                    onChange={() => setGuideUnit('eu')}
                  />
                  EU
                </label>
              </fieldset>
            </div>
            <RecommendedSize length={footLength} unit={guideUnit} />
            <button type="button" className="close-dialog" onClick={() => setSizeGuideOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <section className="info-tabs">
        <div className="tablist" role="tablist" aria-label="Product information">
          {['details', 'reviews', 'shipping'].map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              onClick={() => setActiveTab(id)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>
        {activeTab === 'details' && (
          <div role="tabpanel" id="panel-details" aria-labelledby="tab-details">
            <ul>
              <li>Water-resistant mesh upper with reinforced toe cap</li>
              <li>Cushioned midsole for all-day comfort on any terrain</li>
              <li>Grippy rubber outsole with 4 mm lugs for mud and gravel</li>
              <li>Weighs 300 g per shoe (US 9)</li>
            </ul>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews">
            <blockquote>“Best trail shoe I have owned — comfortable right out of the box.” — Dana R. ★★★★★</blockquote>
            <blockquote>“Great grip on wet rocks. The toe box is roomy.” — Sam K. ★★★★☆</blockquote>
          </div>
        )}
        {activeTab === 'shipping' && (
          <div role="tabpanel" id="panel-shipping" aria-labelledby="tab-shipping">
            <p>Free shipping on orders over $75. Orders ship within 1–2 business days.</p>
            <p>Returns are free within 30 days, as long as the shoes are unworn outdoors.</p>
          </div>
        )}
      </section>

      <section className="questions" aria-label="Questions">
        <h2>Questions</h2>
        {QUESTIONS.map((item, i) => (
          <div className="question" key={item.q}>
            <button
              type="button"
              aria-expanded={openQuestion === i}
              onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
            >
              {item.q}
            </button>
            {openQuestion === i && <p className="answer">{item.a}</p>}
          </div>
        ))}
      </section>

      <footer className="footer" role="contentinfo">
        <div>
          <h3>Customer help</h3>
          <ul>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Shipping &amp; returns</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h3>Company</h3>
          <ul>
            <li><a href="#">About Stride</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Sustainability</a></li>
          </ul>
        </div>
        <div>
          <h3>Follow us</h3>
          <ul className="social">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">YouTube</a></li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
