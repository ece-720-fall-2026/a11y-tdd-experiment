export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol className="container breadcrumb-list">
        {items.map((item, i) => {
          const isCurrent = i === items.length - 1
          return (
            <li key={item.label}>
              {isCurrent ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <>
                  <a href={item.href}>{item.label}</a>
                  <span className="breadcrumb-sep" aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
