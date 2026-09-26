import type { ReactNode } from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import './SiteLayout.css'

type SiteLayoutProps = {
  children: ReactNode
}

/** Shared page chrome (fixed header + footer) for the landing page and any standalone page. */
export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="page">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
