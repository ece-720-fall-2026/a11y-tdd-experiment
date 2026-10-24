import { forwardRef, useState } from 'react'
import { sizeLabel } from '../data/trailRunner2.js'

const SizePicker = forwardRef(function SizePicker({ sizes, value, onChange, onOpenGuide, invalid }, ref) {
  const [open, setOpen] = useState(false)

  const choose = (size) => {
    onChange(size)
    setOpen(false)
  }

  return (
    <div className="option-group">
      <div className="option-head">
        <p className="option-label" id="size-label">
          Size
        </p>
        <button type="button" className="link-btn" onClick={onOpenGuide}>
          Size guide
        </button>
      </div>
      <button
        ref={ref}
        type="button"
        className={`select-trigger${invalid ? ' is-invalid' : ''}`}
        aria-labelledby="size-label"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{value ? sizeLabel(value) : 'Select size'}</span>
        <span className="chevron" aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <ul className="size-list" role="listbox" aria-labelledby="size-label">
          {sizes.map((size) => (
            <li key={size.us} role="none">
              <button
                type="button"
                role="option"
                aria-selected={value?.us === size.us}
                aria-disabled={size.soldOut || undefined}
                disabled={size.soldOut}
                className="size-option"
                onClick={() => choose(size)}
              >
                {sizeLabel(size)}
                {size.soldOut && <span className="sold-out"> Sold out</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})

export default SizePicker
