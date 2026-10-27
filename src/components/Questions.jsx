import { useState } from 'react'
import { product } from '../data/product.js'

// Accordion (APG): each button controls an answer that stays hidden until opened.
export default function Questions() {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <section aria-labelledby="questions-title" className="questions">
      <h2 id="questions-title">Common questions</h2>
      {product.faqs.map((faq, i) => {
        const open = openIndex === i
        return (
          <div key={faq.question} className="faq">
            <h3>
              <button
                type="button"
                id={`faq-${i}`}
                aria-expanded={open}
                aria-controls={`faq-${i}-answer`}
                className="faq__button"
                onClick={() => setOpenIndex(open ? null : i)}
              >
                {faq.question}
                <svg aria-hidden="true" className="faq__icon" viewBox="0 0 16 16" focusable="false">
                  <path d={open ? 'M3 8h10' : 'M3 8h10M8 3v10'} stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </button>
            </h3>
            <div id={`faq-${i}-answer`} role="region" aria-labelledby={`faq-${i}`} hidden={!open} className="faq__answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
