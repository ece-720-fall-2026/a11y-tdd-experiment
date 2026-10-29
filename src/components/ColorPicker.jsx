import { useId, useState } from 'react'

// Shows only the chosen color; the full choice list opens from a button.
export default function ColorPicker({ colors, value, onChange }) {
  const [open, setOpen] = useState(false)
  const groupId = useId()
  const chosen = colors.find((c) => c.id === value)

  return (
    <div className="color-picker">
      <div className="field-row">
        <span className="field-label">Color</span>
        <button
          type="button"
          className="chip-button"
          aria-expanded={open}
          aria-controls={groupId}
          aria-label={`Color: ${chosen.label}`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="swatch" style={{ background: chosen.hex }} aria-hidden="true" />
          <span className="chosen-label">{chosen.label}</span>
        </button>
      </div>
      {open && (
        <div role="radiogroup" aria-label="Color" id={groupId} className="color-options">
          {colors.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={c.id === value}
              className="color-option"
              onClick={() => {
                onChange(c.id)
                setOpen(false)
              }}
            >
              <span
                className="swatch"
                data-testid="swatch"
                style={{ background: c.hex }}
                aria-hidden="true"
              />
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
