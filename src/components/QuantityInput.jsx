import { MAX_QUANTITY } from '../data/product.js'

export function toQuantity(value) {
  const n = Number.parseInt(value, 10)
  if (Number.isNaN(n)) return 1
  return Math.min(MAX_QUANTITY, Math.max(1, n))
}

export default function QuantityInput({ value, onChange }) {
  const current = toQuantity(value)
  return (
    <div className="quantity">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(String(Math.max(1, current - 1)))}
      >
        −
      </button>
      <input
        type="number"
        aria-label="Quantity"
        min={1}
        max={MAX_QUANTITY}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => onChange(String(current))}
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(String(Math.min(MAX_QUANTITY, current + 1)))}
      >
        +
      </button>
    </div>
  )
}
