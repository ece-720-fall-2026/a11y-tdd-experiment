import { useId, useState } from 'react'
import { product } from '../data/product.js'

// Accordion (APG accordion pattern). Each answer is hidden until its
// question button is pressed.
function FaqItem({ item }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="faq__item">
      <h3 className="faq__heading">
        <button
          type="button"
          className="faq__button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
        >
          {item.question}
          <span className="faq__icon" aria-hidden="true">
            {open ? '−' : '+'}
          </span>
        </button>
      </h3>
      <div id={id} className="faq__panel" hidden={!open}>
        <p>{item.answer}</p>
      </div>
    </div>
  )
}

export default function FaqList() {
  return (
    <div className="faq">
      {product.faqs.map((item) => (
        <FaqItem key={item.id} item={item} />
      ))}
    </div>
  )
}
