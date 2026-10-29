import { useId, useState } from 'react'
import { formatPrice } from '../data/trailRunner2.js'

export default function Price({ amount, currency }) {
  const tipId = useId()
  const [open, setOpen] = useState(false)

  return (
    <div className="price">
      <span className="price__amount">{formatPrice(amount, currency)}</span>
      <span className={`price__info${open ? ' is-open' : ''}`}>
        <button
          type="button"
          className="price__info-btn"
          aria-label="About this price"
          aria-describedby={tipId}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          onBlur={() => setOpen(false)}
        >
          i
        </button>
        <span role="tooltip" id={tipId} className="price__tip">
          Includes taxes.
        </span>
      </span>
    </div>
  )
}
