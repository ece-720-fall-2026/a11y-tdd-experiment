export default function Header({ cartCount }) {
  const itemWord = cartCount === 1 ? 'item' : 'items'
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <p className="brand">
        <a href="/">Stride</a>
      </p>
      <a className="cart-link" href="#cart">
        Cart ({cartCount} {itemWord})
      </a>
    </header>
  )
}
