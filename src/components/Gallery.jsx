import { useState } from 'react'

// Shows one photo at a time. Next and previous wrap around at the ends.
export default function Gallery({ productName, colorName, views, srcFor }) {
  const [index, setIndex] = useState(0)
  const total = views.length
  const step = (delta) => setIndex((i) => (i + delta + total) % total)

  return (
    <div className="gallery">
      <div className="gallery-stage">
        <img
          src={srcFor(index)}
          alt={`${productName} in ${colorName}, ${views[index]} (${index + 1} of ${total})`}
        />
        <button type="button" className="gallery-arrow prev" aria-label="Previous photo" onClick={() => step(-1)}>
          &#8592;
        </button>
        <button type="button" className="gallery-arrow next" aria-label="Next photo" onClick={() => step(1)}>
          &#8594;
        </button>
        <span className="gallery-counter" aria-hidden="true">
          {index + 1} / {total}
        </span>
      </div>
    </div>
  )
}
