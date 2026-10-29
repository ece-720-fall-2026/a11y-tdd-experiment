import { useId, useState } from 'react'

// Small "i" button that shows a tooltip on hover or keyboard focus.
// The tooltip stays while the pointer is over the button or the tooltip, and Escape dismisses it.
export default function PriceInfo({ message }) {
  const [open, setOpen] = useState(false)
  const tooltipId = useId()

  return (
    <span
      className="price-info"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.stopPropagation()
          setOpen(false)
        }
      }}
    >
      <button
        type="button"
        className="info-button"
        aria-label="Price information"
        aria-describedby={open ? tooltipId : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <span aria-hidden="true">i</span>
      </button>
      {open && (
        <span role="tooltip" id={tooltipId} className="tooltip">
          {message}
        </span>
      )}
    </span>
  )
}
