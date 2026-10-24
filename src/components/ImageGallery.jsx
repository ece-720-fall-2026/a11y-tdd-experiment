import { useState } from 'react'

// Carousel following the W3C carousel pattern: one visible slide at a time,
// previous/next buttons that wrap around, and a labelled region.
export default function ImageGallery({ images }) {
  const [index, setIndex] = useState(0)
  const count = images.length

  const showPrevious = () => setIndex((i) => (i - 1 + count) % count)
  const showNext = () => setIndex((i) => (i + 1) % count)

  return (
    <section className="gallery" aria-roledescription="carousel" aria-label="Product photos">
      <div className="gallery-stage">
        {images.map((image, i) => (
          <div
            key={image.src}
            className="gallery-slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            hidden={i !== index}
          >
            <img src={image.src} alt={image.alt} width="800" height="600" />
          </div>
        ))}
      </div>
      <div className="gallery-controls">
        <button type="button" className="round-btn" onClick={showPrevious} aria-label="Previous photo">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className="round-btn" onClick={showNext} aria-label="Next photo">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="gallery-count" aria-hidden="true">
          {index + 1} / {count}
        </span>
      </div>
    </section>
  )
}
