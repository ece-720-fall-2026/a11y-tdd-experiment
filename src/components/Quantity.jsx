import { useState } from 'react'

const MAX = 10

export default function Quantity({ value, onChange }) {
  // `draft` holds text the shopper is typing; null means show the real value.
  const [draft, setDraft] = useState(null)

  const commit = (raw) => {
    const n = Math.round(Number(raw))
    if (raw !== '' && Number.isFinite(n)) {
      onChange(Math.min(MAX, Math.max(1, n)))
    }
    setDraft(null)
  }

  return (
    <div className="quantity">
      <span className="option-label" id="qty-label">Quantity</span>
      <div className="qty-control">
        <button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} aria-label="Decrease quantity">
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min="1"
          max={MAX}
          aria-labelledby="qty-label"
          value={draft ?? String(value)}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && commit(e.currentTarget.value)}
        />
        <button type="button" onClick={() => onChange(Math.min(MAX, value + 1))} disabled={value >= MAX} aria-label="Increase quantity">
          +
        </button>
      </div>
    </div>
  )
}
