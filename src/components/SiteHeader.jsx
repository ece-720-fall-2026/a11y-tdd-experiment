import { store } from '../data/product.js'

export default function SiteHeader({ cartCount }) {
  const itemsLabel = cartCount === 1 ? 'item' : 'items'
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <a href={store.homeHref} className="brand">
          {store.name}
        </a>
        <a href="/cart" className="cart-link">
          <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M6 7h12l-1.2 12.1a1 1 0 0 1-1 .9H8.2a1 1 0 0 1-1-.9L6 7Zm3 0V6a3 3 0 0 1 6 0v1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          <span>Cart</span>{' '}
          <span className="cart-count">
            {cartCount}
            <span className="visually-hidden"> {itemsLabel}</span>
          </span>
        </a>
      </div>
    </header>
  )
}
