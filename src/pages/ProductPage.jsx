import { useRef, useState } from 'react'
import { product } from '../data/trailRunner2.js'
import SiteHeader from '../components/SiteHeader.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import Gallery from '../components/Gallery.jsx'
import PriceInfo from '../components/PriceInfo.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import SizePicker from '../components/SizePicker.jsx'
import SizeGuide from '../components/SizeGuide.jsx'
import Quantity from '../components/Quantity.jsx'
import Wishlist from '../components/Wishlist.jsx'
import MoreInfo from '../components/MoreInfo.jsx'
import Questions from '../components/Questions.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { sizeLabel } from '../data/trailRunner2.js'

export default function ProductPage() {
  const [color, setColor] = useState(product.colors[0])
  const [size, setSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [saved, setSaved] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text }
  const [guideOpen, setGuideOpen] = useState(false)
  const sizeTrigger = useRef(null)

  const addToCart = () => {
    if (!size) {
      setMessage({ type: 'error', text: 'Please choose a size before adding to your cart.' })
      sizeTrigger.current?.focus()
      return
    }
    setCartCount((c) => c + quantity)
    setMessage({
      type: 'success',
      text: `Added ${quantity} × ${product.name}, ${color.name}, ${sizeLabel(size)} to your cart.`,
    })
  }

  const chooseSize = (s) => {
    setSize(s)
    setMessage(null)
  }

  return (
    <>
      <SiteHeader cartCount={cartCount} />
      <main className="product-page">
        <Breadcrumb path={product.path} />

        <div className="product-top">
          <Gallery productName={product.name} color={color} />

          <section className="buy-box" aria-labelledby="product-name">
            <h1 id="product-name">{product.name}</h1>
            <p className="subtitle">{product.subtitle}</p>
            <p className="rating">
              <span aria-label={`${product.rating} out of 5 stars`}>★ {product.rating}</span>{' '}
              <a href="#reviews">({product.reviewCount} reviews)</a>
            </p>

            <PriceInfo price={product.price} currency={product.currency} />

            <ColorPicker colors={product.colors} value={color} onChange={setColor} />

            <SizePicker
              ref={sizeTrigger}
              sizes={product.sizes}
              value={size}
              onChange={chooseSize}
              onOpenGuide={() => setGuideOpen(true)}
              invalid={message?.type === 'error' && !size}
            />

            <Quantity value={quantity} onChange={setQuantity} />

            <button type="button" className="btn btn-primary btn-block" onClick={addToCart}>
              Add to cart
            </button>
            <Wishlist saved={saved} onToggle={() => setSaved((s) => !s)} name={product.name} />

            <div className="cart-message" role={message?.type === 'error' ? 'alert' : 'status'}>
              {message && <p className={message.type}>{message.text}</p>}
            </div>

            <p className="description">{product.description}</p>
          </section>
        </div>

        <div id="reviews">
          <MoreInfo product={product} />
        </div>
        <Questions faqs={product.faqs} />
      </main>
      <SiteFooter />

      {guideOpen && (
        <SizeGuide sizes={product.sizes} onClose={() => setGuideOpen(false)} onSelect={chooseSize} />
      )}
    </>
  )
}
