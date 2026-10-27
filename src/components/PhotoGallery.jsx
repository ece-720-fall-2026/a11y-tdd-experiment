import { useMemo, useState } from 'react'
import { shoePhotos } from '../lib/shoeImages.js'

export default function PhotoGallery({ colorHex }) {
  const photos = useMemo(() => shoePhotos(colorHex), [colorHex])
  const [index, setIndex] = useState(0)
  const count = photos.length
  const photo = photos[index]

  return (
    <section className="gallery" aria-label="Product photos">
      <div className="photo-frame">
        <img src={photo.src} alt={`Trail Runner 2, ${photo.label}`} />
      </div>
      <div className="gallery-controls">
        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => setIndex((i) => (i - 1 + count) % count)}
        >
          ‹
        </button>
        <span className="gallery-count">
          {index + 1} / {count}
        </span>
        <button type="button" aria-label="Next photo" onClick={() => setIndex((i) => (i + 1) % count)}>
          ›
        </button>
      </div>
    </section>
  )
}
