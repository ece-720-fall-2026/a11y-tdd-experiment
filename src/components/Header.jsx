export default function Header({ cartCount }) {
  return (
    <header className="site-header">
      <div className="pp-container site-header-inner">
        <a href="/" className="store-name">
          Stride
        </a>
        <button type="button" className="cart-button">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 7h12l-1 13H7L6 7Z" strokeLinejoin="round" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          <span>Cart</span>
          <span className="cart-count" aria-hidden="true">
            {cartCount}
          </span>
          <span className="sr-only">
            ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </span>
        </button>
      </div>
    </header>
  )
}
