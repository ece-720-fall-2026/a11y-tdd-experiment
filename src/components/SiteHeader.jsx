import { store } from '../data/product.js'

export default function SiteHeader({ cartCount }) {
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <div className="site-header__inner">
        <a className="store-name" href={store.homeHref}>
          {store.name}
        </a>
        <a className="cart-link" href={store.cartHref}>
          Cart
          <span className="cart-link__count">
            {cartCount}
            <span className="sr-only">
              {cartCount === 1 ? ' item' : ' items'} in cart
            </span>
          </span>
        </a>
      </div>
    </header>
  )
}
