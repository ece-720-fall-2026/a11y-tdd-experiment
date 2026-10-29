import { useEffect, useRef, useState } from 'react'
import Shoe from './Shoe.jsx'
import './ProductPage.css'

const COLORS = [
  { id: 'blue', name: 'Blue', hex: '#2b5d9e' },
  { id: 'black', name: 'Black', hex: '#26262a' },
  { id: 'grey', name: 'Grey', hex: '#8b8b88' },
]

const SIZES = [
  { us: '7', eu: '40', inStock: true },
  { us: '8', eu: '41', inStock: true },
  { us: '9', eu: '42', inStock: false },
  { us: '10', eu: '43', inStock: true },
  { us: '11', eu: '44', inStock: true },
  { us: '12', eu: '45', inStock: false },
]

const QUESTIONS = [
  { q: 'Is the Trail Runner 2 waterproof?', a: 'The upper is water-repellent and dries fast, but it is not fully waterproof. For deep puddles, look at our Storm Shell line.' },
  { q: 'How does it fit?', a: 'It runs true to size with a roomy toe box. If you are between sizes, we suggest going half a size down.' },
  { q: 'Can I run roads in it too?', a: 'Yes. The midsole is cushioned enough for a few road kilometres between trails, but the outsole is designed for grip on dirt and rock.' },
  { q: 'How do I clean it?', a: 'Remove the insole, brush off mud, then hand-wash the upper with mild soap and cold water. Let it air dry away from direct heat.' },
]

const PHOTO_LABELS = ['side', 'three-quarter', 'heel', 'outsole']

function sizeFromFootLength(cm, unit) {
  // Rough conversion: US size = 3 * length in inches - 22, rounded to nearest half.
  const inches = cm / 2.54
  const us = Math.round((3 * inches - 22) * 2) / 2
  const eu = Math.round(us + 33)
  return unit === 'us' ? `US ${us}` : `EU ${eu}`
}

export default function ProductPage() {
  const [cartCount, setCartCount] = useState(2)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [color, setColor] = useState('blue')
  const [size, setSize] = useState(null)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [sizeError, setSizeError] = useState(false)
  const [qty, setQty] = useState(1)
  const [saved, setSaved] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [tab, setTab] = useState('details')
  const [openQuestion, setOpenQuestion] = useState(null)
  const [guideOpen, setGuideOpen] = useState(false)
  const [footLength, setFootLength] = useState('')
  const [unit, setUnit] = useState('us')

  const sizeRef = useRef(null)
  const colorName = COLORS.find((c) => c.id === color).name

  useEffect(() => {
    if (!sizeOpen) return
    const onDown = (e) => {
      if (sizeRef.current && !sizeRef.current.contains(e.target)) setSizeOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setSizeOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [sizeOpen])

  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % PHOTO_LABELS.length)
  const prevPhoto = () => setPhotoIndex((i) => (i === 0 ? PHOTO_LABELS.length - 1 : i - 1))

  const clampQty = (v) => Math.max(1, Math.min(10, Number.isFinite(v) ? Math.trunc(v) : 1))
  const changeQty = (delta) => setQty((q) => clampQty(q + delta))

  const addToCart = () => {
    if (!size) {
      setSizeError(true)
      setSizeOpen(true)
      return
    }
    setSizeError(false)
    setCartCount((c) => c + qty)
    setAddedToCart(true)
  }

  const pickSize = (s) => {
    setSize(s)
    setSizeOpen(false)
    setSizeError(false)
    setAddedToCart(false)
  }

  const guideResult = footLength ? sizeFromFootLength(clampFoot(footLength), unit) : null

  return (
    <div className="pp-page">
      <header className="pp-header">
        <a className="pp-store-name" href="/">Stride</a>
        <span className="pp-cart" aria-label={`Cart with ${cartCount} items`}>
          🛍 Cart · {cartCount} {cartCount === 1 ? 'item' : 'items'}
        </span>
      </header>

      <nav className="pp-breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Shop</a> <span aria-hidden="true">/</span>{' '}
        <a href="/">Trail</a> <span aria-hidden="true">/</span>{' '}
        <span aria-current="page">Trail Runner 2</span>
      </nav>

      <main className="pp-main">
        <section className="pp-gallery" aria-label="Product photos">
          <div className="pp-stage">
            <div className="pp-photo" key={`${color}-${photoIndex}`}>
              <Shoe color={color} variant={photoIndex} />
            </div>
            <button className="pp-nav pp-nav-prev" onClick={prevPhoto} aria-label="Previous photo">‹</button>
            <button className="pp-nav pp-nav-next" onClick={nextPhoto} aria-label="Next photo">›</button>
            <span className="pp-count">{photoIndex + 1} / {PHOTO_LABELS.length} · {PHOTO_LABELS[photoIndex]}</span>
          </div>
          <div className="pp-thumbs">
            {PHOTO_LABELS.map((label, i) => (
              <button
                key={label}
                className={`pp-thumb${i === photoIndex ? ' is-active' : ''}`}
                onClick={() => setPhotoIndex(i)}
                aria-label={`Show ${label} photo`}
              >
                <Shoe color={color} variant={i} />
              </button>
            ))}
          </div>
        </section>

        <section className="pp-info">
          <h1 className="pp-title">Trail Runner 2</h1>
          <p className="pp-subtitle">Grip the trail. Own the descent.</p>

          <div className="pp-price-row">
            <span className="pp-price">$120.00 CAD</span>
            <span className="pp-info-icon" tabIndex="0" aria-label="Price information">
              i
              <span className="pp-tax-tip" role="tooltip">Price includes taxes and duties.</span>
            </span>
          </div>

          <p className="pp-label">Color — {colorName}</p>
          <div className="pp-colors">
            {COLORS.map((c) => (
              <button
                key={c.id}
                className={`pp-swatch${color === c.id ? ' is-active' : ''}`}
                style={{ background: c.hex }}
                onClick={() => setColor(c.id)}
                aria-label={`Choose ${c.name}`}
                aria-pressed={color === c.id}
                title={c.name}
              />
            ))}
          </div>

          <p className="pp-label">Size</p>
          <div className="pp-size-row" ref={sizeRef}>
            <div style={{ position: 'relative' }}>
              <button
                className="pp-size-button"
                onClick={() => setSizeOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={sizeOpen}
              >
                {size ? `US ${size.us}` : 'Select size'}
                <span aria-hidden="true">{sizeOpen ? '▲' : '▼'}</span>
              </button>
              {sizeOpen && (
                <div className="pp-size-options" role="listbox">
                  {SIZES.map((s) => (
                    <button
                      key={s.us}
                      className="pp-size-option"
                      role="option"
                      aria-selected={size?.us === s.us}
                      disabled={!s.inStock}
                      onClick={() => pickSize(s)}
                    >
                      <span>US {s.us} · EU {s.eu}</span>
                      <span>{s.inStock ? '' : 'Sold out'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="pp-size-guide-link" onClick={() => setGuideOpen(true)}>
              Size guide
            </button>
          </div>
          {sizeError && <p className="pp-size-error" role="alert">Please pick a size before adding to your bag.</p>}

          <p className="pp-label">Quantity</p>
          <div className="pp-qty">
            <button onClick={() => changeQty(-1)} aria-label="Decrease quantity">−</button>
            <input
              type="number"
              min="1"
              max="10"
              value={qty}
              onChange={(e) => setQty(clampQty(parseInt(e.target.value, 10)))}
              aria-label="Quantity"
            />
            <button onClick={() => changeQty(1)} aria-label="Increase quantity">+</button>
          </div>

          <div className="pp-actions">
            <button className="pp-add" onClick={addToCart}>Add to bag</button>
            <button
              className={`pp-heart${saved ? ' is-saved' : ''}`}
              onClick={() => setSaved((s) => !s)}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
              title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              {saved ? '♥' : '♡'}
            </button>
          </div>

          {addedToCart && (
            <p className="pp-confirmation" role="status">
              Added {qty} {qty === 1 ? 'pair' : 'pairs'} of Trail Runner 2 in {colorName}, US {size.us} to your bag.
            </p>
          )}
          {saved && <p className="pp-wish-note">Saved to your wishlist.</p>}

          {guideOpen && (
            <div className="pp-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="guide-title">
              <div className="pp-modal">
                <div className="pp-modal-head">
                  <h3 id="guide-title">Size guide</h3>
                  <button className="pp-close" onClick={() => setGuideOpen(false)} aria-label="Close size guide">✕</button>
                </div>
                <p style={{ fontSize: 14, color: '#555', margin: '0 0 6px' }}>
                  Enter your foot length to find your Trail Runner 2 size.
                </p>
                <div className="pp-field">
                  <div style={{ flex: 1 }}>
                    <label htmlFor="foot-length">Foot length (cm)</label>
                    <input
                      id="foot-length"
                      type="number"
                      min="20"
                      max="32"
                      step="0.1"
                      value={footLength}
                      onChange={(e) => setFootLength(e.target.value)}
                      placeholder="e.g. 27"
                    />
                  </div>
                  <div>
                    <label>Units</label>
                    <div className="pp-unit-toggle">
                      <button className={unit === 'us' ? 'is-active' : ''} onClick={() => setUnit('us')}>US</button>
                      <button className={unit === 'eu' ? 'is-active' : ''} onClick={() => setUnit('eu')}>EU</button>
                    </div>
                  </div>
                </div>
                {guideResult && <p className="pp-result">Your size: <strong>{guideResult}</strong></p>}
                <div className="pp-modal-actions">
                  <button className="pp-add" style={{ width: 'auto' }} onClick={() => setGuideOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <section className="pp-tabs">
        <div className="pp-tab-list" role="tablist">
          {['details', 'reviews', 'shipping'].map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`pp-tab${tab === t ? ' is-active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {tab === 'details' && (
          <div className="pp-tab-panel" role="tabpanel">
            <p><strong>Trail Runner 2</strong> is built for technical terrain, with 4 mm lugs, a rock plate and a knit upper that sheds water and breathes on long climbs.</p>
            <ul>
              <li>Weight: 285 g (US 9)</li>
              <li>Drop: 6 mm</li>
              <li>Outsole: Trail Grip rubber with 4 mm lugs</li>
              <li>Upper: recycled knit with reinforced toe cap</li>
            </ul>
          </div>
        )}
        {tab === 'reviews' && (
          <div className="pp-tab-panel" role="tabpanel">
            <p><strong>★★★★★ Rain or shine</strong> — Dana P.</p>
            <p>Grippy on wet rock and the fit is spot on after 40 km.</p>
            <p><strong>★★★★☆ Light and quick</strong> — Marta L.</p>
            <p>Feels fast, though I would like a touch more cushion on rocky descents.</p>
          </div>
        )}
        {tab === 'shipping' && (
          <div className="pp-tab-panel" role="tabpanel">
            <p>Free carbon-neutral shipping on orders over $50 CAD. Delivered in 2–4 business days across Canada. Returns are free within 30 days, unworn.</p>
          </div>
        )}
      </section>

      <section className="pp-questions">
        <h2 style={{ fontSize: 22, margin: '0 0 16px' }}>Questions</h2>
        {QUESTIONS.map((item, i) => {
          const open = openQuestion === i
          return (
            <div className="pp-question" key={item.q}>
              <button
                aria-expanded={open}
                onClick={() => setOpenQuestion(open ? null : i)}
              >
                {item.q}
                <span aria-hidden="true">{open ? '−' : '+'}</span>
              </button>
              {open && <p className="pp-answer">{item.a}</p>}
            </div>
          )
        })}
      </section>

      <footer className="pp-footer">
        <div className="pp-footer-grid">
          <div>
            <h4>Customer help</h4>
            <ul>
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns &amp; exchanges</a></li>
              <li><a href="#">Size guide</a></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Stride</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div>
            <h4>Social</h4>
            <ul>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">YouTube</a></li>
              <li><a href="#">Strava</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

function clampFoot(v) {
  const n = parseFloat(v)
  if (!Number.isFinite(n)) return 27
  return Math.min(32, Math.max(20, n))
}
