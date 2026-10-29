export default function StoreHeader({ cartCount }) {
  return (
    <header className="store-header">
      <div className="store-header__inner">
        <a href="/" className="store-logo">Stride</a>
        <a href="#cart" className="store-cart" aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.5L21 8H6.2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="10" cy="20" r="1.5" fill="currentColor" />
            <circle cx="17" cy="20" r="1.5" fill="currentColor" />
          </svg>
          <span className="store-cart__count" aria-hidden="true">{cartCount}</span>
        </a>
      </div>
    </header>
  )
}
