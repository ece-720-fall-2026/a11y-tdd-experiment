import { useId, useState } from 'react'

export function formatSize(size) {
  return `US ${size.us} · EU ${size.eu}`
}

// The chosen size is shown. The list of sizes opens only when asked for.
export default function SizePicker({ sizes, value, onChange, onOpenGuide }) {
  const [open, setOpen] = useState(false)
  const listId = useId()
  const current = sizes.find((s) => s.us === value)

  function choose(size) {
    if (size.soldOut) return
    onChange(size.us)
    setOpen(false)
  }

  return (
    <div className="option">
      <div className="size-head">
        <button
          type="button"
          className="select-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={() => setOpen((o) => !o)}
        >
          Size: <strong>{current ? formatSize(current) : 'Select size'}</strong>
        </button>
        <button type="button" className="link-button" onClick={onOpenGuide}>
          Size guide
        </button>
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Size"
          className="size-list"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false)
          }}
        >
          {sizes.map((s) => (
            <li
              key={s.us}
              role="option"
              aria-selected={s.us === value}
              aria-disabled={s.soldOut ? 'true' : undefined}
              tabIndex={s.soldOut ? -1 : 0}
              className={s.soldOut ? 'size-option sold-out' : 'size-option'}
              onClick={() => choose(s)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  choose(s)
                }
              }}
            >
              <span>
                {formatSize(s)}
                {s.soldOut ? ' · Sold out' : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
