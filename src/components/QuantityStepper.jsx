const MIN = 1
const MAX = 10

export default function QuantityStepper({ value, onChange }) {
  const changeBy = (step) => onChange(Math.min(MAX, Math.max(MIN, value + step)))

  return (
    <div className="quantity">
      <label htmlFor="quantity">Quantity</label>
      <div className="quantity-controls">
        <button type="button" onClick={() => changeBy(-1)} aria-controls="quantity">
          Decrease quantity
        </button>
        <input
          id="quantity"
          type="number"
          min={MIN}
          max={MAX}
          step={1}
          value={value}
          onChange={(event) => {
            const parsed = Number(event.target.value)
            onChange(Number.isFinite(parsed) ? Math.min(MAX, Math.max(MIN, Math.round(parsed))) : MIN)
          }}
        />
        <button type="button" onClick={() => changeBy(1)} aria-controls="quantity">
          Increase quantity
        </button>
      </div>
      <span className="quantity-hint">Up to 10 pairs per order.</span>
    </div>
  )
}
