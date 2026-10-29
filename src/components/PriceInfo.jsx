import { useEffect, useId, useState } from 'react'

// Tooltip per WAI-ARIA APG: opens on hover and focus, closes on Escape,
// and stays open while the pointer is over the tooltip itself (WCAG 1.4.13).
export default function PriceInfo() {
  const [open, setOpen] = useState(false)
  const tipId = useId()

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <span className="price-info" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="info-button"
        aria-describedby={tipId}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <span aria-hidden="true">i</span>
        <span className="sr-only">Price info</span>
      </button>
      <span role="tooltip" id={tipId} className="tooltip" hidden={!open}>
        Includes taxes. Shipping is calculated at checkout.
      </span>
    </span>
  )
}
