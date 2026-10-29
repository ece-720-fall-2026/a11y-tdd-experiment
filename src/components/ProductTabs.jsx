import { useId, useRef, useState } from 'react'
import { product } from '../data/product.js'

// APG Tabs pattern: roving tabindex, arrow/Home/End keys, one tabpanel visible.
export default function ProductTabs() {
  const [selected, setSelected] = useState(0)
  const tabRefs = useRef([])
  const baseId = useId()
  const headingId = `${baseId}-heading`

  const tabs = [
    {
      label: 'Details',
      content: (
        <dl className="spec-list">
          {product.details.map(([term, desc]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{desc}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      label: 'Reviews',
      content: (
        <>
          <p>
            <span aria-hidden="true">★★★★★</span> {product.rating} out of 5 stars from {product.reviewCount} reviews
          </p>
          <ul className="review-list">
            {product.reviews.map((review) => (
              <li key={review.author}>
                <p>
                  <strong>{review.author}</strong>, {review.rating} out of 5 stars
                </p>
                <p>{review.text}</p>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      label: 'Shipping',
      content: product.shipping.map((text) => <p key={text}>{text}</p>),
    },
  ]

  function handleKeyDown(event, index) {
    let next = null
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    if (next === null) return
    event.preventDefault()
    setSelected(next)
    tabRefs.current[next].focus()
  }

  return (
    <section className="info-section" aria-labelledby={headingId}>
      <h2 id={headingId}>More information</h2>
      <div role="tablist" aria-labelledby={headingId} className="tablist">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={selected === i}
            aria-controls={`${baseId}-panel-${i}`}
            tabIndex={selected === i ? 0 : -1}
            ref={(el) => (tabRefs.current[i] = el)}
            onClick={() => setSelected(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={selected !== i}
          tabIndex={0}
          className="tabpanel"
        >
          {tab.content}
        </div>
      ))}
    </section>
  )
}
