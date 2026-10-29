import { useState } from 'react'
import { product } from '../data/product.js'

// One photo at a time with previous/next controls. Moving past the last
// photo returns to the first, and vice versa.
export default function ImageGallery({ colorId, colorName }) {
  const [index, setIndex] = useState(0)
  const total = product.views.length
  const view = product.views[index]
  const src = `/images/trail-runner-2-${colorId}-${view.id}.svg`
  const alt = `${product.name} in ${colorName.toLowerCase()}, ${view.label}`

  const step = (delta) => setIndex((i) => (i + delta + total) % total)

  return (
    <section className="gallery" aria-label="Product photos">
      <div className="gallery__stage">
        <img id="gallery-image" className="gallery__image" src={src} alt={alt} />
        <div className="gallery__controls">
          <button
            type="button"
            className="icon-button"
            aria-label="Previous photo"
            aria-controls="gallery-image"
            onClick={() => step(-1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Next photo"
            aria-controls="gallery-image"
            onClick={() => step(1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <p className="gallery__count" aria-live="polite">
        Photo {index + 1} of {total}: {view.label}
      </p>
    </section>
  )
}
