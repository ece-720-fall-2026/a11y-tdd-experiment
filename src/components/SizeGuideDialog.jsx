import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { product } from '../data/product.js'
import { chartRange, euFromUs, sizeFromFootLength } from './sizing.js'

// Modal size guide. A native <dialog> opened with showModal() traps focus,
// makes the page behind it inert and closes on Escape. It stays open until
// the shopper closes it. It is portalled to <body> so it is not nested in
// the add-to-cart form.
export default function SizeGuideDialog({ open, onClose, onUseSize }) {
  const dialogRef = useRef(null)
  const footRef = useRef(null)
  const ids = {
    title: useId(),
    chart: useId(),
    foot: useId(),
    hint: useId(),
    error: useId(),
    system: useId(),
  }
  const [footInput, setFootInput] = useState('')
  const [system, setSystem] = useState('US')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const range = chartRange()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      footRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    // The dialog is portalled out of the page form, but React events still
    // bubble through the React tree, so stop this one here.
    e.stopPropagation()
    const cm = Number.parseFloat(footInput)
    const us = sizeFromFootLength(cm)
    if (us === null) {
      setResult(null)
      setError(
        `Enter a foot length between ${range.min} and ${range.max} cm.`,
      )
      return
    }
    setError('')
    setResult(us)
  }

  const soldOut = result !== null && product.sizes.find((s) => s.us === result)?.soldOut
  const resultText =
    result === null
      ? ''
      : system === 'US'
        ? `Your size is US ${result} (EU ${euFromUs(result)}).`
        : `Your size is EU ${euFromUs(result)} (US ${result}).`

  return createPortal(
    <dialog
      ref={dialogRef}
      className="size-guide"
      aria-labelledby={ids.title}
      onClose={onClose}
    >
      <div className="size-guide__body">
        <h2 id={ids.title}>Size guide</h2>

        <table className="size-chart" aria-labelledby={ids.chart}>
          <caption id={ids.chart}>Trail Runner 2 size chart</caption>
          <thead>
            <tr>
              <th scope="col">US</th>
              <th scope="col">EU</th>
              <th scope="col">Foot length (cm)</th>
            </tr>
          </thead>
          <tbody>
            {product.sizeChart.map((row) => (
              <tr key={row.us}>
                <td>{row.us}</td>
                <td>{row.eu}</td>
                <td>{row.footCm}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="size-guide__subhead">Find your size</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor={ids.foot}>Foot length (cm)</label>
            <input
              ref={footRef}
              id={ids.foot}
              type="number"
              inputMode="decimal"
              step="0.1"
              min={range.min}
              max={range.max}
              value={footInput}
              onChange={(e) => setFootInput(e.target.value)}
              aria-invalid={error ? 'true' : undefined}
              aria-describedby={`${ids.hint} ${ids.error}`}
              className="text-input text-input--short"
            />
            <p id={ids.hint} className="hint">
              Stand on a sheet of paper against a wall and mark the tip of your longest toe and your heel. Measure the distance between the marks.
            </p>
            <p id={ids.error} className="error" role="alert">
              {error}
            </p>
          </div>

          <fieldset className="field">
            <legend>Show my size in</legend>
            <div className="radio-row">
              {['US', 'EU'].map((s) => (
                <label key={s} className="radio-label">
                  <input
                    type="radio"
                    name={ids.system}
                    value={s}
                    checked={system === s}
                    onChange={() => setSystem(s)}
                  />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="button button--secondary">
            Find my size
          </button>
        </form>

        <p className="size-guide__result" role="status">
          {resultText}
          {soldOut && ' This size is sold out, so it cannot be selected.'}
        </p>

        <div className="size-guide__actions">
          <button
            type="button"
            className="button button--primary"
            disabled={result === null || soldOut}
            onClick={() => {
              onUseSize(result)
              dialogRef.current?.close()
            }}
          >
            Use this size
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => dialogRef.current?.close()}
          >
            Close size guide
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  )
}
