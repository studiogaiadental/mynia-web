import { useCallback, useEffect, useState } from 'react'
import { ApiError, listOcrWarmModes, type OcrVersion, type OcrWarmStatus } from './api'
import OcrWarmVersionPanel from './OcrWarmVersionPanel'
import { versionInfo } from './ocrVersions'
import type { AdminSession } from './session'

type OcrWarmPanelProps = {
  session: AdminSession
  onSessionExpired: () => void
}

// Live worker state changes while a worker boots; keep the readout current.
const REFRESH_MS = 15_000

export default function OcrWarmPanel({ session, onSessionExpired }: OcrWarmPanelProps) {
  const [modes, setModes] = useState<OcrWarmStatus[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selected, setSelected] = useState<OcrVersion | null>(null)

  const refresh = useCallback(async () => {
    try {
      setModes(await listOcrWarmModes(session.token))
      setLoadError(null)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired()
        return
      }
      setLoadError(err instanceof Error ? err.message : "Couldn't load OCR warm mode.")
    }
  }, [session.token, onSessionExpired])

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => void refresh(), REFRESH_MS)
    return () => window.clearInterval(timer)
  }, [refresh])

  // Start on the version the app's scans use; after that the choice is the admin's.
  useEffect(() => {
    if (selected || !modes || modes.length === 0) return
    setSelected((modes.find((m) => m.servesScans) ?? modes[0]).version)
  }, [modes, selected])

  const handleChange = useCallback((next: OcrWarmStatus) => {
    setModes((current) => current && current.map((m) => (m.version === next.version ? next : m)))
  }, [])

  const current = modes?.find((m) => m.version === selected)

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <h1 className="admin-page-heading__title">OCR warm mode</h1>
        <p className="admin-page-heading__text">
          KTP scans try the RunPod GPU model first. When no worker is running, the first scan waits for one to
          boot and falls back to the old OCR in the meantime. Warm mode keeps one worker running so every scan
          uses RunPod, then switches itself off after the set time. Each OCR version is its own RunPod endpoint,
          so each has its own switch and auto-off time.
        </p>
      </div>

      {loadError ? (
        <div className="admin-alert admin-alert--error">
          <span>{loadError}</span>
          <button type="button" className="admin-button admin-button--secondary" onClick={() => void refresh()}>
            Try again
          </button>
        </div>
      ) : !modes || !current ? (
        <p className="admin-muted">Loading…</p>
      ) : (
        <>
          <div className="admin-versions" role="tablist" aria-label="OCR version">
            {modes.map((m) => {
              const active = m.version === current.version
              return (
                <button
                  key={m.version}
                  type="button"
                  role="tab"
                  id={`admin-warm-tab-${m.version}`}
                  aria-selected={active}
                  aria-controls="admin-warm-panel"
                  className={`admin-versions__option${active ? ' admin-versions__option--active' : ''}`}
                  onClick={() => setSelected(m.version)}
                >
                  {versionInfo(m.version).label}
                  <span className={`admin-badge${m.warmMode.enabled ? '' : ' admin-badge--off'}`}>
                    {m.warmMode.enabled ? 'On' : 'Off'}
                  </span>
                </button>
              )
            })}
          </div>

          <div
            id="admin-warm-panel"
            className="admin-warm-version"
            role="tabpanel"
            aria-labelledby={`admin-warm-tab-${current.version}`}
          >
            {/* Keyed so each version has its own form state and messages. */}
            <OcrWarmVersionPanel
              key={current.version}
              session={session}
              data={current}
              onChange={handleChange}
              onSessionExpired={onSessionExpired}
            />
          </div>
        </>
      )}
    </main>
  )
}
