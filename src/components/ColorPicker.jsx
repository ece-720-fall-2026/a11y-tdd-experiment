import { product } from '../data/product.js'

// Radio group of round swatches. The inputs are native radios, so arrow keys
// move the selection and only one color can be chosen at a time.
export default function ColorPicker({ value, onChange }) {
  const chosen = product.colors.find((c) => c.id === value)
  return (
    <fieldset className="field color-picker">
      <legend>
        Color: <span className="color-picker__chosen">{chosen.name}</span>
      </legend>
      <div className="swatches">
        {product.colors.map((color) => (
          <label key={color.id} className="swatch">
            <input
              type="radio"
              name="color"
              value={color.id}
              checked={value === color.id}
              onChange={() => onChange(color.id)}
            />
            <span
              className="swatch__circle"
              style={{ backgroundColor: color.hex }}
              aria-hidden="true"
            />
            <span className="sr-only">{color.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
