import { storeName } from '../data/product.js'

export default function SiteHeader({ cartCount }) {
  return (
    <header className="site-header">
      <a href="/" className="logo">
        {storeName}
      </a>
      <a href="/cart" className="cart-link">
        Cart <span className="cart-count">{cartCount}</span>
      </a>
    </header>
  )
}
