export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.label}>
              {last ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
              {!last && <span className="breadcrumb__sep" aria-hidden="true">›</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
