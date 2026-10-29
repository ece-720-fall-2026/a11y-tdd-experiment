export default function ColorPicker({ colors, value, onChange }) {
  return (
    <fieldset className="field">
      <legend className="field__label">
        Color: <span className="field__value">{value.name}</span>
      </legend>
      <div className="swatches">
        {colors.map((c) => (
          <label key={c.id} className="swatch" title={c.name}>
            <input
              type="radio"
              name="color"
              value={c.id}
              checked={value.id === c.id}
              onChange={() => onChange(c)}
              className="visually-hidden"
            />
            <span
              className={`swatch__dot${value.id === c.id ? ' is-selected' : ''}`}
              style={{ background: c.swatch }}
              aria-hidden="true"
            />
            <span className="visually-hidden">{c.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
