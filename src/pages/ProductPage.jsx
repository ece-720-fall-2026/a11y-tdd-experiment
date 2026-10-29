import { useEffect, useId, useRef, useState } from 'react'
import { product } from '../data/product.js'
import Breadcrumb from '../components/Breadcrumb.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import FaqList from '../components/FaqList.jsx'
import ImageGallery from '../components/ImageGallery.jsx'
import MoreInfoTabs from '../components/MoreInfoTabs.jsx'
import QuantityField from '../components/QuantityField.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import SizeField from '../components/SizeField.jsx'
import TaxTooltip from '../components/TaxTooltip.jsx'
import { parseQuantity } from '../components/quantity.js'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: product.currency,
})

export default function ProductPage() {
  const [cartCount, setCartCount] = useState(0)
  const [colorId, setColorId] = useState(product.colors[0].id)
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [sizeError, setSizeError] = useState('')
  const [quantityError, setQuantityError] = useState('')
  const [wishlisted, setWishlisted] = useState(false)
  const [wishlistMessage, setWishlistMessage] = useState('')
  const [cartMessage, setCartMessage] = useState('')
  const sizeRef = useRef(null)
  const quantityRef = useRef(null)
  const infoId = useId()

  const colorName = product.colors.find((c) => c.id === colorId).name

  useEffect(() => {
    document.title = `${product.name} | Stride`
  }, [])

  const handleAddToCart = (e) => {
    e.preventDefault()
    const count = parseQuantity(quantity)
    if (count === null) {
      setQuantityError(
        `Enter a whole number from 1 to ${product.maxQuantity}.`,
      )
      setCartMessage('')
      quantityRef.current?.focus()
      return
    }
    if (!size) {
      setSizeError('Choose a size before adding this shoe to your cart.')
      setCartMessage('')
      sizeRef.current?.focus()
      return
    }
    setCartCount((n) => n + count)
    setCartMessage(
      `Added ${count} ${count === 1 ? 'pair' : 'pairs'} of ${product.name} in ${colorName.toLowerCase()}, US ${size}, to your cart.`,
    )
  }

  const toggleWishlist = () => {
    const next = !wishlisted
    setWishlisted(next)
    setWishlistMessage(
      next ? `${product.name} saved to your wishlist.` : `${product.name} removed from your wishlist.`,
    )
  }

  const formattedPrice = priceFormatter.format(product.price)

  return (
    <>
      <SiteHeader cartCount={cartCount} />
      <main id="main" tabIndex={-1} className="page">
        <Breadcrumb />

        <div className="product">
          <ImageGallery colorId={colorId} colorName={colorName} />

          <div className="buy-box">
            <h1 className="product__name">{product.name}</h1>
            <p className="rating">
              <span className="stars" aria-hidden="true">★★★★☆</span>{' '}
              <span>
                {product.rating} out of 5 ({product.reviewCount} reviews)
              </span>
            </p>

            <p className="price">
              <span className="price__amount">{formattedPrice}</span>
              <TaxTooltip>Price includes taxes.</TaxTooltip>
            </p>

            <form className="buy-form" onSubmit={handleAddToCart} noValidate>
              <ColorPicker value={colorId} onChange={setColorId} />

              <SizeField
                selectRef={sizeRef}
                value={size}
                error={sizeError}
                onChange={(v) => {
                  setSize(v)
                  setSizeError('')
                }}
              />

              <QuantityField
                inputRef={quantityRef}
                value={quantity}
                error={quantityError}
                onChange={(v) => {
                  setQuantity(v)
                  setQuantityError('')
                }}
              />

              <div className="buy-form__actions">
                <button type="submit" className="button button--primary button--block">
                  Add to cart
                </button>
                <button
                  type="button"
                  className="button button--outline button--block"
                  aria-pressed={wishlisted}
                  onClick={toggleWishlist}
                >
                  <svg
                    className={`heart${wishlisted ? ' heart--on' : ''}`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M12 21s-7.5-4.6-9.5-9.2C1 8.6 3.2 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5 18.8 5 21 8.6 21.5 11.8 19.5 16.4 12 21 12 21z" />
                  </svg>
                  Add to wishlist
                </button>
              </div>
            </form>

            {/* Live regions stay in the DOM so screen readers announce updates. */}
            <div className="status-stack">
              <p role="status" className="status">
                {cartMessage}
              </p>
              {cartMessage && (
                <p className="status-link">
                  <a href="/cart">View cart</a>
                </p>
              )}
              <p role="status" className="status">
                {wishlistMessage}
              </p>
            </div>
          </div>
        </div>

        <section className="more-info" aria-labelledby={infoId}>
          <h2 id={infoId}>More information</h2>
          <MoreInfoTabs />
        </section>

        <section className="questions" aria-labelledby="questions-heading">
          <h2 id="questions-heading">Questions</h2>
          <FaqList />
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
