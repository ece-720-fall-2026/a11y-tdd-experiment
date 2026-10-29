export default function QuantityStepper({ quantity, onQuantityChange }) {
  const setQuantity = (value) => {
    const next = Math.max(1, Math.min(10, value))
    onQuantityChange(next)
  }

  return (
    <div className="quantity">
      <label htmlFor="quantity">Quantity</label>
      <div className="quantity-controls">
        <button
          type="button"
          onClick={() => setQuantity(quantity - 1)}
          disabled={quantity <= 1}
        >
          <span aria-hidden="true">−</span>
          <span className="visually-hidden">Decrease quantity</span>
        </button>
        <input
          id="quantity"
          type="number"
          inputMode="numeric"
          min="1"
          max="10"
          step="1"
          value={quantity}
          onChange={(event) => {
            const parsed = Number.parseInt(event.target.value, 10)
            if (Number.isNaN(parsed)) return
            setQuantity(parsed)
          }}
        />
        <button
          type="button"
          onClick={() => setQuantity(quantity + 1)}
          disabled={quantity >= 10}
        >
          <span aria-hidden="true">+</span>
          <span className="visually-hidden">Increase quantity</span>
        </button>
      </div>
    </div>
  )
}
