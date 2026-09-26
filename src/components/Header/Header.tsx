import { useEffect, useRef, useState } from 'react'
import './Header.css'

const arrowDown = '/assets/arrow-down.svg'
const logo = '/assets/logo.png'

type NavItem = { label: string; href: string; hasCaret?: boolean; active?: boolean }

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: 'https://www.gmedcc.com/' },
  {
    label: 'Foundation',
    href: 'https://www.gmedcc.com/get-involved/genia-day/genia-day-gmedcc-doctorshare?tab=individual',
    hasCaret: true,
  },
  {
    label: 'Genia Day',
    href: 'https://www.gmedcc.com/get-involved/genia-day',
    hasCaret: true,
    active: true,
  },
  { label: 'Updates', href: 'https://www.gmedcc.com/updates/insights', hasCaret: true },
  { label: 'Contact Us', href: 'https://www.gmedcc.com/contact-us' },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        toggleRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__logo" href="#">
          <img src={logo} alt="GMedCC" />
        </a>

        <nav
          id="site-header-nav"
          className={`site-header__nav${isMenuOpen ? ' site-header__nav--open' : ''}`}
          aria-label="Primary"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`nav-link${item.active ? ' nav-link--active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{item.label}</span>
              {item.hasCaret && <img className="nav-link__caret" src={arrowDown} alt="" />}
            </a>
          ))}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={`site-header__toggle${isMenuOpen ? ' site-header__toggle--open' : ''}`}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="site-header-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {isMenuOpen && (
        <button
          type="button"
          className="site-header__scrim"
          aria-label="Close menu"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  )
}
