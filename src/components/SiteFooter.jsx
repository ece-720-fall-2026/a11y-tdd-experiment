import { footer, store } from '../data/product.js'

function LinkList({ items }) {
  return (
    <ul className="footer-list">
      {items.map((item) => (
        <li key={item.label}>
          <a href={item.href}>{item.label}</a>
        </li>
      ))}
    </ul>
  )
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <section aria-labelledby="footer-help">
          <h2 id="footer-help">Customer help</h2>
          <p>
            <a href={footer.phone.href}>{footer.phone.label}</a>
          </p>
          <LinkList items={footer.customerHelp} />
        </section>
        <section aria-labelledby="footer-company">
          <h2 id="footer-company">{store.name}</h2>
          <LinkList items={footer.company} />
        </section>
        <section aria-labelledby="footer-social">
          <h2 id="footer-social">Follow us</h2>
          <ul className="footer-list footer-list--social">
            {footer.social.map((item) => (
              <li key={item.label}>
                <a href={item.href} rel="noopener noreferrer" target="_blank">
                  {item.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <p className="site-footer__legal">
        © {new Date().getFullYear()} {store.name}. All rights reserved.
      </p>
    </footer>
  )
}
