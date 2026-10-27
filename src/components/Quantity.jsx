export const MIN_QTY = 1
export const MAX_QTY = 10

export function clampQuantity(raw) {
  const n = Math.floor(Number(raw))
  if (!Number.isFinite(n)) return MIN_QTY
  return Math.min(MAX_QTY, Math.max(MIN_QTY, n))
}

export default function Quantity({ value, onChange, onCommit }) {
  const current = clampQuantity(value)
  return (
    <div className="quantity">
      <label htmlFor="quantity" className="option-group__label">Quantity</label>
      <div className="quantity__controls">
        <button type="button" aria-label="Decrease quantity" onClick={() => onCommit(clampQuantity(current - 1))} disabled={current <= MIN_QTY}>
          −
        </button>
        <input
          id="quantity"
          type="number"
          inputMode="numeric"
          min={MIN_QTY}
          max={MAX_QTY}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => onCommit(current)}
        />
        <button type="button" aria-label="Increase quantity" onClick={() => onCommit(clampQuantity(current + 1))} disabled={current >= MAX_QTY}>
          +
        </button>
      </div>
    </div>
  )
}
