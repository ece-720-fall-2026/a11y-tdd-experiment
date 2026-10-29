import { useEffect, useRef, useState } from 'react'
import { COLOR_OPTIONS, PHOTO_COUNT, photoFor } from '../shoePhoto.js'

const SIZES = [
  { size: '7' },
  { size: '8' },
  { size: '9', soldOut: true },
  { size: '10' },
  { size: '11', soldOut: true },
  { size: '12' },
]

function Header({ cartCount }) {
  return (
    <header className="site-header">
      <a className="brand" href="/">
        Stride
      </a>
      <a className="cart-link" href="/cart">
        Cart ({cartCount})
      </a>
    </header>
  )
}

function Breadcrumb() {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li>
          <a href="/">Shop</a>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <a href="/shop/trail">Trail</a>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <span aria-current="page">Trail Runner 2</span>
        </li>
      </ol>
    </nav>
  )
}

function Photos({ color }) {
  const [index, setIndex] = useState(0)
  const count = PHOTO_COUNT
  const go = (delta) => setIndex((current) => (current + delta + count) % count)
  const photo = photoFor(color, index)
  const colorName = COLOR_OPTIONS.find((c) => c.id === color).name

  return (
    <section className="photos" aria-label="Photos">
      <div className="photo-frame">
        <img src={photo.src} alt={photo.alt} />
        <p className="photo-caption">
          Trail Runner 2 in {colorName} — {photo.caption}
        </p>
      </div>
      <div className="photo-controls">
        <button type="button" onClick={() => go(-1)}>
          Previous photo
        </button>
        <button type="button" onClick={() => go(1)}>
          Next photo
        </button>
      </div>
    </section>
  )
}

function Price() {
  return (
    <p className="price">
      <span>$120.00 CAD</span>
      <button type="button" className="info-button" aria-label="Price includes taxes">
        <span aria-hidden="true">i</span>
        <span className="tooltip">Price includes taxes and duties.</span>
      </button>
    </p>
  )
}

function ColorPicker({ color, onChange }) {
  return (
    <fieldset className="color-picker" role="radiogroup">
      <legend>Color</legend>
      {COLOR_OPTIONS.map((option) => (
        <label key={option.id} className="color-option">
          <input
            type="radio"
            name="color"
            value={option.id}
            checked={color === option.id}
            aria-checked={color === option.id ? 'true' : 'false'}
            onChange={() => onChange(option.id)}
            className={`swatch swatch-${option.id}`}
          />
          <span>{option.name}</span>
        </label>
      ))}
    </fieldset>
  )
}

function SizePicker({ selectedSize, onSelect }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  return (
    <div className="size-picker" ref={containerRef}>
      <span id="size-label" className="field-label">
        Size
      </span>
      <button
        type="button"
        role="combobox"
        aria-labelledby="size-label"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="size-listbox"
        className="size-combobox"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault()
            setOpen(true)
          }
          if (open && event.key === 'Escape') setOpen(false)
        }}
      >
        {selectedSize ? `US ${selectedSize}` : 'Select a size'}
      </button>
      <ul id="size-listbox" role="listbox" aria-labelledby="size-label" className="size-listbox" hidden={!open}>
        {SIZES.map((entry) => (
          <li
            key={entry.size}
            role="option"
            aria-selected={selectedSize === entry.size}
            aria-disabled={entry.soldOut ? 'true' : undefined}
            className={entry.soldOut ? 'sold-out' : undefined}
            onClick={() => {
              if (entry.soldOut) return
              onSelect(entry.size)
              setOpen(false)
            }}
          >
            {entry.soldOut ? (
              <button type="button" disabled aria-disabled="true" className="sold-out-button">
                US {entry.size} — Sold out
              </button>
            ) : (
              `US ${entry.size}`
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const FOOT_TO_US = (cm) => Math.round(3 * cm - 72)
const FOOT_TO_EU = (cm) => Math.round(1.5 * cm + 1.5)

function SizeGuideDialog({ onClose }) {
  const dialogRef = useRef(null)
  const [footLength, setFootLength] = useState('')
  const [unit, setUnit] = useState('US')

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') onClose()
    if (event.key !== 'Tab') return
    const focusable = dialogRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const list = Array.from(focusable).filter((el) => !el.disabled)
    const current = list.indexOf(document.activeElement)
    event.preventDefault()
    const nextIndex = event.shiftKey
      ? (current - 1 + list.length) % list.length
      : (current + 1) % list.length
    list[nextIndex]?.focus()
  }

  const length = Number(footLength)
  const valid = footLength !== '' && Number.isFinite(length) && length >= 15 && length <= 35
  const size = unit === 'US' ? FOOT_TO_US(length) : FOOT_TO_EU(length)

  return (
    <div className="modal-overlay">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        className="modal"
        tabIndex="-1"
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <h2 id="size-guide-title">Size guide</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            Close
          </button>
        </div>
        <p>Measure your foot from heel to longest toe, then find your size below.</p>
        <div className="modal-field">
          <label htmlFor="foot-length">Foot length (cm)</label>
          <input
            id="foot-length"
            type="number"
            inputMode="decimal"
            min="15"
            max="35"
            step="0.5"
            value={footLength}
            onChange={(event) => setFootLength(event.target.value)}
          />
        </div>
        <fieldset className="unit-picker">
          <legend>Unit</legend>
          <label>
            <input
              type="radio"
              name="unit"
              value="US"
              checked={unit === 'US'}
              onChange={() => setUnit('US')}
            />
            US
          </label>
          <label>
            <input
              type="radio"
              name="unit"
              value="EU"
              checked={unit === 'EU'}
              onChange={() => setUnit('EU')}
            />
            EU
          </label>
        </fieldset>
        <p className="size-result">
          {valid ? (
            <>
              Your size: <strong>
                {unit} {size}
              </strong>
            </>
          ) : (
            <>Enter your foot length to find your size.</>
          )}
        </p>
      </div>
    </div>
  )
}

function Quantity({ quantity, onChange }) {
  const update = (value) => onChange(Math.min(10, Math.max(1, value)))
  return (
    <div className="quantity">
      <label htmlFor="quantity" className="field-label">
        Quantity
      </label>
      <div className="quantity-controls">
        <button type="button" aria-label="Decrease quantity" onClick={() => update(quantity - 1)}>
          −
        </button>
        <input
          id="quantity"
          type="number"
          min="1"
          max="10"
          step="1"
          value={quantity}
          onChange={(event) => {
            const value = Number(event.target.value)
            if (Number.isFinite(value) && value >= 1) update(value)
          }}
        />
        <button type="button" aria-label="Increase quantity" onClick={() => update(quantity + 1)}>
          +
        </button>
      </div>
    </div>
  )
}

const TABS = [
  { id: 'details', label: 'Details', content: (
    <ul>
      <li>Ripstop mesh upper with welded overlays for trail protection</li>
      <li>Rock plate underfoot to shield against sharp stones</li>
      <li>4 mm lugs made from grippy wet-traction rubber</li>
      <li>Weight: 289 g per shoe (US 9)</li>
      <li>Drop: 6 mm heel to toe</li>
    </ul>
  ) },
  { id: 'reviews', label: 'Reviews', content: (
    <div>
      <h3>4.6 out of 5 from 128 reviews</h3>
      <blockquote>
        “Gripped everything from wet roots to loose gravel. No blisters after a 30 km day.”
        <footer>— Maya R., verified buyer</footer>
      </blockquote>
      <blockquote>
        “True to size with a roomy toe box. The rock plate is a lifesaver on scree.”
        <footer>— Daniel K., verified buyer</footer>
      </blockquote>
    </div>
  ) },
  { id: 'shipping', label: 'Shipping', content: (
    <ul>
      <li>Free standard shipping on orders over $75</li>
      <li>Express delivery in 1–2 business days for $12</li>
      <li>Free returns within 60 days, worn or unworn</li>
    </ul>
  ) },
]

function MoreInfo() {
  const [active, setActive] = useState('details')
  const activeTab = TABS.find((tab) => tab.id === active)

  const move = (offset) => {
    const index = TABS.findIndex((tab) => tab.id === active)
    const next = TABS[(index + offset + TABS.length) % TABS.length]
    setActive(next.id)
    document.getElementById(`tab-${next.id}`)?.focus()
  }

  return (
    <section className="more-info">
      <h2>More information</h2>
      <div
        role="tablist"
        aria-label="More information"
        className="tablist"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            move(1)
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            move(-1)
          }
          if (event.key === 'Home') {
            event.preventDefault()
            setActive(TABS[0].id)
            document.getElementById(`tab-${TABS[0].id}`)?.focus()
          }
          if (event.key === 'End') {
            event.preventDefault()
            setActive(TABS[TABS.length - 1].id)
            document.getElementById(`tab-${TABS[TABS.length - 1].id}`)?.focus()
          }
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            className={active === tab.id ? 'tab tab-active' : 'tab'}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="tabpanel"
      >
        {activeTab.content}
      </div>
    </section>
  )
}

const QUESTIONS = [
  {
    question: 'Does the Trail Runner 2 run true to size?',
    answer: 'Yes. Most shoppers take their usual running size; if you are between sizes, take the larger one for long descents.',
  },
  {
    question: 'Can I use it on roads as well as trails?',
    answer: 'Absolutely. The midsole is cushioned enough for road sections, while the lugs stay quiet on pavement.',
  },
  {
    question: 'Is the shoe waterproof?',
    answer: 'No, it is a breathable trail shoe. Water drains quickly through the mesh, and a waterproof model arrives next season.',
  },
  {
    question: 'How do I clean it?',
    answer: 'Remove the insole, brush off mud, and hand wash with mild soap. Let it air dry away from direct heat.',
  },
]

function Questions() {
  const [open, setOpen] = useState(null)
  return (
    <section className="questions" aria-label="Questions">
      <h2>Questions &amp; answers</h2>
      {QUESTIONS.map((entry, index) => {
        const buttonId = `question-${index}`
        return (
          <div className="question" key={buttonId}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open === index}
                aria-controls={`answer-${index}`}
                className="question-toggle"
                onClick={() => setOpen(open === index ? null : index)}
              >
                {entry.question}
              </button>
            </h3>
            {open === index && (
              <div
                role="region"
                id={`answer-${index}`}
                aria-labelledby={buttonId}
                className="answer"
              >
                <p>{entry.answer}</p>
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <h2>Customer Help</h2>
        <ul>
          <li>
            <a href="#">Contact us</a>
          </li>
          <li>
            <a href="#">Shipping</a>
          </li>
          <li>
            <a href="#">Returns &amp; exchanges</a>
          </li>
        </ul>
      </div>
      <div>
        <h2>Company</h2>
        <ul>
          <li>
            <a href="#">About us</a>
          </li>
          <li>
            <a href="#">Careers</a>
          </li>
          <li>
            <a href="#">Sustainability</a>
          </li>
        </ul>
      </div>
      <div>
        <h2>Follow us</h2>
        <ul className="social">
          <li>
            <a href="#">Instagram</a>
          </li>
          <li>
            <a href="#">Facebook</a>
          </li>
          <li>
            <a href="#">YouTube</a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default function ProductPage() {
  const [color, setColor] = useState('blue')
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [cartCount, setCartCount] = useState(0)
  const [message, setMessage] = useState('')
  const [saved, setSaved] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const sizeGuideButtonRef = useRef(null)

  const closeSizeGuide = () => {
    setSizeGuideOpen(false)
    sizeGuideButtonRef.current?.focus()
  }

  const addToCart = () => {
    if (!selectedSize) {
      setMessage('Please pick a size before adding the Trail Runner 2 to your bag.')
      return
    }
    setCartCount((count) => count + quantity)
    setMessage(
      `Trail Runner 2 in ${COLOR_OPTIONS.find((c) => c.id === color).name}, US ${selectedSize} × ${quantity} added to bag.`,
    )
  }

  return (
    <div className="page">
      <Header cartCount={cartCount} />
      <main>
        <Breadcrumb />
        <div className="product">
          <Photos color={color} />
          <div className="product-details">
            <h1>Trail Runner 2</h1>
            <p className="tagline">Grip the trail. Own the descent.</p>
            <Price />
            <ColorPicker color={color} onChange={setColor} />
            <div className="size-row">
              <SizePicker selectedSize={selectedSize} onSelect={setSelectedSize} />
              <button
                type="button"
                ref={sizeGuideButtonRef}
                className="size-guide-button"
                onClick={() => setSizeGuideOpen(true)}
              >
                Size guide
              </button>
            </div>
            <Quantity quantity={quantity} onChange={setQuantity} />
            <div className="actions">
              <button type="button" className="add-to-cart" onClick={addToCart}>
                Add to bag
              </button>
              <button
                type="button"
                className="wishlist"
                aria-pressed={saved}
                onClick={() => setSaved((value) => !value)}
              >
                <span aria-hidden="true">{saved ? '♥' : '♡'}</span> Save to wishlist
              </button>
            </div>
            <p className="status" role="status">
              {message}
            </p>
          </div>
        </div>
        <MoreInfo />
        <Questions />
      </main>
      <Footer />
      {sizeGuideOpen && <SizeGuideDialog onClose={closeSizeGuide} />}
    </div>
  )
}
