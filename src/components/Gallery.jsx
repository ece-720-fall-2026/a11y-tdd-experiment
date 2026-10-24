import { useState } from 'react'
import ShoeImage, { VIEW_ORDER, viewLabel } from './ShoeImage.jsx'

export default function Gallery({ productName, color }) {
  const [index, setIndex] = useState(0)
  const total = VIEW_ORDER.length
  const view = VIEW_ORDER[index]
  const label = `${productName} in ${color.name.toLowerCase()}, ${viewLabel(view).toLowerCase()}`

  const next = () => setIndex((i) => (i + 1) % total)
  const prev = () => setIndex((i) => (i - 1 + total) % total)

  return (
    <section className="gallery" aria-label="Product photos">
      <div className="gallery-stage">
        <ShoeImage view={view} color={color.hex} trim={color.trim} label={label} />
        <button type="button" className="gallery-btn gallery-prev" onClick={prev} aria-label="Previous photo">
          &#8592;
        </button>
        <button type="button" className="gallery-btn gallery-next" onClick={next} aria-label="Next photo">
          &#8594;
        </button>
        <p className="gallery-count" aria-live="polite">
          {index + 1} / {total}
        </p>
      </div>
    </section>
  )
}
