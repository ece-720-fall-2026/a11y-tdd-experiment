import { useEffect, useId, useRef, useState } from 'react'

// Converts a foot length (cm) to the first size that fits it.
export function sizeForFootLength(sizes, cm) {
  return sizes.find((s) => s.footCm >= cm) ?? null
}

// Modal size chart. It stays on screen until the shopper closes it.
export default function SizeGuide({ sizes, onClose, onChoose }) {
  const titleId = useId()
  const [footCm, setFootCm] = useState('')
  const [unit, setUnit] = useState('US')
  const [result, setResult] = useState(null) // { size } | { error }
  const closeRef = useRef(null)

  // Keep the latest onClose without re-running the effects on every render.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onCloseRef.current()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const find = (e) => {
    e.preventDefault()
    const cm = parseFloat(footCm)
    if (!Number.isFinite(cm) || cm < 20 || cm > 35) {
      setResult({ error: 'Enter a foot length between 20 and 35 cm.' })
      return
    }
    const size = sizeForFootLength(sizes, cm)
    setResult(size ? { size } : { error: 'No size in our range fits that foot length.' })
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCloseRef.current()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="modal-head">
          <h2 id={titleId}>Size guide</h2>
          <button ref={closeRef} type="button" className="modal-close" aria-label="Close size guide" onClick={onClose}>
            &times;
          </button>
        </div>

        <form className="guide-form" onSubmit={find}>
          <label>
            Foot length (cm)
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="20"
              max="35"
              value={footCm}
              onChange={(e) => setFootCm(e.target.value)}
            />
          </label>
          <fieldset>
            <legend>Convert to</legend>
            {['US', 'EU'].map((u) => (
              <label key={u} className="radio-label">
                <input type="radio" name="guide-unit" value={u} checked={unit === u} onChange={() => setUnit(u)} />
                {u}
              </label>
            ))}
          </fieldset>
          <button type="submit" className="primary">
            Find my size
          </button>
        </form>

        {result?.error && <p className="guide-error" role="alert">{result.error}</p>}
        {result?.size && (
          <div className="guide-result" role="status">
            <p>
              Your size: <strong>{unit === 'US' ? `US ${result.size.us}` : `EU ${result.size.eu}`}</strong>
              {unit === 'US' ? ` (EU ${result.size.eu})` : ` (US ${result.size.us})`}
            </p>
            <button
              type="button"
              className="secondary"
              disabled={result.size.soldOut}
              onClick={() => onChoose(result.size.us)}
            >
              Use this size
            </button>
            {result.size.soldOut && <span className="muted"> That size is sold out.</span>}
          </div>
        )}

        <table className="chart">
          <thead>
            <tr>
              <th scope="col">US</th>
              <th scope="col">EU</th>
              <th scope="col">Foot (cm)</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s.us}>
                <td>{s.us}</td>
                <td>{s.eu}</td>
                <td>{s.footCm.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
