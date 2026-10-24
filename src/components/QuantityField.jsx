import { useId } from 'react'
import { MIN_QTY, MAX_QTY, parseQty } from '../lib/quantity.js'

export default function QuantityField({ value, onChange, onBlur, error, inputRef }) {
  const id = useId()
  const errorId = useId()
  const parsed = parseQty(value)
  const current = parsed ?? MIN_QTY

  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        Quantity
      </label>
      <div className="qty">
        <button
          type="button"
          className="round-btn"
          aria-label="Decrease quantity"
          disabled={parsed === MIN_QTY}
          onClick={() => onChange(String(Math.max(MIN_QTY, current - 1)))}
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          ref={inputRef}
          id={id}
          className="qty-input"
          type="number"
          inputMode="numeric"
          min={MIN_QTY}
          max={MAX_QTY}
          step={1}
          value={value}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
        />
        <button
          type="button"
          className="round-btn"
          aria-label="Increase quantity"
          disabled={parsed === MAX_QTY}
          onClick={() => onChange(String(Math.min(MAX_QTY, current + 1)))}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
      {error && (
        <p id={errorId} className="error">
          Enter a whole number from {MIN_QTY} to {MAX_QTY}.
        </p>
      )}
    </div>
  )
}
