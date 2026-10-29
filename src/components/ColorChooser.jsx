import { useEffect, useId, useRef, useState } from 'react'

function Swatch({ hex }) {
  return <span className="swatch" style={{ backgroundColor: hex }} aria-hidden="true" />
}

// Shows only the chosen colour. "Change color" opens the list of colours.
// Picking a colour (or pressing Escape) closes the list and returns focus to the button.
export default function ColorChooser({ colors, value, onChange }) {
  const [open, setOpen] = useState(false)
  const name = useId()
  const listId = useId()
  const toggleRef = useRef(null)
  const listRef = useRef(null)
  const restoreFocus = useRef(false)
  // Arrow keys move the selection and fire a click; that must not close the list.
  const arrowKeyDown = useRef(false)
  const chosen = colors.find((c) => c.id === value) ?? colors[0]

  useEffect(() => {
    if (open) {
      listRef.current?.querySelector('input:checked')?.focus()
    } else if (restoreFocus.current) {
      restoreFocus.current = false
      toggleRef.current?.focus()
    }
  }, [open])

  function close({ returnFocus }) {
    restoreFocus.current = returnFocus
    setOpen(false)
  }

  return (
    <fieldset
      className="option"
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget)) close({ returnFocus: false })
      }}
      onKeyUp={() => {
        arrowKeyDown.current = false
      }}
      onKeyDown={(event) => {
        if (event.key.startsWith('Arrow')) arrowKeyDown.current = true
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          close({ returnFocus: true })
        }
      }}
    >
      <legend>Color</legend>
      {open ? (
        <div className="swatch-list" id={listId} ref={listRef}>
          {colors.map((c) => (
            <label key={c.id} className="swatch-option">
              <input
                type="radio"
                name={name}
                value={c.id}
                checked={c.id === value}
                onChange={() => onChange(c.id)}
                onKeyDown={(event) => {
                  if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault()
                    onChange(c.id)
                    close({ returnFocus: true })
                  }
                }}
                onClick={() => {
                  if (!arrowKeyDown.current) close({ returnFocus: true })
                }}
              />
              <Swatch hex={c.hex} />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      ) : (
        <label className="swatch-option is-current">
          <input
            type="radio"
            name={name}
            value={chosen.id}
            checked
            readOnly
            onClick={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault()
                setOpen(true)
              }
            }}
          />
          <Swatch hex={chosen.hex} />
          <span>{chosen.label}</span>
        </label>
      )}
      <button
        ref={toggleRef}
        type="button"
        className="text-button"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close({ returnFocus: false }) : setOpen(true))}
      >
        Change color
      </button>
    </fieldset>
  )
}
