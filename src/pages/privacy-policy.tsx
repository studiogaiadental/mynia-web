import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import LegalPage from '../components/LegalPage/LegalPage'
import privacySource from '../content/legal/privacy-policy.md?raw'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LegalPage source={privacySource} />
  </StrictMode>,
)
