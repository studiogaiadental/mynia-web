import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import LegalPage from '../components/LegalPage/LegalPage'
import termsSource from '../content/legal/terms-and-conditions.md?raw'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LegalPage source={termsSource} />
  </StrictMode>,
)
