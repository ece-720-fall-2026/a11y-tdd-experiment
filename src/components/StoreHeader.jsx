export default function StoreHeader({ storeName, cartCount }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="store-name" href="/">
          {storeName}
        </a>
        <a className="cart-link" href="/cart">
          Cart ({cartCount})
        </a>
      </div>
    </header>
  )
}
