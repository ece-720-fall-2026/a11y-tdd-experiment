import { useId, useState } from 'react'

export default function PriceInfo({ price, currency }) {
  const [open, setOpen] = useState(false)
  const tipId = useId()
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)

  return (
    <div className={`price-row${open ? ' is-open' : ''}`}>
      <span className="price">{formatted}</span>
      <span className="price-info">
        <button
          type="button"
          className="info-btn"
          aria-label="Price information"
          aria-describedby={tipId}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        >
          i
        </button>
        <span role="tooltip" id={tipId} className="price-tip">
          Includes taxes.
        </span>
      </span>
    </div>
  )
}
