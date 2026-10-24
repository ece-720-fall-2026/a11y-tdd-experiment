import { useId, useState } from 'react'

// Accordion: each question is a button with aria-expanded that shows or hides its answer.
function FaqItem({ faq }) {
  const [expanded, setExpanded] = useState(false)
  const buttonId = useId()
  const panelId = useId()
  return (
    <li className="faq-item">
      <h3>
        <button
          id={buttonId}
          type="button"
          className="faq-button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((e) => !e)}
        >
          <span>{faq.question}</span>
          <span className="faq-chevron" aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
      </h3>
      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!expanded} className="faq-answer">
        <p>{faq.answer}</p>
      </div>
    </li>
  )
}

export default function FaqSection({ faqs }) {
  const headingId = useId()
  return (
    <section className="faq container" aria-labelledby={headingId}>
      <h2 id={headingId}>Questions</h2>
      <ul className="faq-list">
        {faqs.map((faq) => (
          <FaqItem key={faq.id} faq={faq} />
        ))}
      </ul>
    </section>
  )
}
