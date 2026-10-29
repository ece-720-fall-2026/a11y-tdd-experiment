import { product } from '../data/product.js'

export default function Price() {
  return (
    <div className="price-row">
      <p className="price">
        ${product.price.toFixed(2)} {product.currency}
      </p>
      <span className="price-info-wrap">
        <button
          type="button"
          className="price-info"
          aria-describedby="price-info-tip"
        >
          <span aria-hidden="true">i</span>
          <span className="visually-hidden">Price information</span>
        </button>
        <span className="price-tip" id="price-info-tip" role="tooltip">
          Price includes taxes and duties.
        </span>
      </span>
    </div>
  )
}
