import { useEffect, useId, useRef, useState } from 'react'

// Shows only the chosen size. The list opens on "Change size" and closes on
// choice or Escape. Sold-out sizes are disabled and labelled as sold out.
export default function SizePicker({ sizes, value, onChange, error, errorToken, onOpenGuide, guideButtonRef }) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef(null)
  const listRef = useRef(null)
  const focusPending = useRef(false)
  const labelId = useId()
  const listId = useId()
  const errorId = useId()
  const groupName = useId()
  const selected = sizes.find((s) => s.us === value)

  // A failed add-to-cart passes a new error object: open the list and move
  // focus into it so the shopper can pick a size.
  useEffect(() => {
    if (!errorToken) return
    focusPending.current = true
    setOpen(true)
  }, [errorToken])

  useEffect(() => {
    if (open && focusPending.current) {
      const target =
        listRef.current?.querySelector('input:checked') ??
        listRef.current?.querySelector('input:not(:disabled)')
      if (target) {
        target.focus()
        focusPending.current = false
      }
    }
  }, [open, errorToken])

  const choose = (us) => {
    onChange(us)
    setOpen(false)
    toggleRef.current?.focus()
  }

  return (
    <div className="field">
      <div className="field-head">
        <span id={labelId} className="field-label">
          Size
        </span>
        <span className="field-value">{selected ? `US ${selected.us} (EU ${selected.eu})` : 'Not selected'}</span>
      </div>
      <div className="field-actions">
        <button
          ref={toggleRef}
          type="button"
          className="text-btn"
          aria-expanded={open}
          aria-controls={listId}
          aria-describedby={error ? errorId : undefined}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close sizes' : selected ? 'Change size' : 'Choose size'}
        </button>
        <button ref={guideButtonRef} type="button" className="text-btn" aria-haspopup="dialog" onClick={onOpenGuide}>
          Size guide
        </button>
      </div>
      {open && (
        <fieldset
          id={listId}
          ref={listRef}
          className="options size-options"
          aria-labelledby={labelId}
          aria-describedby={error ? errorId : undefined}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false)
              toggleRef.current?.focus()
            }
          }}
        >
          {sizes.map((size) => (
            <label key={size.us} className={`size-option${size.soldOut ? ' is-sold-out' : ''}`}>
              <input
                type="radio"
                name={groupName}
                value={size.us}
                disabled={size.soldOut}
                checked={value === size.us}
                onChange={() => onChange(size.us)}
                onClick={() => choose(size.us)}
              />
              <span className="size-us">US {size.us}</span>
              <span className="size-eu">EU {size.eu}</span>
              {size.soldOut && <span className="sold-out">Sold out</span>}
            </label>
          ))}
        </fieldset>
      )}
      {error && (
        <p id={errorId} className="error">
          {error}
        </p>
      )}
    </div>
  )
}
