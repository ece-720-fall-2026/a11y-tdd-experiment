import { useEffect, useId, useRef, useState } from 'react'

// "i" button beside the price. The tooltip opens on hover, keyboard focus or
// tap. It stays open while the pointer is over it, closes on Escape (from any
// trigger, WCAG 1.4.13), and is linked to the button with aria-describedby
// (APG tooltip pattern).
export default function TaxTooltip({ children }) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null)
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <span
      className="tax-info"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        // Keep it open if the keyboard focus is still on the button.
        if (document.activeElement !== buttonRef.current) setOpen(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="tax-info__button"
        aria-label="Price information"
        aria-describedby={id}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">i</span>
      </button>
      <span id={id} role="tooltip" className="tax-info__tip" hidden={!open}>
        {children}
      </span>
    </span>
  )
}
