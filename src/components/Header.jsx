export default function Header({ store, cartCount }) {
  return (
    <header className="site-header">
      <a className="store-name" href="/">{store}</a>
      <a className="cart-link" href="/cart">Cart ({cartCount})</a>
    </header>
  )
}
