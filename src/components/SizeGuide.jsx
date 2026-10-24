import { useEffect, useId, useRef, useState } from 'react'
import { sizeLabel } from '../data/trailRunner2.js'

// Modal over the page. It stays open until the shopper closes it.
export default function SizeGuide({ sizes, onClose, onSelect }) {
  const titleId = useId()
  const footId = useId()
  const [footCm, setFootCm] = useState('')
  const [system, setSystem] = useState('US')
  const [result, setResult] = useState(null) // { size } | { none: true } | { invalid: true } | null
  const firstField = useRef(null)

  useEffect(() => {
    firstField.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const findSize = (e) => {
    e.preventDefault()
    const cm = parseFloat(footCm)
    if (!Number.isFinite(cm) || cm <= 0) {
      setResult({ invalid: true })
      return
    }
    // The smallest size whose length covers the foot.
    const size = sizes.find((s) => s.cm >= cm)
    setResult(size ? { size } : { none: true })
  }

  const displayFor = (size) => (system === 'US' ? `US ${size.us}` : `EU ${size.eu}`)

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal-head">
          <h2 id={titleId}>Size guide</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close size guide">
            ×
          </button>
        </div>

        <form className="size-finder" onSubmit={findSize}>
          <label>
            Foot length (cm)
            <input
              ref={firstField}
              type="number"
              inputMode="decimal"
              min="10"
              max="40"
              step="0.1"
              value={footCm}
              onChange={(e) => {
                setFootCm(e.target.value)
                setResult(null)
              }}
              aria-describedby={footId}
            />
          </label>
          <fieldset className="system-toggle">
            <legend>Show my size in</legend>
            {['US', 'EU'].map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  name="size-system"
                  value={s}
                  checked={system === s}
                  onChange={() => setSystem(s)}
                />
                {s}
              </label>
            ))}
          </fieldset>
          <button type="submit" className="btn btn-primary">Find my size</button>
          <p id={footId} className="hint">
            Stand on a sheet of paper, mark the heel and longest toe, then measure in cm.
          </p>
        </form>

        <div className="size-result" role="status">
          {result?.invalid && <p className="error">Enter your foot length in cm.</p>}
          {result?.none && <p className="error">Your foot is longer than our largest size.</p>}
          {result?.size && (
            <>
              <p>
                Your size: <strong>{displayFor(result.size)}</strong>
              </p>
              {result.size.soldOut ? (
                <p className="error">This size is sold out. Try the next size up.</p>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    onSelect(result.size)
                    onClose()
                  }}
                >
                  Use {sizeLabel(result.size)}
                </button>
              )}
            </>
          )}
        </div>

        <table className="size-chart">
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

        <div className="modal-foot">
          <button type="button" className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
