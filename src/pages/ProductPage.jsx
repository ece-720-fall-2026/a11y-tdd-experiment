import { useMemo, useRef, useState } from 'react'
import { product, store, footer } from '../data/trailRunner2.js'
import { productPhotos } from '../data/photos.js'
import StoreHeader from '../components/StoreHeader.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import PhotoCarousel from '../components/PhotoCarousel.jsx'
import PriceInfo from '../components/PriceInfo.jsx'
import ColorChooser from '../components/ColorChooser.jsx'
import SizeChooser from '../components/SizeChooser.jsx'
import QuantityField from '../components/QuantityField.jsx'
import WishlistButton from '../components/WishlistButton.jsx'
import FaqSection from '../components/FaqSection.jsx'
import MoreInformation from '../components/MoreInformation.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency })

export default function ProductPage() {
  const [colorId, setColorId] = useState(product.colors[0].id)
  const [size, setSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [cartCount, setCartCount] = useState(store.cartCount)
  const [sizeError, setSizeError] = useState('')
  const [cartMessage, setCartMessage] = useState('')
  const sizeRef = useRef(null)

  const photos = useMemo(() => productPhotos(product, colorId), [colorId])
  const color = product.colors.find((c) => c.id === colorId)

  function addToCart() {
    if (size === null) {
      setCartMessage('')
      setSizeError('Please choose a size before adding this shoe to your cart.')
      sizeRef.current?.open()
      return
    }
    setSizeError('')
    setCartCount((count) => count + quantity)
    setCartMessage(
      `Added to your cart: ${quantity} × ${product.name}, ${color.label}, US size ${size}.`,
    )
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to product
      </a>
      <StoreHeader storeName={store.name} cartCount={cartCount} />

      <main id="main" className="page">
        <Breadcrumb items={product.breadcrumb} current={product.name} />

        <div className="product">
          <div className="product-media">
            <PhotoCarousel key={colorId} photos={photos} />
          </div>

          <div className="product-buy">
            <h1>{product.name}</h1>
            <p className="product-description">{product.description}</p>

            <div className="price-row">
              <span className="price">{priceFormatter.format(product.price)}</span>
              <PriceInfo message="Price includes taxes." />
            </div>

            <ColorChooser colors={product.colors} value={colorId} onChange={setColorId} />

            <SizeChooser
              ref={sizeRef}
              sizes={product.sizes}
              sizeChart={product.sizeChart}
              value={size}
              onChange={(us) => {
                setSize(us)
                setSizeError('')
              }}
            />

            <QuantityField value={quantity} max={product.maxQuantity} onChange={setQuantity} />

            <div className="actions">
              <button type="button" className="button-primary" onClick={addToCart}>
                Add to cart
              </button>
              <WishlistButton />
            </div>

            <p role="alert" className="form-message form-error">
              {sizeError}
            </p>
            <p role="status" className="form-message form-success">
              {cartMessage}
            </p>
          </div>
        </div>

        <FaqSection faqs={product.faqs} />
        <MoreInformation product={product} />
      </main>

      <SiteFooter storeName={store.name} links={footer} />
    </>
  )
}
