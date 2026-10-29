import { useState } from 'react'
import { questions } from '../data'

export default function Questions() {
  const [openId, setOpenId] = useState(null)

  return (
    <section aria-labelledby="questions-heading" className="questions">
      <h2 id="questions-heading">Questions</h2>
      {questions.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.question} className="question">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`answer-${item.id}`}
                id={`question-${item.id}`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                {item.question}
              </button>
            </h3>
            <div
              id={`answer-${item.id}`}
              role="region"
              aria-labelledby={`question-${item.id}`}
              hidden={!isOpen}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
