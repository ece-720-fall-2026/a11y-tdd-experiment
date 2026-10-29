import { useId, useRef, useState } from 'react'
import { product } from '../data/product.js'

// Tabs for details, reviews and shipping (APG tabs pattern). Arrow keys move
// between tabs, Home and End jump to the first and last, and only the
// selected tab is in the tab order.
const tabs = [
  { id: 'details', label: 'Details' },
  { id: 'reviews', label: `Reviews (${product.reviewCount})` },
  { id: 'shipping', label: 'Shipping & returns' },
]

function Stars({ rating }) {
  const full = Math.round(rating)
  return (
    <span className="stars" aria-hidden="true">
      {'★'.repeat(full)}
      {'☆'.repeat(5 - full)}
    </span>
  )
}

export default function MoreInfoTabs() {
  const [active, setActive] = useState('details')
  const baseId = useId()
  const tabRefs = useRef({})
  const idFor = (id, kind) => `${baseId}-${kind}-${id}`

  const select = (index) => {
    const tab = tabs[(index + tabs.length) % tabs.length]
    setActive(tab.id)
    tabRefs.current[tab.id]?.focus()
  }

  const onKeyDown = (e, index) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        select(index + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        select(index - 1)
        break
      case 'Home':
        e.preventDefault()
        select(0)
        break
      case 'End':
        e.preventDefault()
        select(tabs.length - 1)
        break
      default:
    }
  }

  return (
    <div className="tabs">
      <div role="tablist" aria-label="More information" className="tabs__list">
        {tabs.map((tab, index) => {
          const selected = active === tab.id
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[tab.id] = el }}
              type="button"
              role="tab"
              id={idFor(tab.id, 'tab')}
              aria-selected={selected}
              aria-controls={idFor(tab.id, 'panel')}
              tabIndex={selected ? 0 : -1}
              className="tabs__tab"
              onClick={() => setActive(tab.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={idFor('details', 'panel')}
        aria-labelledby={idFor('details', 'tab')}
        hidden={active !== 'details'}
        tabIndex={0}
        className="tabs__panel"
      >
        <p>{product.description}</p>
        <ul className="bullets">
          {product.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <div
        role="tabpanel"
        id={idFor('reviews', 'panel')}
        aria-labelledby={idFor('reviews', 'tab')}
        hidden={active !== 'reviews'}
        tabIndex={0}
        className="tabs__panel"
      >
        <p className="rating">
          <Stars rating={product.rating} />{' '}
          {product.rating} out of 5 average from {product.reviewCount} reviews
        </p>
        <ul className="reviews">
          {product.reviews.map((r) => (
            <li key={r.id} className="review">
              <p className="review__head">
                <Stars rating={r.rating} />
                <span className="sr-only">Rated {r.rating} out of 5 stars. </span>
                <strong>{r.author}</strong>{' '}
                <time dateTime={r.date}>
                  {new Date(r.date + 'T00:00:00').toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </p>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div
        role="tabpanel"
        id={idFor('shipping', 'panel')}
        aria-labelledby={idFor('shipping', 'tab')}
        hidden={active !== 'shipping'}
        tabIndex={0}
        className="tabs__panel"
      >
        <ul className="bullets">
          {product.shipping.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
