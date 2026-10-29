import { useId, useState } from 'react'

function Question({ item }) {
  const [open, setOpen] = useState(false)
  const answerId = useId()
  return (
    <div className="faq-item">
      <button
        type="button"
        className="faq-question"
        aria-expanded={open}
        aria-controls={answerId}
        onClick={() => setOpen((o) => !o)}
      >
        {item.q}
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      <div id={answerId} className="faq-answer" hidden={!open}>
        <p>{item.a}</p>
      </div>
    </div>
  )
}

export default function Questions({ items }) {
  const headingId = useId()
  return (
    <section className="questions" aria-labelledby={headingId}>
      <h2 id={headingId}>Questions</h2>
      <div>
        {items.map((item) => (
          <Question key={item.q} item={item} />
        ))}
      </div>
    </section>
  )
}
