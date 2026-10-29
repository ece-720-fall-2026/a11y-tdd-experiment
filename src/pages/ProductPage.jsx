import { useEffect, useRef, useState } from 'react'
import '../styles/product-page.css'
import { product } from '../data/product.js'
import Header from '../components/Header.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Gallery from '../components/Gallery.jsx'
import PriceInfo from '../components/PriceInfo.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import SizePicker from '../components/SizePicker.jsx'
import ProductTabs from '../components/ProductTabs.jsx'
import FAQ from '../components/FAQ.jsx'
import Footer from '../components/Footer.jsx'

const MIN_QUANTITY = 1

function clampQuantity(text) {
  const n = parseInt(text, 10)
  if (!Number.isFinite(n)) return MIN_QUANTITY
  return Math.min(Math.max(n, MIN_QUANTITY), product.maxQuantity)
}

export default function ProductPage() {
  const [colorId, setColorId] = useState(product.colors[0].id)
  const [size, setSize] = useState('')
  const [quantityText, setQuantityText] = useState('1')
  const [cartCount, setCartCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [cartError, setCartError] = useState('')
  const [cartStatus, setCartStatus] = useState('')
  const sizeButtonRef = useRef(null)

  const color = product.colors.find((c) => c.id === colorId)
  const quantity = clampQuantity(quantityText)

  useEffect(() => {
    document.title = `${product.name} | ${product.brand}`
  }, [])

  function changeSize(next) {
    setSize(next)
    setCartError('')
  }

  function setQuantity(next) {
    setQuantityText(String(clampQuantity(String(next))))
  }

  function addToCart() {
    if (!size) {
      setCartStatus('')
      setCartError('Select a size before adding this shoe to your cart.')
      sizeButtonRef.current?.focus()
      return
    }
    setCartError('')
    setCartCount((n) => n + quantity)
    setCartStatus(
      `Added to your cart: ${quantity} ${quantity === 1 ? 'pair' : 'pairs'} of ${product.name}, ${color.name}, US ${size}.`,
    )
  }

  return (
    <div className="pp">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header cartCount={cartCount} />

      <main id="main" className="pp-container">
        <Breadcrumb
          items={[
            { label: 'Shop', href: '/shop' },
            { label: 'Trail', href: '/shop/trail' },
          ]}
          current={product.name}
        />

        <div className="product">
          <Gallery productName={product.name} color={color} />

          <div className="buy-box">
            <h1>{product.name}</h1>
            <p className="rating">
              <span aria-hidden="true" className="stars">★★★★☆</span>
              <span>
                {product.rating} out of 5 stars ({product.reviewCount} reviews)
              </span>
            </p>
            <p className="summary">{product.summary}</p>

            <div className="price-row">
              <p className="price">{product.priceText}</p>
              <PriceInfo />
            </div>

            <ColorPicker colors={product.colors} value={colorId} onChange={setColorId} />

            <SizePicker sizes={product.sizes} value={size} onChange={changeSize} buttonRef={sizeButtonRef} />

            <div className="option">
              <div className="option-row">
                <span className="option-label" id="quantity-label">
                  Quantity
                </span>
                <div className="quantity">
                  <button
                    type="button"
                    className="icon-button"
                    aria-disabled={quantity <= MIN_QUANTITY}
                    onClick={() => quantity > MIN_QUANTITY && setQuantity(quantity - 1)}
                  >
                    <span aria-hidden="true">−</span>
                    <span className="sr-only">Decrease quantity</span>
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    aria-labelledby="quantity-label"
                    min={MIN_QUANTITY}
                    max={product.maxQuantity}
                    step="1"
                    inputMode="numeric"
                    value={quantityText}
                    onChange={(e) => setQuantityText(e.target.value)}
                    onBlur={() => setQuantity(quantity)}
                  />
                  <button
                    type="button"
                    className="icon-button"
                    aria-disabled={quantity >= product.maxQuantity}
                    onClick={() => quantity < product.maxQuantity && setQuantity(quantity + 1)}
                  >
                    <span aria-hidden="true">+</span>
                    <span className="sr-only">Increase quantity</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="actions">
              <button type="button" className="button-primary" onClick={addToCart}>
                Add to cart
              </button>
              <p role="alert" className="form-error">
                {cartError}
              </p>
              <p role="status" className="form-status">
                {cartStatus}
              </p>
            </div>

            <button type="button" className="button-secondary wishlist" aria-pressed={saved} onClick={() => setSaved((s) => !s)}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" strokeLinejoin="round" />
              </svg>
              Save to wishlist
            </button>
          </div>
        </div>

        <ProductTabs />
        <FAQ />
      </main>

      <Footer />
    </div>
  )
}
