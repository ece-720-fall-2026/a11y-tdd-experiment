import { useState } from 'react'

const tabs = [
  {
    id: 'details',
    label: 'Details',
    content: (
      <ul>
        <li>Waterproof mesh upper with reinforced toe cap</li>
        <li>Rainshield bootie keeps feet dry on wet trails</li>
        <li>4 mm drop, 8 mm foam midsole</li>
        <li>Grippy rubber outsole with 4 mm lugs</li>
        <li>Weight: 289 g (US 9)</li>
      </ul>
    ),
  },
  {
    id: 'reviews',
    label: 'Reviews',
    content: (
      <>
        <p>4.8 out of 5 from 216 runners</p>
        <ul>
          <li>“Best trail shoe I have owned — dry feet all winter.” — Dana M.</li>
          <li>“Grip is excellent on wet rock.” — Priya S.</li>
          <li>“Roomy toe box and no break-in period.” — Marco L.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'shipping',
    label: 'Shipping',
    content: (
      <>
        <p>Free shipping on orders over $100 CAD.</p>
        <p>Standard delivery: 3–5 business days. Express: 1–2 business days.</p>
        <p>Free returns within 60 days, worn on the trail or not.</p>
      </>
    ),
  },
]

export default function InfoTabs() {
  const [selected, setSelected] = useState('details')

  const onKeyDown = (event) => {
    const index = tabs.findIndex((tab) => tab.id === selected)
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      setSelected(tabs[(index + 1) % tabs.length].id)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setSelected(tabs[(index - 1 + tabs.length) % tabs.length].id)
    }
  }

  return (
    <section className="info-tabs">
      <div role="tablist" aria-label="More information" onKeyDown={onKeyDown}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${tab.id}-tab`}
            aria-selected={selected === tab.id}
            aria-controls={`${tab.id}-panel`}
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
          id={`${tab.id}-panel`}
          aria-labelledby={`${tab.id}-tab`}
          hidden={selected !== tab.id}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </section>
  )
}
