export default function Questions({ faqs }) {
  return (
    <section className="questions" aria-labelledby="questions-heading">
      <h2 id="questions-heading">Common questions</h2>
      {faqs.map((f) => (
        <details key={f.q} className="faq">
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  )
}
