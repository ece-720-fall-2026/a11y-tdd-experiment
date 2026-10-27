import { useState } from 'react'
import { product } from '../data/product.js'

export default function InfoTabs() {
  const [selected, setSelected] = useState('details')

  const tabs = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <ul className="feature-list">
          {product.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      ),
    },
    {
      id: 'reviews',
      label: `Reviews (${product.reviewCount})`,
      content: (
        <ul className="review-list">
          {product.reviews.map((r) => (
            <li key={r.author}>
              <p className="review-meta">
                <strong>{r.author}</strong> · {r.rating}/5
              </p>
              <p>{r.text}</p>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'shipping',
      label: 'Shipping & returns',
      content: <p>{product.shipping}</p>,
    },
  ]

  const active = tabs.find((t) => t.id === selected)

  return (
    <div className="info-tabs">
      <div role="tablist" aria-label="Product information" className="tablist">
        {tabs.map((t) => {
          const isSelected = t.id === selected
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={isSelected}
              aria-controls={isSelected ? `panel-${t.id}` : undefined}
              tabIndex={isSelected ? 0 : -1}
              className={isSelected ? 'tab selected' : 'tab'}
              onClick={() => setSelected(t.id)}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      <div role="tabpanel" id={`panel-${active.id}`} aria-labelledby={`tab-${active.id}`} className="tab-panel">
        {active.content}
      </div>
    </div>
  )
}
