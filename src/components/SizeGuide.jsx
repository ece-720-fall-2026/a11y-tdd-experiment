import { useEffect, useId, useRef, useState } from 'react'
import { product } from '../data/product.js'
import { FOOT_MAX_CM, FOOT_MIN_CM, sizeForFoot } from '../lib/sizes.js'

// Modal size chart. Native <dialog> with showModal() makes the page inert
// behind it, traps focus, and closes on Escape.
export default function SizeGuide({ open, onClose, triggerRef }) {
  const dialogRef = useRef(null)
  const footRef = useRef(null)
  const titleId = useId()
  const footId = useId()
  const [foot, setFoot] = useState('')
  const [system, setSystem] = useState('US')

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) {
      dialog.showModal()
      footRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const footCm = parseFloat(foot)
  const result = foot.trim() === '' ? { error: 'Enter your foot length in centimetres to see your size.' } : sizeForFoot(footCm, product.sizeChart, system)

  function handleClosed() {
    onClose()
    triggerRef.current?.focus()
  }

  return (
    <dialog ref={dialogRef} className="size-guide" aria-labelledby={titleId} onClose={handleClosed}>
      <div className="dialog-header">
        <h2 id={titleId}>Size guide</h2>
        <button type="button" className="button-secondary" onClick={() => dialogRef.current.close()}>
          Close
        </button>
      </div>

      <p>Stand on a sheet of paper against a wall and mark the tip of your longest toe. Measure from the wall to the mark.</p>

      <form onSubmit={(e) => e.preventDefault()} className="size-form">
        <div className="field">
          <label htmlFor={footId}>Foot length (cm)</label>
          <input
            id={footId}
            ref={footRef}
            type="number"
            inputMode="decimal"
            step="0.5"
            min={FOOT_MIN_CM}
            max={FOOT_MAX_CM}
            value={foot}
            onChange={(e) => setFoot(e.target.value)}
          />
        </div>

        <fieldset className="field">
          <legend>Show my size in</legend>
          <label className="radio">
            <input type="radio" name="size-system" value="US" checked={system === 'US'} onChange={() => setSystem('US')} />
            US
          </label>
          <label className="radio">
            <input type="radio" name="size-system" value="EU" checked={system === 'EU'} onChange={() => setSystem('EU')} />
            EU
          </label>
        </fieldset>

        <p role="status" className="size-result">
          {result.error ?? `Your size: ${result.size}`}
        </p>
      </form>

      <table className="size-table">
        <caption>Trail Runner 2 size chart</caption>
        <thead>
          <tr>
            <th scope="col">Foot length (cm)</th>
            <th scope="col">US</th>
            <th scope="col">EU</th>
          </tr>
        </thead>
        <tbody>
          {product.sizeChart.map((row) => (
            <tr key={row.maxCm}>
              <th scope="row">Up to {row.maxCm.toFixed(1)}</th>
              <td>{row.us}</td>
              <td>{row.eu}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </dialog>
  )
}
