import { useEffect, useId, useRef, useState } from 'react'
import { product } from '../data/product.js'

const MIN_CM = 23
const MAX_CM = 31

// Finds the smallest size that fits the foot length.
function recommend(footCm, system) {
  const cm = Number.parseFloat(footCm)
  if (!Number.isFinite(cm) || cm < MIN_CM || cm > MAX_CM) {
    return { message: `Enter your foot length in centimetres (${MIN_CM} to ${MAX_CM}).` }
  }
  const row = product.sizes.find((s) => s.cm >= cm)
  if (!row) {
    return { message: 'Your foot is longer than our largest size.' }
  }
  if (!system) {
    return { message: 'Choose US or EU to see your result.' }
  }
  const size = system === 'US' ? row.us : row.eu
  return { message: `Your size: ${system} ${size}` }
}

export default function SizeGuide({ onClose }) {
  const titleId = useId()
  const footId = useId()
  const groupName = useId()
  const dialogRef = useRef(null)
  const [footCm, setFootCm] = useState('')
  const [system, setSystem] = useState('')

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  const result = recommend(footCm, system)

  return (
    <div className="modal-backdrop">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="modal"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
      >
        <h2 id={titleId}>Size guide</h2>

        <table className="size-chart">
          <thead>
            <tr>
              <th scope="col">US</th>
              <th scope="col">EU</th>
              <th scope="col">Foot length (cm)</th>
            </tr>
          </thead>
          <tbody>
            {product.sizes.map((s) => (
              <tr key={s.us}>
                <td>{s.us}</td>
                <td>{s.eu}</td>
                <td>{s.cm}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="guide-form">
          <label htmlFor={footId}>Foot length (cm)</label>
          <input
            id={footId}
            type="number"
            inputMode="decimal"
            step="0.5"
            min={MIN_CM}
            max={MAX_CM}
            value={footCm}
            onChange={(e) => setFootCm(e.target.value)}
          />

          <fieldset className="system">
            <legend>Show my size in</legend>
            {['US', 'EU'].map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  name={groupName}
                  value={s}
                  checked={system === s}
                  onChange={() => setSystem(s)}
                />{' '}
                {s}
              </label>
            ))}
          </fieldset>

          <p className="guide-result" role="status">
            {result.message}
          </p>
        </div>

        <button type="button" className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
