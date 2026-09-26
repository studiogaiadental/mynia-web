export type AdminSession = {
  token: string
  username: string
  /** ISO timestamp; the server rejects the token after this. */
  expiresAt: string
}

const STORAGE_KEY = 'mynia-admin-session'

export function isExpired(session: AdminSession): boolean {
  return !(Date.parse(session.expiresAt) > Date.now())
}

// sessionStorage, so a login ends with the tab. Storage can be unavailable
// (private mode, blocked site data); then a reload just asks for the login
// again.
export function loadSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as AdminSession
    if (!session.token || !session.username || isExpired(session)) return null
    return session
  } catch {
    return null
  }
}

export function saveSession(session: AdminSession) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Kept in memory only.
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing was stored.
  }
}
