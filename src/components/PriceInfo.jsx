import { useId, useState } from 'react'

// APG tooltip: shown on focus or hover, dismissed with Escape, focus stays on the trigger.
export default function PriceInfo({ text }) {
  const id = useId()
  const [open, setOpen] = useState(false)

  return (
    <span className="price-info">
      <button
        type="button"
        className="info-button"
        aria-describedby={id}
        aria-label="Price info"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
      >
        i
      </button>
      <span id={id} role="tooltip" className="tooltip" hidden={!open}>
        {text}
      </span>
    </span>
  )
}
