const COLUMNS = [
  {
    title: 'Customer help',
    links: [
      { label: 'Help center', href: '#' },
      { label: 'Returns', href: '#' },
      { label: 'Order status', href: '#' },
      { label: 'Warranty', href: '#' },
      { label: 'Contact us: (800) 555-0100', href: 'tel:+18005550100' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Sustainability', href: '#' },
      { label: 'Press', href: '#' },
    ],
  },
  {
    title: 'Follow us',
    links: [
      { label: 'Instagram', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'X', href: '#' },
      { label: 'YouTube', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3>{col.title}</h3>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="copyright">© {new Date().getFullYear()} Stride. All rights reserved.</p>
    </footer>
  )
}
