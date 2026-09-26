import { useCallback, useEffect, useState } from 'react'
import ApkManager from './ApkManager'
import LoginForm from './LoginForm'
import { clearSession, loadSession, saveSession, type AdminSession } from './session'
import './admin.css'

const EXPIRED_NOTICE = 'Your session has expired. Please log in again.'

export default function AdminApp() {
  const [session, setSession] = useState<AdminSession | null>(() => loadSession())
  const [notice, setNotice] = useState<string | null>(null)

  const handleLogin = useCallback((next: AdminSession) => {
    saveSession(next)
    setNotice(null)
    setSession(next)
  }, [])

  const handleLogout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const handleExpired = useCallback(() => {
    clearSession()
    setSession(null)
    setNotice(EXPIRED_NOTICE)
  }, [])

  // Back to the login screen the moment the token lapses, not on the next click.
  useEffect(() => {
    if (!session) return
    const timer = window.setTimeout(handleExpired, Date.parse(session.expiresAt) - Date.now())
    return () => window.clearTimeout(timer)
  }, [session, handleExpired])

  return session ? (
    <ApkManager session={session} onLogout={handleLogout} onSessionExpired={handleExpired} />
  ) : (
    <LoginForm notice={notice} onLogin={handleLogin} />
  )
}
