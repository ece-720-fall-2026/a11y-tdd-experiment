import { useState } from 'react'
import { photoViews, shoePhoto } from '../photo'

export default function PhotoGallery({ color }) {
  const goNext = () => setIndex((i) => (i + 1) % photoViews.length)
  const [index, setIndex] = useState(0)
  const view = photoViews[index]

  return (
    <section aria-label="Trail Runner 2 photos" className="gallery">
      <img
        className="gallery-photo"
        src={shoePhoto(color.hex, view.id)}
        alt={`Trail Runner 2 in ${color.name.toLowerCase()}, ${view.label}`}
      />
      <div className="gallery-controls">
        <button type="button" onClick={() => setIndex((i) => (i - 1 + photoViews.length) % photoViews.length)}>
          Previous photo
        </button>
        <span aria-live="polite" className="gallery-status">
          Photo {index + 1} of {photoViews.length}: {view.label}
        </span>
        <button type="button" onClick={goNext}>
          Next photo
        </button>
      </div>
    </section>
  )
}
