export default function Breadcrumb({ path }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        {path.map((step, i) => {
          const isLast = i === path.length - 1
          return (
            <li key={step.label}>
              {isLast ? (
                <span aria-current="page">{step.label}</span>
              ) : (
                <a href={step.href}>{step.label}</a>
              )}
              {!isLast && <span className="crumb-sep" aria-hidden="true">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
