import { footerLinks } from '../data/product.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="pp-container footer-grid">
        <div>
          <h2>Customer help</h2>
          <ul className="footer-list">
            {footerLinks.help.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul className="footer-list">
            {footerLinks.company.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Follow Stride</h2>
          <ul className="footer-list social">
            {footerLinks.social.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (opens in a new tab)`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="pp-container copyright">© 2026 Stride Outdoor Co. All rights reserved.</p>
    </footer>
  )
}
