import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import SizeGuide from './SizeGuide.jsx'

// Shows only the chosen size. "Change size" opens the list of sizes.
// Sold-out sizes are disabled. Picking a size (or pressing Escape) closes the list.
const SizeChooser = forwardRef(function SizeChooser({ sizes, sizeChart, value, onChange }, ref) {
  const [open, setOpen] = useState(false)
  const name = useId()
  const listId = useId()
  const toggleRef = useRef(null)
  const listRef = useRef(null)
  const restoreFocus = useRef(false)
  // Arrow keys move the selection and fire a click; that must not close the list.
  const arrowKeyDown = useRef(false)
  const openRef = useRef(open)
  openRef.current = open

  useEffect(() => {
    if (open) {
      const target =
        listRef.current?.querySelector('input:checked') ??
        listRef.current?.querySelector('input:not(:disabled)')
      target?.focus()
    } else if (restoreFocus.current) {
      restoreFocus.current = false
      toggleRef.current?.focus()
    }
  }, [open])

  // Lets the page open the list when the shopper tries to add to cart without a size.
  useImperativeHandle(ref, () => ({
    open() {
      if (openRef.current) {
        listRef.current?.querySelector('input:not(:disabled)')?.focus()
      } else {
        setOpen(true)
      }
    },
  }))

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
        // Escape inside the size guide dialog belongs to the dialog.
        if (event.key === 'Escape' && open && !event.target.closest('dialog')) {
          event.preventDefault()
          close({ returnFocus: true })
        }
      }}
    >
      <legend>Size</legend>
      {open ? (
        <div className="size-list" id={listId} ref={listRef}>
          <p className="option-note">US sizes</p>
          <div className="size-options">
            {sizes.map((size) => (
              <label key={size.us} className={size.soldOut ? 'size-option is-sold-out' : 'size-option'}>
                <input
                  type="radio"
                  name={name}
                  value={size.us}
                  disabled={size.soldOut}
                  checked={size.us === value}
                  onChange={() => onChange(size.us)}
                  onKeyDown={(event) => {
                    if (event.key === ' ' || event.key === 'Enter') {
                      event.preventDefault()
                      onChange(size.us)
                      close({ returnFocus: true })
                    }
                  }}
                  onClick={() => {
                    if (!arrowKeyDown.current) close({ returnFocus: true })
                  }}
                />
                <span className="size-number">{size.us}</span>
                {size.soldOut && <span className="size-sold-out">Sold out</span>}
              </label>
            ))}
          </div>
        </div>
      ) : (
        <p className="option-value">{value ? `US ${value}` : 'No size selected'}</p>
      )}
      <div className="option-actions">
        <button
          ref={toggleRef}
          type="button"
          className="text-button"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={() => (open ? close({ returnFocus: false }) : setOpen(true))}
        >
          Change size
        </button>
        <SizeGuide sizes={sizes} chart={sizeChart} />
      </div>
    </fieldset>
  )
})

export default SizeChooser
