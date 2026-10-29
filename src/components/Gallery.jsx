import { useState } from 'react'
import { shoeImage, VIEWS } from '../lib/shoeImage.js'

export default function Gallery({ productName, color }) {
  const [index, setIndex] = useState(0)
  const count = VIEWS.length
  const view = VIEWS[index]

  return (
    <section className="gallery" aria-roledescription="carousel" aria-label="Product photos">
      <div className="gallery-stage">
        <img
          src={shoeImage(color.id, view.id)}
          alt={`${productName} in ${color.name}, ${view.label} (photo ${index + 1} of ${count})`}
          width="840"
          height="560"
        />
      </div>
      <div className="gallery-controls">
        <button type="button" className="icon-button" onClick={() => setIndex((index - 1 + count) % count)}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          <span className="sr-only">Previous photo</span>
        </button>
        <span className="gallery-count" aria-live="polite">
          {index + 1} / {count}
        </span>
        <button type="button" className="icon-button" onClick={() => setIndex((index + 1) % count)}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 5l7 7-7 7" />
          </svg>
          <span className="sr-only">Next photo</span>
        </button>
      </div>
    </section>
  )
}
