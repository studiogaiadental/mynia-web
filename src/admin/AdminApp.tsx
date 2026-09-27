import { useCallback, useEffect, useState } from 'react'
import AdminTopBar, { type AdminPage } from './AdminTopBar'
import ApkManager from './ApkManager'
import LoginForm from './LoginForm'
import OcrWarmPanel from './OcrWarmPanel'
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

  const page = useHashPage()

  return session ? (
    <div className="admin">
      <AdminTopBar username={session.username} page={page} onLogout={handleLogout} />
      {page === 'ocr' ? (
        <OcrWarmPanel session={session} onSessionExpired={handleExpired} />
      ) : (
        <ApkManager session={session} onSessionExpired={handleExpired} />
      )}
    </div>
  ) : (
    <LoginForm notice={notice} onLogin={handleLogin} />
  )
}

function pageFromHash(): AdminPage {
  return window.location.hash === '#ocr' ? 'ocr' : 'apks'
}

function useHashPage(): AdminPage {
  const [page, setPage] = useState<AdminPage>(pageFromHash)
  useEffect(() => {
    const onChange = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return page
}
