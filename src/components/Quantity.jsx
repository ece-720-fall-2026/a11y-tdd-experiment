// Quantity can be typed, or changed by one with the buttons.
export default function Quantity({ text, max, onText, onStep }) {
  const current = parseInt(text, 10)
  return (
    <div className="quantity">
      <span className="option-label">Quantity</span>
      <div className="stepper">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onStep(-1)}
          disabled={current <= 1}
        >
          &minus;
        </button>
        <input
          type="number"
          aria-label="Quantity"
          min="1"
          max={max}
          value={text}
          onChange={(e) => onText(e.target.value)}
          onBlur={() => onText(String(clampQty(text, max)))}
        />
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onStep(1)}
          disabled={current >= max}
        >
          +
        </button>
      </div>
    </div>
  )
}

export function clampQty(value, max) {
  const n = parseInt(value, 10)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.min(n, max)
}
