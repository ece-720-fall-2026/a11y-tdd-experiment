import { useRef, useState } from 'react'
import { product } from '../data/product.js'

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'shipping', label: 'Shipping' },
]

function TabContent({ id }) {
  if (id === 'details') {
    return (
      <ul className="plain-list">
        {product.tabs.details.map((line) => <li key={line}>{line}</li>)}
      </ul>
    )
  }
  if (id === 'reviews') {
    return (
      <>
        <p>{product.tabs.reviewSummary}</p>
        {product.tabs.reviews.map((r) => (
          <blockquote key={r.author} className="review">
            <p>
              <strong>{r.author}</strong>, {r.rating} out of 5
            </p>
            <p>{r.text}</p>
          </blockquote>
        ))}
      </>
    )
  }
  return (
    <ul className="plain-list">
      {product.tabs.shipping.map((line) => <li key={line}>{line}</li>)}
    </ul>
  )
}

// Tabs (APG): arrow keys move between tabs and select them; only one panel is shown.
export default function MoreInfoTabs() {
  const [selected, setSelected] = useState('details')
  const tabRefs = useRef({})

  const select = (id) => {
    setSelected(id)
    tabRefs.current[id]?.focus()
  }

  const onKeyDown = (e, index) => {
    let next = null
    if (e.key === 'ArrowRight') next = (index + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    if (next === null) return
    e.preventDefault()
    select(TABS[next].id)
  }

  return (
    <section aria-labelledby="more-info-title" className="more-info">
      <h2 id="more-info-title">More information</h2>
      <div role="tablist" aria-labelledby="more-info-title" className="tablist">
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected === tab.id ? 0 : -1}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            onClick={() => setSelected(tab.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={selected !== tab.id}
          tabIndex={0}
          className="tabpanel"
        >
          <TabContent id={tab.id} />
        </div>
      ))}
    </section>
  )
}
