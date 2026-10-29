export default function ShopPage() {
  return (
    <div className="page">
      <header className="banner">
        <a className="store-name" href="/">Stride</a>
        <a className="cart-link" href="/cart">Cart (0)</a>
      </header>
      <main>
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <ol>
            <li><a href="/">Shop</a></li>
            <li><a href="/products" aria-current="page">Trail</a></li>
          </ol>
        </nav>
        <h1>Trail</h1>
        <ul>
          <li><a href="/products/trail-runner-2">Trail Runner 2</a></li>
        </ul>
      </main>
      <footer className="footer">
        <p>&copy; Stride</p>
      </footer>
    </div>
  )
}
