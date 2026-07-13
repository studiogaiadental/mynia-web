const arrowDown = '/assets/arrow-down.svg'
const logo = '/assets/logo.png'

type NavItem = { label: string; hasCaret?: boolean; active?: boolean }

const NAV_ITEMS: NavItem[] = [
  { label: 'Home' },
  { label: 'Foundation', hasCaret: true },
  { label: 'Genia Day', hasCaret: true, active: true },
  { label: 'Updates', hasCaret: true },
  { label: 'Contact Us' },
]

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-header__logo" href="#">
          <img src={logo} alt="GMedCC" />
        </a>
        <nav className="site-header__nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`nav-link${item.active ? ' nav-link--active' : ''}`}
            >
              <span>{item.label}</span>
              {item.hasCaret && <img className="nav-link__caret" src={arrowDown} alt="" />}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
