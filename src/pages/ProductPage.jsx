import { useState } from 'react'
import { product } from '../data/trailRunner2.js'
import Header from '../components/Header.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Gallery from '../components/Gallery.jsx'
import PriceInfo from '../components/PriceInfo.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import SizePicker from '../components/SizePicker.jsx'
import SizeGuide from '../components/SizeGuide.jsx'
import Questions from '../components/Questions.jsx'
import MoreInfo from '../components/MoreInfo.jsx'
import Footer from '../components/Footer.jsx'

export default function ProductPage() {
  const [color, setColor] = useState(product.colors[0].id)
  const [size, setSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [cartCount, setCartCount] = useState(product.cartCount)
  const [sizeError, setSizeError] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [wishlisted, setWishlisted] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const photos = product.photos[color]
  const colorLabel = product.colors.find((c) => c.id === color).label
  const price = `${product.currency}${product.price}`

  const setQty = (n) => {
    if (Number.isFinite(n) && n >= 1) setQuantity(Math.floor(n))
  }

  const addToCart = () => {
    if (!size) {
      setConfirmation('')
      setSizeError('Please select a size before adding to cart.')
      return
    }
    setSizeError('')
    setCartCount((c) => c + quantity)
    setConfirmation(`Added to cart: ${quantity} × ${product.name}, ${colorLabel}, US ${size}.`)
  }

  return (
    <>
      <Header store={product.store} cartCount={cartCount} />
      <main>
        <Breadcrumb items={product.path} />
        <div className="product-layout">
          <Gallery key={color} photos={photos} label={product.name} />
          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="price">
              <span>{price}</span> <PriceInfo text="Includes taxes." />
            </p>

            <ColorPicker colors={product.colors} value={color} onChange={setColor} />

            <SizePicker
              sizes={product.sizes}
              value={size}
              onChange={(s) => {
                setSize(s)
                setSizeError('')
              }}
              onOpenGuide={() => setGuideOpen(true)}
              error={sizeError}
            />

            <div className="field-row">
              <span className="field-label" id="qty-label">Quantity</span>
              <button type="button" className="qty-button" aria-label="Decrease quantity" onClick={() => setQty(quantity - 1)} disabled={quantity <= 1}>
                −
              </button>
              <input
                type="number"
                aria-label="Quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQty(Number.parseInt(e.target.value, 10))}
                className="qty-input"
              />
              <button type="button" className="qty-button" aria-label="Increase quantity" onClick={() => setQty(quantity + 1)}>
                +
              </button>
            </div>

            <div className="purchase-row">
              <button type="button" className="add-to-cart" onClick={addToCart}>
                Add to cart
              </button>
              <button
                type="button"
                className="wishlist"
                aria-pressed={wishlisted}
                onClick={() => setWishlisted((w) => !w)}
              >
                <span aria-hidden="true">{wishlisted ? '♥' : '♡'}</span> Wishlist
              </button>
            </div>

            {confirmation && <p role="status" className="confirmation">{confirmation}</p>}
          </div>
        </div>
        <Questions items={product.faqs} />
        <MoreInfo
          details={<p>{product.details}</p>}
          reviews={
            <ul className="reviews">
              {product.reviews.map((r) => (
                <li key={r.author}>
                  <strong>{r.author}</strong> — {r.rating}/5
                  <p>{r.text}</p>
                </li>
              ))}
            </ul>
          }
          shipping={<p>{product.shipping}</p>}
        />
      </main>

      <Footer store={product.store} />

      {guideOpen && (
        <SizeGuide
          chart={product.sizeChart}
          onClose={() => setGuideOpen(false)}
        />
      )}
    </>
  )
}
