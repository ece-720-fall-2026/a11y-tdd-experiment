import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import HomePage from './pages/HomePage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import ProductPage from './pages/ProductPage.jsx'

const pages = {
  '/': HomePage,
  '/products': ShopPage,
  '/products/trail-runner-2': ProductPage,
}

const Page = pages[window.location.pathname] ?? (() => <p>Page not found.</p>)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
