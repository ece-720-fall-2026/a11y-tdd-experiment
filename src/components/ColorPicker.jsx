import { useCallback, useRef, useState } from 'react'
import { useDismiss } from './useDismiss.js'

// Collapsed, it shows only the chosen color. Opened, it shows round swatches.
export default function ColorPicker({ colors, value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  const chosen = colors.find((c) => c.id === value)

  return (
    <div className="option" ref={ref}>
      <button
        type="button"
        className="option-toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        Color: <strong>{chosen.name}</strong>
      </button>
      {open && (
        <div className="swatches" role="radiogroup" aria-label="Color">
          {colors.map((c) => (
            <input
              key={c.id}
              type="radio"
              name="color"
              className="swatch"
              aria-label={c.name}
              title={c.name}
              value={c.id}
              checked={value === c.id}
              style={{ '--swatch': c.hex }}
              onChange={() => {
                onChange(c.id)
                close()
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
