import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'

const pages = {
  '/': HomePage,
  '/products/trail-runner-2': ProductPage,
}

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = pages[path] ?? (() => <p>Page not found.</p>)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
