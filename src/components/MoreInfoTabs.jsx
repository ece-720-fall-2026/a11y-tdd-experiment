import { useId, useRef, useState } from 'react'
import { product } from '../data/product.js'
import Stars from './Stars.jsx'

// Tabs following the WAI-ARIA tabs pattern: roving tabindex, arrow/Home/End keys.
export default function MoreInfoTabs() {
  const headingId = useId()
  const baseId = useId()
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'shipping', label: 'Shipping & returns' },
  ]
  const [selected, setSelected] = useState('details')
  const tabRefs = useRef({})

  const select = (id, focus = false) => {
    setSelected(id)
    if (focus) tabRefs.current[id]?.focus()
  }

  const onKeyDown = (event) => {
    const index = tabs.findIndex((t) => t.id === selected)
    let next = null
    if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length].id
    if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length].id
    if (event.key === 'Home') next = tabs[0].id
    if (event.key === 'End') next = tabs[tabs.length - 1].id
    if (next) {
      event.preventDefault()
      select(next, true)
    }
  }

  const tabId = (id) => `${baseId}-tab-${id}`
  const panelId = (id) => `${baseId}-panel-${id}`

  return (
    <section className="more-info container" aria-labelledby={headingId}>
      <h2 id={headingId}>More information</h2>
      <div role="tablist" aria-label="More information" className="tablist" onKeyDown={onKeyDown}>
        {tabs.map((tab) => {
          const isSelected = tab.id === selected
          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              id={tabId(tab.id)}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId(tab.id)}
              tabIndex={isSelected ? 0 : -1}
              className="tab"
              onClick={() => select(tab.id)}
            >
              {tab.label}
              {tab.id === 'reviews' && ` (${product.rating.count})`}
            </button>
          )
        })}
      </div>

      <div
        id={panelId('details')}
        role="tabpanel"
        aria-labelledby={tabId('details')}
        hidden={selected !== 'details'}
        tabIndex={0}
        className="tabpanel"
      >
        <ul className="plain-list">
          {product.details.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div
        id={panelId('reviews')}
        role="tabpanel"
        aria-labelledby={tabId('reviews')}
        hidden={selected !== 'reviews'}
        tabIndex={0}
        className="tabpanel"
      >
        <p>
          <Stars value={product.rating.average} /> {product.rating.average} out of 5 based on {product.rating.count} reviews
        </p>
        <ul className="plain-list reviews">
          {product.reviews.map((review) => (
            <li key={review.id} className="review">
              <p>
                <Stars value={review.rating} /> <strong>{review.author}</strong>{' '}
                <time dateTime={review.date}>{review.date}</time>
              </p>
              <p>{review.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <div
        id={panelId('shipping')}
        role="tabpanel"
        aria-labelledby={tabId('shipping')}
        hidden={selected !== 'shipping'}
        tabIndex={0}
        className="tabpanel"
      >
        <ul className="plain-list">
          {product.shipping.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
