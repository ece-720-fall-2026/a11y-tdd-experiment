import { useState } from 'react'
import { photosFor, sizes, questions } from '../data/product.js'
import './ProductPage.css'

const COLORS = [
  { id: 'blue', name: 'Blue', hex: '#2b5f9e' },
  { id: 'black', name: 'Black', hex: '#232323' },
  { id: 'grey', name: 'Grey', hex: '#8d8d8d' },
]

export default function ProductPage() {
  const [colorId, setColorId] = useState('blue')
  const [photoIndex, setPhotoIndex] = useState(0)
  const [size, setSize] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [inWishlist, setInWishlist] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [taxInfoOpen, setTaxInfoOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  const [openQuestion, setOpenQuestion] = useState(null)

  const photos = photosFor(colorId)

  const nextPhoto = () => setPhotoIndex((i) => (i + 1) % photos.length)
  const prevPhoto = () =>
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)

  const addToCart = () => {
    if (!size) {
      setSizeError(true)
      setAdded(false)
      return
    }
    setSizeError(false)
    setCartCount((c) => c + quantity)
    setAdded(true)
  }

  return (
    <div className="store">
      <header className="store-header">
        <a className="store-logo" href="/">
          <h1>Stride</h1>
        </a>
        <a className="cart-link" href="/cart">
          Cart ({cartCount})
        </a>
      </header>

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li>
            <a href="/">Shop</a>
          </li>
          <li>
            <a href="/products/trail">Trail</a>
          </li>
          <li aria-current="page">Trail Runner 2</li>
        </ol>
      </nav>

      <main className="product">
        <section className="gallery" aria-label="Photos of the Trail Runner 2">
          <img
            className="photo"
            src={photos[photoIndex].src}
            alt={`Trail Runner 2 in ${
              COLORS.find((c) => c.id === colorId).name.toLowerCase()
            } — ${photos[photoIndex].label}`}
          />
          <button className="photo-nav prev" type="button" onClick={prevPhoto} aria-label="Previous photo">
            ‹
          </button>
          <button className="photo-nav next" type="button" onClick={nextPhoto} aria-label="Next photo">
            ›
          </button>
          <p className="photo-count">
            {photoIndex + 1} of {photos.length}
          </p>
        </section>

        <section className="details" aria-label="Trail Runner 2 details">
          <h2>Trail Runner 2</h2>
          <p className="tagline">Grip any trail. Run any weather.</p>

          <div className="price-row">
            <span className="price">$120.00 CAD</span>
            <span
              className="price-info"
              aria-label="Includes taxes"
              tabIndex={0}
              onMouseEnter={() => setTaxInfoOpen(true)}
              onMouseLeave={() => setTaxInfoOpen(false)}
              onFocus={() => setTaxInfoOpen(true)}
              onBlur={() => setTaxInfoOpen(false)}
            >
              i
              {taxInfoOpen && (
                <span className="price-tooltip" role="tooltip">
                  Price includes taxes and duties.
                </span>
              )}
            </span>
          </div>

          <fieldset className="color-picker">
            <legend>Color</legend>
            <div className="swatches">
              {COLORS.map((color) => (
                <label key={color.id} className="swatch-label">
                  <input
                    type="radio"
                    name="color"
                    className="swatch"
                    style={{ background: color.hex }}
                    aria-label={color.name}
                    value={color.id}
                    checked={colorId === color.id}
                    onChange={() => {
                      setColorId(color.id)
                      setPhotoIndex(0)
                    }}
                  />
                  <span className="swatch-name">{color.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="size-row">
            <label id="size-label">Size</label>
            <SizeSelect
              value={size}
              onChange={(next) => {
                setSize(next)
                setSizeError(false)
              }}
            />
          <button
            type="button"
            className="size-guide-button"
            onClick={() => setShowGuide(true)}
          >
            Size guide
          </button>
        </div>
          {sizeError && (
            <p className="error" role="alert">
              Please pick a size before adding to your cart.
            </p>
          )}

          <div className="quantity-row">
            <label htmlFor="quantity">Quantity</label>
            <div className="stepper">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                id="quantity"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  if (Number.isFinite(value)) setQuantity(Math.max(1, value))
                }}
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="actions">
            <button
              type="button"
              className="add-to-cart"
              onClick={addToCart}
              aria-label="Add to cart"
            >
              Add to bag
            </button>
            <button
              type="button"
              className="wishlist"
              aria-pressed={inWishlist}
              onClick={() => setInWishlist((w) => !w)}
              aria-label="Add to wishlist"
            >
              {inWishlist ? '♥' : '♡'}
            </button>
          </div>
          {added && (
            <p className="confirmation" role="status">
              Added to cart — {quantity} pair{quantity > 1 ? 's' : ''} of Trail
              Runner 2.
            </p>
          )}

          <div className="tablist" role="tablist" aria-label="More information">
            {['details', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                id={`tab-${tab}`}
                aria-selected={activeTab === tab}
                aria-controls={`panel-${tab}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="tabpanel"
          >
            {activeTab === 'details' && (
              <ul className="feature-list">
                <li>Omni-MAX™ midsole for cushioning on rocky trails</li>
                <li>Waterproof breathable membrane keeps feet dry</li>
                <li>4mm lugs grip mud, gravel and wet rock</li>
                <li>Weight: 300g (US 9) per shoe</li>
              </ul>
            )}
            {activeTab === 'reviews' && (
              <ul className="review-list">
                <li>★★★★★ “Best trail shoe I have owned.” — Maya R.</li>
                <li>★★★★☆ “Great grip, runs a half size small.” — Dev P.</li>
                <li>★★★★★ “Dry feet through two river crossings.” — Sam L.</li>
              </ul>
            )}
            {activeTab === 'shipping' && (
              <ul className="shipping-list">
                <li>Free shipping on orders over $50</li>
                <li>Delivery in 2–5 business days</li>
                <li>Free 30-day returns</li>
              </ul>
            )}
          </div>
        </section>
      </main>

      <section className="questions" aria-label="Common questions">
        <h2>Questions</h2>
        {questions.map((q, index) => (
          <div className="question" key={q.id}>
            <button
              type="button"
              id={`question-${q.id}`}
              aria-expanded={openQuestion === index}
              aria-controls={`answer-${q.id}`}
              onClick={() =>
                setOpenQuestion((open) => (open === index ? null : index))
              }
            >
              {q.question}
            </button>
            {openQuestion === index && (
              <div
                role="region"
                id={`answer-${q.id}`}
                aria-labelledby={`question-${q.id}`}
              >
                {q.answer}
              </div>
            )}
          </div>
        ))}
      </section>

      {showGuide && (
        <SizeGuideModal
          onClose={() => setShowGuide(false)}
          onPickSize={(recommended) => {
            setSize(String(recommended))
            setSizeError(false)
            setShowGuide(false)
          }}
        />
      )}

      <footer className="footer">
        <div>
          <h3>Customer help</h3>
          <ul>
            <li>
              <a href="/help/shipping">Shipping</a>
            </li>
            <li>
              <a href="/help/returns">Returns</a>
            </li>
            <li>
              <a href="/help/contact">Contact support</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Company</h3>
          <ul>
            <li>
              <a href="/about">About us</a>
            </li>
            <li>
              <a href="/careers">Careers</a>
            </li>
            <li>
              <a href="/sustainability">Sustainability</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Follow us</h3>
          <ul className="social">
            <li>
              <a href="https://instagram.com">Instagram</a>
            </li>
            <li>
              <a href="https://facebook.com">Facebook</a>
            </li>
            <li>
              <a href="https://x.com">X</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}

function SizeSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)

  const selected = sizes.find((s) => String(s.value) === value)

  return (
    <div className="size-select">
      <button
        type="button"
        role="combobox"
        aria-label="Size"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="size-listbox"
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? String(selected.value) : 'Choose your fit'}
      </button>
      {open && (
        <ul id="size-listbox" role="listbox" aria-label="Sizes">
          {sizes.map((s) => {
            const label = s.soldOut ? `${s.value} (sold out)` : String(s.value)
            return (
              <li
                key={s.value}
                role="option"
                aria-selected={value === String(s.value)}
                aria-disabled={s.soldOut ? 'true' : undefined}
                onClick={() => {
                  if (s.soldOut) return
                  onChange(String(s.value))
                  setOpen(false)
                }}
              >
                {label}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function SizeGuideModal({ onClose, onPickSize }) {
  const [footLength, setFootLength] = useState('')
  const [system, setSystem] = useState('us')

  const recommended = (() => {
    const cm = Number(footLength)
    if (!Number.isFinite(cm) || cm <= 0) return null
    const us = Math.round((cm - 21.5) * 1.5 * 2) / 2
    if (system === 'us') return us
    return Math.round(us + 33.5)
  })()

  return (
    <div className="modal-overlay">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
      >
        <h2>Find your fit</h2>
        <p>Measure your foot from heel to longest toe, then enter the length below.</p>
        <label htmlFor="foot-length">Foot length (cm)</label>
        <input
          id="foot-length"
          type="number"
          step="0.5"
          min="10"
          max="35"
          value={footLength}
          onChange={(e) => setFootLength(e.target.value)}
        />
        <fieldset>
          <legend>Sizing region</legend>
          <label>
            <input
              type="radio"
              name="system"
              value="us"
              checked={system === 'us'}
              onChange={() => setSystem('us')}
            />{' '}
            US
          </label>
          <label>
            <input
              type="radio"
              name="system"
              value="eu"
              checked={system === 'eu'}
              onChange={() => setSystem('eu')}
            />{' '}
            EU
          </label>
        </fieldset>
        <p className="recommended-size">
          {recommended
            ? `Your recommended size: ${recommended} ${
                system === 'us' ? 'US' : 'EU'
              }`
            : 'Enter a foot length to see your size.'}
        </p>
        <div className="modal-actions">
          {recommended && (
            <button type="button" onClick={() => onPickSize(recommended)}>
              Use this fit
            </button>
          )}
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
