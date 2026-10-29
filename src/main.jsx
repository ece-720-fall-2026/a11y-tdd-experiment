import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import './styles/styles.css'

const pages = {
  '/': HomePage,
  '/products/trail-runner-2': ProductPage,
}

const Page = pages[window.location.pathname] ?? (() => <p>Page not found.</p>)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
