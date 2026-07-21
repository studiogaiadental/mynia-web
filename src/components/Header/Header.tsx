import { useEffect, useRef, useState } from 'react'
import './Header.css'

const arrowDown = '/assets/arrow-down.svg'
const logo = '/assets/logo.png'

type NavItem = { label: string; hasCaret?: boolean; active?: boolean }

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', active: true },
  { label: 'Foundation', hasCaret: true },
  { label: 'Genia Day', hasCaret: true },
  { label: 'Updates', hasCaret: true },
  { label: 'Contact Us' },
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
              href="#"
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
