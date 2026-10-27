import { footer } from '../data/product.js'

export default function StoreFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <h2>Customer help</h2>
          <ul className="plain-list">
            {footer.customerHelp.map((link) => (
              <li key={link.href}><a href={link.href}>{link.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul className="plain-list">
            {footer.company.map((link) => (
              <li key={link.href}><a href={link.href}>{link.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Follow us</h2>
          <ul className="social-list">
            {footer.social.map((link) => (
              <li key={link.href}><a href={link.href}>{link.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <p className="container site-footer__legal">© {new Date().getFullYear()} Stride. All rights reserved.</p>
    </footer>
  )
}
