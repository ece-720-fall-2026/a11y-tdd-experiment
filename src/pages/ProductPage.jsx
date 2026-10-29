import { useRef, useState } from 'react'
import { product, formatPrice } from '../data/trailRunner2.js'
import StoreHeader from '../components/StoreHeader.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Gallery from '../components/Gallery.jsx'
import PriceInfo from '../components/PriceInfo.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import SizePicker from '../components/SizePicker.jsx'
import SizeGuide from '../components/SizeGuide.jsx'
import Quantity from '../components/Quantity.jsx'
import InfoTabs from '../components/InfoTabs.jsx'
import Faq from '../components/Faq.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

export default function ProductPage() {
  const [color, setColor] = useState(product.colors[0])
  const [size, setSize] = useState(null)
  const [sizeError, setSizeError] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [cartCount, setCartCount] = useState(0)
  const [added, setAdded] = useState(null)
  const [wishlisted, setWishlisted] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)

  const sizeBtnRef = useRef(null)
  const guideBtnRef = useRef(null)

  const pickSize = (us) => {
    setSize(us)
    setSizeError(false)
  }

  const closeGuide = () => {
    setGuideOpen(false)
    guideBtnRef.current?.focus()
  }

  const useSizeFromGuide = (us) => {
    pickSize(us)
    closeGuide()
  }

  const addToCart = () => {
    if (size == null) {
      setSizeError(true)
      sizeBtnRef.current?.focus()
      return
    }
    setCartCount((n) => n + quantity)
    setAdded({ name: product.name, color: color.name, size, quantity })
  }

  const crumbs = [
    { label: 'Shop', href: '/' },
    { label: product.category.label, href: product.category.href },
    { label: product.name },
  ]

  return (
    <>
      <StoreHeader cartCount={cartCount} />

      <main className="product">
        <Breadcrumb items={crumbs} />

        <div className="product__top">
          <Gallery photos={product.photos} color={color} productName={product.name} />

          <div className="product__info">
            <h1 className="product__title">{product.name}</h1>
            <PriceInfo amount={product.price} currency={product.currency} />

            <ColorPicker colors={product.colors} value={color} onChange={setColor} />

            <SizePicker
              ref={sizeBtnRef}
              value={size}
              onChange={pickSize}
              onOpenGuide={() => setGuideOpen(true)}
              guideRef={guideBtnRef}
              error={sizeError}
            />

            <Quantity value={quantity} onChange={setQuantity} />

            <div className="product__actions">
              <button type="button" className="btn btn--primary btn--block" onClick={addToCart}>
                Add to cart · {formatPrice(product.price * quantity, product.currency)}
              </button>
              <button
                type="button"
                className={`wish-btn${wishlisted ? ' is-on' : ''}`}
                aria-pressed={wishlisted}
                onClick={() => setWishlisted((w) => !w)}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path
                    d="M12 21s-7.5-4.6-9.6-9.1C.9 8.8 2.6 5 6.3 5c2.1 0 3.4 1.2 4.2 2.4h.99C12.3 6.2 13.6 5 15.7 5c3.7 0 5.4 3.8 3.9 6.9C19.5 16.4 12 21 12 21z"
                    fill={wishlisted ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
                {wishlisted ? 'Saved to wishlist' : 'Save to wishlist'}
              </button>
            </div>

            {added && (
              <p className="added" role="status">
                Added {added.quantity} × {added.name} ({added.color}, US {added.size}) to your cart.
              </p>
            )}

            <ul className="highlights">
              {product.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        </div>

        <InfoTabs />
        <Faq />
      </main>

      <SizeGuide open={guideOpen} onClose={closeGuide} onUseSize={useSizeFromGuide} />
      <SiteFooter />
    </>
  )
}
