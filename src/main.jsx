import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HomePage from './pages/HomePage.jsx'

const pages = {
  '/': HomePage,
}

const Page = pages[window.location.pathname] ?? (() => <p>Page not found.</p>)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
