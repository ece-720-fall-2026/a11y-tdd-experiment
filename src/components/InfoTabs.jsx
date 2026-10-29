import { useState } from 'react'
import { product } from '../data/trailRunner2.js'

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'shipping', label: 'Shipping & Returns' },
]

function Stars({ rating }) {
  return <span className="stars" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}</span>
}

export default function InfoTabs() {
  const [active, setActive] = useState('details')
  const reviews = product.reviews
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  const panel = {
    details: (
      <ul className="plain-list">
        {product.details.map((d) => <li key={d}>{d}</li>)}
      </ul>
    ),
    reviews: (
      <div>
        <p className="reviews__summary">
          <Stars rating={avg} /> <strong>{avg.toFixed(1)}</strong> out of 5 · {reviews.length} reviews
        </p>
        <ul className="reviews">
          {reviews.map((r) => (
            <li key={r.id} className="review">
              <div className="review__head">
                <Stars rating={r.rating} />
                <strong>{r.title}</strong>
              </div>
              <p>{r.body}</p>
              <p className="muted">{r.author} · {r.date}</p>
            </li>
          ))}
        </ul>
      </div>
    ),
    shipping: (
      <ul className="plain-list">
        {product.shipping.map((s) => <li key={s}>{s}</li>)}
      </ul>
    ),
  }

  return (
    <section className="info-tabs" aria-label="More information">
      <div role="tablist" aria-label="Product information" className="info-tabs__list">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            className={`info-tabs__tab${active === t.id ? ' is-active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {TABS.map((t) => (
        <div
          key={t.id}
          id={`panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== t.id}
          className="info-tabs__panel"
        >
          {panel[t.id]}
        </div>
      ))}
    </section>
  )
}
