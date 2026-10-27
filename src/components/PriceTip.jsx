import { useId, useState } from 'react'

// The price with a small "i" that explains the price includes taxes.
export default function PriceTip({ children }) {
  const [open, setOpen] = useState(false)
  const tipId = useId()

  return (
    <span
      className="price-tip"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}
      <button
        type="button"
        className="info-button"
        aria-label="Price information"
        aria-describedby={open ? tipId : undefined}
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        i
      </button>
      {open && (
        <span role="tooltip" id={tipId} className="tooltip">
          Price includes taxes.
        </span>
      )}
    </span>
  )
}
