import { footer, store } from '../data/product.js'

const socialIcons = {
  Instagram: 'IG',
  Facebook: 'f',
  YouTube: '▶',
  X: 'X',
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <nav aria-labelledby="footer-help">
          <h2 id="footer-help">Customer help</h2>
          <p>
            <a href={footer.customerCare.href}>{footer.customerCare.label}</a>
          </p>
          <ul className="plain-list">
            {footer.customerHelp.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-company">
          <h2 id="footer-company">{store.name}</h2>
          <ul className="plain-list">
            {footer.company.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-social">
          <h2 id="footer-social">Follow us</h2>
          <ul className="social-list">
            {footer.social.map((link) => {
              const network = link.label.replace(/^Stride on /, '')
              return (
                <li key={link.href}>
                  <a href={link.href} className="social-link">
                    <span aria-hidden="true">{socialIcons[network] ?? network}</span>
                    <span className="visually-hidden">{link.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
      <p className="container copyright">{footer.copyright}</p>
    </footer>
  )
}
