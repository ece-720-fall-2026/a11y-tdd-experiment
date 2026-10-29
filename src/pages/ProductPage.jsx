import { useState } from 'react'
import '../styles/product.css'
import { product } from '../data/product.js'
import { shoeImageSrc } from '../data/shoeImage.js'
import SiteHeader from '../components/SiteHeader.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Gallery from '../components/Gallery.jsx'
import PriceInfo from '../components/PriceInfo.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import SizePicker from '../components/SizePicker.jsx'
import SizeGuide from '../components/SizeGuide.jsx'
import Quantity, { clampQty } from '../components/Quantity.jsx'
import MoreInfo from '../components/MoreInfo.jsx'
import Questions from '../components/Questions.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

export default function ProductPage() {
  const [colorId, setColorId] = useState(product.colors[0].id)
  const [sizeUs, setSizeUs] = useState(null)
  const [qtyText, setQtyText] = useState('1')
  const [guideOpen, setGuideOpen] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [sizeError, setSizeError] = useState(false)
  const [lastAdded, setLastAdded] = useState(null) // { qty, color, size }
  const [cartCount, setCartCount] = useState(0)

  const color = product.colors.find((c) => c.id === colorId)
  const quantity = clampQty(qtyText, product.maxQuantity)
  const size = product.sizes.find((s) => s.us === sizeUs) ?? null

  const chooseSize = (us) => {
    setSizeUs(us)
    setSizeError(false)
  }

  const addToCart = () => {
    if (!size) {
      setSizeError(true)
      setLastAdded(null)
      return
    }
    setSizeError(false)
    setCartCount((n) => n + quantity)
    setLastAdded({ qty: quantity, color: color.name, size: size.us })
  }

  const stepQuantity = (delta) => setQtyText(String(clampQty(quantity + delta, product.maxQuantity)))

  return (
    <>
      <SiteHeader cartCount={cartCount} />
      <main className="product">
        <Breadcrumb steps={product.path} />

        <div className="product-hero">
          <Gallery
            productName={product.name}
            colorName={color.name}
            views={product.photos}
            srcFor={(i) => shoeImageSrc(color.hex, i)}
          />

          <div className="buybox">
            <h1>{product.name}</h1>
            <PriceInfo price={product.price} currency={product.currency} />
            <p className="description">{product.description}</p>

            <ColorPicker colors={product.colors} value={colorId} onChange={setColorId} />

            <SizePicker
              sizes={product.sizes}
              value={sizeUs}
              onChange={chooseSize}
              onOpenGuide={() => setGuideOpen(true)}
            />

            <Quantity
              text={qtyText}
              max={product.maxQuantity}
              onText={setQtyText}
              onStep={stepQuantity}
            />

            <div className="actions">
              <button type="button" className="primary add-to-cart" onClick={addToCart}>
                Add to cart
              </button>
              <button
                type="button"
                className={wishlisted ? 'wishlist active' : 'wishlist'}
                aria-pressed={wishlisted}
                onClick={() => setWishlisted((w) => !w)}
              >
                <span aria-hidden="true">{wishlisted ? '♥' : '♡'}</span> Wishlist
              </button>
            </div>

            {sizeError && (
              <p className="message error" role="alert">
                Please select a size before adding to cart.
              </p>
            )}
            {lastAdded && (
              <p className="message success" role="status">
                Added to your cart: {lastAdded.qty} × {product.name}, {lastAdded.color}, US {lastAdded.size}.
              </p>
            )}
          </div>
        </div>

        <Questions items={product.questions} />
        <MoreInfo product={product} />
      </main>

      {guideOpen && (
        <SizeGuide
          sizes={product.sizes}
          onClose={() => setGuideOpen(false)}
          onChoose={(us) => {
            chooseSize(us)
            setGuideOpen(false)
          }}
        />
      )}

      <SiteFooter />
    </>
  )
}
