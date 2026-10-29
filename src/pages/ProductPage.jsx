import { useEffect, useId, useRef, useState } from 'react'
import '../styles/product.css'

/* ------------------------------------------------------------------ */
/* Mock data                                                          */
/* ------------------------------------------------------------------ */

const PHOTOS = [
  { label: 'Side view of the Trail Runner 2', art: 'side' },
  { label: 'Trail Runner 2 seen from above', art: 'top' },
  { label: 'Close-up of the Trail Runner 2 outsole', art: 'sole' },
]

const COLORS = [
  { id: 'storm-blue', name: 'Storm Blue', hex: '#3f5f7d' },
  { id: 'graphite-black', name: 'Graphite Black', hex: '#2b2b2b' },
  { id: 'ridge-grey', name: 'Ridge Grey', hex: '#9aa0a6' },
]

const SIZES = [
  { id: 'us-8', label: 'US 8 / EU 41', soldOut: true },
  { id: 'us-9', label: 'US 9 / EU 42', soldOut: false },
  { id: 'us-10', label: 'US 10 / EU 43', soldOut: false },
  { id: 'us-11', label: 'US 11 / EU 44', soldOut: true },
  { id: 'us-12', label: 'US 12 / EU 45', soldOut: false },
]

const TABS = [
  { id: 'details', label: 'Details', heading: 'Details' },
  { id: 'reviews', label: 'Reviews', heading: 'Reviews' },
  { id: 'shipping', label: 'Shipping', heading: 'Shipping & returns' },
]

const TAB_CONTENT = {
  details: (
    <>
      <p>
        The Trail Runner 2 is built for wet roots, loose gravel and long
        climbs. A 4mm drop, a rock plate underfoot and a knit upper that
        drains fast keep you moving on technical ground.
      </p>
      <ul>
        <li>Weight: 300g (US 9)</li>
        <li>Drop: 4mm</li>
        <li>Upper: recycled knit with welded overlays</li>
        <li>Outsole: 4mm lugs, sticky trail rubber</li>
      </ul>
    </>
  ),
  reviews: (
    <>
      <p>
        <strong>4.4 out of 5</strong> from 126 verified reviews.
      </p>
      <blockquote>
        <p>"Grippy on everything and the fit is spot on out of the box."</p>
        <footer>— Priya M., verified buyer</footer>
      </blockquote>
      <blockquote>
        <p>"Ran 50km of muddy trail with dry feet. Impressive."</p>
        <footer>— Tomás R., verified buyer</footer>
      </blockquote>
    </>
  ),
  shipping: (
    <>
      <p>
        Free standard shipping on orders over $100. Express shipping in 2-3
        business days for $12.
      </p>
      <p>
        Returns are free within 60 days. Shoes can be worn outside - we just
        ask that you clean them first.
      </p>
    </>
  ),
}

const QUESTIONS = [
  {
    q: 'Does it run true to size?',
    a: 'Yes. Most shoppers pick their usual running size. If you are between sizes, we suggest going up half a size for descents.',
  },
  {
    q: 'Can I use it on roads as well as trails?',
    a: 'You can. The cushioning works on roads, but the 4mm lugs are loudest and most effective on dirt and gravel.',
  },
  {
    q: 'How do I clean it?',
    a: 'Rinse off mud with cold water, remove the insole to dry, and let the shoe air dry away from direct heat.',
  },
]

/* ------------------------------------------------------------------ */
/* Little inline artwork so the page needs no image files               */
/* ------------------------------------------------------------------ */

function ShoeArt({ kind, color }) {
  const paths = {
    side: (
      <>
        <path
          d="M40 120c-8 0-14-6-14-14 0-6 3-10 8-13l30-14 20-18 14 4 10 12 34 8c14 3 22 12 22 22 0 9-8 15-18 15H40z"
          fill={color}
        />
        <path d="M78 79l16 6-10 10-10-8z" fill="#ffffff" opacity="0.25" />
        <path
          d="M26 108c4 8 12 12 22 12h96c8 0 14-4 16-11-2 8-8 11-16 11H48c-10 0-18-4-22-12z"
          fill="#000"
          opacity="0.35"
        />
        <path d="M40 120h120" stroke="#000" strokeOpacity="0.2" strokeWidth="2" />
      </>
    ),
    top: (
      <>
        <path
          d="M110 50c34 0 62 20 62 44s-28 42-62 42S48 118 48 94s28-44 62-44z"
          fill={color}
        />
        <path d="M110 50c10 0 18 6 18 14s-8 14-18 14-18-6-18-14 8-14 18-14z" fill="#fff" opacity="0.3" />
        <path d="M110 64c16 0 30 14 30 30s-14 30-30 30-30-14-30-30 14-30 30-30z" fill="none" stroke="#000" strokeOpacity="0.25" strokeWidth="4" />
        <path d="M104 72l6 44M124 72l-6 44M92 84l36 26M128 84l-36 26" stroke="#000" strokeOpacity="0.18" strokeWidth="4" />
      </>
    ),
    sole: (
      <>
        <path d="M30 96c10-6 24-8 40-4l52 12 34-4c12 0 24 4 30 10 4 4 2 10-4 12l-30 6-40 8c-18 2-38-2-52-10-12-6-14-22-4-30z" fill={color} opacity="0.5" />
        <g stroke="#111" strokeWidth="6" strokeLinecap="round">
          <path d="M44 92v28M60 90v32M76 94v30M92 98v28M108 102v26M124 106v22M140 108v20M156 108v20" />
        </g>
      </>
    ),
  }
  return (
    <svg viewBox="0 0 220 150" role="img" aria-hidden="true" focusable="false">
      {paths[kind]}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                      */
/* ------------------------------------------------------------------ */

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2 4.6 5.5 3.6 7.8 3 10.2 4 12 6.1 13.8 4 16.2 3 18.5 3.6 22 4.6 23.6 8.4 22 11.7 19.5 16.4 12 21 12 21z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Size guide dialog (APG dialog pattern)                             */
/* ------------------------------------------------------------------ */

function SizeGuideDialog({ onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const headingId = useId()
  const [footLength, setFootLength] = useState('')
  const [unit, setUnit] = useState('us')

  useEffect(() => {
    const node = dialogRef.current
    // Guard against React StrictMode running the effect twice.
    if (node && !node.open) node.showModal()
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // Close the native dialog first: while it is modal, the browser will not
  // let focus move outside it, so the parent can only move focus after
  // close() has run. The dialog's `close` event then triggers `onClose`.
  function requestClose() {
    dialogRef.current?.close()
  }

  const lengthCm = parseFloat(footLength)
  const valid = !Number.isNaN(lengthCm) && lengthCm >= 18 && lengthCm <= 34
  const recommended = (() => {
    if (!valid) return null
    const us = Math.round((lengthCm / 2.54) * 3 - 22)
    if (us < 8) return 'US 8 / EU 41'
    if (us > 12) return 'US 12 / EU 45'
    return `US ${us} / EU ${us + 33}`
  })()

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={headingId}
      className="modal"
      onClose={onClose}
      onCancel={requestClose}
    >
      <div className="modal__panel">
        <div className="modal__header">
          <h2 id={headingId}>Size guide</h2>
          <button
            ref={closeRef}
            type="button"
            className="btn btn--ghost"
            onClick={requestClose}
          >
            Close
          </button>
        </div>
        <p>
          Measure your foot from heel to longest toe, then choose US or EU to
          see your size.
        </p>
        <div className="size-guide__controls">
          <label htmlFor="foot-length">Foot length (cm)</label>
          <input
            id="foot-length"
            type="number"
            inputMode="decimal"
            min="18"
            max="34"
            step="0.5"
            value={footLength}
            onChange={(e) => setFootLength(e.target.value)}
            aria-describedby="foot-length-hint"
          />
          <p id="foot-length-hint" className="hint">
            Enter a length between 18 and 34 cm.
          </p>
          <fieldset>
            <legend>Unit</legend>
            <label>
              <input
                type="radio"
                name="size-guide-unit"
                checked={unit === 'us'}
                onChange={() => setUnit('us')}
              />{' '}
              US
            </label>
            <label>
              <input
                type="radio"
                name="size-guide-unit"
                checked={unit === 'eu'}
                onChange={() => setUnit('eu')}
              />{' '}
              EU
            </label>
          </fieldset>
          <p className="size-guide__result" aria-live="polite">
            {valid
              ? unit === 'us'
                ? `Your size is ${recommended}.`
                : `Your size is ${recommended.split(' / ')[1]}.`
              : 'Enter a foot length to see your size.'}
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={requestClose}>
          Back to the shoe
        </button>
      </div>
    </dialog>
  )
}

/* ------------------------------------------------------------------ */
/* Product page                                                       */
/* ------------------------------------------------------------------ */

export default function ProductPage() {
  const [cartCount, setCartCount] = useState(1)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [color, setColor] = useState(COLORS[0])
  const [size, setSize] = useState(null)
  const [sizeOpen, setSizeOpen] = useState(false)
  const [sizeActive, setSizeActive] = useState(-1)
  const [qty, setQty] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [tab, setTab] = useState('details')
  const [openQuestion, setOpenQuestion] = useState(0)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  const priceHintId = useId()
  const sizeErrorId = useId()
  const liveId = useId()
  const comboId = useId()
  const listboxId = useId()
  const sizeButtonRef = useRef(null)
  const tabRefs = useRef({})

  const availableSizes = SIZES.filter((s) => !s.soldOut)

  function go(delta) {
    setPhotoIndex((i) => (i + delta + PHOTOS.length) % PHOTOS.length)
  }

  function openSizeGuide() {
    setSizeGuideOpen(true)
  }

  function closeSizeGuide() {
    setSizeGuideOpen(false)
    sizeButtonRef.current?.focus()
  }

  function addToCart() {
    if (!size) {
      setSizeError(true)
      sizeButtonRef.current?.focus()
      return
    }
    setSizeError(false)
    setCartCount((c) => c + qty)
    setAdded(true)
  }

  function onKeyDownCombobox(e) {
    if (sizeOpen) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setSizeOpen(false)
        sizeButtonRef.current?.focus()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        setSizeOpen(true)
        setSizeActive((i) => {
          const dir = e.key === 'ArrowDown' ? 1 : -1
          let next = i + dir
          while (next >= 0 && next < SIZES.length && SIZES[next].soldOut) {
            next += dir
          }
          return next >= 0 && next < SIZES.length ? next : i
        })
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (sizeActive >= 0 && !SIZES[sizeActive].soldOut) {
          setSize(SIZES[sizeActive])
          setSizeOpen(false)
          sizeButtonRef.current?.focus()
        }
      } else if (e.key === 'Home') {
        e.preventDefault()
        setSizeActive(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setSizeActive(SIZES.length - 1)
      }
    } else {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setSizeOpen(true)
        setSizeActive(availableSizes.length ? SIZES.findIndex((s) => !s.soldOut) : -1)
      }
    }
  }

  function onTabKeyDown(e, index) {
    let newIndex = null
    if (e.key === 'ArrowRight') newIndex = (index + 1) % TABS.length
    if (e.key === 'ArrowLeft') newIndex = (index - 1 + TABS.length) % TABS.length
    if (e.key === 'Home') newIndex = 0
    if (e.key === 'End') newIndex = TABS.length - 1
    if (newIndex !== null) {
      e.preventDefault()
      const nextTab = TABS[newIndex]
      setTab(nextTab.id)
      tabRefs.current[nextTab.id]?.focus()
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <header className="site-header">
        <a className="site-header__brand" href="/">
          Stride
        </a>
        <p className="site-header__cart">
          Cart:{' '}
          <span aria-live="polite" aria-atomic="true">
            {cartCount} {cartCount === 1 ? 'item' : 'items'}
          </span>
        </p>
      </header>

      <main id="main" className="product">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumb">
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

        <div className="product__grid">
          <section className="gallery" aria-roledescription="carousel" aria-label="Trail Runner 2 photos">
            <div className="gallery__frame">
              <ShoeArt kind={PHOTOS[photoIndex].art} color={color.hex} />
              <span className="visually-hidden" aria-live="polite">
                {`Photo ${photoIndex + 1} of ${PHOTOS.length}: ${PHOTOS[photoIndex].label}, ${color.name}`}
              </span>
            </div>
            <div className="gallery__controls">
              <button type="button" className="btn btn--icon" onClick={() => go(-1)}>
                <span aria-hidden="true">‹</span> Previous photo
              </button>
              <button type="button" className="btn btn--icon" onClick={() => go(1)}>
                Next photo <span aria-hidden="true">›</span>
              </button>
            </div>
          </section>

          <section className="info" aria-labelledby="product-title">
            <h1 id="product-title">Trail Runner 2</h1>
            <p className="product__tagline">Grip the trail. Own the descent.</p>

            <p className="price">
              <span className="price__amount">$120.00 CAD</span>
              <button
                type="button"
                className="price__info"
                aria-describedby={priceHintId}
              >
                <span aria-hidden="true">i</span>
                <span className="visually-hidden">About the price</span>
              </button>
              <span id={priceHintId} role="tooltip" className="tooltip">
                Tax included. Duties may apply outside Canada.
              </span>
            </p>

            <fieldset className="colors">
              <legend>Color: {color.name}</legend>
              <div role="radiogroup" aria-label="Color" className="colors__swatches">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={c.id === color.id}
                    className="swatch"
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setColor(c)}
                  >
                    <span className="visually-hidden">{c.name}</span>
                    {c.id === color.id && (
                      <span className="swatch__check" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="size-row">
              <label id={comboId} className="size-row__label">
                Size
              </label>
              <button
                ref={sizeButtonRef}
                type="button"
                role="combobox"
                aria-controls={listboxId}
                aria-expanded={sizeOpen}
                aria-haspopup="listbox"
                aria-labelledby={`${comboId} ${comboId}-value`}
                aria-describedby={sizeError ? sizeErrorId : undefined}
                className="combo"
                onClick={() => {
                  setSizeOpen((o) => !o)
                  setSizeActive(availableSizes.length ? SIZES.findIndex((s) => !s.soldOut) : -1)
                }}
                onKeyDown={onKeyDownCombobox}
                onBlur={() => setSizeOpen(false)}
              >
                <span id={`${comboId}-value`}>{size ? size.label : 'Select a size'}</span>
                <span aria-hidden="true">▾</span>
              </button>
              <button type="button" className="link-btn" onClick={openSizeGuide}>
                Size guide
              </button>
              {sizeOpen && (
                <ul
                  id={listboxId}
                  role="listbox"
                  aria-labelledby={comboId}
                  className="listbox"
                >
                  {SIZES.map((s, i) => (
                    <li
                      key={s.id}
                      role="option"
                      aria-selected={size?.id === s.id}
                      aria-disabled={s.soldOut}
                      className={`listbox__option${s.soldOut ? ' is-soldout' : ''}${
                        i === sizeActive ? ' is-active' : ''
                      }`}
                      tabIndex={-1}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        if (!s.soldOut) {
                          setSize(s)
                          setSizeOpen(false)
                          sizeButtonRef.current?.focus()
                        }
                      }}
                    >
                      {s.label}
                      {s.soldOut && <span className="badge">Sold out</span>}
                    </li>
                  ))}
                </ul>
              )}
              {sizeError && (
                <p id={sizeErrorId} className="error">
                  Please pick a size before adding to the cart.
                </p>
              )}
            </div>

            <div className="qty-row">
              <label htmlFor="quantity">Quantity</label>
              <div className="qty">
                <button
                  type="button"
                  className="btn btn--icon"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <span aria-hidden="true">−</span>
                </button>
                <input
                  id="quantity"
                  type="text"
                  role="spinbutton"
                  aria-valuemin={1}
                  aria-valuemax={10}
                  aria-valuenow={qty}
                  aria-valuetext={`${qty} ${qty === 1 ? 'pair' : 'pairs'}`}
                  inputMode="numeric"
                  value={qty}
                  onChange={(e) => {
                    const n = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10)
                    if (Number.isNaN(n)) setQty(1)
                    else setQty(Math.min(10, Math.max(1, n)))
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      setQty((q) => Math.min(10, q + 1))
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      setQty((q) => Math.max(1, q - 1))
                    } else if (e.key === 'Home') {
                      e.preventDefault()
                      setQty(1)
                    } else if (e.key === 'End') {
                      e.preventDefault()
                      setQty(10)
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn--icon"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                >
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </div>

            <div className="actions">
              <button type="button" className="btn btn--primary" onClick={addToCart}>
                Add to bag
              </button>
              <button
                type="button"
                className={`btn btn--wishlist${wishlisted ? ' is-active' : ''}`}
                aria-pressed={wishlisted}
                onClick={() => setWishlisted((w) => !w)}
              >
                <HeartIcon filled={wishlisted} />
                {wishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
              </button>
            </div>
            <p id={liveId} aria-live="polite" className="confirm">
              {added
                ? `Added ${qty} ${qty === 1 ? 'pair' : 'pairs'} of Trail Runner 2 (${color.name}, ${
                    size?.label
                  }) to your bag.`
                : ''}
            </p>
          </section>
        </div>

        <section className="tabs-section" aria-labelledby="tabs-heading">
          <h2 id="tabs-heading">More information</h2>
          <div role="tablist" aria-label="More information" className="tablist">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => (tabRefs.current[t.id] = el)}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`panel-${t.id}`}
                tabIndex={tab === t.id ? 0 : -1}
                className="tab"
                onClick={() => setTab(t.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
              >
                {t.label}
              </button>
            ))}
          </div>
          {TABS.filter((t) => t.id === tab).map((t) => (
            <div
              key={t.id}
              role="tabpanel"
              id={`panel-${t.id}`}
              aria-labelledby={`tab-${t.id}`}
              tabIndex={0}
              className="tabpanel"
            >
              <h3>{t.heading}</h3>
              {TAB_CONTENT[t.id]}
            </div>
          ))}
        </section>

        <section className="questions" aria-labelledby="questions-heading">
          <h2 id="questions-heading">Questions</h2>
          {QUESTIONS.map((item, i) => {
            const open = openQuestion === i
            return (
              <div key={i} className="accordion">
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`question-${i}`}
                    id={`question-button-${i}`}
                    className="accordion__trigger"
                    onClick={() => setOpenQuestion(open ? -1 : i)}
                  >
                    {item.q}
                    <span aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                </h3>
                <div
                  id={`question-${i}`}
                  role="region"
                  aria-labelledby={`question-button-${i}`}
                  hidden={!open}
                  className="accordion__panel"
                >
                  <p>{item.a}</p>
                </div>
              </div>
            )
          })}
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__cols">
          <section aria-labelledby="footer-help">
            <h2 id="footer-help">Customer help</h2>
            <ul>
              <li><a href="/">Contact us</a></li>
              <li><a href="/">Shipping & delivery</a></li>
              <li><a href="/">Returns & exchanges</a></li>
            </ul>
          </section>
          <section aria-labelledby="footer-company">
            <h2 id="footer-company">Company</h2>
            <ul>
              <li><a href="/">About Stride</a></li>
              <li><a href="/">Careers</a></li>
              <li><a href="/">Sustainability</a></li>
            </ul>
          </section>
          <section aria-labelledby="footer-social">
            <h2 id="footer-social">Follow us</h2>
            <ul>
              <li><a href="/">Instagram</a></li>
              <li><a href="/">Facebook</a></li>
              <li><a href="/">X</a></li>
              <li><a href="/">LinkedIn</a></li>
            </ul>
          </section>
        </div>
        <p className="site-footer__legal">© 2026 Stride. All rights reserved.</p>
      </footer>

      {sizeGuideOpen && <SizeGuideDialog onClose={closeSizeGuide} />}
    </>
  )
}
