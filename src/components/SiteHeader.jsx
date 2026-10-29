import { store } from '../data/product.js'

export default function SiteHeader({ cartCount }) {
  return (
    <header className="site-header">
      <a className="store-name" href={store.homeHref}>
        {store.name}
      </a>
      <a className="cart-link" href="/cart">
        Cart <span className="cart-count">{cartCount}</span>
      </a>
    </header>
  )
}
