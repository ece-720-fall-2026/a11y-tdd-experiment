import { useState } from 'react'

const tabs = [
  {
    id: 'details',
    label: 'Details',
    content: (
      <>
        <p>Fabric care: brush off mud and air dry, never machine wash.</p>
        <p>Gear up for adventure: 4 millimetre lugs grip wet rock and loose gravel.</p>
        <p>Shipping and returns: free returns within 30 days of delivery.</p>
      </>
    ),
  },
  {
    id: 'reviews',
    label: 'Reviews',
    content: (
      <>
        <p>“Gripped everything the North Shore threw at me.” — Priya, trail runner</p>
        <p>“True to size and no blisters on a 30 kilometre day.” — Marc</p>
      </>
    ),
  },
  {
    id: 'shipping',
    label: 'Shipping',
    content: (
      <>
        <p>Free shipping on orders over $75 CAD, arriving in 2 to 4 business days.</p>
        <p>Free returns within 30 days, worn on the trail or not.</p>
      </>
    ),
  },
]

export default function InfoTabs() {
  const [selected, setSelected] = useState('details')

  const onKeyDown = (event) => {
    const index = tabs.findIndex((tab) => tab.id === selected)
    let next = null
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = tabs.length - 1
    if (next !== null) {
      event.preventDefault()
      setSelected(tabs[next].id)
      document.getElementById(`tab-${tabs[next].id}`)?.focus()
    }
  }

  return (
    <section aria-labelledby="info-heading" className="info-tabs">
      <h2 id="info-heading">More information</h2>
      <div role="tablist" aria-labelledby="info-heading" onKeyDown={onKeyDown}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected === tab.id ? 0 : -1}
            onClick={() => setSelected(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={selected !== tab.id}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </section>
  )
}
