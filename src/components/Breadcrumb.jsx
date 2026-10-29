import { product } from '../data/product.js'

export default function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        {product.breadcrumb.map((step, index) => (
          <li key={step.label}>
            {index > 0 && (
              <span className="breadcrumb__sep" aria-hidden="true">
                /
              </span>
            )}
            <a href={step.href}>{step.label}</a>
          </li>
        ))}
        <li>
          <span className="breadcrumb__sep" aria-hidden="true">
            /
          </span>
          <span aria-current="page">{product.name}</span>
        </li>
      </ol>
    </nav>
  )
}
