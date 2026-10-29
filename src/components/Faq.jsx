import { product } from '../data/trailRunner2.js'

export default function Faq() {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">Common questions</h2>
      {product.faqs.map((f) => (
        <details key={f.q} className="faq__item">
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  )
}
