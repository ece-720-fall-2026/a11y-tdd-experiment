import { useRef, useState } from 'react'

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'shipping', label: 'Shipping' },
]

// APG tabs: arrow keys, Home and End move between tabs; only the selected panel is rendered.
export default function MoreInfo({ details, reviews, shipping }) {
  const [selected, setSelected] = useState('details')
  const refs = useRef({})

  const select = (index) => {
    const tab = TABS[(index + TABS.length) % TABS.length]
    setSelected(tab.id)
    refs.current[tab.id]?.focus()
  }

  const onKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); select(index + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); select(index - 1) }
    else if (e.key === 'Home') { e.preventDefault(); select(0) }
    else if (e.key === 'End') { e.preventDefault(); select(TABS.length - 1) }
  }

  return (
    <section aria-labelledby="more-info-title" className="more-info">
      <h2 id="more-info-title">More information</h2>
      <div role="tablist" aria-label="More information" className="tablist">
        {TABS.map((tab, i) => {
          const isSelected = selected === tab.id
          return (
            <button
              key={tab.id}
              ref={(el) => (refs.current[tab.id] = el)}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              className="tab"
              onClick={() => setSelected(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      {TABS.map((tab) => {
        const content = { details, reviews, shipping }[tab.id]
        if (selected !== tab.id) return null
        return (
          <div key={tab.id} role="tabpanel" id={`panel-${tab.id}`} aria-labelledby={`tab-${tab.id}`} className="tabpanel">
            {content}
          </div>
        )
      })}
    </section>
  )
}
