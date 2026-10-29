import { useState } from 'react'

function ChevronIcon({ direction }) {
  const d = direction === 'previous' ? 'M15 5 L8 12 L15 19' : 'M9 5 L16 12 L9 19'
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="20" height="20">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Shows one photo at a time. The parent gives it a new key when the colour changes.
export default function PhotoCarousel({ photos }) {
  const [index, setIndex] = useState(0)
  const count = photos.length
  const photo = photos[index]

  return (
    <section className="gallery" aria-label="Product photos">
      <div className="gallery-stage">
        <img className="gallery-image" src={photo.src} alt={photo.alt} width="640" height="420" />
      </div>
      <div className="gallery-controls">
        <button
          type="button"
          className="icon-button"
          aria-label="Previous photo"
          onClick={() => setIndex((i) => (i - 1 + count) % count)}
        >
          <ChevronIcon direction="previous" />
        </button>
        <span className="gallery-count">
          {index + 1} / {count}
        </span>
        <button
          type="button"
          className="icon-button"
          aria-label="Next photo"
          onClick={() => setIndex((i) => (i + 1) % count)}
        >
          <ChevronIcon direction="next" />
        </button>
      </div>
    </section>
  )
}
