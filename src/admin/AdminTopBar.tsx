export type AdminPage = 'apks' | 'ocr'

const logo = '/assets/logo.png'

const PAGES: { id: AdminPage; label: string }[] = [
  { id: 'apks', label: 'APKs' },
  { id: 'ocr', label: 'OCR warm mode' },
]

type AdminTopBarProps = {
  username: string
  page: AdminPage
  onLogout: () => void
}

export default function AdminTopBar({ username, page, onLogout }: AdminTopBarProps) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__inner">
        <div className="admin-topbar__brand">
          <img className="admin-topbar__logo" src={logo} alt="GMedCC" />
          <span className="admin-topbar__product">MyNia Admin</span>
        </div>
        <div className="admin-topbar__account">
          <span className="admin-topbar__user">
            Signed in as <strong>{username}</strong>
          </span>
          <button type="button" className="admin-button admin-button--secondary" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
      {/* Plain hash links: the admin is one page with no router. */}
      <nav className="admin-tabs" aria-label="Admin sections">
        {PAGES.map((p) => (
          <a
            key={p.id}
            href={`#${p.id}`}
            className={`admin-tabs__tab${p.id === page ? ' admin-tabs__tab--active' : ''}`}
            aria-current={p.id === page ? 'page' : undefined}
          >
            {p.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
