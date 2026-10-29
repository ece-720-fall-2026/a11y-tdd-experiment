import { useId, useState } from 'react'

export default function PriceInfo({ price, currency }) {
  const [open, setOpen] = useState(false)
  const tipId = useId()
  const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price)

  return (
    <div className="price-row">
      <span className="price">{formatted}</span>
      <span className="price-info-wrap">
        <button
          type="button"
          className="info-button"
          aria-label="Price information"
          aria-describedby={open ? tipId : undefined}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          i
        </button>
        {open && (
          <span role="tooltip" id={tipId} className="tooltip">
            Price includes all taxes.
          </span>
        )}
      </span>
    </div>
  )
}
