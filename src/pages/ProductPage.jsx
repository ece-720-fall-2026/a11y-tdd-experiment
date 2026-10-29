import { useEffect, useRef, useState } from 'react'
import ShoeImage from '../components/ShoeImage.jsx'
import Tooltip from '../components/Tooltip.jsx'
import SizeGuideDialog from '../components/SizeGuideDialog.jsx'
import '../styles.css'

const COLORS = [
  { id: 'blue', name: 'Blue' },
  { id: 'black', name: 'Black' },
  { id: 'grey', name: 'Grey' },
]

const SIZES = [
  { us: 7, eu: 40, inStock: true },
  { us: 8, eu: 41, inStock: true },
  { us: 9, eu: 42, inStock: false },
  { us: 10, eu: 43, inStock: true },
  { us: 11, eu: 44, inStock: true },
  { us: 12, eu: 45, inStock: true },
  { us: 13, eu: 46, inStock: false },
]

const PHOTOS_PER_COLOR = 3

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'shipping', label: 'Shipping' },
]

const QUESTIONS = [
  {
    q: 'Can I run with these on wet trails?',
    a: 'Yes. The outsole uses a sticky wet-grip rubber with 4 mm lugs, made for mud, roots and wet rock.',
  },
  {
    q: 'How do I clean them?',
    a: 'Remove the insole, rinse the upper with lukewarm water and mild soap, and let them dry at room temperature away from direct heat.',
  },
  {
    q: 'Do they fit orthotics?',
    a: 'The insole comes out easily, so most slim orthotics fit. If you use a bulky one, consider going half a size up.',
  },
]

const usFromCm = (cm) => Math.round(cm - 17)
const euFromCm = (cm) => usFromCm(cm) + 33

export default function ProductPage() {
  const [cartCount, setCartCount] = useState(1)
  const [color, setColor] = useState('blue')
  const [photoIndex, setPhotoIndex] = useState(0)
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [sizeError, setSizeError] = useState('')
  const [cartMessage, setCartMessage] = useState('')
  const [activeTab, setActiveTab] = useState('details')
  const [openQuestion, setOpenQuestion] = useState(0)
  const sizeSelectRef = useRef(null)
  const tabRefs = useRef([])

  const goToPhoto = (index) => setPhotoIndex((index + PHOTOS_PER_COLOR) % PHOTOS_PER_COLOR)

  const onColorChange = (id) => {
    setColor(id)
    setPhotoIndex(0)
  }

  const changeQuantity = (delta) => {
    setQuantity((current) => Math.min(10, Math.max(1, current + delta)))
  }

  const onQuantityInput = (event) => {
    const value = Number(event.target.value)
    setQuantity(Number.isFinite(value) ? Math.min(10, Math.max(1, Math.round(value))) : 1)
  }

  const addToCart = () => {
    if (!size) {
      setSizeError('Choose a size to continue.')
      setCartMessage('')
      sizeSelectRef.current?.focus()
      return
    }
    setSizeError('')
    const chosen = SIZES.find((s) => String(s.us) === size)
    setCartCount((count) => count + quantity)
    setCartMessage(
      `Added ${quantity} ${quantity === 1 ? 'pair' : 'pairs'} of Trail Runner 2 (${COLORS.find((c) => c.id === color).name}, US ${chosen.us} / EU ${chosen.eu}) to your bag.`,
    )
  }

  const onTabKeyDown = (event, index) => {
    let nextIndex = null
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % TABS.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + TABS.length) % TABS.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = TABS.length - 1
    if (nextIndex === null) return
    event.preventDefault()
    setActiveTab(TABS[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  useEffect(() => {
    document.title = 'Trail Runner 2 · Stride'
  }, [])

  return (
    <div className="page">
      <header className="site-header">
        <p className="store-name">
          <a href="/">Stride</a>
        </p>
        <a className="cart-link" href="/">
          <span aria-hidden="true">🛍</span> Cart (<span>{cartCount}</span>{' '}
          <span>{cartCount === 1 ? 'item' : 'items'}</span>)
        </a>
      </header>

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol>
          <li>
            <a href="/">Shop</a>
          </li>
          <li>
            <a href="/">Trail</a>
          </li>
          <li>
            <span aria-current="page">Trail Runner 2</span>
          </li>
        </ol>
      </nav>

      <main className="product">
        <section
          className="carousel"
          aria-roledescription="carousel"
          aria-label={`Trail Runner 2 photos in ${COLORS.find((c) => c.id === color).name}`}
        >
          <div className="carousel-stage" aria-live="polite" aria-atomic="true">
            <div className="slide" role="group" aria-roledescription="slide" aria-label={`Photo ${photoIndex + 1} of ${PHOTOS_PER_COLOR}`}>
              <ShoeImage color={color} index={photoIndex} />
            </div>
          </div>
          <div className="carousel-controls">
            <button
              type="button"
              className="secondary"
              onClick={() => goToPhoto(photoIndex - 1)}
            >
              Previous photo
            </button>
            <span aria-hidden="true">
              {photoIndex + 1} / {PHOTOS_PER_COLOR}
            </span>
            <button type="button" onClick={() => goToPhoto(photoIndex + 1)}>
              Next photo
            </button>
          </div>
        </section>

        <section className="product-info" aria-label="Trail Runner 2 details">
          <h1>Trail Runner 2</h1>
          <p className="tagline">New &amp; trending · Men&apos;s trail running shoe</p>
          <p className="rating">
            <span aria-hidden="true">★★★★</span>
            <span className="visually-hidden">Rated 4 out of 5 stars from 128 reviews.</span>
            4.0 (128 reviews)
          </p>

          <p className="price">
            <span className="price-value">$120.00 CAD</span>
            <Tooltip label="About the price" text="Taxes are included in this price." />
          </p>

          <fieldset className="colors">
            <legend>Color</legend>
            {COLORS.map((option) => (
              <label key={option.id} className={option.id === color ? 'swatch is-selected' : 'swatch'}>
                <input
                  type="radio"
                  name="color"
                  value={option.id}
                  checked={option.id === color}
                  onChange={() => onColorChange(option.id)}
                />
                <span className="visually-hidden">{option.name}</span>
                <span className="swatch-dot" data-color={option.id} aria-hidden="true" />
              </label>
            ))}
          </fieldset>

          <div className="size-row">
            <div className="field">
              <label htmlFor="size">Size</label>
              <select
                id="size"
                ref={sizeSelectRef}
                value={size}
                onChange={(event) => {
                  setSize(event.target.value)
                  if (event.target.value) setSizeError('')
                }}
                aria-describedby={sizeError ? 'size-error' : 'size-hint'}
              >
                <option value="">Choose a size</option>
                {SIZES.map((s) => (
                  <option key={s.us} value={String(s.us)} disabled={!s.inStock}>
                    US {s.us} · EU {s.eu}
                    {s.inStock ? '' : ' (sold out)'}
                  </option>
                ))}
              </select>
              <p id="size-hint" className="hint">
                US sizes shown with EU equivalents.
              </p>
              {sizeError && (
                <p id="size-error" role="alert" className="error">
                  {sizeError}
                </p>
              )}
            </div>
            <button type="button" className="link-button" onClick={() => setSizeGuideOpen(true)}>
              Size guide
            </button>
          </div>

          <div className="quantity-row">
            <span id="quantity-label" className="field-label">
              Quantity
            </span>
            <div className="stepper" aria-labelledby="quantity-label">
              <button
                type="button"
                onClick={() => changeQuantity(-1)}
                aria-label="Decrease quantity by one"
                disabled={quantity <= 1}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={onQuantityInput}
                aria-label="Quantity"
              />
              <button
                type="button"
                onClick={() => changeQuantity(1)}
                aria-label="Increase quantity by one"
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
            <p className="hint">Up to 10 pairs per order.</p>
          </div>

          <div className="actions">
            <button type="button" className="primary" onClick={addToCart}>
              Add to bag
            </button>
            <button
              type="button"
              className="heart"
              aria-pressed={wishlist}
              aria-label={wishlist ? 'Remove Trail Runner 2 from wishlist' : 'Save Trail Runner 2 to wishlist'}
              onClick={() => setWishlist((saved) => !saved)}
            >
              <span aria-hidden="true">{wishlist ? '♥' : '♡'}</span>
            </button>
          </div>
          <p className="confirmation" role="status">
            {cartMessage}
          </p>

          <ul className="features">
            <li>Water-repellent ripstop upper</li>
            <li>Wet-grip rubber outsole with 4 mm lugs</li>
            <li>Responsive foam midsole</li>
          </ul>
        </section>
      </main>

      <section className="tabs" aria-label="More information">
        <div role="tablist" aria-label="More information" className="tablist">
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'tab is-selected' : 'tab'}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id="panel-details"
          aria-labelledby="tab-details"
          tabIndex={0}
          hidden={activeTab !== 'details'}
        >
          <h2>Details</h2>
          <p>
            The Trail Runner 2 is built for technical terrain: a locked-down fit, protective toe
            bumper and a midsole that keeps its bounce on long days out.
          </p>
        </div>
        <div
          role="tabpanel"
          id="panel-reviews"
          aria-labelledby="tab-reviews"
          tabIndex={0}
          hidden={activeTab !== 'reviews'}
        >
          <h2>Reviews</h2>
          <blockquote>
            <p>“Confident on wet rock and the fit is spot on.” — Alex, 4/5</p>
          </blockquote>
          <blockquote>
            <p>“Lugs still look new after 300 km.” — Priya, 5/5</p>
          </blockquote>
        </div>
        <div
          role="tabpanel"
          id="panel-shipping"
          aria-labelledby="tab-shipping"
          tabIndex={0}
          hidden={activeTab !== 'shipping'}
        >
          <h2>Shipping</h2>
          <p>Free standard shipping in Canada on orders over $75. Returns are free within 30 days.</p>
        </div>
      </section>

      <section className="questions" aria-label="Questions">
        <h2>Questions</h2>
        {QUESTIONS.map((item, index) => {
          const expanded = openQuestion === index
          return (
            <div className="question" key={item.q}>
              <h3>
                <button
                  type="button"
                  className="question-trigger"
                  id={`question-button-${index}`}
                  aria-expanded={expanded}
                  aria-controls={`question-panel-${index}`}
                  onClick={() => setOpenQuestion(expanded ? null : index)}
                >
                  <span>{item.q}</span>
                  <span aria-hidden="true">{expanded ? '−' : '+'}</span>
                </button>
              </h3>
              <div
                id={`question-panel-${index}`}
                role="region"
                aria-labelledby={`question-button-${index}`}
                hidden={!expanded}
              >
                <p>{item.a}</p>
              </div>
            </div>
          )
        })}
      </section>

      <footer className="site-footer">
        <div className="footer-column">
          <h2>Customer help</h2>
          <ul>
            <li><a href="/">Contact us</a></li>
            <li><a href="/">Shipping</a></li>
            <li><a href="/">Returns</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h2>Company</h2>
          <ul>
            <li><a href="/">About Stride</a></li>
            <li><a href="/">Careers</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h2>Social media</h2>
          <ul className="social">
            <li><a href="/" aria-label="Stride on Instagram"><span aria-hidden="true">Instagram</span></a></li>
            <li><a href="/" aria-label="Stride on Facebook"><span aria-hidden="true">Facebook</span></a></li>
            <li><a href="/" aria-label="Stride on X"><span aria-hidden="true">X</span></a></li>
          </ul>
        </div>
      </footer>

      <SizeGuideDialog open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </div>
  )
}
