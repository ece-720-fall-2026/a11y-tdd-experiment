import { useState } from 'react'
import Header from '../components/Header'
import Breadcrumb from '../components/Breadcrumb'
import PhotoGallery from '../components/PhotoGallery'
import SizeSelect from '../components/SizeSelect'
import SizeGuideDialog from '../components/SizeGuideDialog'
import QuantityStepper from '../components/QuantityStepper'
import InfoTabs from '../components/InfoTabs'
import Questions from '../components/Questions'
import Footer from '../components/Footer'
import { product } from '../data'

function Heart({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d="M12 21s-7.5-4.7-9.3-9.1C1.4 8.4 3.4 5 6.8 5c2 0 3.6 1.1 4.4 2.7h1.6C13.6 6.1 15.2 5 17.2 5c3.4 0 5.4 3.4 4.1 6.9C19.5 16.3 12 21 12 21z"
        fill={filled ? '#d6455d' : 'none'}
        stroke="#d6455d"
        strokeWidth="1.6"
      />
    </svg>
  )
}

export default function ProductPage() {
  const [colorId, setColorId] = useState(product.colors[0].id)
  const [sizeId, setSizeId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [cartCount, setCartCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [priceInfoVisible, setPriceInfoVisible] = useState(false)
  const [message, setMessage] = useState(null)

  const color = product.colors.find((item) => item.id === colorId)

  const addToCart = () => {
    if (!sizeId) {
      setMessage({ type: 'error', text: 'Pick a size to add this shoe to your cart.' })
      return
    }
    setCartCount((count) => count + quantity)
    setMessage({ type: 'success', text: 'Added to cart.' })
  }

  return (
    <>
      <Header cartCount={cartCount} />
      <Breadcrumb
        trail={[
          { label: 'Shop', href: '/' },
          { label: 'Trail', href: '/' },
          { label: product.name },
        ]}
      />
      <main id="main" className="product">
        <h1>{product.name}</h1>
        <p className="tagline">
          {product.tagline} · {product.reviewCount} reviews
        </p>

        <div className="product-layout">
          <PhotoGallery color={color} />

          <div className="product-details">
            <p className="price">
              ${product.price}.00 {product.currency}
              <span className="price-info">
                <button
                  type="button"
                  aria-label="Price information"
                  className="price-info-button"
                  onMouseEnter={() => setPriceInfoVisible(true)}
                  onMouseLeave={() => setPriceInfoVisible(false)}
                  onFocus={() => setPriceInfoVisible(true)}
                  onBlur={() => setPriceInfoVisible(false)}
                >
                  i
                </button>
                <span role="note" className="price-info-tooltip" hidden={!priceInfoVisible}>
                  Price includes taxes.
                </span>
              </span>
            </p>

            <fieldset className="colour-field">
              <legend>Colour: {color.name}</legend>
              <div className="swatches">
                {product.colors.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={colorId === item.id || undefined}
                    aria-label={item.name}
                    title={item.name}
                    className={'swatch' + (colorId === item.id ? ' is-selected' : '')}
                    style={{ backgroundColor: item.hex }}
                    onClick={() => setColorId(item.id)}
                  />
                ))}
              </div>
            </fieldset>

            <div className="size-row">
              <SizeSelect id="size" selectedId={sizeId} onSelect={setSizeId} />
              <button
                type="button"
                className="size-guide-button"
                onClick={() => setSizeGuideOpen(true)}
              >
                Size guide
              </button>
            </div>

            <QuantityStepper value={quantity} onChange={setQuantity} />

            <div className="actions">
              <button type="button" className="add-to-cart" onClick={addToCart}>
                Add to cart
              </button>
              <button
                type="button"
                className="wishlist-button"
                aria-pressed={saved}
                aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={() => setSaved((value) => !value)}
              >
                <Heart filled={saved} />
              </button>
            </div>

            <p role="alert" className="message is-error" hidden={message?.type !== 'error'}>
              {message?.type === 'error' ? message.text : ''}
            </p>
            <p role="status" className="message is-success" hidden={message?.type !== 'success'}>
              {message?.type === 'success' ? message.text : ''}
            </p>
          </div>
        </div>

        <InfoTabs />
        <Questions />
      </main>
      <Footer />
      {sizeGuideOpen && <SizeGuideDialog onClose={() => setSizeGuideOpen(false)} />}
    </>
  )
}
