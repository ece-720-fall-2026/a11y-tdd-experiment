import { product } from '../data/product.js'

export default function Breadcrumb() {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li>
          <a href="/">Shop</a>
        </li>
        <li>
          <a href="/products">Trail</a>
        </li>
        <li>
          <span aria-current="page">{product.name}</span>
        </li>
      </ol>
    </nav>
  )
}
