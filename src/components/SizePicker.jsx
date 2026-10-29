import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { product } from '../data/product.js'
import { useOutsideClose } from '../hooks/useOutsideClose.js'
import SizeGuide from './SizeGuide.jsx'

// Select-only listbox (APG "Collapsible Listbox"): the options exist only while open,
// focus moves to the listbox, and arrow keys move aria-activedescendant.
export default function SizePicker({ sizes, value, onChange, buttonRef }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [guideOpen, setGuideOpen] = useState(false)
  const listId = useId()
  const wrapRef = useRef(null)
  const listRef = useRef(null)
  const guideButtonRef = useRef(null)
  const selectedIndex = sizes.findIndex((s) => s.us === value)
  const closeOnOutside = useCallback(() => setOpen(false), [])

  useOutsideClose(wrapRef, open, closeOnOutside)

  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  function openList() {
    const firstAvailable = sizes.findIndex((s) => !s.soldOut)
    setActive(selectedIndex >= 0 ? selectedIndex : Math.max(firstAvailable, 0))
    setOpen(true)
  }

  function closeList({ returnFocus = true } = {}) {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }

  function choose(index) {
    const size = sizes[index]
    if (size.soldOut) return
    onChange(size.us)
    closeList()
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive((a) => Math.min(a + 1, sizes.length - 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((a) => Math.max(a - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(sizes.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(active)
        break
      case 'Escape':
        event.preventDefault()
        closeList()
        break
      case 'Tab':
        closeList({ returnFocus: false })
        break
      default:
        break
    }
  }

  const optionId = (i) => `${listId}-option-${i}`

  return (
    <div className="option" ref={wrapRef}>
      <div className="option-row">
        <span className="option-label">Size</span>
        <div className="size-picker">
          <button
            type="button"
            ref={buttonRef}
            className="size-button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            onClick={() => (open ? closeList({ returnFocus: false }) : openList())}
          >
            <span className="size-value">{value ? `US ${value}` : 'No size selected'}</span>
            <span className="size-action">Change size</span>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {open && (
            <ul
              id={listId}
              role="listbox"
              aria-label="Size"
              tabIndex={-1}
              ref={listRef}
              aria-activedescendant={optionId(active)}
              onKeyDown={handleKeyDown}
              className="listbox"
            >
              {sizes.map((size, i) => (
                <li
                  key={size.us}
                  id={optionId(i)}
                  role="option"
                  aria-selected={size.us === value}
                  aria-disabled={size.soldOut ? 'true' : undefined}
                  className={[
                    'listbox-option',
                    i === active ? 'is-active' : '',
                    size.soldOut ? 'is-sold-out' : '',
                  ].join(' ')}
                  onMouseMove={() => setActive(i)}
                  onClick={() => choose(i)}
                >
                  <span>US {size.us}</span>
                  {size.soldOut && <span className="tag">Sold out</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="button" ref={guideButtonRef} className="link-button" onClick={() => setGuideOpen(true)}>
          Size guide
        </button>
      </div>

      <SizeGuide open={guideOpen} onClose={() => setGuideOpen(false)} triggerRef={guideButtonRef} />
    </div>
  )
}
