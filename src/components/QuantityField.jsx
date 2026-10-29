import { useId } from 'react'
import { product } from '../data/product.js'
import { parseQuantity } from './quantity.js'

export default function QuantityField({ value, onChange, error, inputRef }) {
  const ids = { input: useId(), hint: useId(), error: useId() }
  const current = parseQuantity(value) ?? 1
  const atMin = current <= 1
  const atMax = current >= product.maxQuantity

  const set = (n) => onChange(String(Math.min(Math.max(n, 1), product.maxQuantity)))

  return (
    <div className="field">
      <label htmlFor={ids.input}>Quantity</label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__button"
          aria-label="Decrease quantity by one"
          aria-controls={ids.input}
          disabled={atMin}
          onClick={() => set(current - 1)}
        >
          −
        </button>
        <input
          ref={inputRef}
          id={ids.input}
          className="text-input text-input--stepper"
          type="number"
          inputMode="numeric"
          min={1}
          max={product.maxQuantity}
          step={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            // Snap a typed number that is out of range back into range.
            const n = Number.parseInt(value, 10)
            if (Number.isFinite(n) && n !== parseQuantity(value)) set(n)
          }}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={`${ids.hint}${error ? ` ${ids.error}` : ''}`}
        />
        <button
          type="button"
          className="stepper__button"
          aria-label="Increase quantity by one"
          aria-controls={ids.input}
          disabled={atMax}
          onClick={() => set(current + 1)}
        >
          +
        </button>
      </div>
      <p id={ids.hint} className="hint">
        Up to {product.maxQuantity} pairs per order.
      </p>
      {error && (
        <p id={ids.error} className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
