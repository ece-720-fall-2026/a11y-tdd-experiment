import { useState } from 'react'

export default function PriceInfo({ price }) {
  const [open, setOpen] = useState(false)
  const show = () => setOpen(true)
  const hide = () => setOpen(false)

  return (
    <div className="price-row">
      <p className="price">${price.toFixed(2)}</p>
      <button
        type="button"
        className="info-button"
        aria-label="Price info"
        aria-describedby={open ? 'price-tooltip' : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(e) => e.key === 'Escape' && hide()}
      >
        <span aria-hidden="true">i</span>
      </button>
      {open && (
        <span role="tooltip" id="price-tooltip" className="tooltip">
          The price includes taxes.
        </span>
      )}
    </div>
  )
}
