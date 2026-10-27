import { useState } from 'react'
import { product } from '../data/product.js'
import SiteHeader from '../components/SiteHeader.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import PhotoGallery from '../components/PhotoGallery.jsx'
import PriceTip from '../components/PriceTip.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import SizePicker from '../components/SizePicker.jsx'
import SizeGuide from '../components/SizeGuide.jsx'
import QuantityInput, { toQuantity } from '../components/QuantityInput.jsx'
import InfoTabs from '../components/InfoTabs.jsx'
import FaqList from '../components/FaqList.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import '../styles/product.css'

const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency }).format(
  product.price,
)

export default function ProductPage() {
  const [cartCount, setCartCount] = useState(0)
  const [colorId, setColorId] = useState(product.colors[0].id)
  const [sizeUs, setSizeUs] = useState(null)
  const [quantity, setQuantity] = useState('1')
  const [saved, setSaved] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [message, setMessage] = useState(null)

  const color = product.colors.find((c) => c.id === colorId)
  const size = product.sizes.find((s) => s.us === sizeUs)

  function addToCart() {
    if (!size) {
      setMessage({ tone: 'error', text: 'Please select a size before adding to your cart.' })
      return
    }
    const count = toQuantity(quantity)
    setCartCount((n) => n + count)
    setMessage({
      tone: 'success',
      text: `Added to your cart: ${count} × ${product.name}, ${color.name}, US ${size.us}.`,
    })
  }

  return (
    <div className="product-page">
      <SiteHeader cartCount={cartCount} />

      <main className="product">
        <Breadcrumb
          items={[{ label: 'Shop', href: '/' }, { label: 'Trail', href: '/' }, { label: product.name }]}
        />

        <div className="product-layout">
          <PhotoGallery colorHex={color.hex} />

          <div className="buy-panel">
            <h1>{product.name}</h1>
            <p className="rating">
              <span aria-hidden="true">★★★★☆</span> {product.rating} · {product.reviewCount} reviews
            </p>

            <p className="price-row">
              <PriceTip>
                <span className="price">{price}</span>
              </PriceTip>
            </p>

            <ColorPicker colors={product.colors} value={colorId} onChange={setColorId} />

            <SizePicker
              sizes={product.sizes}
              value={sizeUs}
              onChange={setSizeUs}
              onOpenGuide={() => setGuideOpen(true)}
            />

            <div className="purchase-row">
              <QuantityInput value={quantity} onChange={setQuantity} />
              <button type="button" className="add-to-cart" onClick={addToCart}>
                Add to cart
              </button>
            </div>

            {message && (
              <p className={`message ${message.tone}`} role={message.tone === 'error' ? 'alert' : 'status'}>
                {message.text}
              </p>
            )}

            <button
              type="button"
              className="wishlist"
              aria-pressed={saved}
              onClick={() => setSaved((s) => !s)}
            >
              <span aria-hidden="true">{saved ? '♥' : '♡'}</span> Wishlist
            </button>

            <p className="description">{product.description}</p>
          </div>
        </div>

        <section className="questions">
          <h2>Questions</h2>
          <FaqList items={product.questions} />
        </section>

        <section className="more-info">
          <h2>More information</h2>
          <InfoTabs />
        </section>
      </main>

      <SiteFooter />

      {guideOpen && <SizeGuide onClose={() => setGuideOpen(false)} />}
    </div>
  )
}
