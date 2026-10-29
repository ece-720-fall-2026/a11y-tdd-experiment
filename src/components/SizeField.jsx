import { useId, useRef, useState } from 'react'
import { product } from '../data/product.js'
import SizeGuideDialog from './SizeGuideDialog.jsx'

// Size picker: a native select so the list only opens when the shopper wants
// to change it. Sold-out sizes are disabled options.
const SizeField = (
  { value, onChange, error, selectRef },
) => {
  const [guideOpen, setGuideOpen] = useState(false)
  const guideButtonRef = useRef(null)
  const ids = { select: useId(), error: useId() }

  const closeGuide = () => {
    setGuideOpen(false)
    guideButtonRef.current?.focus()
  }

  return (
    <div className="field">
      <div className="field__head">
        <label htmlFor={ids.select}>
          Size
        </label>
        <button
          ref={guideButtonRef}
          type="button"
          className="link-button"
          aria-haspopup="dialog"
          onClick={() => setGuideOpen(true)}
        >
          Size guide
        </button>
      </div>
      <select
        ref={selectRef}
        id={ids.select}
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? ids.error : undefined}
      >
        <option value="" disabled>
          Select a size
        </option>
        {product.sizes.map((size) => (
          <option key={size.us} value={size.us} disabled={size.soldOut}>
            {`US ${size.us} (EU ${size.eu})${size.soldOut ? ' - sold out' : ''}`}
          </option>
        ))}
      </select>
      {error && (
        <p id={ids.error} className="error" role="alert">
          {error}
        </p>
      )}
      <SizeGuideDialog
        open={guideOpen}
        onClose={closeGuide}
        onUseSize={(us) => onChange(String(us))}
      />
    </div>
  )
}

export default SizeField
