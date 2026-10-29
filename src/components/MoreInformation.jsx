import { useId, useRef, useState } from 'react'

// Details, reviews and shipping as a tab list. One panel shows at a time.
export default function MoreInformation({ product }) {
  const [selected, setSelected] = useState('details')
  const baseId = useId()
  const tabRefs = useRef({})

  const tabs = [
    {
      id: 'details',
      label: 'Details',
      body: (
        <ul className="plain-list">
          {product.details.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ),
    },
    {
      id: 'reviews',
      label: 'Reviews',
      body: (
        <>
          <p className="rating-summary">
            Rated {product.reviews.average} out of 5 from {product.reviews.count} reviews
          </p>
          {product.reviews.items.map((review) => (
            <article key={review.author} className="review">
              <h3>
                {review.author}, {review.rating} out of 5 stars
              </h3>
              <p>{review.text}</p>
            </article>
          ))}
        </>
      ),
    },
    {
      id: 'shipping',
      label: 'Shipping',
      body: (
        <ul className="plain-list">
          {product.shipping.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ),
    },
  ]

  function handleKeyDown(event, index) {
    let next
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return

    event.preventDefault()
    setSelected(tabs[next].id)
    tabRefs.current[tabs[next].id]?.focus()
  }

  return (
    <section className="more-info" aria-labelledby={`${baseId}-heading`}>
      <h2 id={`${baseId}-heading`}>More information</h2>
      <div className="tab-list" role="tablist" aria-label="More information">
        {tabs.map((tab, index) => {
          const isSelected = tab.id === selected
          return (
            <button
              key={tab.id}
              ref={(node) => (tabRefs.current[tab.id] = node)}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              className={isSelected ? 'tab is-selected' : 'tab'}
              onClick={() => setSelected(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          tabIndex={0}
          hidden={tab.id !== selected}
          className="tab-panel"
        >
          {tab.body}
        </div>
      ))}
    </section>
  )
}
