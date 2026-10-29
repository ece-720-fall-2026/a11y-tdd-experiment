import { useState } from 'react'
import ShoeArt from './ShoeArt.jsx'

export default function Gallery({ photos, color, productName }) {
  const [index, setIndex] = useState(0)
  const count = photos.length
  const photo = photos[index]

  const prev = () => setIndex((i) => (i - 1 + count) % count)
  const next = () => setIndex((i) => (i + 1) % count)

  return (
    <section className="gallery" aria-label="Product photos">
      <div className="gallery__stage">
        <ShoeArt color={color} view={photo.view} label={`${photo.alt}, ${color.name.toLowerCase()}`} />
        <div className="gallery__controls">
          <button type="button" className="gallery__arrow" onClick={prev} aria-label="Previous photo">
            ←
          </button>
          <button type="button" className="gallery__arrow" onClick={next} aria-label="Next photo">
            →
          </button>
        </div>
        <span className="gallery__counter" aria-live="polite">
          {index + 1} / {count}
        </span>
      </div>
      <p className="visually-hidden">{productName} photo {index + 1} of {count}</p>
    </section>
  )
}
