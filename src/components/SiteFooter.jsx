import { store } from '../data/product.js'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <h2>Customer help</h2>
        <ul>
          <li>
            <a href="/help">Help centre</a>
          </li>
          <li>
            <a href="/contact">Contact us</a>
          </li>
          <li>
            <a href="/shipping">Shipping &amp; returns</a>
          </li>
        </ul>
      </div>
      <div>
        <h2>Company</h2>
        <ul>
          <li>
            <a href="/about">About us</a>
          </li>
          <li>
            <a href="/careers">Careers</a>
          </li>
          <li>
            <a href="/sustainability">Sustainability</a>
          </li>
        </ul>
      </div>
      <div>
        <h2>Follow us</h2>
        <ul>
          <li>
            <a href="https://instagram.com">Instagram</a>
          </li>
          <li>
            <a href="https://facebook.com">Facebook</a>
          </li>
          <li>
            <a href="https://youtube.com">YouTube</a>
          </li>
        </ul>
      </div>
      <div>
        <h2>Visit us</h2>
        <p>
          {store.name} Service Centre
          <br />
          834 Granville Street, Vancouver, BC
          <br />
          {store.supportPhone}
        </p>
      </div>
    </footer>
  )
}
