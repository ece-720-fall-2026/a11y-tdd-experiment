import { useEffect, useRef, useState } from 'react'
import { sizeFromFootLength } from '../data/sizing.js'

// Modal dialog (APG): focus moves in, Escape/Close dismisses and returns focus to the trigger.
export default function SizeGuide({ chart, onClose, returnFocusTo }) {
  const [footLength, setFootLength] = useState('')
  const [system, setSystem] = useState('US')
  const dialogRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const trigger = returnFocusTo
    return () => trigger?.current?.focus()
    // Runs on mount/unmount only: focus returns to the trigger once the dialog closes.
  }, [])

  const result = sizeFromFootLength(footLength, system, chart)

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key === 'Tab') {
      const focusable = [...dialogRef.current.querySelectorAll('button, input')]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  let message
  if (result.status === 'empty') message = 'Enter your foot length to see your size.'
  else if (result.status === 'out-of-range')
    message = `Foot length must be between ${result.min} and ${result.max} cm.`
  else message = `Your size is ${result.size}.`

  return (
    <div className="dialog-backdrop">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-guide-title"
        className="dialog"
        onKeyDown={onKeyDown}
      >
        <h2 id="size-guide-title">Size guide</h2>
        <table className="size-table">
          <caption>Foot length to size</caption>
          <thead>
            <tr>
              <th scope="col">Foot length (cm)</th>
              <th scope="col">US</th>
              <th scope="col">EU</th>
            </tr>
          </thead>
          <tbody>
            {chart.map((row) => (
              <tr key={row.cm}>
                <td>{row.cm.toFixed(1)}</td>
                <td>{row.us}</td>
                <td>{row.eu}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="dialog__field">
          <label htmlFor="foot-length">Foot length (cm)</label>
          <input
            id="foot-length"
            ref={inputRef}
            type="number"
            inputMode="decimal"
            step="0.1"
            value={footLength}
            onChange={(e) => setFootLength(e.target.value)}
          />
        </div>

        <fieldset className="dialog__field">
          <legend>Show my size in</legend>
          <label className="inline-option">
            <input type="radio" name="system" value="US" checked={system === 'US'} onChange={() => setSystem('US')} />
            US
          </label>
          <label className="inline-option">
            <input type="radio" name="system" value="EU" checked={system === 'EU'} onChange={() => setSystem('EU')} />
            EU
          </label>
        </fieldset>

        <p className="dialog__result" aria-live="polite">{message}</p>
        <button type="button" className="button button--secondary" onClick={onClose}>
          Close size guide
        </button>
      </div>
    </div>
  )
}
