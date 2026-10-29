import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { product, recommendedSize } from '../data/product.js'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

export default function SizeChooser({ size, onSizeChange, open, onOpenChange }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [footLength, setFootLength] = useState('')
  const [unit, setUnit] = useState('us')
  const result =
    footLength && Number(footLength) > 0
      ? recommendedSize(footLength, unit)
      : null

  const triggerRef = useRef(null)
  const dialogRef = useRef(null)
  const listRef = useRef(null)

  const selected = product.sizes.find((s) => s.id === size)
  const triggerLabel = selected ? `Size: ${selected.label}` : 'Select size'

  useEffect(() => {
    onOpenChange?.(open)
  }, [open, onOpenChange])

  useEffect(() => {
    if (!open) return
    const initial = selected
      ? product.sizes.findIndex((s) => s.id === size)
      : product.sizes.findIndex((s) => !s.soldOut)
    const index = initial >= 0 ? initial : 0
    setActiveIndex(index)

    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.focus()
    }, 0)
    return () => window.clearTimeout(focusTimer)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    onOpenChange?.(false)
    triggerRef.current?.focus()
  }

  const choose = (option) => {
    if (option.soldOut) return
    onSizeChange(option.id)
    close()
  }

  const focusOption = (index) => {
    setActiveIndex(index)
    listRef.current?.querySelectorAll('[role="option"]')[index]?.focus()
  }

  const move = (delta) => {
    const count = product.sizes.length
    let index = activeIndex
    for (let step = 0; step < count; step++) {
      index = (index + delta + count * 2) % count
      if (!product.sizes[index].soldOut) break
    }
    focusOption(index)
  }

  const onDialogKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }
    if (event.key !== 'Tab') return
    const focusables = Array.from(
      dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [],
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const onListKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        move(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        move(-1)
        break
      case 'Home':
        event.preventDefault()
        focusOption(0)
        break
      case 'End':
        event.preventDefault()
        focusOption(product.sizes.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(product.sizes[activeIndex])
        break
      default:
        break
    }
  }

  return (
    <div className="size-chooser">
      <button
        ref={triggerRef}
        type="button"
        id="size-trigger"
        className="size-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="size-dialog"
        onClick={() => onOpenChange?.(!open)}
      >
        {triggerLabel}
        <span className="visually-hidden"> — open the size guide</span>
      </button>

      {open
        ? createPortal(
            <div className="overlay" onClick={close}>
          <div
            ref={dialogRef}
            id="size-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-dialog-title"
            className="dialog"
            tabIndex={-1}
            onKeyDown={onDialogKeyDown}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="size-dialog-title">Choose your size</h2>
            <button type="button" className="dialog-close" onClick={close}>
              <span aria-hidden="true">✕</span> Close
            </button>

            <div className="size-list-block">
              <h3 id="sizes-label">Available sizes</h3>
              <ul
                ref={listRef}
                role="listbox"
                aria-labelledby="sizes-label"
                className="size-listbox"
                onKeyDown={onListKeyDown}
              >
                {product.sizes.map((option, index) => (
                  <li
                    key={option.id}
                    id={`size-option-${option.id}`}
                    role="option"
                    tabIndex={-1}
                    aria-selected={size === option.id}
                    aria-disabled={option.soldOut}
                    className={index === activeIndex ? 'active' : undefined}
                    onClick={() => choose(option)}
                  >
                    {option.label}
                    {option.soldOut ? (
                      <span className="sold-out">Sold out</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            <div className="size-guide-block">
              <h3>Size guide</h3>
              <p>Enter your foot length and we will recommend a size.</p>
              <div>
                <label htmlFor="foot-length">Foot length (cm)</label>
                <input
                  id="foot-length"
                  type="number"
                  min="10"
                  max="40"
                  step="0.1"
                  value={footLength}
                  onChange={(event) => setFootLength(event.target.value)}
                />
                <fieldset>
                  <legend>Size unit</legend>
                  <label>
                    <input
                      type="radio"
                      name="unit"
                      value="us"
                      checked={unit === 'us'}
                      onChange={() => setUnit('us')}
                    />
                    US
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="unit"
                      value="eu"
                      checked={unit === 'eu'}
                      onChange={() => setUnit('eu')}
                    />
                    EU
                  </label>
                </fieldset>
                <p className="size-result" aria-live="polite">
                  {result
                    ? [
                        'Recommended size: ',
                        <strong key="result">{result}</strong>,
                        '.',
                      ]
                    : null}
                </p>
              </div>
            </div>
            </div>
          </div>,
            document.body,
          )
        : null}
    </div>
  )
}
