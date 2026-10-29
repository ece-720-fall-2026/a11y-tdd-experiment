import { useId, useState } from 'react'

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div className="faq-item">
      <h3>
        <button
          type="button"
          className="faq-question"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-answer`}
          onClick={() => setOpen((value) => !value)}
        >
          <span>{question}</span>
          <span className="faq-icon" aria-hidden="true">
            {open ? '−' : '+'}
          </span>
        </button>
      </h3>
      <div id={`${id}-answer`} className="faq-answer" hidden={!open}>
        <p>{answer}</p>
      </div>
    </div>
  )
}

export default function FaqSection({ faqs }) {
  const headingId = useId()

  return (
    <section className="faq" aria-labelledby={headingId}>
      <h2 id={headingId}>Questions</h2>
      {faqs.map((faq) => (
        <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
      ))}
    </section>
  )
}
