import { useId, useRef, useState } from 'react'

// Shows only the chosen color. "Change color" opens a radio group of swatches.
export default function ColorPicker({ colors, value, onChange }) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const labelId = useId()
  const listId = useId()
  const groupName = useId()
  const selected = colors.find((c) => c.id === value)

  const choose = (id) => {
    onChange(id)
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <div className="field">
      <div className="field-head">
        <span id={labelId} className="field-label">
          Color
        </span>
        <span className="field-value">{selected.label}</span>
      </div>
      <button
        ref={toggleRef}
        type="button"
        className="text-btn"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Close colors' : 'Change color'}
      </button>
      {open && (
        <fieldset
          id={listId}
          className="options swatch-options"
          aria-labelledby={labelId}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false)
              toggleRef.current?.focus()
            }
          }}
        >
          {colors.map((color) => (
            <label key={color.id} className="swatch">
              <input
                type="radio"
                name={groupName}
                value={color.id}
                checked={value === color.id}
                onChange={() => onChange(color.id)}
                onClick={() => choose(color.id)}
              />
              <span className="swatch-dot" style={{ '--swatch': color.hex }} aria-hidden="true" />
              <span className="swatch-name">{color.label}</span>
            </label>
          ))}
        </fieldset>
      )}
    </div>
  )
}
