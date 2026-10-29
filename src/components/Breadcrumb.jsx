export default function Breadcrumb({ steps }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        {steps.map((step, i) => {
          const last = i === steps.length - 1
          return (
            <li key={step.label}>
              {last ? (
                <span aria-current="page">{step.label}</span>
              ) : (
                <a href={step.href}>{step.label}</a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
