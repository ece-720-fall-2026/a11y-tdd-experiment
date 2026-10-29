import { useEffect, useRef, useState } from 'react'
import { sizeChart } from '../data'

function sizeFor(footLength, system) {
  if (!footLength) return null
  const cm = Number(footLength)
  if (!Number.isFinite(cm) || cm < 15 || cm > 35) return null
  let closest = sizeChart[0]
  for (const row of sizeChart) {
    if (Math.abs(row.cm - cm) < Math.abs(closest.cm - cm)) closest = row
  }
  return system === 'us' ? `US ${closest.us}` : `EU ${closest.eu}`
}

export default function SizeGuideDialog({ onClose }) {
  const [footLength, setFootLength] = useState('')
  const [system, setSystem] = useState('us')
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const result = sizeFor(footLength, system)
  const hint = !footLength
    ? 'Enter your foot length to find your size.'
    : result
      ? `Your recommended size is ${result}.`
      : 'Enter a foot length between 15 and 35 centimetres.'

  return (
    <div className="dialog-backdrop">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        aria-describedby="size-guide-description"
        className="dialog"
      >
        <h2 id="size-guide-title">Size guide</h2>
        <p id="size-guide-description">
          Measure your foot from heel to longest toe, then pick US or EU sizing.
        </p>
        <label htmlFor="foot-length">
          Foot length (cm)
          <input
            id="foot-length"
            type="number"
            inputMode="decimal"
            min="15"
            max="35"
            step="0.5"
            value={footLength}
            onChange={(event) => setFootLength(event.target.value)}
          />
        </label>
        <fieldset>
          <legend>Sizing system</legend>
          <label>
            <input
              type="radio"
              name="sizing-system"
              value="us"
              checked={system === 'us'}
              onChange={() => setSystem('us')}
            />
            US
          </label>
          <label>
            <input
              type="radio"
              name="sizing-system"
              value="eu"
              checked={system === 'eu'}
              onChange={() => setSystem('eu')}
            />
            EU
          </label>
        </fieldset>
        <p className="size-guide-result" aria-live="polite">
          {hint}
        </p>
        <button ref={closeButtonRef} type="button" onClick={onClose} className="dialog-close">
          Close size guide
        </button>
      </div>
    </div>
  )
}
