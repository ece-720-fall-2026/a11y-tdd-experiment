import { useEffect, useState } from 'react'

export const MAX_QTY = 10

export default function Quantity({ value, onChange }) {
  const [draft, setDraft] = useState(String(value))

  // Keep the text box in sync when the value changes via the +/- buttons.
  useEffect(() => setDraft(String(value)), [value])

  const commit = (raw) => {
    const n = Math.round(Number(raw))
    const clamped = Number.isFinite(n) ? Math.min(MAX_QTY, Math.max(1, n)) : value
    onChange(clamped)
    setDraft(String(clamped))
  }

  return (
    <div className="field">
      <span className="field__label" id="qty-label">Quantity</span>
      <div className="qty">
        <button
          type="button"
          className="qty__btn"
          aria-label="Decrease quantity"
          onClick={() => commit(value - 1)}
          disabled={value <= 1}
        >
          −
        </button>
        <input
          type="number"
          className="qty__input"
          aria-labelledby="qty-label"
          inputMode="numeric"
          min="1"
          max={MAX_QTY}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            const n = Number(e.target.value)
            if (Number.isInteger(n) && n >= 1 && n <= MAX_QTY) onChange(n)
          }}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && commit(e.currentTarget.value)}
        />
        <button
          type="button"
          className="qty__btn"
          aria-label="Increase quantity"
          onClick={() => commit(value + 1)}
          disabled={value >= MAX_QTY}
        >
          +
        </button>
      </div>
    </div>
  )
}
