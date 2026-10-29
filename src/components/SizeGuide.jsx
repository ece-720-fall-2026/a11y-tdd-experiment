import { useEffect, useId, useRef, useState } from 'react'

// Returns the first chart row whose foot-length range includes the given length, or null.
export function recommendSize(footCm, chart) {
  if (!Number.isFinite(footCm) || chart.length === 0) return null
  if (footCm < chart[0].minCm || footCm > chart[chart.length - 1].maxCm) return null
  return chart.find((row) => footCm <= row.maxCm) ?? null
}

// A modal size chart. It covers the page until closed, then focus returns to the button.
export default function SizeGuide({ sizes, chart }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [unit, setUnit] = useState('US')
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)
  const titleId = useId()
  const inputId = useId()
  const hintId = useId()
  const unitName = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const footCm = Number(text.trim().replace(',', '.'))
  const hasInput = text.trim() !== ''
  const valid = hasInput && Number.isFinite(footCm) && footCm > 0
  const row = valid ? recommendSize(footCm, chart) : null
  const soldOut = row ? sizes.find((s) => s.us === row.us)?.soldOut : false

  let message
  if (!hasInput) {
    message = 'Enter your foot length in centimetres to see your size.'
  } else if (!valid) {
    message = 'Enter your foot length as a number of centimetres.'
  } else if (!row) {
    message = `That length is outside the size chart (${chart[0].minCm} to ${chart[chart.length - 1].maxCm} cm). Check your measurement and try again.`
  } else {
    const primary = unit === 'EU' ? `EU ${row.eu}` : `US ${row.us}`
    const secondary = unit === 'EU' ? `US ${row.us}` : `EU ${row.eu}`
    message = `Your size is ${primary} (${secondary}).${soldOut ? ` US ${row.us} is currently sold out.` : ''}`
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="text-button"
        onClick={() => setOpen(true)}
      >
        Size guide
      </button>
      <dialog
        ref={dialogRef}
        className="size-guide"
        aria-labelledby={titleId}
        onClose={() => {
          setOpen(false)
          triggerRef.current?.focus()
        }}
      >
        <div className="size-guide-content">
          <div className="dialog-header">
            <h2 id={titleId}>Size guide</h2>
            <button type="button" className="button-secondary" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <table className="size-table">
            <caption>Trail Runner 2 sizes</caption>
            <thead>
              <tr>
                <th scope="col">US</th>
                <th scope="col">EU</th>
                <th scope="col">Foot length (cm)</th>
              </tr>
            </thead>
            <tbody>
              {chart.map((r) => (
                <tr key={r.us}>
                  <td>{r.us}</td>
                  <td>{r.eu}</td>
                  <td>
                    {r.minCm} to {r.maxCm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="field">
            <label htmlFor={inputId}>Foot length (cm)</label>
            <input
              id={inputId}
              type="number"
              inputMode="decimal"
              step="0.1"
              min="15"
              max="35"
              value={text}
              aria-describedby={hintId}
              aria-invalid={hasInput && !valid ? 'true' : undefined}
              onChange={(event) => setText(event.target.value)}
            />
            <p id={hintId} className="field-hint">
              Stand on a sheet of paper, heel against a wall, and measure to your longest toe.
            </p>
          </div>

          <fieldset className="unit-choice">
            <legend>Show my size in</legend>
            <label>
              <input type="radio" name={unitName} value="US" checked={unit === 'US'} onChange={() => setUnit('US')} />
              US
            </label>
            <label>
              <input type="radio" name={unitName} value="EU" checked={unit === 'EU'} onChange={() => setUnit('EU')} />
              EU
            </label>
          </fieldset>

          <p role="status" className="size-result">
            {message}
          </p>
        </div>
      </dialog>
    </>
  )
}
