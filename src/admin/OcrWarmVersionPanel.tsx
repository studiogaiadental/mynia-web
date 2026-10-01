import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { ApiError, updateOcrWarmMode, type OcrWarmPatch, type OcrWarmStatus } from './api'
import { formatDateTime } from './format'
import { versionInfo } from './ocrVersions'
import type { AdminSession } from './session'

type OcrWarmVersionPanelProps = {
  session: AdminSession
  data: OcrWarmStatus
  /** Called with the saved status, so the page's list stays current. */
  onChange: (next: OcrWarmStatus) => void
  onSessionExpired: () => void
}

type Status = { kind: 'success' | 'error'; text: string }

type Unit = 'minutes' | 'hours'

// Matches the server's limit: 1 minute to 7 days.
const MAX_MINUTES = 7 * 24 * 60

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

/** 90 -> "1 hour 30 minutes", 120 -> "2 hours", 45 -> "45 minutes". */
function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  const hours = h === 1 ? '1 hour' : `${h} hours`
  const minutes = m === 1 ? '1 minute' : `${m} minutes`
  if (h === 0) return minutes
  if (m === 0) return hours
  return `${hours} ${minutes}`
}

/**
 * When it switches itself off. Only the version the app's scans use is kept
 * alive by them; any other counts from when it was turned on.
 */
function autoOffRule(servesScans: boolean, minutes: number): string {
  return servesScans
    ? `after ${formatDuration(minutes)} with no KTP scan`
    : `${formatDuration(minutes)} after it is turned on`
}

/** One OCR version's warm mode: its switch, auto-off time and live RunPod endpoint. */
export default function OcrWarmVersionPanel({ session, data, onChange, onSessionExpired }: OcrWarmVersionPanelProps) {
  const { version, servesScans, warmMode: warm, runpod } = data
  const info = versionInfo(version)
  const [status, setStatus] = useState<Status | null>(null)
  const [busy, setBusy] = useState(false)
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState<Unit>('hours')

  // Fill the field once, from the saved value, in whole hours when it is one;
  // after that it's the admin's.
  const [filled, setFilled] = useState(false)
  useEffect(() => {
    if (filled) return
    const inHours = warm.autoOffMinutes % 60 === 0
    setUnit(inHours ? 'hours' : 'minutes')
    setAmount(String(inHours ? warm.autoOffMinutes / 60 : warm.autoOffMinutes))
    setFilled(true)
  }, [warm.autoOffMinutes, filled])

  const apply = async (patch: OcrWarmPatch, success: string) => {
    setBusy(true)
    setStatus(null)
    try {
      onChange(await updateOcrWarmMode(session.token, version, patch))
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
    if (
      enabled &&
      !window.confirm(
        `Turn on ${info.label} warm mode? It keeps one GPU worker running (about ${info.hourlyCost}) until it ` +
          `switches itself off ${autoOffRule(servesScans, warm.autoOffMinutes)}.`,
      )
    ) {
      return
    }
    void apply(
      { enabled },
      enabled
        ? `${info.label} warm mode is on. The worker takes ${info.boot} to boot before it answers quickly.`
        : `${info.label} warm mode is off. The endpoint scales back to zero.`,
    )
  }

  const handleSaveAutoOff = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const n = Number(amount)
    const minutes = unit === 'hours' ? n * 60 : n
    if (!Number.isInteger(n) || n < 1 || minutes > MAX_MINUTES) {
      setStatus({
        kind: 'error',
        text: `Enter a whole number: 1–${MAX_MINUTES} minutes or 1–${MAX_MINUTES / 60} hours (7 days).`,
      })
      return
    }
    void apply(
      { autoOffMinutes: minutes },
      `${info.label} auto-off set to ${autoOffRule(servesScans, minutes)}.`,
    )
  }

  // Stored as on, but someone set min workers back to 0 in the RunPod console.
  const drifted = warm.enabled && runpod.minWorkers === 0

  return (
    <>
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

      <section className="admin-card admin-warm" aria-labelledby={`admin-warm-title-${version}`}>
        <div className="admin-warm__header">
          <h2 id={`admin-warm-title-${version}`} className="admin-card__title">
            {info.label} warm mode{' '}
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

        <p className="admin-muted">
          {info.model ? `${info.model}. ` : ''}
          {servesScans
            ? "The app's KTP scans use this version."
            : "The app's KTP scans don't use this version, so scans don't keep it on."}
        </p>

        {!runpod.configured && (
          <p className="admin-current__none">
            RunPod management isn&rsquo;t configured on the server for {info.label} (RUNPOD_MANAGEMENT_API_KEY and{' '}
            {info.endpointVar}), so warm mode can&rsquo;t be switched.
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
          <Fact label="Last KTP scan">{servesScans ? when(warm.lastOcrRequestAt) : 'Not used for scans'}</Fact>
        </dl>
      </section>

      <section className="admin-card" aria-labelledby={`admin-warm-hours-title-${version}`}>
        <h2 id={`admin-warm-hours-title-${version}`} className="admin-card__title">
          Auto-off
        </h2>
        <p className="admin-muted">
          Currently: switches off <strong>{autoOffRule(servesScans, warm.autoOffMinutes)}</strong>.
        </p>
        <form className="admin-warm__auto-off" onSubmit={handleSaveAutoOff}>
          <fieldset disabled={busy}>
            <div className="admin-field">
              <label className="admin-field__label" htmlFor={`admin-warm-amount-${version}`}>
                {servesScans ? 'Switch off after this long with no KTP scan' : 'Switch off this long after turning on'}
              </label>
              <div className="admin-warm__duration">
                <input
                  id={`admin-warm-amount-${version}`}
                  className="admin-input"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={unit === 'hours' ? MAX_MINUTES / 60 : MAX_MINUTES}
                  step={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <select
                  className="admin-input admin-warm__unit"
                  aria-label="Unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as Unit)}
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
              <span className="admin-field__hint">
                Up to 7 days. Checked every minute.{' '}
                {servesScans
                  ? `Costs at most about ${info.hourlyCost} for this long after the last scan.`
                  : `Costs about ${info.hourlyCost} for as long as it stays on.`}
              </span>
            </div>
            <button type="submit" className="admin-button admin-button--primary">
              {busy ? 'Saving…' : 'Save'}
            </button>
          </fieldset>
        </form>
      </section>

      <section className="admin-card" aria-labelledby={`admin-warm-runpod-title-${version}`}>
        <h2 id={`admin-warm-runpod-title-${version}`} className="admin-card__title">
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
  )
}
