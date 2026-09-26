import { useCallback, useEffect, useState } from 'react'
import { APK_DOWNLOAD_URL } from '../lib/api'
import ApkTable from './ApkTable'
import UploadForm from './UploadForm'
import { ApiError, activateApk, deleteApk, listApks, updateApk, type Apk, type ApkDetails } from './api'
import { formatBytes } from './format'
import type { AdminSession } from './session'

const logo = '/assets/logo.png'

type ApkManagerProps = {
  session: AdminSession
  onLogout: () => void
  onSessionExpired: () => void
}

type Status = { kind: 'success' | 'error'; text: string }

export default function ApkManager({ session, onLogout, onSessionExpired }: ApkManagerProps) {
  const [apks, setApks] = useState<Apk[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  // A 401 on any call means the session is over: it expired, or the password
  // was changed on the server.
  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired()
        return
      }
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : fallback })
    },
    [onSessionExpired],
  )

  const refresh = useCallback(async () => {
    try {
      setApks(await listApks(session.token))
      setLoadError(null)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired()
        return
      }
      setLoadError(err instanceof Error ? err.message : "Couldn't load the APKs.")
    }
  }, [session.token, onSessionExpired])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const handleUploaded = (apk: Apk) => {
    setStatus({
      kind: 'success',
      text: apk.isActive
        ? `Uploaded ${apk.versionName} and made it the active download.`
        : `Uploaded ${apk.versionName}.`,
    })
    void refresh()
  }

  const handleActivate = async (apk: Apk) => {
    const confirmed = window.confirm(
      `Make ${apk.versionName} the active download?\n\nEveryone who taps "Download Now" on the website will get this APK from now on.`,
    )
    if (!confirmed) return
    setBusyId(apk.id)
    try {
      await activateApk(session.token, apk.id)
      setStatus({ kind: 'success', text: `${apk.versionName} is now the active download.` })
      await refresh()
    } catch (err) {
      handleError(err, "Couldn't activate the APK.")
    } finally {
      setBusyId(null)
    }
  }

  const handleSave = async (apk: Apk, details: ApkDetails): Promise<boolean> => {
    setBusyId(apk.id)
    try {
      await updateApk(session.token, apk.id, details)
      setStatus({ kind: 'success', text: `Saved the changes to ${details.versionName}.` })
      await refresh()
      return true
    } catch (err) {
      handleError(err, "Couldn't save the changes.")
      return false
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (apk: Apk) => {
    const confirmed = window.confirm(
      `Delete ${apk.versionName} (${apk.originalFileName})?\n\nThe file is removed from the server. This can't be undone.`,
    )
    if (!confirmed) return
    setBusyId(apk.id)
    try {
      await deleteApk(session.token, apk.id)
      setStatus({ kind: 'success', text: `Deleted ${apk.versionName}.` })
      await refresh()
    } catch (err) {
      handleError(err, "Couldn't delete the APK.")
    } finally {
      setBusyId(null)
    }
  }

  const active = apks?.find((apk) => apk.isActive) ?? null

  return (
    <div className="admin">
      <header className="admin-topbar">
        <div className="admin-topbar__inner">
          <div className="admin-topbar__brand">
            <img className="admin-topbar__logo" src={logo} alt="GMedCC" />
            <span className="admin-topbar__product">MyNia Admin</span>
          </div>
          <div className="admin-topbar__account">
            <span className="admin-topbar__user">
              Signed in as <strong>{session.username}</strong>
            </span>
            <button type="button" className="admin-button admin-button--secondary" onClick={onLogout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-page-heading">
          <h1 className="admin-page-heading__title">Android APKs</h1>
          <p className="admin-page-heading__text">
            The active APK is the one the &ldquo;Download Now&rdquo; buttons on the landing page download.
          </p>
        </div>

        <section className="admin-card admin-current" aria-labelledby="admin-current-title">
          <h2 id="admin-current-title" className="admin-card__title">
            Active download
          </h2>
          {apks === null ? (
            <p className="admin-muted">Loading…</p>
          ) : active ? (
            <p className="admin-current__version">
              <strong>{active.versionName}</strong>
              {active.versionCode !== null && <span> · build {active.versionCode}</span>}
              <span> · {formatBytes(active.fileSize)}</span>
            </p>
          ) : (
            <p className="admin-current__none">
              No APK is active yet, so the Download buttons won&rsquo;t work. Upload one and make it active.
            </p>
          )}
          <p className="admin-current__link">
            Public link:{' '}
            <a href={APK_DOWNLOAD_URL} className="admin-link">
              {APK_DOWNLOAD_URL}
            </a>
          </p>
        </section>

        <div className="admin-status" aria-live="polite">
          {status && (
            <p className={`admin-alert admin-alert--${status.kind}`}>
              <span>{status.text}</span>
              <button
                type="button"
                className="admin-alert__dismiss"
                aria-label="Dismiss message"
                onClick={() => setStatus(null)}
              >
                ×
              </button>
            </p>
          )}
        </div>

        <UploadForm token={session.token} onUploaded={handleUploaded} onError={handleError} />

        <section className="admin-card" aria-labelledby="admin-list-title">
          <h2 id="admin-list-title" className="admin-card__title">
            All APKs
          </h2>
          {loadError ? (
            <div className="admin-alert admin-alert--error">
              <span>{loadError}</span>
              <button type="button" className="admin-button admin-button--secondary" onClick={() => void refresh()}>
                Try again
              </button>
            </div>
          ) : apks === null ? (
            <p className="admin-muted">Loading…</p>
          ) : (
            <ApkTable
              apks={apks}
              busyId={busyId}
              onActivate={handleActivate}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  )
}
