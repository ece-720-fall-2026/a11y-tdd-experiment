import { useEffect, useRef, useState, forwardRef } from 'react'
import { product } from '../data/trailRunner2.js'

const euFor = (us) => product.sizeChart.find((r) => r.us === us)?.eu

// The list only opens when the shopper asks for it.
const SizePicker = forwardRef(function SizePicker({ value, onChange, onOpenGuide, guideRef, error }, buttonRef) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const listId = 'size-options'

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef?.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, buttonRef])

  const choose = (us) => {
    onChange(us)
    setOpen(false)
    buttonRef?.current?.focus()
  }

  return (
    <div className="field">
      <div className="field__head">
        <span className="field__label" id="size-label">Size</span>
        <button ref={guideRef} type="button" className="link-btn" onClick={onOpenGuide}>
          Size guide
        </button>
      </div>

      <div className="size-picker" ref={wrapRef}>
        <button
          ref={buttonRef}
          type="button"
          className={`size-picker__btn${error ? ' is-error' : ''}`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby="size-label size-value"
          onClick={() => setOpen((o) => !o)}
        >
          <span id="size-value">{value == null ? 'Select size' : `US ${value} / EU ${euFor(value)}`}</span>
          <span aria-hidden="true" className="size-picker__chev">{open ? '▴' : '▾'}</span>
        </button>

        {open && (
          <ul id={listId} role="listbox" aria-labelledby="size-label" className="size-list">
            {product.sizes.map((us) => {
              const soldOut = product.soldOut.includes(us)
              const selected = us === value
              return (
                <li key={us} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    aria-disabled={soldOut}
                    disabled={soldOut}
                    className={`size-opt${selected ? ' is-selected' : ''}${soldOut ? ' is-sold-out' : ''}`}
                    onClick={() => choose(us)}
                  >
                    <span>US {us}</span>
                    <span className="size-opt__eu">EU {euFor(us)}</span>
                    {soldOut && <span className="size-opt__tag">Sold out</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {error && (
        <p className="field__error" role="alert">
          Please select a size before adding to cart.
        </p>
      )}
    </div>
  )
})

export default SizePicker
