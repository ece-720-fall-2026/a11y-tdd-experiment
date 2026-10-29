import { footer } from '../data/product.js'

export default function SiteFooter() {
  const { customerHelp, helpLinks, companyLinks, social } = footer
  return (
    <footer className="site-footer">
      <div className="footer-cols">
        <div>
          <h2>Customer help</h2>
          <p>Phone: {customerHelp.phone}</p>
          <p>{customerHelp.hours}</p>
          <ul>
            {helpLinks.map((name) => (
              <li key={name}>
                <a href="#">{name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul>
            {companyLinks.map((name) => (
              <li key={name}>
                <a href="#">{name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Follow us</h2>
          <ul className="social">
            {social.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="copyright">© {new Date().getFullYear()} Stride. All rights reserved.</p>
    </footer>
  )
}
