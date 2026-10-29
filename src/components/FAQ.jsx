import { useId, useState } from 'react'
import { product } from '../data/product.js'

// APG Accordion pattern: each button controls a panel with aria-expanded.
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const baseId = useId()
  const headingId = `${baseId}-heading`

  return (
    <section className="faq" aria-labelledby={headingId}>
      <h2 id={headingId}>Questions</h2>
      {product.faq.map((item, i) => {
        const expanded = openIndex === i
        return (
          <div key={item.question} className="faq-item">
            <h3>
              <button
                type="button"
                id={`${baseId}-q-${i}`}
                aria-expanded={expanded}
                aria-controls={`${baseId}-a-${i}`}
                className="faq-question"
                onClick={() => setOpenIndex(expanded ? null : i)}
              >
                <span>{item.question}</span>
                <span aria-hidden="true" className="faq-icon">
                  {expanded ? '−' : '+'}
                </span>
              </button>
            </h3>
            <div id={`${baseId}-a-${i}`} className="faq-answer" hidden={!expanded} role="region" aria-labelledby={`${baseId}-q-${i}`}>
              <p>{item.answer}</p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
