import { useEffect, useRef, useState } from 'react'
import { product } from '../data'

export default function SizeSelect({ id, selectedId, onSelect }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef(null)
  const buttonRef = useRef(null)

  const sizes = product.sizes
  const selected = sizes.find((size) => size.id === selectedId)

  useEffect(() => {
    if (!open) return
    const firstEnabled = sizes.findIndex((size) => !size.soldOut)
    setActiveIndex(selectedId ? sizes.findIndex((s) => s.id === selectedId) : Math.max(firstEnabled, 0))
    listRef.current?.focus()
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  const choose = (size) => {
    if (size.soldOut) return
    onSelect(size.id)
    setOpen(false)
    buttonRef.current?.focus()
  }

  const handleListKeyDown = (event) => {
    let next = activeIndex
    if (event.key === 'ArrowDown') next = (activeIndex + 1) % sizes.length
    if (event.key === 'ArrowUp') next = (activeIndex - 1 + sizes.length) % sizes.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = sizes.length - 1
    if (next !== activeIndex) {
      event.preventDefault()
      setActiveIndex(next)
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(sizes[activeIndex])
    }
  }

  return (
    <div className="size-select">
      <button
        ref={buttonRef}
        type="button"
        id={`${id}-button`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="size-button"
      >
        {selected ? selected.label : 'Select a size'}
      </button>
      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-labelledby={`${id}-button`}
          tabIndex={0}
          onKeyDown={handleListKeyDown}
          className="size-list"
        >
          {sizes.map((size, index) => (
            <li
              key={size.id}
              role="option"
              aria-selected={selectedId === size.id}
              aria-disabled={size.soldOut || undefined}
              className={
                'size-option' +
                (index === activeIndex ? ' is-active' : '') +
                (size.soldOut ? ' is-sold-out' : '') +
                (selectedId === size.id ? ' is-selected' : '')
              }
              onClick={() => choose(size)}
            >
              <span>{size.label}</span>
              {size.soldOut && <span className="sold-out-tag">Sold out</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
