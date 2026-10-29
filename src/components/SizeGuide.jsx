import { useEffect, useId, useRef, useState } from 'react'
import { product, sizeForFootLength } from '../data/trailRunner2.js'

export default function SizeGuide({ open, onClose, onUseSize }) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const [footCm, setFootCm] = useState('')
  const [system, setSystem] = useState('US')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    dialogRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    const cm = parseFloat(footCm)
    if (!Number.isFinite(cm) || cm < 15 || cm > 40) {
      setResult(null)
      setError('Enter your foot length in centimetres (for example 26.0).')
      return
    }
    setError('')
    const row = sizeForFootLength(cm)
    setResult(row ? { row, cm } : { row: null, cm })
  }

  const row = result?.row
  const soldOut = row && product.soldOut.includes(row.us)

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="modal"
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <h2 id={titleId}>Size guide</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close size guide">
            ×
          </button>
        </div>

        <form className="size-finder" onSubmit={submit}>
          <h3>Find your size</h3>
          <div className="size-finder__row">
            <label>
              Foot length (cm)
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                min="15"
                max="40"
                value={footCm}
                onChange={(e) => setFootCm(e.target.value)}
              />
            </label>
            <fieldset className="size-finder__system">
              <legend>Show my size in</legend>
              <label><input type="radio" name="system" checked={system === 'US'} onChange={() => setSystem('US')} /> US</label>
              <label><input type="radio" name="system" checked={system === 'EU'} onChange={() => setSystem('EU')} /> EU</label>
            </fieldset>
          </div>
          <button type="submit" className="btn btn--secondary">Get my size</button>
          {error && <p className="field__error" role="alert">{error}</p>}

          {result && row && (
            <div className="size-result" role="status">
              <p>
                Your size: <strong>{system === 'US' ? `US ${row.us}` : `EU ${row.eu}`}</strong>{' '}
                <span className="muted">({system === 'US' ? `EU ${row.eu}` : `US ${row.us}`})</span>
              </p>
              {soldOut ? (
                <p className="field__error">US {row.us} is sold out. Choose another size.</p>
              ) : (
                <button type="button" className="btn btn--primary" onClick={() => onUseSize(row.us)}>
                  Use US {row.us}
                </button>
              )}
            </div>
          )}
          {result && !row && (
            <p className="field__error" role="status">
              Your foot is longer than our largest size. Please contact customer help.
            </p>
          )}
        </form>

        <h3>Size chart</h3>
        <table className="size-table">
          <thead>
            <tr>
              <th scope="col">US</th>
              <th scope="col">EU</th>
              <th scope="col">Foot length (cm)</th>
            </tr>
          </thead>
          <tbody>
            {product.sizeChart.map((r) => (
              <tr key={r.us}>
                <td>{r.us}</td>
                <td>{r.eu}</td>
                <td>{r.footCm.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal__foot">
          <button type="button" className="btn btn--primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
