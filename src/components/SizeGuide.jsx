import { useEffect, useId, useRef, useState } from 'react'

// Modal dialog: focus stays inside until it is closed; Escape or the Close button dismiss it.
export default function SizeGuide({ chart, onClose }) {
  const dialogRef = useRef(null)
  const lengthRef = useRef(null)
  const titleId = useId()
  const lengthId = useId()
  const [length, setLength] = useState('')
  const [system, setSystem] = useState('US')
  const [opener] = useState(() => document.activeElement)

  useEffect(() => {
    lengthRef.current?.focus()
    return () => opener?.focus()
  }, [opener])

  const cm = Number.parseFloat(length)
  const row =
    Number.isFinite(cm) && cm > 0
      ? chart.reduce((best, r) => (Math.abs(r.cm - cm) < Math.abs(best.cm - cm) ? r : best))
      : null

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    // Tab order inside the dialog: an unchecked radio is skipped, as a radio group is one tab stop.
    const tabbable = Array.from(
      dialogRef.current.querySelectorAll('button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])'),
    ).filter((el) => !(el.type === 'radio' && !el.checked))
    if (!tabbable.length) return
    e.preventDefault()
    const index = tabbable.indexOf(document.activeElement)
    const step = e.shiftKey ? -1 : 1
    const next = (index + step + tabbable.length) % tabbable.length
    tabbable[next].focus()
  }

  return (
    <div className="modal-overlay">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="modal"
        onKeyDown={onKeyDown}
      >
        <div className="modal-head">
          <h2 id={titleId}>Size guide</h2>
          <button type="button" onClick={onClose}>Close</button>
        </div>

        <table className="size-chart">
          <caption>Foot length to size</caption>
          <thead>
            <tr><th scope="col">Foot length (cm)</th><th scope="col">US</th><th scope="col">EU</th></tr>
          </thead>
          <tbody>
            {chart.map((r) => (
              <tr key={r.cm}>
                <td>{r.cm.toFixed(1)}</td>
                <td>{r.us}</td>
                <td>{r.eu}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="size-converter">
          <label htmlFor={lengthId}>Foot length (cm)</label>
          <input
            ref={lengthRef}
            id={lengthId}
            type="number"
            inputMode="decimal"
            min="20"
            max="35"
            step="0.5"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
          <fieldset>
            <legend>Size system</legend>
            <label><input type="radio" name={`${lengthId}-system`} value="US" checked={system === 'US'} onChange={() => setSystem('US')} /> US</label>
            <label><input type="radio" name={`${lengthId}-system`} value="EU" checked={system === 'EU'} onChange={() => setSystem('EU')} /> EU</label>
          </fieldset>
          <p role="status">
            {row ? `Your size: ${system} ${row[system.toLowerCase()]}` : 'Enter your foot length to see your size.'}
          </p>
        </div>
      </div>
    </div>
  )
}
