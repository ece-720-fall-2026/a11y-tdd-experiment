export default function StoreHeader({ cartCount }) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a href="/" className="logo">Stride</a>
        <a href="/cart" className="cart-link">
          Cart <span className="cart-count">{cartCount}</span>
        </a>
      </div>
    </header>
  )
}
