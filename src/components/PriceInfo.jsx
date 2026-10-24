import { useEffect, useId, useState } from 'react'

// Price with an "i" button. The tooltip opens on hover or focus, closes on
// Escape (WCAG 1.4.13) and is linked to the button with aria-describedby.
export default function PriceInfo({ price, note }) {
  const tooltipId = useId()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const visible = (hovered || focused) && !dismissed

  // Escape dismisses the tooltip wherever focus is (WCAG 1.4.13).
  useEffect(() => {
    if (!visible) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setDismissed(true)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [visible])

  return (
    <div className="price-row">
      <span className="price">{price}</span>
      <span
        className="price-info"
        onPointerEnter={() => {
          setHovered(true)
          setDismissed(false)
        }}
        onPointerLeave={() => setHovered(false)}
      >
        <button
          type="button"
          className="info-btn"
          aria-label="About this price"
          aria-describedby={tooltipId}
          onFocus={() => {
            setFocused(true)
            setDismissed(false)
          }}
          onBlur={() => setFocused(false)}
        >
          i
        </button>
        <span role="tooltip" id={tooltipId} className="tooltip" hidden={!visible}>
          {note}
        </span>
      </span>
    </div>
  )
}
