import { useState } from 'react'

// Select-only combobox (APG): the list opens on demand, sold-out sizes are aria-disabled.
export default function SizePicker({ sizes, value, onChange, comboRef, onOpenGuide, triggerRef }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)

  const optionId = (i) => `size-option-${i}`
  const isSoldOut = (i) => sizes[i].soldOut

  const openList = () => {
    const current = sizes.findIndex((s) => s.us === value)
    setActive(current >= 0 ? current : sizes.findIndex((s) => !s.soldOut))
    setOpen(true)
  }
  const closeList = () => {
    setOpen(false)
    setActive(-1)
  }
  const choose = (i) => {
    if (isSoldOut(i)) return
    onChange(sizes[i].us)
    closeList()
    comboRef.current?.focus()
  }
  const available = sizes.map((s, i) => (s.soldOut ? -1 : i)).filter((i) => i >= 0)
  const step = (dir) => {
    let i = active + dir
    while (i >= 0 && i < sizes.length && sizes[i].soldOut) i += dir
    if (i >= 0 && i < sizes.length) setActive(i)
  }

  const onKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault()
        if (!open) openList()
        else step(e.key === 'ArrowDown' ? 1 : -1)
        break
      case 'Home':
      case 'End':
        if (open) {
          e.preventDefault()
          setActive(e.key === 'Home' ? available[0] : available[available.length - 1])
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (!open) openList()
        else if (active >= 0) choose(active)
        break
      case 'Escape':
        if (open) {
          e.preventDefault()
          closeList()
        }
        break
      case 'Tab':
        closeList()
        break
      default:
    }
  }

  return (
    <div className="size-picker">
      <div className="size-picker__header">
        <span id="size-label" className="option-group__label">Size</span>
        <button type="button" ref={triggerRef} className="link-button" onClick={onOpenGuide}>
          Size guide
        </button>
      </div>
      <div className="combobox-wrap">
        <div
          ref={comboRef}
          role="combobox"
          id="size-combobox"
          tabIndex={0}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls="size-listbox"
          aria-labelledby="size-label size-value"
          aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
          className="combobox"
          onClick={() => (open ? closeList() : openList())}
          onKeyDown={onKeyDown}
          onBlur={closeList}
        >
          <span id="size-value">{value ? `US ${value}` : 'Choose a size'}</span>
          <span aria-hidden="true" className="combobox__chevron">▾</span>
        </div>
        {open && (
          <ul
            role="listbox"
            id="size-listbox"
            aria-labelledby="size-label"
            className="listbox"
            onMouseDown={(e) => e.preventDefault()}
          >
            {sizes.map((size, i) => (
              <li
                key={size.us}
                id={optionId(i)}
                role="option"
                aria-selected={size.us === value}
                aria-disabled={size.soldOut ? 'true' : undefined}
                className={`option${i === active ? ' option--active' : ''}`}
                onClick={() => choose(i)}
                onMouseEnter={() => !size.soldOut && setActive(i)}
              >
                <span>US {size.us}</span>
                {size.soldOut && <span className="option__sold-out">Sold out</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
