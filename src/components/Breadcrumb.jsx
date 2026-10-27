export default function Breadcrumb({ steps, current }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        {steps.map((step) => (
          <li key={step.href}>
            <a href={step.href}>{step.label}</a>
          </li>
        ))}
        <li>
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  )
}
