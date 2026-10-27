export default function ColorPicker({ colors, value, onChange }) {
  const selected = colors.find((c) => c.id === value)
  return (
    <div className="option-group">
      <p className="option-group__label">
        <span id="color-label">Color</span>: <strong>{selected.name}</strong>
      </p>
      <div role="radiogroup" aria-labelledby="color-label" className="swatches">
        {colors.map((color) => (
          <label key={color.id} className={`swatch${color.id === value ? ' swatch--selected' : ''}`}>
            <input
              type="radio"
              name="color"
              value={color.id}
              aria-label={color.name}
              checked={color.id === value}
              onChange={() => onChange(color.id)}
              className="swatch__input"
            />
            <span className="swatch__dot" style={{ backgroundColor: color.hex }} aria-hidden="true" />
          </label>
        ))}
      </div>
    </div>
  )
}
