import { useId, useState } from 'react'

// The shopper can type a quantity or change it by one. Values outside 1 to max are ignored.
export default function QuantityField({ value, max, onChange }) {
  const [text, setText] = useState(String(value))
  const id = useId()
  const hintId = useId()

  function commit(next) {
    onChange(next)
    setText(String(next))
  }

  return (
    <div className="quantity">
      <label htmlFor={id}>Quantity</label>
      <div className="quantity-controls">
        <button
          type="button"
          className="icon-button"
          aria-label="Decrease quantity"
          disabled={value <= 1}
          onClick={() => commit(Math.max(1, value - 1))}
        >
          <span aria-hidden="true">−</span>
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min="1"
          max={max}
          step="1"
          value={text}
          aria-describedby={hintId}
          onChange={(event) => {
            const raw = event.target.value
            setText(raw)
            const n = Number(raw)
            if (Number.isInteger(n) && n >= 1 && n <= max) onChange(n)
          }}
          onBlur={() => setText(String(value))}
        />
        <button
          type="button"
          className="icon-button"
          aria-label="Increase quantity"
          disabled={value >= max}
          onClick={() => commit(Math.min(max, value + 1))}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
      <p id={hintId} className="field-hint">
        Up to {max} pairs per order.
      </p>
    </div>
  )
}
