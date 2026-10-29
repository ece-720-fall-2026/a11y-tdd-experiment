import { useRef, useState } from 'react'
import StoreHeader from '../components/StoreHeader.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import PhotoGallery from '../components/PhotoGallery.jsx'
import Price from '../components/Price.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import SizeChooser from '../components/SizeChooser.jsx'
import QuantityStepper from '../components/QuantityStepper.jsx'
import InfoTabs from '../components/InfoTabs.jsx'
import Questions from '../components/Questions.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { product } from '../data/product.js'

export default function ProductPage() {
  const [cartCount, setCartCount] = useState(0)
  const [cartStatus, setCartStatus] = useState('')
  const [color, setColor] = useState('blue')
  const [viewIndex, setViewIndex] = useState(0)
  const [size, setSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [sizeDialogOpen, setSizeDialogOpen] = useState(false)
  const statusRef = useRef(null)

  const viewCount = product.views.length

  const addToCart = () => {
    if (!size) {
      setCartStatus('Please pick a size before adding this shoe to the cart.')
      statusRef.current?.focus()
      return
    }
    setCartCount((count) => count + quantity)
    const chosen = product.sizes.find((s) => s.id === size).label
    const chosenColor = product.colors.find((c) => c.id === color).name
    setCartStatus(
      `Added to cart: ${quantity} × ${product.name} in ${chosenColor.toLowerCase()}, size ${chosen}.`,
    )
    statusRef.current?.focus()
  }

  return (
    <div className="page" inert={sizeDialogOpen || undefined}>
      <StoreHeader cartCount={cartCount} />
      <main id="main">
        <Breadcrumb />
        <h1>{product.name}</h1>
        <p className="tagline">New for fall — grip the trail, skip the puddles.</p>
        <div className="product-layout">
          <PhotoGallery
            color={color}
            viewIndex={viewIndex}
            onViewIndexChange={(index) =>
              setViewIndex(((index % viewCount) + viewCount) % viewCount)
            }
          />
          <div className="product-details">
            <Price />
            <p className="rating">
              ★ {product.rating} · {product.reviewCount} reviews
            </p>
            <ColorPicker color={color} onColorChange={setColor} />
            <div className="size-row">
              <SizeChooser
                size={size}
                onSizeChange={setSize}
                open={sizeDialogOpen}
                onOpenChange={setSizeDialogOpen}
              />
              <p className="size-help">Sizes run true. Open the guide to measure your foot.</p>
            </div>
            <QuantityStepper quantity={quantity} onQuantityChange={setQuantity} />
            <div className="buy-row">
              <button type="button" className="add-to-cart" onClick={addToCart}>
                Add to cart
              </button>
              <button
                type="button"
                className="wishlist"
                aria-pressed={wishlisted}
                onClick={() => setWishlisted((value) => !value)}
              >
                <span aria-hidden="true">{wishlisted ? '♥' : '♡'}</span>{' '}
                {wishlisted ? 'Saved to wishlist' : 'Add to wishlist'}
              </button>
            </div>
            <p
              ref={statusRef}
              tabIndex={-1}
              className="cart-status"
              role="status"
              aria-live="polite"
            >
              {cartStatus}
            </p>
          </div>
        </div>
        <InfoTabs />
        <Questions />
      </main>
      <SiteFooter />
    </div>
  )
}
