export default function Breadcrumb({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        {trail.slice(0, -1).map((step) => (
          <li key={step.label}>
            <a href={step.href}>{step.label}</a>
          </li>
        ))}
        <li>
          <span aria-current="page">{trail[trail.length - 1].label}</span>
        </li>
      </ol>
    </nav>
  )
}
