import { product } from '../data/product.js'

export default function ColorPicker({ color, onColorChange }) {
  return (
    <fieldset className="color-picker">
      <legend>Color</legend>
      <div className="color-swatches" role="radiogroup" aria-label="Color">
        {product.colors.map((c) => (
          <label key={c.id} className="color-label">
            <input
              type="radio"
              name="color"
              value={c.id}
              checked={color === c.id}
              onChange={() => onColorChange(c.id)}
              className="color-swatch"
              style={{ backgroundColor: c.swatch }}
            />
            <span>{c.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
