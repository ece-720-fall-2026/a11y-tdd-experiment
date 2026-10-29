import { useEffect, useId, useRef, useState } from 'react'

/**
 * Tooltip per the WAI-ARIA APG: the trigger is a real button, the tooltip text
 * is linked with aria-describedby, it appears on hover and on keyboard focus and
 * disappears on blur, mouse leave or Escape.
 */
export default function Tooltip({ label, text }) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef(null)
  const id = useId()
  const wrapperRef = useRef(null)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const show = () => {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const hide = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setOpen(false), 100)
  }
  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      setOpen(false)
      event.stopPropagation()
    }
  }

  return (
    <span className="tooltip" ref={wrapperRef}>
      <button
        type="button"
        className="tooltip-trigger"
        aria-label={label}
        aria-describedby={id}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={onKeyDown}
      >
        i
      </button>
      <span role="tooltip" id={id} className={open ? 'tooltip-text is-open' : 'tooltip-text'}>
        {text}
      </span>
    </span>
  )
}
