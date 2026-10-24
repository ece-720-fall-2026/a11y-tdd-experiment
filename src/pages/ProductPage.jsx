import { useEffect, useRef, useState } from 'react'
import SiteHeader from '../components/SiteHeader.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import ImageGallery from '../components/ImageGallery.jsx'
import PriceInfo from '../components/PriceInfo.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import SizePicker from '../components/SizePicker.jsx'
import SizeGuideDialog from '../components/SizeGuideDialog.jsx'
import QuantityField from '../components/QuantityField.jsx'
import FaqSection from '../components/FaqSection.jsx'
import MoreInfoTabs from '../components/MoreInfoTabs.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import Stars from '../components/Stars.jsx'
import { product, formatPrice } from '../data/product.js'
import { parseQty, MIN_QTY, MAX_QTY } from '../lib/quantity.js'
import '../styles/product.css'

export default function ProductPage() {
  const [colorId, setColorId] = useState(product.colors[0].id)
  const [sizeUs, setSizeUs] = useState(null)
  const [qtyText, setQtyText] = useState(String(MIN_QTY))
  const [qtyError, setQtyError] = useState(false)
  const [sizeError, setSizeError] = useState(null)
  const [saved, setSaved] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [cartMessage, setCartMessage] = useState('')
  const [wishMessage, setWishMessage] = useState('')
  const [guideOpen, setGuideOpen] = useState(false)

  const sizeGuideButtonRef = useRef(null)
  const qtyInputRef = useRef(null)

  useEffect(() => {
    document.title = `${product.name} | Stride`
  }, [])

  const color = product.colors.find((c) => c.id === colorId)
  const sizeLabel = sizeUs ? `US ${sizeUs}` : null
  const priceText = formatPrice(product.price, product.currency)

  const addToCart = () => {
    if (sizeUs === null) {
      setCartMessage('')
      setSizeError({ message: 'Select a size to add this shoe to your cart.' })
      return
    }
    const qty = parseQty(qtyText)
    if (qty === null) {
      setCartMessage('')
      setQtyError(true)
      qtyInputRef.current?.focus()
      return
    }
    setCartCount((c) => c + qty)
    setCartMessage(
      `Added ${qty} ${qty === 1 ? 'pair' : 'pairs'} of ${product.name}, ${color.label}, ${sizeLabel}, to your cart.`,
    )
  }

  const toggleSaved = () => {
    const next = !saved
    setSaved(next)
    setWishMessage(next ? `${product.name} saved to your wishlist.` : `${product.name} removed from your wishlist.`)
  }

  const closeGuide = () => {
    setGuideOpen(false)
    sizeGuideButtonRef.current?.focus()
  }

  const chooseSizeFromGuide = (us) => {
    setSizeUs(us)
    setSizeError(null)
    closeGuide()
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to product
      </a>
      <SiteHeader cartCount={cartCount} />
      <Breadcrumb items={product.breadcrumb} />

      <main id="main" tabIndex={-1}>
        <div className="container product-layout">
          <ImageGallery key={colorId} images={product.photos[colorId]} />

          <section className="product-info" aria-labelledby="product-title">
            <h1 id="product-title">{product.name}</h1>
            <p className="tagline">{product.tagline}</p>
            <p className="rating">
              <Stars value={product.rating.average} /> {product.rating.average} out of 5 ({product.rating.count} reviews)
            </p>

            <PriceInfo price={priceText} note={product.priceNote} />

            <ColorPicker colors={product.colors} value={colorId} onChange={setColorId} />

            <SizePicker
              sizes={product.sizes}
              value={sizeUs}
              error={sizeError?.message ?? null}
              errorToken={sizeError}
              onChange={(us) => {
                setSizeUs(us)
                setSizeError(null)
              }}
              onOpenGuide={() => setGuideOpen(true)}
              guideButtonRef={sizeGuideButtonRef}
            />

            <QuantityField
              value={qtyText}
              inputRef={qtyInputRef}
              error={qtyError}
              onChange={(text) => {
                setQtyText(text)
                if (parseQty(text) !== null) setQtyError(false)
              }}
              onBlur={() => {
                if (parseQty(qtyText) === null) setQtyError(true)
              }}
            />

            <div className="actions">
              <button type="button" className="primary-btn" onClick={addToCart}>
                Add to cart
              </button>
              <button
                type="button"
                className="secondary-btn"
                aria-pressed={saved}
                onClick={toggleSaved}
              >
                <span aria-hidden="true">{saved ? '♥' : '♡'}</span> Save to wishlist
              </button>
            </div>

            <div className="status-stack">
              <p role="status" className="cart-status">
                {cartMessage}
              </p>
              <p role="status" className="wish-status">
                {wishMessage}
              </p>
            </div>
          </section>
        </div>

        <FaqSection faqs={product.faqs} />
        <MoreInfoTabs />
      </main>

      <SiteFooter />

      <SizeGuideDialog
        open={guideOpen}
        onClose={() => {
          setGuideOpen(false)
          // The native dialog restores focus itself; only step in if focus was lost.
          const active = document.activeElement
          if (!active || active === document.body) sizeGuideButtonRef.current?.focus()
        }}
        sizes={product.sizes}
        onChooseSize={chooseSizeFromGuide}
      />
    </>
  )
}
