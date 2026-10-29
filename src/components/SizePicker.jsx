import { useCallback, useRef, useState } from 'react'
import { useDismiss } from './useDismiss.js'

const label = (s) => `US ${s.us}`

// Collapsed, it shows only the chosen size. Opened, it lists every size.
// Sold-out sizes are shown but cannot be picked.
export default function SizePicker({ sizes, value, onChange, onOpenGuide }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  const pick = (s) => {
    if (s.soldOut) return
    onChange(s.us)
    close()
  }

  return (
    <div className="option size-option" ref={ref}>
      <div className="size-row">
        <button
          type="button"
          className="option-toggle"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          Size: <strong>{value == null ? 'Choose' : label(sizes.find((s) => s.us === value))}</strong>
        </button>
        <button type="button" className="link-button" onClick={onOpenGuide}>
          Size guide
        </button>
      </div>
      {open && (
        <ul role="listbox" aria-label="Size" className="size-list">
          {sizes.map((s) => {
            const selected = s.us === value
            return (
              <li
                key={s.us}
                role="option"
                aria-selected={selected}
                aria-disabled={s.soldOut ? 'true' : undefined}
                tabIndex={s.soldOut ? -1 : 0}
                className={[
                  'size-option-item',
                  selected && 'selected',
                  s.soldOut && 'sold-out',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => pick(s)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    pick(s)
                  }
                }}
              >
                {label(s)}
                <span className="eu">EU {s.eu}</span>
                {s.soldOut && <span className="sold-out-tag">Sold out</span>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
