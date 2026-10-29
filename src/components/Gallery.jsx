import { useState } from 'react'

export default function Gallery({ photos, label }) {
  const [index, setIndex] = useState(0)
  const count = photos.length
  const photo = photos[index]

  return (
    <section className="gallery" aria-roledescription="carousel" aria-label={`Photos of ${label}`} role="region">
      <img src={photo.src} alt={photo.alt} className="gallery-image" />
      <div className="gallery-controls">
        <button type="button" aria-label="Previous photo" onClick={() => setIndex((index - 1 + count) % count)}>
          ←
        </button>
        <span className="gallery-count" aria-live="polite">{index + 1} / {count}</span>
        <button type="button" aria-label="Next photo" onClick={() => setIndex((index + 1) % count)}>
          →
        </button>
      </div>
    </section>
  )
}
