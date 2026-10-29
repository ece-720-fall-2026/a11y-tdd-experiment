import { useEffect, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const COLORS = [
  { id: 'blue', label: 'Blue', hex: '#2563eb', name: 'blue' },
  { id: 'black', label: 'Black', hex: '#111827', name: 'black' },
  { id: 'grey', label: 'Grey', hex: '#6b7280', name: 'grey' },
]

const PHOTO_VIEWS = ['side view', 'sole detail', 'on the trail']

const SIZES = [
  { label: '7', soldOut: false },
  { label: '8', soldOut: false },
  { label: '9', soldOut: false },
  { label: '10', soldOut: false },
  { label: '11', soldOut: false },
  { label: '12', soldOut: true },
  { label: '13', soldOut: false },
  { label: '15', soldOut: true },
  { label: '17', soldOut: true },
]

const REVIEWS = [
  {
    name: 'Maya R.',
    rating: 5,
    text: 'Grippy on wet rock and light enough for long days. My go-to trail shoe now.',
  },
  {
    name: 'Jonas P.',
    rating: 4,
    text: 'Great fit right out of the box. The toe box is roomy without feeling sloppy.',
  },
  {
    name: 'Priya S.',
    rating: 5,
    text: 'Ran 30 km of muddy singletrack and they cleaned up like new.',
  },
]

const QUESTIONS = [
  {
    q: 'Do these shoes run true to size?',
    a: 'Yes. The Trail Runner 2 has a roomy toe box and fits true to size for most runners. If you are between sizes, we suggest the larger one.',
  },
  {
    q: 'Can I use them on roads as well as trails?',
    a: 'Absolutely. The midsole cushioning works on pavement, while the lugged outsole keeps its grip on dirt, gravel and wet rock.',
  },
  {
    q: 'How do I clean them?',
    a: 'Brush off dried mud, then hand wash the upper with mild soap and lukewarm water. Let them air dry away from direct heat.',
  },
]

/** Builds an inline SVG "photo" of the shoe for a given color and view. */
function shoePhoto(color, view) {
  const backgrounds = ['#eef2f7', '#e9eef4', '#f3efe7']
  const bg = backgrounds[view]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" role="img">
    <rect width="480" height="360" fill="${bg}"/>
    <ellipse cx="245" cy="316" rx="190" ry="26" fill="#d5dbe4"/>
    <path d="M118 262 C112 200 128 138 152 108 L216 96 L248 132 L300 146 L334 152 L346 262 Z"
      fill="${color.hex}" stroke="#111827" stroke-width="6"/>
    <path d="M104 262 L348 262 C364 294 350 306 320 306 L122 306 C94 306 86 290 104 262 Z"
      fill="#3f3f46" stroke="#111827" stroke-width="6"/>
    <path d="M118 276 L338 276" stroke="#f8fafc" stroke-width="7" stroke-linecap="round"/>
    <circle cx="198" cy="150" r="8" fill="#f8fafc" stroke="#111827" stroke-width="3"/>
    <circle cx="232" cy="140" r="8" fill="#f8fafc" stroke="#111827" stroke-width="3"/>
    <path d="M190 170 L240 178 M184 194 L246 200" stroke="#f8fafc" stroke-width="6" stroke-linecap="round"/>
    <path d="M252 150 L306 160" stroke="#f8fafc" stroke-width="9" stroke-linecap="round"/>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// ---------------------------------------------------------------------------
// Size guide modal dialog
// ---------------------------------------------------------------------------

function SizeGuideDialog({ onClose }) {
  const dialogRef = useRef(null)
  const [length, setLength] = useState('')
  const [unit, setUnit] = useState('us')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusables = Array.from(
        dialog.querySelectorAll('button, input, [href], [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => !el.disabled && el.offsetParent !== null)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      } else if (!dialog.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [onClose])

  const cm = parseFloat(length)
  const hasLength = Number.isFinite(cm) && cm > 0
  const computed = hasLength
    ? unit === 'eu'
      ? `Your size: EU ${Math.round(cm + 15)}`
      : `Your size: US ${Math.round(cm - 18)}`
    : 'Enter your foot length to see your size.'

  return (
    <div className="dialog-backdrop">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        tabIndex={-1}
        className="dialog"
      >
        <h2>Size guide</h2>
        <p>
          Measure your foot from heel to longest toe, then enter the length below to find your
          Trail Runner 2 fit.
        </p>

        <div className="field">
          <label htmlFor="foot-length">Foot length (cm)</label>
          <input
            id="foot-length"
            type="number"
            min="10"
            max="35"
            step="0.5"
            inputMode="decimal"
            value={length}
            onChange={(event) => setLength(event.target.value)}
          />
        </div>

        <fieldset className="field">
          <legend>Unit</legend>
          <label className="radio-row">
            <input
              type="radio"
              name="unit"
              value="us"
              checked={unit === 'us'}
              onChange={() => setUnit('us')}
            />
            US
          </label>
          <label className="radio-row">
            <input
              type="radio"
              name="unit"
              value="eu"
              checked={unit === 'eu'}
              onChange={() => setUnit('eu')}
            />
            EU
          </label>
        </fieldset>

        <p className="size-result">{computed}</p>
        <button type="button" className="button button-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// More information tabs
// ---------------------------------------------------------------------------

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'shipping', label: 'Shipping' },
]

function TabPanel({ id }) {
  if (id === 'details') {
    return (
      <>
        <p>
          The Trail Runner 2 pairs a breathable ripstop upper with a rock plate underfoot, so you
          can move fast over rough ground without worrying about what is underneath you.
        </p>
        <ul>
          <li>Weight: 285 g per shoe (US 9)</li>
          <li>Drop: 6 mm</li>
          <li>Outsole: 4 mm lugs with sticky rubber compound</li>
          <li>Upper: recycled ripstop with welded toe cap</li>
        </ul>
      </>
    )
  }
  if (id === 'reviews') {
    return (
      <ul className="review-list">
        {REVIEWS.map((review) => (
          <li key={review.name}>
            <p className="review-title">
              <strong>{review.name}</strong> &mdash; {'★'.repeat(review.rating)}
            </p>
            <p>{review.text}</p>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <>
      <p>
        Free carbon-neutral shipping on orders of 50 dollars or more. Orders leave our warehouse
        within one business day and usually arrive in 2 to 5 business days.
      </p>
      <p>
        Returns are free within 60 days, as long as the shoes are unworn outdoors. Our customer
        care team is happy to help with exchanges.
      </p>
    </>
  )
}

// ---------------------------------------------------------------------------
// Product page
// ---------------------------------------------------------------------------

export default function ProductPage() {
  const [cartCount, setCartCount] = useState(0)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [color, setColor] = useState('blue')
  const [sizeOpen, setSizeOpen] = useState(false)
  const [size, setSize] = useState(null)
  const [sizeError, setSizeError] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [message, setMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('details')
  const [openQuestion, setOpenQuestion] = useState(null)

  const guideButtonRef = useRef(null)
  const sizeFieldRef = useRef(null)
  const activeColor = COLORS.find((entry) => entry.id === color)
  const photoAlt = `Trail Runner 2 in ${activeColor.name}, ${PHOTO_VIEWS[photoIndex]}`

  const nextPhoto = () => setPhotoIndex((index) => (index + 1) % PHOTO_VIEWS.length)
  const prevPhoto = () =>
    setPhotoIndex((index) => (index - 1 + PHOTO_VIEWS.length) % PHOTO_VIEWS.length)

  const closeGuide = () => {
    setGuideOpen(false)
    guideButtonRef.current?.focus()
  }

  const addToCart = () => {
    if (!size) {
      setSizeError(true)
      setMessage('Please pick a size to continue.')
      return
    }
    setCartCount((count) => count + quantity)
    setMessage('Added to cart')
  }

  // Close the size list when the shopper clicks anywhere outside it.
  useEffect(() => {
    if (!sizeOpen) return
    const closeOnOutsideClick = (event) => {
      if (sizeFieldRef.current && !sizeFieldRef.current.contains(event.target)) {
        setSizeOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [sizeOpen])

  const onTabsKeyDown = (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab)
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const next = TABS[(currentIndex + delta + TABS.length) % TABS.length]
    setActiveTab(next.id)
    document.getElementById(`tab-${next.id}`)?.focus()
  }

  return (
    <div className="page">
      <header className="banner">
        <a className="store-name" href="/">
          Stride
        </a>
        <a className="cart-link" href="/cart">
          Cart ({cartCount})
        </a>
      </header>

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li>
            <a href="/">Shop</a>
          </li>
          <li>
            <button
              type="button"
              className="breadcrumb-step"
              onClick={() => window.location.assign('/products')}
            >
              Trail
            </button>
          </li>
          <li>
            <a href="/products/trail-runner-2" aria-current="page">
              Trail Runner 2
            </a>
          </li>
        </ol>
      </nav>

      <main>
        <section aria-label="Product photos" className="gallery">
          <img src={shoePhoto(activeColor, photoIndex)} alt={photoAlt} className="gallery-photo" />
          <button type="button" className="gallery-arrow" onClick={prevPhoto} aria-label="Previous photo">
            &#8592;
          </button>
          <button type="button" className="gallery-arrow" onClick={nextPhoto} aria-label="Next photo">
            &#8594;
          </button>
          <p className="gallery-count">
            {photoIndex + 1} of {PHOTO_VIEWS.length}
          </p>
        </section>

        <section className="product-info">
          <h1>Trail Runner 2</h1>
          <p className="price">
            <span>$120.00</span>
            <PriceInfo />
          </p>
          <p className="tagline">Grippy, cushioned and built for long days on rough ground.</p>

          <ColorPicker color={color} setColor={setColor} />

          <div className="field-row">
            <div className="field size-field" ref={sizeFieldRef}>
              <span id="size-label" className="field-label">
                Size
              </span>
              <div
                role="combobox"
                tabIndex={0}
                aria-labelledby="size-label"
                aria-haspopup="listbox"
                aria-expanded={sizeOpen}
                aria-controls="size-listbox"
                className="size-combobox"
                onClick={() => setSizeOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
                    event.preventDefault()
                    setSizeOpen(true)
                  } else if (event.key === 'Escape') {
                    setSizeOpen(false)
                  }
                }}
              >
                {size ?? (sizeError ? 'Size required' : 'Select one')}
              </div>
              {sizeOpen && (
                <ul role="listbox" id="size-listbox" aria-labelledby="size-label" className="size-listbox">
                  {SIZES.map((entry) => (
                    <li
                      key={entry.label}
                      role="option"
                      aria-selected={size === entry.label}
                      aria-disabled={entry.soldOut ? 'true' : 'false'}
                      className={`size-option${entry.soldOut ? ' sold-out' : ''}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        if (entry.soldOut) return
                        setSize(entry.label)
                        setSizeError(false)
                        setSizeOpen(false)
                      }}
                    >
                      {entry.label}
                      {entry.soldOut ? ' (sold out)' : ''}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              ref={guideButtonRef}
              className="link-button"
              onClick={() => setGuideOpen(true)}
            >
              Size guide
            </button>
          </div>

          <div className="field">
            <label htmlFor="quantity" className="field-label">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max="10"
              step="1"
              value={quantity}
              onChange={(event) => {
                const value = parseInt(event.target.value, 10)
                if (Number.isNaN(value)) return
                setQuantity(Math.min(10, Math.max(1, value)))
              }}
            />
          </div>

          <div className="buy-row">
            <button type="button" className="button button-primary" onClick={addToCart}>
              Add to cart
            </button>
            <button
              type="button"
              className="wishlist-button"
              aria-pressed={wishlist ? 'true' : 'false'}
              aria-label="Wishlist"
              onClick={() => setWishlist((saved) => !saved)}
            >
              {wishlist ? '♥' : '♡'}
            </button>
          </div>

          <p role="status" className="cart-message">
            {message}
          </p>
        </section>

        <section aria-label="More information" className="info-tabs">
          <div role="tablist" className="tablist" onKeyDown={onTabsKeyDown}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id ? 'true' : 'false'}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className={`tab${activeTab === tab.id ? ' tab-selected' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
            className="tab-panel"
          >
            <TabPanel id={activeTab} />
          </div>
        </section>

        <section aria-labelledby="questions-heading" className="questions">
          <h2 id="questions-heading">Questions</h2>
          {QUESTIONS.map((entry, index) => {
            const open = openQuestion === index
            const answerId = `answer-${index}`
            return (
              <div key={entry.q} className="question">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open ? 'true' : 'false'}
                    aria-controls={answerId}
                    className="question-button"
                    onClick={() => setOpenQuestion(open ? null : index)}
                  >
                    {entry.q}
                  </button>
                </h3>
                {open && (
                  <p id={answerId} className="answer">
                    {entry.a}
                  </p>
                )}
              </div>
            )
          })}
        </section>
      </main>

      <footer className="footer">
        <p>&copy; Stride</p>
        <ul className="footer-links">
          <li>
            <a href="/support">Customer support</a>
          </li>
          <li>
            <a href="/about">About us</a>
          </li>
          <li>
            <a href="/stores">Stores</a>
          </li>
          <li>
            <a href="https://instagram.com">Instagram</a>
          </li>
          <li>
            <a href="https://facebook.com">Facebook</a>
          </li>
        </ul>
      </footer>

      {guideOpen && <SizeGuideDialog onClose={closeGuide} />}
    </div>
  )
}

function PriceInfo() {
  const [open, setOpen] = useState(false)
  return (
    <span className="price-info-wrap">
      <button
        type="button"
        className="price-info"
        aria-label="Price information"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        i
      </button>
      {open && <span className="tooltip">Taxes included</span>}
    </span>
  )
}

function ColorPicker({ color, setColor }) {
  return (
    <div role="radiogroup" aria-labelledby="color-label" className="field">
      <span id="color-label" className="field-label">
        Color
      </span>
      <div className="swatch-row">
        {COLORS.map((entry) => (
          <label key={entry.id} className="swatch-option">
            <input
              type="radio"
              name="color"
              value={entry.id}
              checked={color === entry.id}
              onChange={() => setColor(entry.id)}
              className="swatch"
              style={{ backgroundColor: entry.hex }}
            />
            <span className="swatch-name">{entry.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
