import { useId, useState } from 'react'

// Details, reviews and shipping as tabs. Only one panel is shown at a time.
export default function MoreInfo({ product }) {
  const tabs = [
    { id: 'details', label: 'Details', body: <ul>{product.details.map((d) => <li key={d}>{d}</li>)}</ul> },
    {
      id: 'reviews',
      label: 'Reviews',
      body: (
        <div>
          <p>
            <strong>{product.reviews.average.toFixed(1)} out of 5</strong> from {product.reviews.count} reviews
          </p>
          {product.reviews.items.map((r) => (
            <blockquote key={r.author}>
              <p>
                {'★'.repeat(r.rating)}
                {'☆'.repeat(5 - r.rating)} <span className="sr-only">{r.rating} out of 5</span>
              </p>
              <p>{r.text}</p>
              <cite>{r.author}</cite>
            </blockquote>
          ))}
        </div>
      ),
    },
    { id: 'shipping', label: 'Shipping', body: <ul>{product.shipping.map((s) => <li key={s}>{s}</li>)}</ul> },
  ]
  const [active, setActive] = useState('details')
  const baseId = useId()
  const current = tabs.find((t) => t.id === active)

  return (
    <section className="more-info" aria-labelledby={`${baseId}-heading`}>
      <h2 id={`${baseId}-heading`}>More information</h2>
      <div role="tablist" aria-label="More information" className="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`${baseId}-${t.id}-tab`}
            aria-selected={active === t.id}
            aria-controls={`${baseId}-panel`}
            tabIndex={active === t.id ? 0 : -1}
            className={active === t.id ? 'tab active' : 'tab'}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-${current.id}-tab`} className="tabpanel">
        {current.body}
      </div>
    </section>
  )
}
