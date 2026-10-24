import { useId, useState } from 'react'

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'shipping', label: 'Shipping' },
]

export default function MoreInfo({ product }) {
  const [active, setActive] = useState('details')
  const baseId = useId()
  const tabId = (id) => `${baseId}-tab-${id}`
  const panelId = (id) => `${baseId}-panel-${id}`

  return (
    <section className="more-info" aria-labelledby={`${baseId}-heading`}>
      <h2 id={`${baseId}-heading`}>More information</h2>
      <div className="tablist" role="tablist" aria-label="More information">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={tabId(tab.id)}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={panelId(tab.id)}
            tabIndex={active === tab.id ? 0 : -1}
            className={active === tab.id ? 'is-active' : ''}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.id}
          id={panelId(tab.id)}
          role="tabpanel"
          aria-labelledby={tabId(tab.id)}
          hidden={active !== tab.id}
          className="tab-panel"
        >
          {tab.id === 'details' && (
            <>
              <p>{product.description}</p>
              <ul>
                {product.details.map((d) => <li key={d}>{d}</li>)}
              </ul>
            </>
          )}
          {tab.id === 'reviews' && (
            <>
              <p className="rating-line">
                <span aria-label={`${product.rating} out of 5 stars`}>★ {product.rating}</span>
                {' '}from {product.reviewCount} reviews
              </p>
              <ul className="reviews">
                {product.reviews.map((r) => (
                  <li key={r.id}>
                    <p className="review-head">
                      <strong>{r.author}</strong>
                      <span aria-label={`${r.rating} out of 5 stars`}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </p>
                    <p>{r.text}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
          {tab.id === 'shipping' && (
            <ul>
              {product.shipping.map((s) => <li key={s}>{s}</li>)}
            </ul>
          )}
        </div>
      ))}
    </section>
  )
}
