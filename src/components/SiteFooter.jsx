function LinkList({ id, title, links }) {
  return (
    <section className="footer-column" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function SiteFooter({ storeName, links }) {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <LinkList id="footer-help" title="Customer help" links={links.customerHelp} />
        <LinkList id="footer-company" title="Company" links={links.company} />
        <LinkList id="footer-social" title="Social media" links={links.social} />
      </div>
      <p className="copyright">© 2026 {storeName}. All rights reserved.</p>
    </footer>
  )
}
