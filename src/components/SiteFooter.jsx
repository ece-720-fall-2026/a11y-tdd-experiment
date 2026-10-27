import { product, storeName } from '../data/product.js'

export default function SiteFooter() {
  const { customerHelp, company, social } = product.footer
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section>
          <h2>Customer help</h2>
          <ul>
            {customerHelp.map((item) => (
              <li key={item}>
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Company</h2>
          <ul>
            {company.map((item) => (
              <li key={item}>
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Social media</h2>
          <ul className="social-links">
            {social.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="copyright">© 2026 {storeName}. All rights reserved.</p>
    </footer>
  )
}
