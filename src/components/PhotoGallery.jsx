import { imagePath, photoAlt, product } from '../data/product.js'

export default function PhotoGallery({ color, viewIndex, onViewIndexChange }) {
  const colorName =
    product.colors.find((c) => c.id === color)?.name ?? product.colors[0].name
  const view = product.views[viewIndex]

  return (
    <div className="gallery">
      <div className="gallery-stage">
        <img
          className="gallery-photo"
          src={imagePath(color, view.id)}
          alt={photoAlt(colorName, view.label)}
        />
      </div>
      <div className="gallery-controls">
        <button type="button" onClick={() => onViewIndexChange(viewIndex - 1)}>
          <span aria-hidden="true">‹</span> Previous photo
        </button>
        <button type="button" onClick={() => onViewIndexChange(viewIndex + 1)}>
          Next photo <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  )
}
