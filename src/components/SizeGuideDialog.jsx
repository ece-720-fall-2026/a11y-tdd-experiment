import { useEffect, useId, useRef, useState } from 'react'

const usFromCm = (cm) => Math.round(cm - 17)
const euFromCm = (cm) => usFromCm(cm) + 33

/**
 * Modal dialog per the WAI-ARIA APG "Dialog (Modal)" pattern:
 * - role="dialog" with aria-modal="true", labelled by its heading
 * - focus moves into the dialog on open and is trapped inside
 * - Escape closes it (and there is an explicit Close button)
 * - focus returns to the trigger when it closes
 */
export default function SizeGuideDialog({ open, onClose }) {
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)
  const headingId = useId()
  const [footLength, setFootLength] = useState('')
  const [units, setUnits] = useState('US')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return undefined
    // Remember which element had focus, then move focus into the dialog.
    triggerRef.current = document.activeElement
    const { body } = document
    const previousOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    const firstField = dialogRef.current.querySelector('input, button')
    if (firstField) firstField.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusables = dialogRef.current.querySelectorAll(
        'button, input, select, [tabindex]:not([tabindex="-1"])',
      )
      const list = Array.from(focusables).filter((el) => !el.disabled && el.offsetParent !== null)
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      body.style.overflow = previousOverflow
      if (triggerRef.current && triggerRef.current.focus) triggerRef.current.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    const cm = Number.parseFloat(footLength)
    if (!Number.isFinite(cm) || footLength === '' || cm < 15 || cm > 35) {
      setError('Enter a foot length between 15 and 35 cm.')
      setResult(null)
      return
    }
    setError('')
    setResult(units === 'US' ? `US ${usFromCm(cm)} (EU ${euFromCm(cm)})` : `EU ${euFromCm(cm)} (US ${usFromCm(cm)})`)
  }

  return (
    <div className="dialog-backdrop">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="dialog"
      >
        <h2 id={headingId}>Size guide</h2>
        <p>Measure your foot from heel to longest toe while standing, then pick your unit.</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="foot-length">Foot length (cm)</label>
            <input
              id="foot-length"
              type="number"
              inputMode="decimal"
              min="15"
              max="35"
              step="0.5"
              value={footLength}
              onChange={(event) => setFootLength(event.target.value)}
              aria-describedby={error ? 'size-guide-error' : undefined}
            />
          </div>
          <fieldset className="units">
            <legend>Unit</legend>
            <label>
              <input
                type="radio"
                name="size-guide-unit"
                value="US"
                checked={units === 'US'}
                onChange={() => setUnits('US')}
              />{' '}
              US
            </label>
            <label>
              <input
                type="radio"
                name="size-guide-unit"
                value="EU"
                checked={units === 'EU'}
                onChange={() => setUnits('EU')}
              />{' '}
              EU
            </label>
          </fieldset>
          {error && (
            <p id="size-guide-error" role="alert" className="error">
              {error}
            </p>
          )}
          <p className="size-guide-result" role="status">
            {result ? `Your size: ${result}` : 'Your size will appear here.'}
          </p>
          <div className="dialog-actions">
            <button type="submit">Find my size</button>
            <button type="button" className="secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
