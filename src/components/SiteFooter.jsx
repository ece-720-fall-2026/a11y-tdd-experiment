const COLUMNS = [
  {
    title: 'Customer help',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Returns', href: '#' },
      { label: 'Order status', href: '#' },
      { label: 'Warranty', href: '#' },
      { label: 'Contact us', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Sustainability', href: '#' },
    ],
  },
]

const SOCIAL = ['Instagram', 'YouTube', 'Facebook', 'X']

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="site-footer__title">{col.title}</h2>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
        ))}
        <nav aria-label="Social media">
          <h2 className="site-footer__title">Follow us</h2>
          <ul className="social">
            {SOCIAL.map((s) => (
              <li key={s}><a href="#" aria-label={s}>{s}</a></li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="site-footer__legal">© {new Date().getFullYear()} Stride. All rights reserved.</p>
    </footer>
  )
}
