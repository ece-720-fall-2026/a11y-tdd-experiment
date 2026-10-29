import { store } from '../data/product.js'

export default function StoreHeader({ cartCount }) {
  return (
    <header className="store-header">
      <a className="store-logo" href="/">
        <span aria-hidden="true">👟</span> {store.name}
      </a>
      <a className="store-cart" href="/cart">
        Cart
        <span className="cart-count">
          <span className="visually-hidden">items in cart:</span> {cartCount}
        </span>
      </a>
    </header>
  )
}
