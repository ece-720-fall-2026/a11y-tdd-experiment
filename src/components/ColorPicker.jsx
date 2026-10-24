import { useState } from 'react'

// Shows only the chosen colour. Pressing it opens the other options.
export default function ColorPicker({ colors, value, onChange }) {
  const [open, setOpen] = useState(false)

  const choose = (color) => {
    onChange(color)
    setOpen(false)
  }

  return (
    <div className="option-group">
      <p className="option-label" id="color-label">
        Color
      </p>
      <button
        type="button"
        className="select-trigger"
        aria-labelledby="color-label"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="swatch" style={{ background: value.hex }} aria-hidden="true" />
        <span>{value.name}</span>
        <span className="chevron" aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <ul className="swatch-list" role="listbox" aria-labelledby="color-label">
          {colors.map((color) => (
            <li key={color.id} role="none">
              <button
                type="button"
                role="option"
                aria-selected={color.id === value.id}
                className="swatch-option"
                onClick={() => choose(color)}
              >
                <span className="swatch" style={{ background: color.hex }} aria-hidden="true" />
                {color.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
