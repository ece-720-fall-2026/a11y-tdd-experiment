import { useState } from 'react'

const questions = [
  {
    id: 'waterproof',
    question: 'Is the Trail Runner 2 waterproof?',
    answer:
      'Yes. The Rainshield bootie and sealed seams keep water out in rain, mud and shallow stream crossings.',
  },
  {
    id: 'width',
    question: 'Is it available in a wide fit?',
    answer:
      'Yes, most sizes are available in a D width. Choose your size and the wide option appears when it is in stock.',
  },
  {
    id: 'returns',
    question: 'Can I run in them and still return them?',
    answer:
      'Absolutely. Take them on the trail for up to 60 days and return them free if they are not right for you.',
  },
  {
    id: 'care',
    question: 'How do I clean them?',
    answer:
      'Rinse off mud with warm water, remove the insoles to air dry, and never put them in the dryer.',
  },
]

export default function Questions() {
  const [openId, setOpenId] = useState(null)

  return (
    <section className="questions" aria-labelledby="questions-heading">
      <h2 id="questions-heading">Questions</h2>
      {questions.map((item) => {
        const isOpen = openId === item.id
        return (
          <div key={item.id} className="question">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`${item.id}-answer`}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span>{item.question}</span>
                <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
            </h3>
            <p id={`${item.id}-answer`} hidden={!isOpen}>
              {item.answer}
            </p>
          </div>
        )
      })}
    </section>
  )
}
