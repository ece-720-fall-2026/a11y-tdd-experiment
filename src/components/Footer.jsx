export default function Footer({ store }) {
  return (
    <footer className="site-footer">
      <div className="footer-cols">
        <section>
          <h2>Customer help</h2>
          <ul>
            <li><a href="/help">Help center</a></li>
            <li><a href="/returns">Returns</a></li>
            <li><a href="/orders">Order status</a></li>
          </ul>
        </section>
        <section>
          <h2>Company</h2>
          <ul>
            <li><a href="/about">About us</a></li>
            <li><a href="/shop">Shop</a></li>
          </ul>
        </section>
        <section>
          <h2>Social media</h2>
          <ul>
            <li><a href="https://www.facebook.com/">Facebook</a></li>
            <li><a href="https://www.instagram.com/">Instagram</a></li>
            <li><a href="https://x.com/">X</a></li>
            <li><a href="https://www.youtube.com/">YouTube</a></li>
          </ul>
        </section>
      </div>
      <p className="copyright">© {new Date().getFullYear()} {store}</p>
    </footer>
  )
}
