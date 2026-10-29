import { useEffect, useId, useRef, useState } from 'react'

// Select-only listbox: the list opens from the trigger only when wanted.
export default function SizePicker({ sizes, value, onChange, onOpenGuide, error }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const triggerRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()
  const chosen = sizes.find((s) => s.label === value)

  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  const close = (returnFocus) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  const pick = (index) => {
    const s = sizes[index]
    if (s.soldOut) return
    onChange(s.label)
    close(true)
  }

  const openList = () => {
    setActive(Math.max(0, sizes.findIndex((s) => s.label === value)))
    setOpen(true)
  }

  const onListKey = (e) => {
    const move = (i) => setActive(i)
    if (e.key === 'ArrowDown') { e.preventDefault(); move(Math.min(sizes.length - 1, active + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(Math.max(0, active - 1)) }
    else if (e.key === 'Home') { e.preventDefault(); move(0) }
    else if (e.key === 'End') { e.preventDefault(); move(sizes.length - 1) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(active) }
    else if (e.key === 'Escape') { e.preventDefault(); close(true) }
  }

  return (
    <div className="size-picker">
      <div className="field-row">
        <span className="field-label" id={`${listId}-label`}>Size</span>
        <button
          ref={triggerRef}
          type="button"
          className="size-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={() => (open ? close(false) : openList())}
        >
          {chosen ? `US ${chosen.label}` : 'Select size'}
        </button>
        <button type="button" className="link-button" onClick={onOpenGuide}>
          Size guide
        </button>
      </div>
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={`${listId}-label`}
          aria-activedescendant={`${listId}-${active}`}
          className="size-list"
          onKeyDown={onListKey}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) close(false)
          }}
        >
          {sizes.map((s, i) => (
            <li
              key={s.label}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={s.label === value}
              aria-disabled={s.soldOut || undefined}
              className={[
                'size-option',
                i === active ? 'is-active' : '',
                s.soldOut ? 'is-sold-out' : '',
              ].join(' ')}
              onMouseEnter={() => !s.soldOut && setActive(i)}
              onClick={() => pick(i)}
            >
              {s.label}
              {s.soldOut ? ' (sold out)' : ''}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="form-error">{error}</p>
      )}
    </div>
  )
}
