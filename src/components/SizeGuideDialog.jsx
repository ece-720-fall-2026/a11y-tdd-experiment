import { useEffect, useId, useRef, useState } from 'react'

// Modal size guide built on the native <dialog> element, which makes the page
// behind it inert while open, traps focus and closes on Escape.
export default function SizeGuideDialog({ open, onClose, sizes, onChooseSize }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const inputId = useId()
  const hintId = useId()
  const errorId = useId()
  const resultId = useId()
  const systemName = useId()
  const [footText, setFootText] = useState('')
  const [system, setSystem] = useState('US')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const footCm = footText.trim() === '' ? null : Number(footText)
  const footValid = footCm !== null && Number.isFinite(footCm) && footCm >= 15 && footCm <= 40
  const footInvalid = footCm !== null && !footValid

  // Smallest size whose foot length is at least the entered length.
  const match = footValid ? sizes.find((s) => s.cm >= footCm) : undefined
  const largest = sizes[sizes.length - 1]
  const tooLong = footValid && !match

  let result = null
  if (footValid && match) {
    const sizeText = system === 'US' ? `US ${match.us}` : `EU ${match.eu}`
    result = `Your size is ${sizeText}.`
  }

  return (
    <dialog
      ref={dialogRef}
      className="size-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
    >
      <div className="size-dialog-body">
        <h2 id={titleId}>Size guide</h2>
        <p className="muted">Trail Runner 2 is sized for men. Use the chart below or enter your foot length to find your size.</p>

        <div className="field">
          <label htmlFor={inputId} className="field-label">
            Foot length (cm)
          </label>
          <p id={hintId} className="hint">
            Stand on a sheet of paper and measure from the heel to the longest toe.
          </p>
          <input
            id={inputId}
            className="text-input"
            type="number"
            inputMode="decimal"
            min="15"
            max="40"
            step="0.1"
            value={footText}
            onChange={(event) => setFootText(event.target.value)}
            aria-describedby={`${hintId}${footInvalid ? ` ${errorId}` : ''}`}
            aria-invalid={footInvalid ? 'true' : undefined}
          />
          {footInvalid && (
            <p id={errorId} className="error">
              Enter a foot length between 15 and 40 cm.
            </p>
          )}
        </div>

        <fieldset className="options system-options">
          <legend className="field-label">Show my size in</legend>
          {['US', 'EU'].map((option) => (
            <label key={option} className="system-option">
              <input
                type="radio"
                name={systemName}
                value={option}
                checked={system === option}
                onChange={() => setSystem(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>

        <div id={resultId} className="size-result" role="status" aria-live="polite">
          {tooLong && (
            <p>
              Your foot is longer than our largest size, US {largest.us} ({largest.cm} cm).
            </p>
          )}
          {result && (
            <>
              <p className="result-text">{result}</p>
              {match.soldOut ? (
                <p className="error">US {match.us} is sold out. Choose the next size up or check back later.</p>
              ) : null}
            </>
          )}
        </div>
        {result && (
          <button
            type="button"
            className="primary-btn"
            disabled={match.soldOut}
            onClick={() => onChooseSize(match.us)}
          >
            Select US {match.us}
          </button>
        )}

        <table className="size-table">
          <caption>Size chart</caption>
          <thead>
            <tr>
              <th scope="col">US</th>
              <th scope="col">EU</th>
              <th scope="col">Foot length (cm)</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s.us}>
                <td>{s.us}</td>
                <td>{s.eu}</td>
                <td>{s.cm}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="dialog-footer">
          <button type="button" className="secondary-btn" onClick={() => dialogRef.current?.close()}>
            Close size guide
          </button>
        </div>
      </div>
    </dialog>
  )
}
