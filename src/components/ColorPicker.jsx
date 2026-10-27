import { useId, useState } from 'react'

// Shows only the chosen colour. Clicking it opens the other colours.
export default function ColorPicker({ colors, value, onChange }) {
  const [open, setOpen] = useState(false)
  const labelId = useId()
  const current = colors.find((c) => c.id === value)

  return (
    <div className="option">
      <p className="option-label" id={labelId}>
        Color: <strong>{current.name}</strong>
      </p>
      <div className="swatches" role="group" aria-labelledby={labelId}>
        {open ? (
          colors.map((c) => (
            <button
              key={c.id}
              type="button"
              className="swatch"
              aria-label={c.name}
              aria-pressed={c.id === value}
              style={{ '--swatch': c.hex }}
              onClick={() => {
                onChange(c.id)
                setOpen(false)
              }}
            />
          ))
        ) : (
          <button
            type="button"
            className="swatch"
            aria-label={current.name}
            aria-expanded="false"
            style={{ '--swatch': current.hex }}
            onClick={() => setOpen(true)}
          />
        )}
      </div>
    </div>
  )
}
