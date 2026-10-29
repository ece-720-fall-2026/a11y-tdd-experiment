import { useState } from 'react'

// APG accordion: each heading holds a button that shows or hides its answer.
export default function Questions({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section aria-labelledby="questions-title" className="questions">
      <h2 id="questions-title">Questions</h2>
      <div className="accordion">
        {items.map((item, i) => {
          const expanded = openIndex === i
          return (
            <div key={item.q} className="accordion-item">
              <h3>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-button-${i}`}
                  className="accordion-trigger"
                  onClick={() => setOpenIndex(expanded ? null : i)}
                >
                  {item.q}
                </button>
              </h3>
              <div id={`faq-answer-${i}`} hidden={!expanded} className="accordion-panel">
                <p>{item.a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
