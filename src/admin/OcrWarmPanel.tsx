import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { ApiError, getOcrWarmMode, updateOcrWarmMode, type OcrWarmPatch, type OcrWarmStatus } from './api'
import { formatDateTime } from './format'
import type { AdminSession } from './session'

type OcrWarmPanelProps = {
  session: AdminSession
  onSessionExpired: () => void
}

type Status = { kind: 'success' | 'error'; text: string }

const MIN_HOURS = 1
const MAX_HOURS = 168
// Live worker state changes while a worker boots; keep the readout current.
const REFRESH_MS = 15_000
// RunPod serverless price for the endpoint's GPU pool (AMPERE_16).
const HOURLY_COST = '$0.58/hr'

const WORKER_STATES = ['ready', 'idle', 'initializing', 'running', 'throttled', 'unhealthy']

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="admin-warm__fact">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

function when(iso: string | null): string {
  return iso ? formatDateTime(iso) : '—'
}

export default function OcrWarmPanel({ session, onSessionExpired }: OcrWarmPanelProps) {
  const [data, setData] = useState<OcrWarmStatus | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status | null>(null)
  const [busy, setBusy] = useState(false)
  const [hours, setHours] = useState('')

  const refresh = useCallback(async () => {
    try {
      setData(await getOcrWarmMode(session.token))
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

  // Fill the hours field once, from the saved value; after that it's the admin's.
  const savedHours = data?.warmMode.autoOffHours
  useEffect(() => {
    if (savedHours !== undefined) setHours((current) => (current === '' ? String(savedHours) : current))
  }, [savedHours])

  const apply = async (patch: OcrWarmPatch, success: string) => {
    setBusy(true)
    setStatus(null)
    try {
      setData(await updateOcrWarmMode(session.token, patch))
      setStatus({ kind: 'success', text: success })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onSessionExpired()
        return
      }
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : "Couldn't update OCR warm mode." })
    } finally {
      setBusy(false)
    }
  }

  const handleToggle = (enabled: boolean) => {
    if (!data) return
    if (
      enabled &&
      !window.confirm(
        `Turn on warm mode? It keeps one GPU worker running (about ${HOURLY_COST}) until it switches ` +
          `itself off after ${data.warmMode.autoOffHours} hour(s) with no KTP scan.`,
      )
    ) {
      return
    }
    void apply(
      { enabled },
      enabled
        ? 'Warm mode is on. The worker takes a minute or two to boot before scans get faster.'
        : 'Warm mode is off. The endpoint scales back to zero.',
    )
  }

  const handleSaveHours = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const n = Number(hours)
    if (!Number.isInteger(n) || n < MIN_HOURS || n > MAX_HOURS) {
      setStatus({ kind: 'error', text: `Enter a whole number of hours from ${MIN_HOURS} to ${MAX_HOURS}.` })
      return
    }
    void apply({ autoOffHours: n }, `Auto-off set to ${n} hour(s) without a KTP scan.`)
  }

  const warm = data?.warmMode
  const runpod = data?.runpod
  // Stored as on, but someone set min workers back to 0 in the RunPod console.
  const drifted = warm?.enabled && runpod?.minWorkers === 0

  return (
    <main className="admin-main">
      <div className="admin-page-heading">
        <h1 className="admin-page-heading__title">OCR warm mode</h1>
        <p className="admin-page-heading__text">
          KTP scans try the RunPod GPU model first. When no worker is running, the first scan waits about a
          minute for one to boot and falls back to the old OCR in the meantime. Warm mode keeps one worker
          running so every scan uses RunPod, then switches itself off after the set hours with no KTP scan.
        </p>
      </div>

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

      {loadError ? (
        <div className="admin-alert admin-alert--error">
          <span>{loadError}</span>
          <button type="button" className="admin-button admin-button--secondary" onClick={() => void refresh()}>
            Try again
          </button>
        </div>
      ) : !warm || !runpod ? (
        <p className="admin-muted">Loading…</p>
      ) : (
        <>
          <section className="admin-card admin-warm" aria-labelledby="admin-warm-title">
            <div className="admin-warm__header">
              <h2 id="admin-warm-title" className="admin-card__title">
                Warm mode{' '}
                <span className={`admin-badge${warm.enabled ? '' : ' admin-badge--off'}`}>
                  {warm.enabled ? 'On' : 'Off'}
                </span>
              </h2>
              <label className="admin-switch">
                <input
                  type="checkbox"
                  role="switch"
                  checked={warm.enabled}
                  disabled={busy || !runpod.configured}
                  onChange={(e) => handleToggle(e.target.checked)}
                />
                <span className="admin-switch__track" aria-hidden="true" />
                <span className="admin-switch__label">{busy ? 'Saving…' : warm.enabled ? 'Turn off' : 'Turn on'}</span>
              </label>
            </div>

            {!runpod.configured && (
              <p className="admin-current__none">
                RunPod management isn&rsquo;t configured on the server (RUNPOD_MANAGEMENT_API_KEY and
                RUNPOD_OCR_ENDPOINT_ID), so warm mode can&rsquo;t be switched.
              </p>
            )}
            {drifted && (
              <p className="admin-current__none">
                Warm mode is on here, but the RunPod endpoint&rsquo;s minimum workers is 0 (changed in the RunPod
                console?). Turn it off and on again to re-apply.
              </p>
            )}

            <dl className="admin-warm__facts">
              <Fact label={warm.enabled ? 'On since' : 'Off since'}>
                {warm.enabled
                  ? `${when(warm.enabledAt)} by ${warm.enabledBy ?? '—'}`
                  : warm.disabledAt
                    ? `${when(warm.disabledAt)} by ${warm.disabledBy === 'auto-off' ? 'auto-off (no scans)' : (warm.disabledBy ?? '—')}`
                    : 'never turned on'}
              </Fact>
              <Fact label="Switches off at">{warm.enabled ? when(warm.autoOffAt) : '—'}</Fact>
              <Fact label="Last KTP scan">{when(warm.lastOcrRequestAt)}</Fact>
            </dl>
          </section>

          <section className="admin-card" aria-labelledby="admin-warm-hours-title">
            <h2 id="admin-warm-hours-title" className="admin-card__title">
              Auto-off
            </h2>
            <form className="admin-warm__hours" onSubmit={handleSaveHours}>
              <fieldset disabled={busy}>
                <label className="admin-field">
                  <span className="admin-field__label">Switch off after this many hours with no KTP scan</span>
                  <input
                    className="admin-input"
                    type="number"
                    inputMode="numeric"
                    min={MIN_HOURS}
                    max={MAX_HOURS}
                    step={1}
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                  <span className="admin-field__hint">
                    {MIN_HOURS}–{MAX_HOURS} hours. Checked every 5 minutes. At most about {HOURLY_COST} × this many
                    hours after the last scan.
                  </span>
                </label>
                <button type="submit" className="admin-button admin-button--primary">
                  {busy ? 'Saving…' : 'Save'}
                </button>
              </fieldset>
            </form>
          </section>

          <section className="admin-card" aria-labelledby="admin-warm-runpod-title">
            <h2 id="admin-warm-runpod-title" className="admin-card__title">
              RunPod endpoint
            </h2>
            {runpod.error ? (
              <p className="admin-current__none">{runpod.error}</p>
            ) : !runpod.configured ? (
              <p className="admin-muted">Not configured.</p>
            ) : (
              <dl className="admin-warm__facts">
                <Fact label="Minimum workers">{runpod.minWorkers ?? '—'}</Fact>
                {WORKER_STATES.map((state) => (
                  <Fact key={state} label={state[0].toUpperCase() + state.slice(1)}>
                    {runpod.workers?.[state] ?? 0}
                  </Fact>
                ))}
              </dl>
            )}
          </section>
        </>
      )}
    </main>
  )
}
