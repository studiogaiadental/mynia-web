const logo = '/assets/logo.png'

// OCR warm mode moved to the AI panel (tools/ai-panel), which covers every AI
// endpoint; linked here when the build knows where it lives.
const AI_PANEL_URL = (import.meta.env.VITE_AI_PANEL_URL ?? '').trim()

type AdminTopBarProps = {
  username: string
  onLogout: () => void
}

export default function AdminTopBar({ username, onLogout }: AdminTopBarProps) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__inner">
        <div className="admin-topbar__brand">
          <img className="admin-topbar__logo" src={logo} alt="GMedCC" />
          <span className="admin-topbar__product">MyNia Admin</span>
        </div>
        <div className="admin-topbar__account">
          {AI_PANEL_URL && (
            <a
              className="admin-button admin-button--secondary"
              href={AI_PANEL_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              AI warm mode ↗
            </a>
          )}
          <span className="admin-topbar__user">
            Signed in as <strong>{username}</strong>
          </span>
          <button type="button" className="admin-button admin-button--secondary" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
