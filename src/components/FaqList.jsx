import { useState } from 'react'

export default function FaqList({ items }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <ul className="faq">
      {items.map((item, i) => {
        const isOpen = openIndex === i
        const answerId = `faq-answer-${i}`
        return (
          <li key={item.question}>
            <button
              type="button"
              className="faq-question"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              {item.question}
            </button>
            <div id={answerId} className="faq-answer" hidden={!isOpen}>
              <p>{item.answer}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
