import { useCallback, useId, useRef, useState } from 'react'
import { useOutsideClose } from '../hooks/useOutsideClose.js'

export default function ColorPicker({ colors, value, onChange }) {
  const [open, setOpen] = useState(false)
  const listId = useId()
  const wrapRef = useRef(null)
  const buttonRef = useRef(null)
  const current = colors.find((c) => c.id === value)
  const closeOnOutside = useCallback(() => setOpen(false), [])

  useOutsideClose(wrapRef, open, closeOnOutside)

  function choose(id) {
    onChange(id)
    setOpen(false)
    buttonRef.current?.focus()
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && open) {
      event.stopPropagation()
      setOpen(false)
      buttonRef.current?.focus()
    }
  }

  return (
    <div role="group" aria-label="Color" className="option" ref={wrapRef} onKeyDown={handleKeyDown}>
      <div className="option-row">
        <span className="option-label">Color</span>
        <span className="option-value">
          <span className="swatch" style={{ background: current.hex }} aria-hidden="true" />
          <span>{current.name}</span>
        </span>
        <button
          type="button"
          ref={buttonRef}
          className="link-button"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={() => setOpen((o) => !o)}
        >
          Change color
        </button>
      </div>
      {open && (
        <ul id={listId} className="swatch-list">
          {colors.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="swatch-option"
                aria-pressed={c.id === value}
                onClick={() => choose(c.id)}
              >
                <span className="swatch" style={{ background: c.hex }} aria-hidden="true" />
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
