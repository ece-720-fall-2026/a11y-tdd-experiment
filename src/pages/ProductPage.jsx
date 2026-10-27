import { useEffect, useRef, useState } from 'react'
import '../product.css'
import { product } from '../data/product.js'
import StoreHeader from '../components/StoreHeader.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Gallery from '../components/Gallery.jsx'
import PriceInfo from '../components/PriceInfo.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import SizePicker from '../components/SizePicker.jsx'
import SizeGuide from '../components/SizeGuide.jsx'
import Quantity, { clampQuantity } from '../components/Quantity.jsx'
import MoreInfoTabs from '../components/MoreInfoTabs.jsx'
import Questions from '../components/Questions.jsx'
import StoreFooter from '../components/StoreFooter.jsx'

export default function ProductPage() {
  const [cartCount, setCartCount] = useState(product.cartCount)
  const [colorId, setColorId] = useState(product.colors[0].id)
  const [size, setSize] = useState(null)
  const [quantity, setQuantity] = useState('1')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const sizeComboRef = useRef(null)
  const sizeGuideTriggerRef = useRef(null)

  const color = product.colors.find((c) => c.id === colorId)

  useEffect(() => {
    document.title = `${product.name} | Stride`
  }, [])

  const addToCart = () => {
    if (!size) {
      setConfirmation('')
      setError('Please choose a size before adding to cart.')
      sizeComboRef.current?.focus()
      return
    }
    const qty = clampQuantity(quantity)
    setError('')
    setQuantity(String(qty))
    setCartCount((n) => n + qty)
    setConfirmation(`${qty} × ${product.name} (${color.name}, US ${size}) added to your cart.`)
  }

  return (
    <>
      {/* The page behind the size guide is inert while the dialog is open. */}
      <div className="page" inert={sizeGuideOpen}>
        <StoreHeader cartCount={cartCount} />
        <main className="container">
          <Breadcrumb steps={product.breadcrumb} current={product.name} />

          <div className="product">
            <Gallery photos={product.photos} productName={product.name} color={color} />

            <div className="buy-box">
              <h1>{product.name}</h1>
              <PriceInfo price={product.price} />
              <p className="description">{product.description}</p>

              <ColorPicker colors={product.colors} value={colorId} onChange={setColorId} />

              <SizePicker
                sizes={product.sizes}
                value={size}
                onChange={setSize}
                comboRef={sizeComboRef}
                onOpenGuide={() => setSizeGuideOpen(true)}
                triggerRef={sizeGuideTriggerRef}
              />

              <Quantity
                value={quantity}
                onChange={setQuantity}
                onCommit={(q) => setQuantity(String(q))}
              />

              <div className="actions">
                <button type="button" className="button button--primary" onClick={addToCart}>
                  Add to cart
                </button>
                <button
                  type="button"
                  className="button button--secondary wishlist"
                  aria-pressed={saved}
                  onClick={() => setSaved((s) => !s)}
                >
                  <span aria-hidden="true">{saved ? '♥' : '♡'}</span> Wishlist
                </button>
              </div>

              <div role="alert" className="message message--error">{error}</div>
              <div role="status" className="message message--ok">{confirmation}</div>
            </div>
          </div>

          <MoreInfoTabs />
          <Questions />
        </main>
        <StoreFooter />
      </div>

      {sizeGuideOpen && (
        <SizeGuide
          chart={product.sizeChart}
          returnFocusTo={sizeGuideTriggerRef}
          onClose={() => setSizeGuideOpen(false)}
        />
      )}
    </>
  )
}
