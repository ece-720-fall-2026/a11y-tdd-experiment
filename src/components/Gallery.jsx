import { useState } from 'react'
import { shoeImageSrc } from '../data/shoeImage.js'

export default function Gallery({ photos, productName, color }) {
  const [index, setIndex] = useState(0)
  const count = photos.length
  const photo = photos[index]

  const show = (next) => setIndex((next + count) % count)

  return (
    <section aria-label="Product photos" className="gallery">
      <div className="gallery__stage">
        <img
          className="gallery__image"
          src={shoeImageSrc(color.hex, photo.view)}
          alt={`${productName} in ${color.name}, ${photo.label}`}
          width="400"
          height="300"
        />
        <button type="button" className="gallery__button gallery__button--prev" aria-label="Previous photo" onClick={() => show(index - 1)}>
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" className="gallery__button gallery__button--next" aria-label="Next photo" onClick={() => show(index + 1)}>
          <span aria-hidden="true">→</span>
        </button>
        <p className="gallery__count">
          {index + 1} / {count}
        </p>
      </div>
    </section>
  )
}
