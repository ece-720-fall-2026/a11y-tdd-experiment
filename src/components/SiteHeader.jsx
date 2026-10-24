export default function SiteHeader({ cartCount }) {
  return (
    <header className="site-header">
      <a className="store-name" href="/">Stride</a>
      <a className="cart-link" href="#cart" aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}>
        <span>Cart</span>
        <span className="cart-count" aria-hidden="true">{cartCount}</span>
      </a>
    </header>
  )
}
